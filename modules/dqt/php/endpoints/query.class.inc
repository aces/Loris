<?php declare(strict_types=1);

namespace LORIS\dqt\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\dqt\Factory\QueryFactory;

class Query extends Endpoint
{
    /**
     * Returns true if the user has permission to access
     * the dqt categories
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    private function _allowedMethods() : array
    {
        return [
            'POST',
        ];
    }

    /**
     * Handles a request to Resolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');

        if (empty($pathparts)) {
            switch ($request->getMethod()) {
            case 'POST':
                return $this->_handlePOST($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->_allowedMethods());

            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->_allowedMethods()
                );
            }
        }

        return $handler->process($newrequest, $handler);
    }

    /**
     * TODO
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
    
        $loris = $request->getAttribute('loris');
        $user  = $request->getAttribute('user');
        $data  = json_decode((string) $request->getBody());

        $fields = $data->fields ?? [];
        $filters = $data->filters ?? null;

        try {
            $query = QueryFactory::create($user, $fields, $filters);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        try {
            // Save the query first to make it available in queries history
            $db = $request->getAttribute('loris')->getDatabaseConnection();
            $this->_saveQuery($db, $query);

            // TODO :: Writing on disk takes a while. Increase max_execution_time in php.ini 
            //         or use the serverprocessmanager to launch a process.
            $this->_writeOutputs($query);

        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $id  = $query->getId();
        return new \LORIS\Http\Response\JSON\OK(
            [
                'links' => [
                    'query'   => '/dqt/queries/' . $id,
                    'results' => '/dqt/results/' . $id
                ]
            ]
        );
    }
}

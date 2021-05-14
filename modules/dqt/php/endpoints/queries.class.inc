<?php declare(strict_types=1);

namespace LORIS\dqt\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\dqt\Factories\QueryFactory;
use \LORIS\dqt\Models\Query as DQTQuery;

class Queries extends Endpoint
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
            'GET',
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

        // TODO :: Check for queryid param and delegate to /dqt/queries/query

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
        $data  = json_decode((string) $request->getBody(), true);

        $fields  = $data['fields'] ?? [];
        $filters = $data['filters'] ?? [];

        if (empty($fields)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'At least one field is expected.'
            );
        }

        try {
            $query = QueryFactory::create($fields, $filters);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        try {
            // FIXME :: Maybe results should be generated on demand 
            // at /dqt/results/$id or execute just start a server_process
            $results = $query->execute($loris, $user);
            return new \LORIS\Http\Response\JSON\OK(
                (new \LORIS\dqt\Views\Results($query, $results))->toArray()
            );
            $id = $query->getId();

        } catch (\LorisException|\Error $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

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

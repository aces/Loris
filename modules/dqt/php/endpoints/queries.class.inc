<?php declare(strict_types=1);

namespace LORIS\dqt\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\Http\Endpoint;
use \LORIS\dqt\Controllers\QueryFactory;
use \LORIS\dqt\Controllers\QueryKeeper;
use \LORIS\dqt\Endpoints\Queries\Query as QueryEndpoint;

class Queries extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

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

        if (empty($pathparts)) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);
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

        $user     = $request->getAttribute('user');
        $loris    = $request->getAttribute('loris');
        $query_id = array_shift($pathparts);

        try {
            $query = (new QueryKeeper($loris, $user))
                ->getQuery($query_id);
        } catch (\NotFound $e) {
            error_log(print_r($e));
            return new \LORIS\Http\Response\JSON\NotFound();   
        }

        $handler = new QueryEndpoint($query);

        // Update the request with the shortened pathparts.
        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process($newrequest, $handler);
    }

    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $prov = new \LORIS\dqt\Provisioners\QueriesProvisioner();
        $user = $request->getAttribute('user');

        $queries = (new \LORIS\Data\Table())
            ->withDataFrom($prov)
            ->getRows($user);

        $this->_cache = new \LORIS\Http\Response\JsonResponse([
            'queries' => iterator_to_array($queries)
        ]);

        return $this->_cache;
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
/*
            $query = (QueryFactory::create($fields, $filters))
                ->withName($data['name'] ?? null)
                ->withShared($data['shared'] ?? false);
*/
            $query = QueryFactory::create($fields, $filters);

            $id = (new QueryKeeper($loris, $user))
                ->saveQuery($query);

        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
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

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}

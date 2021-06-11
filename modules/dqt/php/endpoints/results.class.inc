<?php declare(strict_types=1);

namespace LORIS\dqt\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;
use \LORIS\dqt\Controllers\QueryKeeper;

class Results extends Endpoint 
{
    // TODO Add EtagCalculator

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
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->_allowedMethods());

        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->_allowedMethods()
            );
        }
    }

    /**
     * TODO
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $loris     = $request->getAttribute('loris');
        $user      = $request->getAttribute('user');
        $pathparts = $request->getAttribute('pathparts');
        $queryid   = array_shift($pathparts);

        if (empty($queryid)) {
            return new \LORIS\Http\Response\JSON\BadRequest('Missing queryid');
        }

        try {
            $querykeeper = new QueryKeeper($loris, $user); 
            $query       = $querykeeper->getQuery($queryid);
            $results     = $querykeeper->getQueryResults($queryid);

        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound('Results not found');
        }

        $view = new \LORIS\dqt\Views\Results($query, $results);
        $this->_cache = new \LORIS\Http\Response\JSON\OK(
            $view->toArray()
        );

        return $this->_cache;
    }
}

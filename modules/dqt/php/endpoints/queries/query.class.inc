<?php declare(strict_types=1);

namespace LORIS\dqt\Endpoints\Queries;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\Http\Endpoint;
use \LORIS\dqt\Models\Query as DQTQuery;

class Query extends Endpoint implements ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The DQT query this endpoint is about
     */
    private $_query;

    /**
     * A contructor to make sure the query exists
     */
    public function __construct(DQTQuery $query)
    {
        $this->_query = $query;
    }

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
            'PATCH',
            'DELETE'
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
        case 'PATCH':
            return $this->_handlePATCH($request);
        case 'DELETE':
            return $this->_handleDELETE($request);
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
     * Retreive this query information and content
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $this->_cache = new \LORIS\Http\Response\JSON\OK(
            $this->_query->jsonSerialize()
        );

        return $this->_cache;
    }

    /**
     * Save information about this query; Typically its name and shared values. 
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePATCH(ServerRequestInterface $request): ResponseInterface
    {
    }

    /**
     * Delete this query
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleDELETE(ServerRequestInterface $request): ResponseInterface
    {
        return new \LORIS\Http\Response();
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

<?php declare(strict_types=1);
/**
 * This implements the Visits page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /projects/$projectname/visits endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Visits extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested project
     */
    private $_project;

    /**
     * Contructor
     *
     * @param \Project $project the requested project
     */
    public function __construct(\Project $project)
    {
        $this->_project = $project;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array('GET');
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array(
            'v0.0.2',
            'v0.0.3-dev',
        );
    }

    /**
     * Handles a request that starts with /projects/$projectname/visits
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // FIXME: Validate project based permissions.

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) !== 0) {
            return new \LORIS\Http\Response\NotFound();
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Create an array representation of this endpoint's reponse body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $array = (new \LORIS\api\Views\Project($this->_project))
            ->toVisitArray();

        $this->_cache = new \LORIS\Http\Response\JsonResponse($array);

        return $this->_cache;
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

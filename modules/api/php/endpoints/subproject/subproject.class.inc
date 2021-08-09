<?php declare(strict_types=1);
/**
 * This implements the Subproject page class under Subprojects
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Subproject;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /subprojects/$subprojectname endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Subproject extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the subprojects/$subprojectname endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested subproject
     */
    private $_subproject;

    /**
     * Contructor
     *
     * @param string $subproject The requested subproject
     */
    public function __construct(string $subproject)
    {
        $this->_subproject = $subproject;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['GET'];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return [
            'v0.0.4-dev',
        ];
    }

    /**
     * Handles a request that starts with /subprojects/$subprojectname
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());

            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }
        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Generates a JSON representation of this subproject following the API
     * specification.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request @unused-param
     *
     * @return ResponseInterface
     */
    private function _handleGET($request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $view         = (new \LORIS\api\Views\SubProject($this->_subproject))
                          ->toArray();
        $this->_cache = new \LORIS\Http\Response\JsonResponse($view);

        return $this->_cache;
    }

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag($request) : string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}

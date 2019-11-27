<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit\Electrophysiology;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * This class handles request to a recording electrode information.
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Electrodes extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * The requested Recording
     *
     * @var \LORIS\Recording
     */
    private $_recording;

    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Contructor
     *
     * @param \Timepoint       $visit     The requested visit
     * @param \LORIS\Recording $recording The requested recording
     */
    public function __construct(\Timepoint $visit, \LORIS\Recording $recording)
    {
        $this->_visit     = $visit;
        $this->_recording = $recording;
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
            'v0.0.3-dev',
        );
    }

    /**
     * Delegates the request to a private handler appropriate to the request's
     * method.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
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

    /**
     * Generates a response using specialized views.
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

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) > 1) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $view = new \LORIS\api\Views\Visit\Recording\Electrodes(
            $this->_visit,
            $this->_recording
        );

        $this->_cache = new \LORIS\Http\Response\JsonResponse($view->toArray());

        return $this->_cache;
    }

    /**
     * Implements the ETagCalculator interface.
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

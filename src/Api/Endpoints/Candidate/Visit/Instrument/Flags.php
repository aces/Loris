<?php declare(strict_types=1);
/**
 * This implements the Visit specific instrument flags  endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit\Instrument;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the request for specific instrument flags.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Flags extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested instrument
     *
     * @var \NDB_BVL_instrument
     */
    private $_instrument;

    /**
     * The visit from which the instrument is filled
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * Contructor
     *
     * @param \Timepoint          $visit      The requested visit; null for PUT
     * @param \NDB_BVL_instrument $instrument The requested instrument
     */
    public function __construct(\Timepoint $visit, \NDB_BVL_instrument $instrument)
    {
        $this->_visit      = $visit;
        $this->_instrument = $instrument;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array(
                'GET',
                'PUT',
                'PATCH',
               );
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
                'v0.0.1',
                'v0.0.2',
                'v0.0.3-dev',
               );
    }

    /**
     * Handles a request that starts with /candidates/$candid
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

        case 'PUT':
        case 'PATCH':
            // TODO :: I don`t think this was working in v0.0.3-dev
            return new \LORIS\Http\Response\NotImplemented();

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
     * Handles a GET request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $body = (new \LORIS\Api\Views\Visit\Flags(
            $this->_visit,
            $this->_instrument
        ))->toArray();

        return new \LORIS\Http\Response\JsonResponse(
            $body
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
        return md5($this->_instrument->toJSON());
    }
}

<?php declare(strict_types=1);
/**
 * This implements the Visit specific instrument class
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
 * A class for handling the request for specific instrument data.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instrument extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \NDB_BVL_instrument
     */
    protected $instrument;

    /**
     * Contructor
     *
     * @param \Timepoint          $visit      The requested visit; null for PUT
     * @param \NDB_BVL_instrument $instrument The requested instrument
     */
    public function __construct(\Timepoint $visit, \NDB_BVL_instrument $instrument)
    {
        $this->visit      = $visit;
        $this->instrument = $instrument;
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
        $pathparts = $request->getAttribute('pathparts');
        $flags     = array_search('flags', $pathparts) !== false;

        if ($flags) {
            // Delegate to sub-endpoints
            $handler = new Flags($this->visit, $this->instrument);

            return $handler->process(
                $request,
                $handler
            );
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);

        case 'PUT':
            return $this->_handlePUT($request);

        case 'PATCH':
            return $this->_handlePATCH($request);

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
        if (!isset($this->cache)) {
            $body = (new \LORIS\Api\Views\Visit\Instrument(
                $this->visit,
                $this->instrument
            ))->toArray();

            $this->cache = new \LORIS\Http\Response\JsonResponse(
                $body
            );
        }

        return $this->cache;
    }

    /**
     * Handles a PUT request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute('user');
        // TODO :: Check permissions. How??

        if (!$this->instrument->determineDataEntryAllowed()) {
            return new \LORIS\Http\Response\Forbidden(
                'Can not update instruments that are flagged as complete.'
            );
        }

        $data = json_decode((string) $request->getBody(), true);

        if (!$this->instrument->validate($data)) {
            return new \LORIS\Http\Response\Forbidden(
                'Could not update.'
            );
        }

        try {
            $instrumentname = $this->instrument->testName;
            $this->instrument->clearInstrument();
            $this->instrument->_save($data[$instrumentname]);
        } catch (\Throwable $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\InternalServerError();
        }
        return (new \LORIS\Http\Response())
            ->withStatus(204);
    }

    /**
     * Handles a PATCH request.
     * Same as handlePatch but the instrument is not cleared before save
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePATCH(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        // TODO :: Check permissions. How??

        if (!$this->instrument->determineDataEntryAllowed()) {
            return new \LORIS\Http\Response\Forbidden(
                'Can not update instruments that are flagged as complete.'
            );
        }

        $data = json_decode((string) $request->getBody(), true);

        if (!$this->instrument->validate($data)) {
            return new \LORIS\Http\Response\Forbidden(
                'Could not update.'
            );
        }

        try {
            $instrumentname = $this->instrument->testName;
            $this->instrument->_save($data[$instrumentname]);
        } catch (\Throwable $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\InternalServerError();
        }
        return (new \LORIS\Http\Response())
            ->withStatus(204);
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
        return md5($this->instrument->toJSON());
    }
}


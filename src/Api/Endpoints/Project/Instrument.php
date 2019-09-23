<?php declare(strict_types=1);
/**
 * This implements the Instrument page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the /projects/$projectname/instruments/$instrumentname
 * endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Instrument extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    protected $responseCache = array();

    /**
     * The requested project
     */
    protected $project;

    /**
     * The requested instrument
     */
    protected $instrument;

    /**
     * Contructor
     *
     * @param \Project            $project    The requested project
     * @param \NDB_BVL_Instrument $instrument The requested instrument
     */
    public function __construct(\Project $project, \NDB_BVL_Instrument $instrument)
    {
        $this->project    = $project;
        $this->instrument = $instrument;
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
                "v0.0.1",
                "v0.0.2",
                "v0.0.3-dev",
               ];
    }

    /**
     * Handles a request that starts with /projects/$projectname/candidates
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // FIXME: Validate project based permissions.

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) > 1) {
            return new \LORIS\Http\Response\NotFound();
        }

        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($this->_toArray($request))
                )
            );
    }

    /**
     * Create an array representation of this endpoint's reponse body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return array
     */
    private function _toArray(ServerRequestInterface $request)
    {
        $instrumentname = $this->instrument->name;

        if (!isset($this->responseCache[$instrumentname])) {
            $this->responseCache[$instrumentname] = $this->instrument->toJSON();
        }

        return array($this->responseCache[$instrumentname]);
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
        return md5(json_encode($this->_toArray($request)));
    }
}

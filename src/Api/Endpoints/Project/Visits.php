<?php declare(strict_types=1);
/**
 * This implements the Visits page class under Project
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
 * A class for handling the /projects/$projectname/visits endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Visits extends Endpoint implements \LORIS\Middleware\ETagCalculator
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
     * Contructor
     *
     * @param \Project $project the requested project
     */
    public function __construct(\Project $project)
    {
        $this->project = $project;
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
            return (new \LORIS\Http\Response())
                    ->withStatus(404);
        }

        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode(
                        $this->toArray($request)
                    )
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
    private function toArray(ServerRequestInterface $request): array
    {
        $projectname = $this->project->getName();

        if (!isset($this->responseCache[$projectname])) {

            $meta   = array('Project' => $projectname);
            $visits = array_keys(
                \Utility::getExistingVisitLabels(
                    $this->project->getId()
                )
            );

            $this->responseCache[$projectname] = array(
                                                  'Meta'   => $meta,
                                                  'Visits' => $visits,
                                                 );
        }

        return $this->responseCache[$projectname];
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
        return md5(json_encode($this->toArray($request)));
    }
}

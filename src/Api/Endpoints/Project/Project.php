<?php declare(strict_types=1);
/**
 * This implements the Project page class under Projects
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
 * A class for handling the /projects/$projectname endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Project extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the projects/$projectname endpoint, so that
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
     * @param \Project $project The requested project
     */
    public function __construct(\Project $project)
    {
        $this->project = $project;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
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
     * Projects has existed since v0.0.1 of the API and has not
     * changed since.
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
     * Handles a request that starts with /projects/$projectname
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // FIXME: Validate project based permissions.

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            $this->getProject($this->project->getName())
                        )
                    )
                );
        }

        // Delegate to sub-endpoints
        $subendpoint = array_shift($pathparts);
        switch ($subendpoint) {
            case 'candidates':
                $handler = new Candidates($this->project);
                break;
            case 'images':
                $handler = new Images($this->project);
                break;
            case 'instruments':
                $handler = new Instruments($this->project);
                break;
            case 'visits':
                $handler = new Visits($this->project);
                break;
            default:
                return new \LORIS\Http\Response\NotFound();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Returns an array of projects for this LORIS instance
     * a format that can be JSON encoded to confirm to the
     * API.
     *
     * @param string $name The project name
     *
     * @throws \NotFound When the project name does not exists
     * @return array The representation of a project
     */
    private function getProject(string $name): array
    {
        if (!isset($this->responseCache[$name])) {
            $meta = array('Project' => $name);

            $visits = array_keys(
                \Utility::getExistingVisitLabels(
                    $this->project->getId()
                )
            );

            $instruments = array_keys(
                \Utility::getAllInstruments()
            );

            $candids = $this->project->getCandidateIds();

            $responsebody           = array();
            $responsebody['Meta']   = $meta;
            $responsebody['Visits'] = $visits;
            $responsebody['Instruments'] = $instruments;
            $responsebody['Candidates']  = $candids;

            $this->responseCache[$name] = $responsebody;
        }

        return $this->responseCache[$name];
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
        $body = $this->getProject($this->project->getName());

        return md5(json_encode($body));
    }
}

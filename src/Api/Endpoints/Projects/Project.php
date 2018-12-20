<?php
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
namespace LORIS\Api\Endpoints\Projects;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the api/v????/projects/$projectname endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Project extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    public $skipTemplate = true;

    /**
     * A cache of the results of the projects/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    protected $responseCache = array();

    /**
     * All users have access to the login endpoint to try and login.
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess()
    {
        $user = \User::singleton();
        return !($user instanceof \LORIS\AnonymousUser);
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

        $this->project = \NDB_Factory::singleton()
            ->project($pathparts[0]);

        if (count($pathparts) > 1) {
            switch($pathparts[1]) {
                // FIXME: delegate to other handlers
            case 'candidates':
            case 'images':
            case 'instruments':
            case 'visits':
                break;
            default:
                return (new \LORIS\Http\Response())
                        ->withStatus(404);
            }
        }

        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "application/json")
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($this->_getProject($pathparts[0]))
                )
            );
    }

    /**
     * Returns an array of projects for this LORIS instance
     * a format that can be JSON encoded to confirm to the
     * API.
     *
     * @param string $name The project name
     *
     * @return array That endpoint representation of a project
     */
    private function _getProject(string $name) : array
    {
        if (!isset($this->responseCache[$name])) {

            $project = \NDB_Factory::singleton()->project($name);

            $meta = array('Project' => $name);

            $visits = array_keys(
                \Utility::getExistingVisitLabels(
                    $project->getId()
                )
            );

            $instruments = array_keys(
                \Utility::getAllInstruments()
            );

            $candids = $project->getCandidateIds();

            $responsebody['Meta']        = $meta;
            $responsebody['Visits']      = $visits;
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
        $projectname = $request->getAttribute('pathparts')[0];
        return md5(json_encode($this->_getProject($projectname), true));
    }
}

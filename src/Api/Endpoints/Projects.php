<?php declare(strict_types=1);
/**
 * This implements the Projects page class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;
/**
 * A class for handling the api/v????/projects endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Projects extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the projects/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    protected $projectsCache;

    /**
     * Only logged in users can see projects.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if access is permitted
     */
    private function _hasAccess(\User $user) : bool
    {
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
     * Handles a request starts with /projects/
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!$this->_hasAccess($user)) {
            return new \LORIS\Http\Response\Unauthorized();
        }

        $pathparts = $request->getAttribute('pathparts');

        if (count($pathparts) === 1) {
            $projects = $this->_getProjectList();
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($projects)
                    )
                );
        }

        // Delegate to project specific endpoint.
        try {
            $project = \NDB_Factory::singleton()
                ->project($pathparts[1]);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\NotFound();
        }

        $endpoint = new Project\Project($project);

        $pathparts = array_slice($pathparts, 2);
        $request   = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Returns an array of projects for this LORIS instance
     * a format that can be JSON encoded to confirm to the
     * API.
     *
     * @return array of projects
     */
    private function _getProjectList() : array
    {
        if (isset($this->projectsCache)) {
            return $this->projectsCache;
        }
        $config = \NDB_Factory::singleton()->config();

        $useEDC = $config->getSetting("useEDC");

        if ($useEDC === '1' || $useEDC === 'true') {
            $useEDC = true;
        } else {
            $useEDC = false;
        }
        $PSCID       = $config->getSetting("PSCID");
        $PSCIDFormat = \Utility::structureToPCRE($PSCID['structure'], "SITE");

        $type = $PSCID['generation'] == 'sequential' ? 'auto' : 'prompt';

        $settings = [
                     "useEDC" => $useEDC,
                     "PSCID"  => [
                                  "Type"  => $type,
                                  "Regex" => $PSCIDFormat,
                                 ],
                    ];

        $projects  = \Utility::getProjectList();
        $projArray = [];
        foreach ($projects as $project) {
            $projArray[$project] = $settings;
        }
        $this->projectsCache = ["Projects" => $projArray];

        return $this->projectsCache;
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
        return md5(json_encode($this->_getProjectList()));
    }
}

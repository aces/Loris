<?php
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
namespace LORIS\api;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;


/**
 * A class for handling the api/v????/projects endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Projects extends APIEndpoint implements \LORIS\Middleware\ETagCalculator
{
    public $skipTemplate = true;

    /**
     * A cache of the results of the projects/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    protected $projectsCache;
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
     * Handles a request starts with /projects/
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // FIXME: Validate permissions.
        switch ($request->getURI()->getPath()) {
        case "projects":
        case "projects/":
            $projects = $this->_getProjectList();
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withBody(new \LORIS\Http\StringStream(json_encode($projects)));
        // FIXME: Delegate to other endpoints under /projects/ for other paths.
        default:
            return (new \LORIS\Http\Response())
            ->withBody(
                new \LORIS\Http\StringStream(
                    '{ "error" : "Invalid API endpoint" }'
                )
            )->withStatus(404);
        }
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

        $useProjects = $config->getSetting("useProjects");
        $useEDC      = $config->getSetting("useEDC");

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

        if ($useProjects && $useProjects !== "false" && $useProjects !== "0") {
            $projects  = \Utility::getProjectList();
            $projArray = [];
            foreach ($projects as $project) {
                $projArray[$project] = $settings;
            }
            $this->projectsCache = ["Projects" => $projArray];
        } else {
            $this->projectsCache = [
                                    "Projects" => array("loris" => $settings),
                                   ];
        }
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
        return md5(json_encode($this->_getProjectList(), true));
    }
}

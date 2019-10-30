<?php declare(strict_types=1);
/**
 * This implements the Projects endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;
/**
 * A class for handling the api/v????/projects endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Projects extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the projects/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    private $_cache;

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
            'v0.0.2',
            'v0.0.3-dev',
        );
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
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            default:
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to project specific endpoint.
        try {
            $project_name = $pathparts[1] ?? '';
            $project      = \NDB_Factory::singleton()
                ->project($project_name);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $endpoint = new Project\Project($project);

        // Removing `/projects/<project_name>` from pathparts.
        $pathparts = array_slice($pathparts, 2);
        $request   = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Returns a list of projects for this LORIS instance.
     *
     * @return ResponseInterface
     */
    private function _getProjectList() : array
    {
        if (!isset($this->_cache)) {
            // The projects list should be related to the user in the request
            // attributes.
            $projects = array_map(
                function ($project_name) {
                    return \Project::singleton($project_name);
                },
                \Utility::getProjectList()
            );

            $this->_cache = (new \LORIS\api\Views\Projects($projects))
                ->toArray();
        }

        return new \LORIS\Http\Response\JsonResponse(
            $this->_cache
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
        return md5(json_encode($this->_handleGet($request)->getBody()));
    }
}

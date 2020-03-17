<?php declare(strict_types=1);
/**
 * This implements the Electrophysiology page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;
use \LORIS\Data\Filters\HasAnyPermissionOrUserSiteMatch;

/**
 * A class for handling the /projects/$projectname/electrophysiology endpoint.
 *
 * @category API
 * @package  LORIS
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Recordings extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested project
     */
    private $_project;

    /**
     * Permission checks
     *
     * @param \User $user The requesting user
     *
     * @return boolean true if access is permitted
     */
    private function _hasAccess(\User $user)
    {
        return (
            $user->hasPermission('electrophysiology_browser_view_allsites') ||
            (
                $user->hasStudySite()
                && $user->hasPermission('electrophysiology_browser_view_site')
            )
        );
    }

    /**
     * Contructor
     *
     * @param \Project $project The requested project
     */
    public function __construct(\Project $project)
    {
        $this->_project = $project;
    }


    /**
     * Returns which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array('GET');
    }

    /**
     * Versions of the LORIS API which are supported by this endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array("v0.0.3-dev");
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
        $user = $request->getAttribute('user');
        if ($user instanceof \LORIS\AnonymousUser) {
            return new \LORIS\Http\Response\JSON\Unauthorized();
        }

        if (!$this->_hasAccess($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) !== 0) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

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
     * Creates an array representation of this endpoint's response body
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

        try {
            $datestring = $request->getQueryParams()['since'] ?? '1970-01-01';
            $since      = new \DateTime($datestring);
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                $e->getMessage()
            );
        }

        $filter = new HasAnyPermissionOrUserSiteMatch(
            array('electrophysiology_browser_view_allsites')
        );

        $provisioner = new \LORIS\api\Provisioners\ProjectRecordingsRowProvisioner(
            $this->_project,
            $since
        );

        $provisioner = $provisioner->filter($filter);

        $recordings = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($request->getAttribute('user'));

        $this->_cache = new \LORIS\Http\Response\JsonResponse(
            array('Recordings' => $recordings)
        );

        return $this->_cache;
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
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}
<?php declare(strict_types=1);
/**
 * This implements the Subprojects endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /projects/{project}/subprojects endpoint.
 *
 * @category API
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Subprojects extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the projects/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested project
     */
    private $_project;

    /**
     * Contructor
     *
     * @param \Project $project the requested project
     */
    public function __construct(\Project $project)
    {
        $this->_project = $project;
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
            'v0.0.4-dev',
        ];
    }

    /**
     * Handles a HTTP request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET();

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to subproject specific endpoint.
        $subproject_name =  urldecode($pathparts[0] ?? '');

        try {
            $subproject = $this->_project->getSubproject($subproject_name);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $endpoint = new Subproject\Subproject($subproject);

        // Removing `/subprojects/<subproject_name>` from pathparts.
        $pathparts = array_slice($pathparts, 2);
        $request   = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Generates a JSON representation of this projecti subprojects following the API
     * specification.
     *
     * @return ResponseInterface
     */
    private function _handleGET(): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $subprojects = array_map(
            function ($subproject) {
                return [
                    'SubprojectID'      => $subproject['subprojectId'],
                    'Title'             => $subproject['title'],
                    'UseEDC'            => boolval($subproject['useEDC']),
                    'WindowDifference'  => $subproject['windowDifference'],
                    'RecruitmentTarget' => intval($subproject['recruitmentTarget'])
                ];
            },
            $this->_project->getSubprojects()
        );

        $array = [
            'Subprojects' => $subprojects
        ];

        $this->_cache = new \LORIS\Http\Response\JsonResponse($array);

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
        return md5(json_encode($this->_handleGet($request)->getBody()));
    }
}

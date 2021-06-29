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
namespace LORIS\api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;
/**
 * A class for handling the api/v????/subprojects endpoint.
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
            return new \LORIS\Http\Response\JSON\Unauthorized();
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
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to subproject specific endpoint.
        $subproject_name = $pathparts[1] ?? '';
        if (!in_array(
            $subproject_name,
            array_values(\Utility::getSubprojectList())
        )
        ) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $endpoint = new Subproject\Subproject($subproject_name);
        // Removing `/subprojects/<subproject_name>` from pathparts.
        $pathparts = array_slice($pathparts, 2);
        $request   = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Returns a list of subprojects for this LORIS instance.
     *
     * @return ResponseInterface
     */
    private function _handleGET() : ResponseInterface
    {
        if (!isset($this->_cache)) {
            // The subprojects list should be related to the user in the request
            // attributes.
            $DB           = \NDB_Factory::singleton()->database();
            $subprojects  = $DB->pselect("SELECT * FROM subproject", []);
            $this->_cache = (new \LORIS\api\Views\Subprojects($subprojects))
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

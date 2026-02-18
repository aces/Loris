<?php declare(strict_types=1);

/**
 * This implements the Sites endpoint class
 *
 * PHP Version 8
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
 * A class for handling the api/v????/sites endpoint.
 *
 * @category API
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Sites extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the sites/ endpoint, so that it doesn't
     * need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * Only logged in users can see sites.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if access is permitted
     */
    private function _innerHasAccess(\User $user) : bool
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
     * Handles a request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute('user');
        if (!$this->_innerHasAccess($user)) {
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

        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Returns a list of sites for this LORIS instance.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        if (!isset($this->_cache)) {
            $provisioner = (new \LORIS\api\Provisioners\SitesProvisioner())
                 ->filter(new \LORIS\Data\Filters\UserSiteMatch());

            $sites = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($request->getAttribute('user'));

            $this->_cache = new \LORIS\Http\Response\JsonResponse(
                ['Sites' => $sites]
            );
        }

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

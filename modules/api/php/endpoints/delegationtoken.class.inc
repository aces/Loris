<?php declare(strict_types=1);
/**
 * This implements the DelegationToken page class
 *
 * This is meant to provide a way to access a specific enpoint on
 * behaft of a registered user.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the api/v????/delegation-token endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DelegationToken extends Endpoint
{

    private function hasAccess(\User $user): bool
    {
        return !$user instanceof \LORIS\AnonymousUser;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array('POST');
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * Login has existed since v0.0.1 of the API and has not
     * changed
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array('v0.0.3-dev');
    }

    /**
     * Handles a login request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if (!$this->hasAccess($request->getAttribute('user'))) {
            return new \LORIS\Http\Response\Unauthorized();
        }

        if (count($request->getAttribute('pathparts')) !== 1) {
            return new \LORIS\Http\Response\NotFound();
        }

        switch ($request->getMethod()) {
        case 'POST':
            return $this->_handlePOST($request);
        case 'OPTIONS':
            return (new \LORIS\Http\Response())
                ->withHeader('Allow', $this->allowedMethods());
        default:
            return new \LORIS\Http\Response\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Create a candidate with the provided data
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $configs = \NDB_Factory::singleton()->config();
        $baseurl = $configs->getSetting("www")['url'];
        $key     = $configs->getSetting("JWTKey");

        $signature = array(
                      // JWT related tokens to for the JWT library to validate
                      "iss"               => $baseurl,
                      "aud"               => $baseurl,
                      // Issued at
                      "iat"               => time(),
                      "nbf"               => time(),
                      // Expire in 1 day
                      "exp"               => time() + 84600,

                      // Additional payload data
                      'delegator'         => $user->getUsername(),
                      'delegate_username' => $data['delegate_username'],
                      'target_endpoint'   => $data['target_endpoint'],
                     );

        $token = \Firebase\JWT\JWT::encode($signature, $key, "HS256");

        return new \LORIS\Http\Response\JsonResponse(
            array('token' => $token)
        );
    }
}

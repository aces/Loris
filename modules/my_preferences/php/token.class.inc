<?php declare(strict_types=1);
namespace LORIS\my_preferences;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Http\Endpoint;

/**
 * This class provides the php code to generate a JWT token for the loged in user
 *
 * PHP Version 7
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://github.com/aces/Loris
 */
class Token extends Endpoint
{
    /**
     * Return which methods are supported by this endpoint.
     *
     * Projects can only be retrieved, not created.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'GET',
        ];
    }

    /**
     * Handles a request to Resolved conflicts
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
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
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $user  = $request->getAttribute('user');
        $token = $this->_getEncodedToken($user);
        return new \LORIS\Http\Response\JsonResponse(
            [
                'token' => $token
            ]
        );
    }

    /**
     * Return a valid JWT encoded identification token for the user
     *
     * @param string $user The user to return an identification token for
     *
     * @return string JWT encoded token
     */
    private function _getEncodedToken($user)
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        $baseURL = $factory->settings()->getBaseURL();

        $token = [
            // JWT related tokens to for the JWT library to validate
            "iss"  => $baseURL,
            "aud"  => $baseURL,
            // Issued at
            "iat"  => time(),
            "nbf"  => time(),
            // Expire in 1 day
            "exp"  => time() + 86400,
            // Additional payload data
            "user" => $user,
        ];

        $key = $config->getSetting("JWTKey");
        if (!$this->_isKeyStrong($key)) {
            return "";
        }
        return \Firebase\JWT\JWT::encode($token, $key, "HS256");
    }

    /**
     * Verify key meets cryptographic strength requirements
     *
     * @param string $key The JWT key to verify
     *
     * @return boolean Key passes strength test
     */
    private function _isKeyStrong($key)
    {
        // Note: this code adapted from User::isPasswordStrong
        $CharTypes = 0;
        if (strlen($key) < 20) {
            return false;
        }
        // nothing but letters
        if (!preg_match('/[^A-Za-z]/', $key)) {
            return false;
        }
        // nothing but numbers
        if (!preg_match('/[^0-9]/', $key)) {
            return false;
        }
        // preg_match returns 1 on match, 0 on non-match
        $CharTypes += preg_match('/[0-9]+/', $key);
        $CharTypes += preg_match('/[A-Za-z]+/', $key);
        $CharTypes += preg_match('/[!\\\$\^@#%&\*\(\)]+/', $key);
        if ($CharTypes < 3) {
            return false;
        }

        return true;
    }
}


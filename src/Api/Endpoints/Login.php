<?php declare(strict_types=1);
/**
 * This implements the Login page class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling the api/v????/login endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Login extends Endpoint
{
    /*
     * A supplied JWT key must have at least this length or it will
     * be rejected for being too weak.
     * 
     * @var int 
     */
    protected const MIN_JWT_KEY_LENGTH = 20;
    /* 
     * The number of "character sets" that must be used in a password. 
     * For example the characters 0-9, a-z, and miscellaneous symbols are all 
     * different character sets. Used as a heuristic to determine password 
     * complexity.
     *
     * @var int
     */
    protected const MIN_COMPLEXITY_CHARSETS = 3;
    /**
     * All users have access to the login endpoint to try and login.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess(\User $user) : bool
    {
        // Anyone can try and login. Even you.
        return true;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * Login can only be POSTed to
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['POST'];
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
        return [
                "v0.0.1",
                "v0.0.2",
                "v0.0.3-dev",
               ];
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
        $requestdata = json_decode((string) $request->getBody(), true);
        if (!isset($requestdata['username']) || !isset($requestdata['password'])) {
            return (new \LORIS\Http\Response())
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            array('error' => 'Missing username or password')
                        )
                    )
                )
                ->withStatus(400);
        }

        $user     = $requestdata['username'];
        $password = $requestdata['password'];

        $login = $this->getLoginAuthenticator();

        if ($login->passwordAuthenticate($user, $password, false)) {
            $token = $this->getEncodedToken($user);
            if (!empty($token)) {
                return (new \LORIS\Http\Response())
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode(array('token' => $token))
                        )
                    )
                    ->withHeader("Content-Type", "application/json")
                    ->withStatus(200);
            } else {
                return (new \LORIS\Http\Response())
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode(
                                array('error' => 'Unacceptable JWT key')
                            )
                        )
                    )
                    ->withHeader("Content-Type", "application/json")
                    ->withStatus(500);
            }
        }
        return (new \LORIS\Http\Response())
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode(array("error" => $login->_lastError))
                )
            )
            ->withHeader("Content-Type", "application/json")
            ->withStatus(401);
    }

    /**
     * Get the SinglePointLogin class used to authenticate this request
     * in a separate function so that it can be mocked out for testing.
     *
     * @return \SinglePointLogin Loris Authenticator
     */
    function getLoginAuthenticator()
    {
        return new \SinglePointLogin();
    }

    /**
     * Return a valid JWT encoded identification token for the user
     *
     * @param string $user The user to return an identification token for
     *
     * @return string JWT encoded token
     */
    function getEncodedToken($user)
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting("www");
        $baseURL = $www['url'];

        $token = array(
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
                 );

        $key = $config->getSetting("JWTKey");
        if (!self::isKeyStrong($key)) {
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
    static function isKeyStrong($key)
    {
        // Note: this code adapted from User::isPasswordStrong
        $CharTypes = 0;
        if (strlen($key) < self::MIN_JWT_KEY_LENGTH) {
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
        if ($CharTypes < self::MIN_COMPLEXITY_CHARSETS) {
            return false;
        }

        return true;
    }
}

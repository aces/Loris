<?php
/**
 * Handles a request to the login API endpoint in Loris
 *
 * PHP Version 5.4+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once __DIR__ . '/APIBase.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

/**
 * Implementation of Login endpoint
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Login extends APIBase
{
    /**
     * Validates the data which was passed in the request.
     *
     * @param string $method The HTTP method of the request
     * @param array  $data   The array-encode JSON posted to
     *                       the URL.
     */
    function __construct($method, $data = array())
    {
        $this->AllowedMethods = array('POST');
        $this->RequestData    = $data;

        if (!in_array($method, $this->AllowedMethods)) {
            $this->header("HTTP/1.1 405 Method Not Allowed");
            $this->header("Allow: " . join(", ", $this->AllowedMethods));
            $this->safeExit(0);
        }

        $client = new \NDB_Client();
        // Bypass session handling because we're trying to authenticate a session
        $client->makeCommandLine();
        $client->initialize(__DIR__ . "/../../../project/config.xml");

        $this->HTTPMethod = $method;
        $this->handleRequest();
    }

    /**
     * Handle a POST request
     *
     * @return void
     */
    function handlePOST()
    {
        if (empty($this->RequestData['username'])
            || empty($this->RequestData['password'])
        ) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->JSON = array("error" => "Missing username or password");
            return;

        }
        $user     = $this->RequestData['username'];
        $password = $this->RequestData['password'];

        $login = $this->getLoginAuthenticator();

        if ($login->passwordAuthenticate($user, $password, false)) {
            $token = $this->getEncodedToken($user);
            if (!empty($token)) {
                $this->JSON = array("token" => $token);
            } else {
                $this->header("HTTP/1.1 500 Internal Server Error");
                $this->JSON = array("error" => "Unacceptable JWT key.");
            }
        } else {
            $this->header("HTTP/1.1 401 Unauthorized");
            if (!empty($login->_lastError)) {
                $this->JSON = array(
                               "error" => $login->_lastError,
                              );
            }

        }
    }

    /**
     * Get the SinglePointLogin class used to authenticate this request
     * in a separate function so that it can be mocked out for testing.
     *
     * @return SinglePointLogin Loris Authenticator
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
            error_log(
                'ERROR: JWTKey config variable is weak. '
                .'Please change the key to a more cryptographically-secure value.'
            );
            return "";
        }
        return \Firebase\JWT\JWT::encode($token, $key, "HS256");
    }

    /**
     * Calculate the ETag for this resource.
     *
     * Since this isn't a real resource, it just returns the
     * empty string.
     *
     * @return string
     */
    function calculateETag()
    {
        return "";
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
        // less than 20 characters
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

if (isset($_REQUEST['PrintLogin'])) {
    // Without this line, mod_rewrite eats the $_POST variable.
    $body = file_get_contents("php://input");
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $obj = new Login($_SERVER['REQUEST_METHOD'], json_decode($body, true));
    } else {
        $obj = new Login($_SERVER['REQUEST_METHOD']);
    }
    header('Content-type: application/json');
    print $obj->toJSONString();
}
?>

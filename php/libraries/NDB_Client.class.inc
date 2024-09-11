<?php
/**
 * This file contains the NDB_Client class
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Sebastien <unknown@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * NeuroDB client - takes care of loading the configuration, creating the first
 * database connection, and including a lot of commonly used libraries.
 * By default does web-appropriate setup (session management and user auth).
 *
 * @category Main
 * @package  Main
 * @author   Sebastien <unknown@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Client
{
    /**
     * Defines whether session management and user authentication is performed
     */
    var $_isWebClient = true;

    /**
     * Defines that the client is a command line client
     *
     * @return void
     */
    function makeCommandLine(): void
    {
        $this->_isWebClient = false;
    }

    /**
     * Initializes the environment
     *
     * @param string|null $configFile Path on filesystem to config.xml file
     *
     * @return bool true on success, false otherwise
     */
    function initialize(?string $configFile = null)
    {
        // Load the config file.
        $factory = NDB_Factory::singleton();

        $config = $factory->config($configFile);

        $DB = $factory->database();

        // Register S3 stream wrapper if configured
        if (getenv('AWS_ACCESS_KEY_ID') !== false) {
            // AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
            // should both be set as environment variables
            $s3config = [
                'version' => '2006-03-01',
            ];
            $endpoint = $config->getSetting('AWS_S3_Endpoint');
            if (!empty($endpoint)) {
                $s3config['region']   = '';
                $s3config['endpoint'] = $endpoint;
            } else {
                $s3config['region'] = $config->getSetting('AWS_S3_Region');
            }

            $s3client = new Aws\S3\S3Client($s3config);

            // Register the stream wrapper so that s3:// urls can be
            // treated as regular files.
            $s3client->registerStreamWrapper();
        }

        // This must be done after the extra includes, as those may
        // include Smarty
        include_once "Smarty_hook.class.inc";

        $GLOBALS['DB'] =& $DB;

        // stop here if this is a command line client
        if (!$this->_isWebClient) {
            // Set user as unix username.
            // Requires Loris to have user with this username
            User::singleton(getenv('USER'));
            return true;
        }

        $config_additions = $DB->pselectOne(
            "SELECT c.Value
            FROM Config c
            JOIN ConfigSettings cs ON (c.ConfigID=cs.ID)
            WHERE cs.Name=:nm",
            ["nm" => "CSPAdditionalHeaders"]
        );
        if (empty($config_additions)) {
            $config_additions = "";
        }
        $CaptchaDomains ="";
        // Get reCATPCHA keys
        $reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');
        $reCAPTCHAPublic  = $config->getSetting('reCAPTCHAPublic');
        // Display reCAPTCHA if both private and public keys are set
        if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
            $CaptchaDomains ="www.google.com  www.gstatic.com";
        }

        // Content-Security policy for LORIS
        // 1. By default, only allow things that are self-hosted
        // 2. Allow inline CSS and JS (inline JS is required for
        //    the Loris base class to load smarty variables
        // 3. Allow unsafe-eval because jQuery requires it to load
        //    our menus. It will be fixed in jQuery 3.0.0.
        //    See: https://github.com/jquery/jquery/issues/2012
        // 4. Allow data URLs for fonts, because our bootstrap theme
        //    seems to load a font that way.
        // 5. Allow reCAPTCHA domains only if the CAPTCHA keys were set
        //    up by the project
        header(
            "Content-Security-Policy: "
            . "default-src 'self' 'unsafe-inline'; "
            . "script-src 'self' 'unsafe-inline' 'unsafe-eval' $CaptchaDomains; "
            . "font-src 'self' data:; "
            . "img-src 'self' https://images.loris.ca data:; "
            . "frame-ancestors 'none'; "
            . "form-action 'self'; "
            . $config_additions
        );
        // start php session
        $sessionOptions = ['cookie_httponly' => true];

        // Lax is required for third party login to maintain the State, otherwise
        // it gets lost after the redirect.
        $sessionOptions['cookie_samesite'] = "Lax";

        // API Detect
        if (strpos(
            $_SERVER['REDIRECT_URL'] ?? $_SERVER['REQUEST_URI'] ?? '',
            '/api/v0.0.3/'
        ) !== false
        ) {
            session_cache_limiter('private');
        }

        session_start($sessionOptions);
        // if exiting, destroy the php session
        if (isset($_REQUEST['logout']) && $_REQUEST['logout']) {
            session_destroy();
            header("HTTP/1.1 303 See Other");
            header("Location: /");
            session_start($sessionOptions);
        }

        /**
        * Log In procedures
        */
        if (!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
            $login = new SinglePointLogin();
            $_SESSION['State']->setProperty('login', $login);
        } else {
            $login = $_SESSION['State']->getProperty('login');
        }
        if (!$login->isLoggedIn()) {
            $auth = $login->authenticate();
            if ($auth === true) {
                if ($login->passwordExpired()) {
                    header("HTTP/1.1 302 Found");
                    header("Location: /login/password-expiry");

                }
                $login->setState();
            } elseif ($auth === false) {
                // only send a 403 error if they were attempting to log in,
                // otherwise the login page returns a 403 when first accessing
                // it.
                if (!empty($_REQUEST['login'])) {
                    header("HTTP/1.1 403 Forbidden");
                } else {
                    // authenticate set an "Incorrect username or password"
                    // error. We don't want it to be displayed on the login page
                    // if they didn't just try and log in, so as a hack clear
                    // it if $_REQUEST['login'] isn't set.
                    $login->_lastError = '';
                }
                $login->clearState();
            }
        }
        if (!$login->isLoggedIn()) {
            return false;
        }

        User::singleton($_SESSION['State']->getUsername());

        session_write_close();
        // finished initializing
        return true;
    }

    /**
     * Returns true if the user is logged in
     *
     * @return true only if user is logged in
     */
    function isLoggedIn()
    {
        if (!isset($_SESSION['State'])) {
            $_SESSION['State'] =& State::singleton();
            $login = new SinglePointLogin();
            $_SESSION['State']->setProperty('login', $login);
        } else {
            $login = $_SESSION['State']->getProperty('login');
        }

        return $login->isLoggedIn();
    }
}


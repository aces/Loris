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
     * @return true on success
     */
    function initialize(?string $configFile = null)
    {
        // Load the config file.
        $factory = NDB_Factory::singleton();

        $config = $factory->config($configFile);

        // Load the database object with settings from config
        // so that after this we can just call Database::singleton()
        // with no parameters
        $DBSettings = $config->getSetting("database");
        if (!defined("UNIT_TESTING")) {
            $DB = Database::singleton(
                $DBSettings['database'],
                $DBSettings['username'],
                $DBSettings['password'],
                $DBSettings['host'],
                true
            );
        }

        // Now make sure the factory reference is the same as the
        // singleton reference
        $DB = $factory->database();

        // add extra include paths. This must be done
        // after the database is connected, since the setting
        // can come from the database.
        $extLibs = $config->getSetting('extLibs');
        if (!empty($extLibs)) {
            set_include_path($extLibs.":".get_include_path());
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
            array("nm" => "CSPAdditionalHeaders")
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
        // 5. Allow reCAPTCHA domains iff the CAPTCHA keys were set
        //    up by the project
        header(
            "Content-Security-Policy: "
            . "default-src 'self' 'unsafe-inline'; "
            . "script-src 'self' 'unsafe-inline' 'unsafe-eval' $CaptchaDomains; "
            . "font-src 'self' data:; "
            . "img-src 'self' data:; "
            . $config_additions
        );
        // start php session
        $sessionOptions = array('cookie_httponly' => true);
        // TODO remove this if statement when 7.3 is the minimum required LORIS
        // version. All session from then onward should have Same Site enabled.
        if (PHP_MAJOR_VERSION === 7 && PHP_MINOR_VERSION >= 3) {
            $sessionOptions['cookie_samesite'] = true;
        }

        // API Detect
        if (strpos($_SERVER['REDIRECT_URL'], '/api/v0.0.3-dev/') !== false) {
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

        // finished initializing
        return true;
    }

    /**
     * Returns true if the user is logged in
     *
     * @return true iff user is logged in
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


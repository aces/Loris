<?php declare(strict_types=1);

/**
 * This file contains the NDB_Client class
 *
 * PHP Version 8
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

        // Load config file into factory as a side-effect
        $factory->config($configFile);

        // stop here if this is a command line client
        if (!$this->_isWebClient) {
            // Set user as unix username.
            // Requires Loris to have user with this username
            $username = getenv('USER');
            if ($username === false) {
                // happens under GitHub actions tests
                $username = '';
            }
            User::singleton($username);
            return true;
        }

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
			return false;
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
}


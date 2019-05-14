<?php
/**
 * Base class to handle requests to the Loris API and perform
 * validation common to all API requests.
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API;
require_once __DIR__ . '/SafeExitException.php';
require_once __DIR__ . '/../../../vendor/autoload.php';

/**
 * Base class to handle requests to the Loris API and perform
 * validation common to all API requests.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class APIBase
{
    var $DB;
    var $client;
    var $JSON;
    var $AllowedMethods = [];
    var $AutoHandleRequestDelegation = true;
    var $HTTPMethod;

    var $Factory;
    var $Headers;

    /**
     * Constructor to handle basic validation
     *
     * @param string $method The HTTP request method
     */
    function __construct($method)
    {
        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }
        // Verify that method is allowed for this type of request.
        if (!in_array($method, $this->AllowedMethods)) {
            $this->header("HTTP/1.1 405 Method Not Allowed");
            $this->header("Allow: " . join(", ", $this->AllowedMethods));
            $this->safeExit(0);
        }

        $this->HTTPMethod = $method;

        //Load config file and ensure paths are correct
        set_include_path(
            get_include_path() . ":" .
            __DIR__ . "/../../../php/libraries"
        );
        include_once 'NDB_Client.class.inc';

        $this->Factory = \NDB_Factory::singleton();
        $this->client  = new \NDB_Client();
        if (defined("UNIT_TESTING")) {
            // Unit tests are run from the command line, so avoid all
            // the session stuff if we're in a unit test
            $this->client->makeCommandLine();
        }
        $this->client->initialize(__DIR__ . "/../../../project/config.xml");

        if (!defined("UNIT_TESTING")) {

            if (!$this->client->isLoggedIn()) {
                $this->header("HTTP/1.1 401 Unauthorized");
                $this->error("User not authenticated");
                $this->safeExit(0);
            }
        }

        $this->DB = $this->Factory->database();

        if ($this->AutoHandleRequestDelegation) {
            $this->handleRequest();
        }
    }

    /**
     * Handles a request by delegating to the appropriate
     * handle method
     *
     * @return void
     */
    function handleRequest()
    {
        $method = $this->HTTPMethod;

        switch($this->HTTPMethod) {
        case 'GET':
            $this->handleETag();
            $this->handleGET();
            break;
        case 'PUT':
            $this->handlePUT();
            break;
        case 'POST':
            $this->handlePOST();
            break;
        case 'OPTIONS':
            $this->handleOPTIONS();
            break;
        case 'PATCH':
            $this->handlePATCH();
            break;

        }
    }

    /**
     * Determine the ETag for this resource and abort
     * early if the client already has it.
     *
     * @return void
     */
    function handleETag()
    {
        session_destroy();
        session_cache_limiter('private');
        session_start(array('cookie_httponly' => true));
        $ETag = $this->calculateETag();

        $this->header("ETag: $ETag");
        if (isset($_SERVER['HTTP_IF_NONE_MATCH'])
            && $_SERVER['HTTP_IF_NONE_MATCH'] === $ETag
        ) {
            $this->header("HTTP/1.1 304 Not Modified");
            $this->safeExit(0);
        }

    }

    /**
     * Calculate the ETag for this resource
     *
     * @return string an ETag for this resource
     */
    abstract function calculateETag();

    /**
     * Handle a GET request
     *
     * @return void
     */
    function handleGET()
    {

    }

    /**
     * Handle a PUT request
     *
     * @return void
     */
    function handlePUT()
    {
        $this->header("HTTP/1.1 501 Not Implemented");
        $this->safeExit(0);
    }

    /**
     * Handle a POST request
     *
     * @return void
     */
    function handlePOST()
    {
        $this->header("HTTP/1.1 501 Not Implemented");
        $this->safeExit(0);
    }

    /**
     * Handle a PATCH request
     *
     * @return void
     */
    function handlePATCH()
    {
        $this->header("HTTP/1.1 501 Not Implemented");
        $this->safeExit(0);
    }

    /**
     * Handle a OPTIONS request
     *
     * @return void
     */
    function handleOPTIONS()
    {
        $this->Header(
            "Access-Control-Allow-Methods: ".
            join(",", $this->AllowedMethods)
        );
        $this->safeExit(0);
    }

    /**
     * Encodes this object as a string of valid JSON
     *
     * @return string encoding of JSON
     */
    function toJSONString()
    {
        return json_encode($this->JSON);
    }

    /**
     * Print an error message to the client
     *
     * @param string $msg The error message to display
     *
     * @return void
     */
    function error($msg)
    {
        print json_encode(["error" => $msg]);
    }

    /**
     * Send a header to the client, or put it in an array
     * to evaluate in unit testing if UNIT_TESTING is defined
     *
     * @param string $head The header to send to the client
     *
     * @return void
     */
    function header($head)
    {
        if (defined("UNIT_TESTING")) {
            $this->Headers[] = $head;
        } else {
            header($head);
        }
    }

    /**
     * Exits the program in a way that is safe for unit testing
     *
     * @param integer $code The program exit code
     *
     * @return void but exits the running program
     */
    function safeExit($code)
    {
        if (defined("UNIT_TESTING")) {
            throw new SafeExitException(
                "Aborting test with code $code",
                $code,
                $this
            );
        } else {
            exit($code);
        }
    }
}


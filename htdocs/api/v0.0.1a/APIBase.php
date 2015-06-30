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
class APIBase
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
        // Even though it's not a command line client, this prevents
        // the login related to showing the login screen from applying,
        // then we manually
        $this->client->makeCommandLine();
        $this->client->initialize(__DIR__ . "/../../../project/config.xml");

        /*
        if(!$this->client->isLoggedIn()) {
            header("HTTP/1.1 401 Unauthorized");
            print json_encode(["error" => "User not authenticated"]);
            exit(0);
        }
         */

        $this->DB = $this->Factory->database();

        if ($this->AutoHandleRequestDelegation) {
            $this->handleRequest();
        }
    }

    /**
     * Handles a request by delegating to the appropriate
     * handle method
     *
     * @return none
     */
    function handleRequest()
    {
        $method = $this->HTTPMethod;

        switch($this->HTTPMethod) {
        case 'GET':
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

        }
    }

    /**
     * Handle a GET request
     *
     * @return none
     */
    function handleGET()
    {

    }

    /**
     * Handle a PUT request
     *
     * @return none
     */
    function handlePUT()
    {
        $this->header("HTTP/1.1 501 Not Implemented");
        $this->safeExit(0);
    }

    /**
     * Handle a POST request
     *
     * @return none
     */
    function handlePOST()
    {
        $this->header("HTTP/1.1 501 Not Implemented");
        $this->safeExit(0);
    }

    /**
     * Handle a OPTIONS request
     *
     * @return none
     */
    function handleOPTIONS()
    {
        $this->Header(
            "Access-Control-Allow-Methods: ".
            join($this->AllowedMethods, ",")
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
     * @return none
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
     * @return none
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
     * @return none, but exits the running program
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
?>

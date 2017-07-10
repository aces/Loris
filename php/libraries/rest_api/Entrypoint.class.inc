<?php
/**
 * This file contains an Entrypoint class to handle request sent to LORIS Rest API.
 *
 * It is inspired from http://coreymaynard.com/blog/creating-a-restful-api-with-php/
 * And also from Dave MacFarlane previous work on LORIS RestAPI v0.0.{1|2}
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS RestAPI
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

namespace LORIS\RestAPI;

/**
 * The Entrypoint is the controler of the flow of operations.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS RestAPI
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Entrypoint
{
    /**
     * The HTTP method this request was made in, either GET, POST, PUT or DELETE
     */
    private $_method = '';

    /**
     * Any additional URI components after the endpoint and verb have been removed, in our
     * case, an integer ID for the resource. eg: /<endpoint_1>/<id_1>/<endpoint_2>/<id_2>
     * or /<endpoint>/<arg0>
     */
    private $_args = Array();

    /**
     * Stores the input of the PUT request
     */
    private $_inputs = array();

    public function __construct()
    {
        $this->_header("Access-Control-Allow-Origin: *");
        $this->_header("Content-Type: application/json");

        $this->_args = explode('/', rtrim($_REQUEST['req'], '/'));


        if (!array_key_exists(0, $this->_args)) {
            $this->_error("Endpoint not specified", 404);
        }

        $this->_request  = $this->_cleanInputs($this->_args);

        $this->_method = $_SERVER['REQUEST_METHOD'];
        // X-HTTP-Method header can be added to a POST request that signals that the
        // server MUST process the request not as a POST
        if ($this->_method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->_method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->_method = 'PUT';
            } else {
                $this->_error("Method not recognized", 501);
            }
        }

        switch($this->_method) {
            case 'POST':
            case 'PUT':
            case 'DELETE':
                $input = json_decode(file_get_contents("php://input"),true);
                if (!is_array($input)) {
                    $this->_error("Invalid input", 400);
                }
                $this->_inputs = $this->_cleanInputs($input);
            case 'GET':
            case 'OPTIONS':
                break;
            default:
                $this->_error("Invalid Method $this->_method", 405);
                break;
        }

        unset($_GET);
        unset($_POST);
        unset($_REQUEST);

        $client = new \NDB_Client();

        $client->makeCommandLine();
        $client->initialize();
    }
    
    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim($data);
        }
        return $clean_input;
    }

    public function run()
    {
        try {
            $endpoint = $this->_getEndpointInstance($this->_request);

            $function_name = 'handle' . $this->_method;
            if ($this->_method == 'OPTIONS') {
                $allowedMethods = $endpoint->getAllowedMethods();
                $this->_header("Allow: $allowedMethods");
            }

            list($data, $status) = $endpoint->{$function_name}(
                $this->_inputs
            );

            $this->_response($data, $status);

        } catch (RestApiException405 $e) {
            $allowedMethods = $e->getPrevious()->getMessage();
            $this->_header("Allow: $allowedMethods");
            $this->_error($e->getMessage(), $e->getCode());

        } catch (RestApiException $e) {
            $this->_error($e->getMessage(), $e->getCode());

        } catch (\Exception $e) {
            $this->_error("Unknown Error", 520);
        } catch (\Error $e) {
            // TODO :: Security check : Is is safe to display any Fatal error in
            // The repsonse body?
            $msg = $e->getMessage();
            $file = $e->getFile();
            $line_number = $e->getLine();
            $this->_error("$msg in $file at line #$line_number");
        }
    }

    /**
     * Send a header to the client, or put it in an array
     * to evaluate in unit testing if UNIT_TESTING is defined
     *
     * @param string $header The header to send to the client
     *
     * @return none
     */
    private static function _header(string $header)
    {
        if (defined("UNIT_TESTING")) {
            self::$Headers[] = $header;
        } else {
            header($header);
        }
    }

    public static function _response(array $data, int $status = 200) {
        $response_body = array('response' => $data);

        switch ($status) {
            case 100: $text = 'Continue'; break;
            case 101: $text = 'Switching Protocols'; break;
            case 200: $text = 'OK'; break;
            case 201: $text = 'Created'; break;
            case 202: $text = 'Accepted'; break;
            case 203: $text = 'Non-Authoritative Information'; break;
            case 204: $text = 'No Content'; break;
            case 205: $text = 'Reset Content'; break;
            case 206: $text = 'Partial Content'; break;
            case 300: $text = 'Multiple Choices'; break;
            case 301: $text = 'Moved Permanently'; break;
            case 302: $text = 'Moved Temporarily'; break;
            case 303: $text = 'See Other'; break;
            case 304: $text = 'Not Modified'; break;
            case 305: $text = 'Use Proxy'; break;
            case 400: $text = 'Bad Request'; break;
            case 401: $text = 'Unauthorized'; break;
            case 402: $text = 'Payment Required'; break;
            case 403: $text = 'Forbidden'; break;
            case 404: $text = 'Not Found'; break;
            case 405: $text = 'Method Not Allowed'; break;
            case 406: $text = 'Not Acceptable'; break;
            case 407: $text = 'Proxy Authentication Required'; break;
            case 408: $text = 'Request Time-out'; break;
            case 409: $text = 'Conflict'; break;
            case 410: $text = 'Gone'; break;
            case 411: $text = 'Length Required'; break;
            case 412: $text = 'Precondition Failed'; break;
            case 413: $text = 'Request Entity Too Large'; break;
            case 414: $text = 'Request-URI Too Large'; break;
            case 415: $text = 'Unsupported Media Type'; break;
            case 500: $text = 'Internal Server Error'; break;
            case 501: $text = 'Not Implemented'; break;
            case 502: $text = 'Bad Gateway'; break;
            case 503: $text = 'Service Unavailable'; break;
            case 504: $text = 'Gateway Time-out'; break;
            case 505: $text = 'HTTP Version not supported'; break;
            default:
                $text = 'Internal Server Error';
            break;
        }
        
        self::_header("HTTP/1.1 " . $status . " " . $text);
        print json_encode($response_body);
    }

    /**
     * Print an error message to the client
     *
     * @param string $msg The error message to display
     *
     * @return none
     */
    private static function _error(string $msg, int $status = 500)
    {
        self::_response(['error' => $msg], $status);
        error_log("API call exited with 1: " . $msg);
        self::_safeExit(1);
    }

    /**
     * Exits the program in a way that is safe for unit testing
     *
     * @param integer $code The program exit code
     *
     * @return none, but exits the running program
     */
    private static function _safeExit(int $code)
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

    private function _getEndpointInstance(array &$request)
    {
        $endpoint_name = array_shift($request);
        $endpoint_id   = array_shift($request);

        $class_name = '\LORIS\RestAPI\\' . $endpoint_name;
        if (!class_exists($class_name)) {
            $this->_error("No Endpoint: $endpoint_name", 404);
        }

        $endpoint = new $class_name($endpoint_id);
        return $endpoint->getEndpointInstance($request);
    }
}

<?php
namespace LORIS\API;
 
require_once __DIR__ . '/../../../vendor/autoload.php';

class RestAPI_EntryPoint
{
    private $_params;
    private $_data;

    public function __construct()
    {
        $client = new \NDB_Client();

        $client->makeCommandLine();
        $client->initialize();

        $this->_prepareParams();
        $this->_prepareData();
    }

    private function _prepareParams()
    {
        // extract params from $_REQUEST
        $raw = explode('/',$_REQUEST['req']);

        // Trim them
        $trimed = array_map('trim', $raw);

        // Remove empty strings
        $filtered = array_filter($trimed, function($item) {
            return strlen($item) > 0;
        });

        unset($_GET);
        unset($_POST);
        unset($_REQUEST);

        $this->_params = $filtered;
    }

    private function _prepareData()
    {
          $input = "";

          $fp   = fopen("php://input", "r");
          while (!feof($fp)) {
              $input .= fread($fp, 1024);
          }
          fclose($fp);

          $this->_data = json_decode($input);
    }

    public function run()
    {

        if ($this->_params[0] === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $handler = new LORIS\API\Login();
            $handler->handlePOST();
            exit;
        }

        $login = new \SinglePointLogin();
        if (!$login->authenticate()) {
            header("HTTP/1.1 401 Unauthorized");
            print json_encode(["error" => "You are not logged in"]);
            exit;
        }

        $handler_name = "LORIS\API\\" . $this->_params[0];

        if (!class_exists($handler_name)) {
            header("HTTP/1.1 400 Not Found");
            print json_encode(["error" => "This endpoint does not exists"]);
            exit;
        }

        try {
            $handler = new $handler_name();
            array_shift($this->_params);

            switch ($_SERVER['REQUEST_METHOD'])
            {
               case 'POST':
                   $this->_prepareData();
                   $handler->handlePOST($this->_params, $this->_data);
                   break;
               case 'GET':
                   // TODO :: ETag checking
                   $handler->handleGET($this->_params);
                   break;
               case 'PUT':
                   $handler->handlePUT($this->_params);
                   break;
               case 'DELETE':
                   $handler->handleDELETE($this->_params);
                   break;
               case 'OPTIONS':
                   $handler->handleOPTIONS();             
                   break;
               default:
                   $this->header("HTTP/1.1 501 Not Implemented");
                   print json_ecode(["error" => "Method not recognized"]);
            }

        } catch (\LORIS\Exceptions\AccessDeniedException $e) {
            header("HTTP/1.1 401 Unauthorized");
            print json_encode(["error" => $e->getMessage()]);

        } catch (\Exception $e) {
            header("HTTP/1.1 520 Unknown Error");
            print json_encode(["error" => "Unknown Error"]);
        }
    }
}

header('Content-type: application/json');
ob_start();

$api = new RestAPI_EntryPoint();
$api->run();

ob_end_flush();
exit;

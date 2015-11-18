<?php
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';
require_once '../../../vendor/autoload.php';
class Login extends APIBase {
    function __construct($method, $data) {
        $this->AllowedMethods = array(
            'POST',
        );
        $this->RequestData    = $data;

        if (!in_array($method, $this->AllowedMethods)) {
            $this->header("HTTP/1.1 405 Method Not Allowed");
            $this->header("Allow: " . join(", ", $this->AllowedMethods));
            $this->safeExit(0);
        }

        $client  = new \NDB_Client();
        // Bypass session handling because we're trying to authenticate a session
        $client->makeCommandLine();
        $client->initialize(__DIR__ . "/../../../project/config.xml");

        $this->HTTPMethod = $method;
        $this->handleRequest();

    }
    function handlePOST() {
        $factory = \NDB_Factory::singleton();
        $config = $factory->config();

        $key = $config->getSetting("JWTKey");

        $user = $this->RequestData['username'];
        $password = $this->RequestData['password'];

        $login = new \SinglePointLogin();

        if($login->passwordAuthenticate($user, $password, false)) {
            $token = array(
                // JWT related tokens to for the JWT library to validate
                "iss"  => "getBaseURLCall()",
                "aud" => "getBaseURLCall()",
                // Issued at
                "iat" => time(), 
                "nbf" => time(),
                // Expire in 1 day
                "exp" => time() + 86400,
                // Additional payload data
                "user" => $user
            );

            $this->JSON = array(
                    "token" => \Firebase\JWT\JWT::encode($token, $key, "HS256")
                );
        } else {
            header("HTTP/1.1 401 Unauthorized");
            if(!empty($login->_lastError)) {
                $this->JSON = array(
                    "error" => $login->_lastError
                    );
            }

        }
    }
    function calculateETag() {
        return;
    }
}

if (isset($_REQUEST['PrintLogin'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $obj = new Login($_SERVER['REQUEST_METHOD'], $_POST);
    } else {
        $obj = new Login($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}
?>

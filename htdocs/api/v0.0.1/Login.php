<?php
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once __DIR__ . '/APIBase.php';
require_once __DIR__ . '/../../../vendor/autoload.php';
class Login extends APIBase {
    function __construct($method, $data = array()) {
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
        $user     = $this->RequestData['username'];
        $password = $this->RequestData['password'];

        $login = $this->getLoginAuthenticator();

        if($login->passwordAuthenticate($user, $password, false)) {
            $this->JSON = array(
                           "token" => $this->getEncodedToken($user)
                          );
        } else {
            $this->header("HTTP/1.1 401 Unauthorized");
            if(!empty($login->_lastError)) {
                $this->JSON = array(
                    "error" => $login->_lastError
                    );
            }

        }
    }

    function getLoginAuthenticator() {
        return new \SinglePointLogin();
    }

    function getEncodedToken($user) {
        $factory = \NDB_Factory::singleton();
        $config = $factory->config();

        $www = $config->getSetting("www");
        $baseURL = $www['url'];

        $token = array(
            // JWT related tokens to for the JWT library to validate
            "iss"  => $baseURL,
            "aud" => $baseURL,
            // Issued at
            "iat" => time(),
            "nbf" => time(),
            // Expire in 1 day
            "exp" => time() + 86400,
            // Additional payload data
            "user" => $user
        );

        $key = $config->getSetting("JWTKey");
        return \Firebase\JWT\JWT::encode($token, $key, "HS256");
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

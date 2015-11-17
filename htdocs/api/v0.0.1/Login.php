<?php
require_once '../../../vendor/autoload.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 405 Method Not Allowed");
    header("Allow: POST");
    exit(0);
}

$client  = new \NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");

$user = $_POST['username'];
$password = $_POST['password'];

$login = new SinglePointLogin();

if($login->passwordAuthenticate($user, $password, false)) {
    $token = array(
        // JWT related tokens to for the JWT library to validate
        "iss"  => "getBaseURLCall()",
        "aud" => "getBaseURLCall()",
        // Issued at
        "iat" => time(), 
        "nbf" => time(),
        // Expire in 1 day
        "exp" => time() + 86400
        // Additional payload data
        "user" => $user
    );

    print json_encode(array(
        "token" => \Firebase\JWT\JWT::encode($token, "example_key", "HS256")
    ));
    exit(0);
}
header("HTTP/1.1 401 Unauthorized");

if(!empty($login->_lastError)) {
    print json_encode(array(
        "error" => $login->_lastError
    ));
}
?>

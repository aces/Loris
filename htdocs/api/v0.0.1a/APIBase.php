<?php
/**
 * PHP 5.5+
 */
namespace Loris\API;
require_once __DIR__ . '/SafeExitException.php';

class APIBase {
    var $DB;
    var $client;
    var $JSON;
    var $AllowedMethods = [];
    var $AutoHandleRequestDelegation = true;
    var $HTTPMethod;

    var $Factory;

    function __construct($method) {
        if(empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }
        // Verify that method is allowed for this type of request.
        if(!in_array($method, $this->AllowedMethods)) {
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
        require_once 'NDB_Client.class.inc';

        $this->client = new \NDB_Client();
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

        $this->Factory = \NDB_Factory::singleton();
        $this->DB = $this->Factory->database();

        if($this->AutoHandleRequestDelegation) {
            $this->handleRequest();
        }
    }

    function handleRequest() {
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

        }
    }

    function handleGET() {

    }

    function handlePUT() {
        $this->header("HTTP/1.1 501 Not Implemented");
        exit(0);
    }

    function handlePOST() {
        $this->header("HTTP/1.1 501 Not Implemented");
        exit(0);
    }

    function toJSONString() {
        return json_encode($this->JSON);
    }

    function error($msg ) {
        if(defined("UNIT_TESTING")) {
        } else {
            print json_encode(["error" => $msg]);
        }
    }
    function header($head) {
        if(defined("UNIT_TESTING")) {
            //print $head;
        } else {
            header($head);
        }
    }

    function safeExit($code) {
        if(defined("UNIT_TESTING")) {
            throw new SafeExitException("Aborting test with code $code", $code, $this);
        } else {
            exit($code);
        }
    }
}
?>

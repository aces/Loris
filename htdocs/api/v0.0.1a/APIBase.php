<?php
/**
 * PHP 5.5+
 */

class APIBase {
    var $DB;
    var $client;
    var $JSON;
    var $AllowedMethods = ['GET'];
    var $AutoHandleRequestDelegation = true;
    var $HTTPMethod;

    function __construct($method) {
        // Verify that method is allowed for this type of request.
        if(!in_array($method, $this->AllowedMethods)) {
            header("HTTP/1.1 405 Method Not Allowed");
            header("Allow: " . join(", ", $this->AllowedMethods));
            exit(0);
        }

        $this->HTTPMethod = $method;

        //Load config file and ensure paths are correct
        set_include_path(
            get_include_path() . ":" .
            __DIR__ . "/../../../php/libraries"
        );
        require_once 'NDB_Client.class.inc';

        $this->client = new NDB_Client();
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

        $this->DB = Database::singleton();

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
    }
    function handlePOST() {
    }

    function toJSONString() {
        return json_encode($this->JSON);
    }
}
?>

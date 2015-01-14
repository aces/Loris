<?php
/**
 * PHP 5.5+
 */

class APIBase {
    var $DB;
    var $client;
    var $JSON;
    function __construct() {
        //Load config file and ensure paths are correct
        set_include_path(
            get_include_path() . ":" .
            __DIR__ . "/../../../php/libraries"
        );
        require_once 'NDB_Client.class.inc';

        header("Access-Control-Allow-Origin: *");
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
    }

    function toJSONString() {
        return json_encode($this->JSON);
    }
}
?>

<?php
ini_set("memory_limit", "2G");
// Load config file and ensure paths are correct
set_include_path(
    get_include_path() . ":../../../project/libraries:../../../php/libraries"
);
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
require_once 'CouchDB.class.inc';
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

$cdb = CouchDB::singleton();

$view = $_GET['view'];
$params = $_GET;
unset($params['view']);

$result = $cdb->queryView("DQG-2.0", $view, $params, true);
print_r($result);
?>

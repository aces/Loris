<?php
//Load config file and ensure paths are correct
set_include_path(
get_include_path() . ":" .
__DIR__ . "../../../php/libraries"
);

header("Access-Control-Allow-Origin: *");
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../../../project/config.xml");

$projects = Utility::getProjectList();
$returnVal = [
    "Projects" =>  array_values($projects)
];
print json_encode($returnVal);
?>

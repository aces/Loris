<?php
/**
 * PHP 5.5+
 */
//Load config file and ensure paths are correct
set_include_path(
    get_include_path() . ":" .
    __DIR__ . "../../../php/libraries"
);

header("Access-Control-Allow-Origin: *");
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
require_once 'Database.class.inc';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../../../project/config.xml");

$DB = Database::singleton();

$candidates = $DB->pselect("SELECT CandID FROM candidate WHERE Active='Y'", array());

$candValues = array_column($candidates, "CandID");
/*
array_map(function($row) {
    return $row['CandID'];
}, $candidates);

 */

$returnVal = [
    "Candidates" =>  $candValues
];
print json_encode($returnVal);
?>

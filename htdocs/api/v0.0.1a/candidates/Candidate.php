<?php
//Load config file and ensure paths are correct
set_include_path(
    get_include_path() . ":" .
    __DIR__ . "../../../../php/libraries"
);

header("Access-Control-Allow-Origin: *");
// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
require_once 'Database.class.inc';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../../../../project/config.xml");

$candID = $_REQUEST['CandID'];

$cand = Candidate::singleton($candID);

$retVal = [
    "Meta"   => [ "CandID" => $candID ],
    "Visits" => array_values($cand->getListOfVisitLabels())
];

print json_encode($retVal);
?>

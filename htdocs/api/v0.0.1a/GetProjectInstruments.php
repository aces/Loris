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

/*
    {
            "Meta" : {
                        "Project" : "ProjectName"
                                },
                                    "Instruments" : ["InstrumentName", "InstrumentName2", "..."]
    }
 */

$project = $_REQUEST['Project'];

require_once 'Utility.class.inc';
$Instruments = Utility::getAllInstruments();
$InstrumentNames = array_keys($Instruments);
$returnVal = [
    "Meta" => [
        "Project" => $project
    ],
    "Instruments" => $InstrumentNames
];
print json_encode($returnVal);
?>

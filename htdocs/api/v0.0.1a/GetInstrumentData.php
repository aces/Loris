<?php
//Load config file and ensure paths are correct
set_include_path(
get_include_path() . ":" .
__DIR__ . "/../../../php/libraries:" . 
__DIR__ . "/../../../project/libraries"
);

header("Access-Control-Allow-Origin: *");
//// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../../../project/config.xml");

require_once "NDB_BVL_Instrument.class.inc";

$Instrument = $_REQUEST['Instrument'];
$Visit      = $_REQUEST['Visit'];
$CandID     = $_REQUEST['CandID'];

$DB = Database::singleton();

$CommentID = $DB->pselectOne(
    "SELECT CommentID FROM flag f
        LEFT JOIN session s ON (s.ID=f.SessionID AND s.Visit_label=:VL)
        LEFT JOIN candidate c USING (CandID)
    WHERE Test_name=:TN AND s.CandID=:CID AND s.Active='Y' AND c.Active='Y' AND f.CommentID NOT LIKE 'DDE%'", array('VL' => $Visit, 'TN' => $Instrument, 'CID' => $CandID)
    );

if(isset($_REQUEST['DDE'])) {
    $CommentID = 'DDE_' . $CommentID;
}

$Value = [
    "Meta" => [
        "Instrument" => $Instrument,
        "Visit"      => $Visit,
        "Candidate"  => $CandID,
        "DDE"        => isset($_REQUEST['DDE']) ? true : false
    ]
];

$inst = NDB_BVL_Instrument::factory($Instrument, $CommentID, null);
if(!isset($_REQUEST['flags'])) {
    $Values = NDB_BVL_Instrument::loadInstanceData($inst);

    unset($Values['CommentID']);
    unset($Values['UserID']);
    unset($Values['Testdate']);
    unset($Values['Data_entry_completion_status']);

    $Value[$Instrument] = $Values;
} else {
    $flags = $DB->pselectRow("SELECT Data_entry, Administration, Validity FROM flag WHERE CommentID=:CID", ['CID' => $CommentID ]);

    if(!$inst->ValidityEnabled) {
        unset($flags['Validity']);
    }
    $Value['Flags'] = $flags;
}

print json_encode($Value);
?>

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
$Visit  = $_REQUEST['VisitLabel'];

$cand = Candidate::singleton($candID);
$Visits = array_values($cand->getListOfVisitLabels());


if(in_array($Visit, $Visits)) {
    $VL = $Visit;
} else {
    throw new Exception("Invalid visit");
}

$Insts = $DB->pselect(
    "SELECT Test_name FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE s.CandID=:CID AND s.Active='Y' AND s.Visit_label=:VL",
    array('CID' => $candID, 'VL' => $VL)
);
$Instruments = array_column($Insts, 'Test_name');
$retVal = [
    "Meta"   => [
        "CandID" => $candID,
        'Visit'  => $VL
    ],
    'Instruments' => $Instruments
];

print json_encode($retVal);
?>

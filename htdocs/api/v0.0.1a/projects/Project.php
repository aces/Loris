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
$client->initialize("../../../../project/config.xml");
require_once 'Utility.class.inc';

$project = $_REQUEST['Project'];

function getProjectID($projectName) {
    $config = NDB_Config::singleton();

    $Projects = $config->getSetting("Projects")["project"];
    foreach($Projects as $project) {
        if($project['title'] === $projectName) {
            return $project['id'];
        }
    }
}

$projID = getProjectID($project);

// Basic stub
$returnVal = [
    "Meta" => [
        "Project" => $project
    ]
];

$Instruments = Utility::getAllInstruments();
$InstrumentNames = array_keys($Instruments);

$Visits = Utility::getExistingVisitLabels($projID);
$VisitNames = array_keys($Visits);



$DB = Database::singleton();
$rows = $DB->pselect("SELECT CandID FROM candidate WHERE ProjectID=:projID", array("projID" => $projID));
$CandIDs = [];
if(isset($_REQUEST['Candidates'])) {
    foreach($rows as $row) {
        $CandIDs[] = $row['CandID'];
    }
    $returnVal['Candidates'] = $CandIDs;
}
if(isset($_REQUEST['Instruments'])) {
    $returnVal['Instruments'] = $InstrumentNames;
}
if(isset($_REQUEST['Visits'])) {
    $returnVal['Visits'] = $VisitNames;
}

print json_encode($returnVal);
?>

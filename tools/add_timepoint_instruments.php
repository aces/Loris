<?php

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// path to config file
$configFile = "../project/config.xml";

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$db =& Database::singleton();
if(PEAR::isError($db)) {
    fwrite(STDERR, "Could not connect to database: ".$db->getMessage());
    return false;
}

$visit_ages = array(
    'v06' => 180,
    'v12' => 365,
    'v18' => 545,
    'v24' => 730,
    'v36' => 1095
);

if($argc != 3) {
    print "Usage: $argv[0] <CandID> <Visit Label>\n";
    exit(-1);
}
$vl = $argv[2];
$CandID= $argv[1];

$fake_age = $visit_ages[$vl];

$session= $DB->pselectRow("SELECT ID, SubprojectID, CenterID FROM session WHERE CandID=:CandID AND Visit_label=:vl", array(':CandID' => $CandID, 'vl' => $vl));
$SessionID = $session['ID'];
$Subproj = $session['SubprojectID'];
$Site = $session['CenterID'];
print_r($rows);
$rows = $DB->pselect("SELECT tb.Test_name FROM test_battery tb WHERE ((tb.AgeMinDays < :fake_age AND tb.AgeMaxDays > :fake_age) OR tb.Visit_label=:vl) AND tb.SubprojectID=:subproj AND NOT EXISTS (SELECT 'x' FROM flag f WHERE f.Test_name=tb.Test_name AND f.SessionID=:SessionID) AND (tb.CenterID=:site OR tb.CenterID IS NULL)", array(':fake_age' => $fake_age, ':vl' => $vl, ':subproj' => $Subproj, ':SessionID' => $SessionID, ':site' => $Site));

foreach($rows as $instrument) {
    `php fix_timepoint_date_problems.php add_instrument $CandID $SessionID $instrument[Test_name]`;
}

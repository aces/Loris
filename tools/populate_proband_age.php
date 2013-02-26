<?php

/**
 * inititalize
 */
set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Utility.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");
$config = NDB_Config::singleton();

$db =& Database::singleton();
if(PEAR::isError($db)) {
    fwrite(STDERR, "Could not connect to database: ".$db->getMessage());
    return false;
}

$database = $config->getSetting('database');

$instruments = Utility::getAllInstruments();
foreach ($instruments as $inst) {
    if(strrpos($inst, "_proband") === FALSE) {
        continue;
    }
    print "$inst";
    // Now works with vineland
    //if($inst == 'vineland' || $inst=="vineland_proband" || $inst=="vineland_subject") continue;
    $DB->select("SELECT i.CommentID, i.Date_taken FROM $inst i JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING(CandID) WHERE c.Active='Y' and s.Active='Y' AND i.Candidate_Age IS NULL AND i.Date_taken IS NOT NULL AND c.ProbandDoB IS NOT NULL", $CommentIDs);
    print "$inst (" . count($CommentIDs) . ")\n";
    $db->select("SELECT TABLE_NAME FROM information_schema.columns WHERE TABLE_SCHEMA='$database[database]' AND COLUMN_NAME='Date_taken' AND TABLE_NAME='$inst'", $tables);
    if(count($tables) > 0) {
        foreach ($CommentIDs as $row) {
            $date = explode('-', $row['Date_taken']);
            $dateArray = array ('Y' => $date[0], 'M' => $date[1], 'd' => $date[2]);
            $instrument =& NDB_BVL_Instrument::factory($inst, $row['CommentID'], null, false);
            if($instrument && !empty($row['Date_taken'])) {
                //print_r($dateArray);
                $instrument->_saveValues(array('Date_taken' => $dateArray));
            }
        }
    }

}

?>

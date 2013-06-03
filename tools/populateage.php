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

// This was required when there was incorrect html in the fields, but now we
// can just populate empty ones without deleting old ones
//$db->select("SELECT TABLE_NAME FROM information_schema.columns WHERE TABLE_SCHEMA='$database[database]' AND COLUMN_NAME='Candidate_Age'", $tables);
//foreach($tables as $table) {
    //print "Emptying $table[TABLE_NAME]\n";
    //$db->run("UPDATE $table[TABLE_NAME] SET Candidate_Age=NULL");
    /*
    $t = $table['TABLE_NAME'];
    $db->select("SELECT i.CommentID, i.Date_taken, c.DoB FROM $t i 
            JOIN flag f USING(CommentID) 
            JOIN session s ON (s.ID=f.SessionID) 
            JOIN candidate c USING(CandID)
        WHERE i.Date_taken IS NOT NULL and c.DoB IS NOT NULL 
                    -- AND i.Candidate_Age IS NULL 
                    -- For testing
                    -- AND i.CommentID='DDE_974665PHI01099231151265297851'
                    AND s.Active='Y' and s.Cancelled='N' 
                    AND c.Active='Y' and c.Cancelled='N'", $Missings);
    print $t . ":" . count($Missings) . "\n";
    foreach($Missings as $row) {
        $date = explode('-', $row['Date_taken']);
        $dateArray = array ('Y' => $date[0], 'M' => $date[1], 'd' => $date[2]);
        $instrument =& NDB_BVL_Instrument::factory('mullen', $row['CommentID'], null);
        $instrument->_saveValues(array('Date_taken' => $dateArray));
    }
    */

//}
$instruments = Utility::getAllInstruments();
foreach ($instruments as $inst) {
    // Now works with vineland
    //if($inst == 'vineland' || $inst=="vineland_proband" || $inst=="vineland_subject") continue;
    $DB->select("SELECT i.CommentID, i.Date_taken FROM $inst i JOIN flag f USING(CommentID) JOIN session s ON (s.ID=f.SessionID) JOIN candidate c USING(CandID) WHERE c.Active='Y' and s.Active='Y' AND i.Candidate_Age IS NULL AND i.Date_taken IS NOT NULL", $CommentIDs);
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
print_r($instruments);

?>

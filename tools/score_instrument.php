<?php

#!/data/web/neurodb/software/bin/php

/**
 * this tools scores any registered instrument that was build using the NDB_BVL_Instrument class and that has a working score() method.
 * the cmd-line arguments need to contain a valid test_name and 'all' or 'one' + candid and SessionID
 * 'all' scores all records of an instrument that belong to an active timepoint and whose data entry is completed and administration <> None.
 * the non-administered records' scores have to be reset in the DB - this tool does not manage them
 *
 * This tool can also be used to debug the scoring:
 * // To debug, comment out the UPDATE to DB in the scoring method(s) of the instrument's class
 * // add return $scores - an array of scores you're sending to the update
 * // and uncomment the lines at the end of the script to print out scores on the screen
 *
 * @version $Id: score_instrument.php,v 1.2 2006/04/07 12:58:41 jharlap Exp $
 * @package behavioural
 */

//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(),'4.3.0','<'))
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;' ) );
}

/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if (empty($argv[1]) || $argv[1] == 'help' || !in_array($argv[2], array('all','one')) || ($argv[2]=='one' && (empty($argv[3]) || empty($argv[4])))) {
    fwrite(STDERR, "Usage: \n\n");
    fwrite(STDERR, "score_instrument.php help - displays this msg\n");
    fwrite(STDERR, "score_instrument.php <test_name> one <candID> <sessionID>\n");
    fwrite(STDERR, "score_instrument.php <test_name> all \n");
    return;
}

/**
* get cmd-line arguments
*/
// get $action argument
$test_name = strtolower($argv[1]);
// get $action argument
$action = strtolower($argv[2]);
// CandID
if (!empty($argv[3])) $candID = $argv[3];
// sessionID
if (!empty($argv[4])) $sessionID = $argv[4];


/**
* inititalize
*/
set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");

// include instrument class
if (!is_file("../project/instruments/NDB_BVL_Instrument_$test_name.class.inc")) {
	fwrite(STDERR, "Included file does not exist (../project/instruments/NDB_BVL_Instrument_$test_name.class.inc)\n");
	return false;
}
require_once "../project/instruments/NDB_BVL_Instrument_$test_name.class.inc";

$db =& Database::singleton();
if(PEAR::isError($db)) {
    fwrite(STDERR, "Could not connect to database: ".$db->getMessage());
    return false;
}


// check that the $test_name is a valid instrument
$query = "SELECT DISTINCT test_name FROM test_battery WHERE Active='Y' AND Test_name ='$test_name'";
$db->selectRow($query, $result);
if (PEAR::isError($result)) {
    fwrite(STDERR, "DBError, failed to get the list of instruments: \n".$result->getMessage()."\n");
    return false;
}
// if nothing is returned than the instrument DNE
if (!is_array($result) || count($result)==0) {
    fwrite(STDERR, "Invalid Instrument ($test_name)!\n");
    return false;
}


// get the list of CommentIDs for valid timepoints
$query = "SELECT s.CandID, s.Visit_label, s.ID as SessionID, t.CommentID
          FROM candidate as c, session as s, flag as f, $test_name as t
          WHERE c.CandID=s.CandID AND s.ID=f.SessionID AND f.CommentID=t.CommentID
          AND s.Active = 'Y' AND s.Cancelled = 'N' AND c.Active='Y' AND c.Cancelled='N'
          AND f.Test_name = '$test_name' AND f.Administration <> 'None' AND f.Administration IS NOT NULL";
if ($action=='one') {
    $query .= " AND s.ID = '$sessionID' AND s.CandID='$candID'";
}
$db->select($query, $result);
if (PEAR::isError($result)) {
    fwrite(STDERR, "Dberror, failed to get the list of visits: \n".$result->getMessage()."\n");
    return false;
}
// return error if no candidates/timepoint matched the args
if (!is_array($result) || count($result)==0) {
    fwrite(STDERR, "No records match the criteria returned for candidate ($candID), timepoint ($sessionID)!\n");
    return false;
}

fwrite(STDERR, "Start \n");

// loop the list and derive scores for each record
foreach ($result as $record) {
    
    // make an instance of the instrument's object
    $instrument =& NDB_BVL_Instrument::factory($test_name, $record['CommentID'],null);
    if (PEAR::isError($instrument)) {
        fwrite(STDERR, $instrument->getMessage()."\n");
    }

    // check if the instrument has a scoring method
    if (!method_exists($instrument, "score")) {
        fwrite(STDERR, "Error, the instrument ($test_name) does not have a scoring feature \n");
        return false;
    }
    
    // print out candidate/session info
    fwrite(STDERR, "Candidate: ".$record['CandID']."/".$record['Visit_label']."/".$record['SessionID'].":: \n");
    fwrite(STDERR, "Candidate: ".$instrument->_dob."/".$instrument->_pls3Age."/".$instrument->getDateOfAdministration().":: \n");
    
    // call the score function
    $success = $instrument->score();
    if (PEAR::isError($success)) {
        fwrite(STDERR, "Error, failed to score the instrument ($test_name) for CommentID (".$record['CommentID']."):\n".$success->getMessage()."\n");
        return false;
    }
    
    fwrite(STDERR, "-- OK! \n");
    // unset
    unset($instrument);
}

fwrite(STDERR, "End \n");
?>
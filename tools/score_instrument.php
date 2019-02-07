<?php

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

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";

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
$test_name = $argv[1];
// get $action argument
$action = strtolower($argv[2]);
// CandID
if (!empty($argv[3])) $candID = $argv[3];
// sessionID
if (!empty($argv[4])) $sessionID = $argv[4];


/**
 * inititalize
 */
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");

$today= getdate();
$date = sprintf("%04d-%02d-%02d", $today['year'], $today['mon'], $today['mday']);

$logfp = fopen("logs/score_instrument.$date.log", 'a');
function log_msg($message) {
    global $logfp;
    $now_array = getdate();
    $now_string = sprintf("%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'], $now_array['mon'], $now_array['mday'], $now_array['hours'], $now_array['minutes'], $now_array['seconds']);
    fwrite($logfp, "[$now_string] $message\n");
}

// include instrument class
if(strtolower($test_name) != 'all') {
     if (!is_file("../project/instruments/NDB_BVL_Instrument_$test_name.class.inc")
            && !is_file("../project/instruments/$test_name.linst")) {
        fwrite(STDERR, "Included file does not exist (../project/instruments/NDB_BVL_Instrument_$test_name.class.inc)\n");
        return false;
    }
}

$db =& Database::singleton();

// check that the $test_name is a valid instrument
if($test_name== 'all') {
    $query = "SELECT DISTINCT test_name FROM test_battery WHERE Active='Y'";
} else {
    $query = "SELECT DISTINCT test_name FROM test_battery WHERE Active='Y' AND Test_name = :tnm";
}
$result = $db->pselect($query, array('tnm' => $test_name));
// if nothing is returned than the instrument DNE
if (!is_array($result) || count($result)==0) {
    fwrite(STDERR, "Invalid Instrument ($test_name)!\n");
    return false;
}


// get the list of CommentIDs for valid timepoints
foreach($result as $test) {
    $test_name = $test['test_name'];
    fwrite(STDERR, "Running scoring for $test_name");
    log_msg("");
    log_msg("Running scoring for $test_name");
    log_msg("------------------------------");

    $query = "SELECT s.CandID, s.Visit_label, s.ID as SessionID, t.CommentID, c.PSCID
        FROM candidate as c, session as s, flag as f, $test_name as t
        WHERE c.CandID=s.CandID AND s.ID=f.SessionID AND f.CommentID=t.CommentID
        AND s.Active = 'Y' AND c.Active='Y' 
        AND f.Test_name = :tnm AND f.Administration <> 'None' AND f.Administration IS NOT NULL";

    $params = array('tnm' => $test_name);
    if ($action=='one') {
        $query .= " AND s.ID = :sid AND s.CandID= :cid";
        $params = array_merge(
            $params,
            array(
                'sid' => $sessionID,
                'cid' => $candID
            )
        );
    }
    $result = $db->pselect($query, $params);
    // return error if no candidates/timepoint matched the args
    if (!is_array($result) || count($result)==0) {
        fwrite(STDERR, "No records match the criteria returned for candidate ($candID), timepoint ($sessionID)!\n");
        return false;
    }

    fwrite(STDERR, "Start \n");

    // loop the list and derive scores for each record
    foreach ($result as $record) {
        // make an instance of the instrument's object
        $instrument = NDB_BVL_Instrument::factory($test_name, $record['CommentID'],null);

        // check if the instrument has a scoring method
        if (!method_exists($instrument, "score")) {
            fwrite(STDERR, "Error, the instrument ($test_name) does not have a scoring feature \n");
            return false;
        }

        // print out candidate/session info
        fwrite(STDERR, "Candidate: ".$record['CandID']."/".$record['Visit_label']."/".$record['SessionID'].":: (".$record['PSCID'].")\n");
        //fwrite(STDERR, "Candidate: ".$instrument->_dob."/"."Test_name:".$test_name."/". $instrument->_pls3Age."/".$instrument->getDateOfAdministration().":: \n");

        // call the score function
        $oldRecord = $db->pselectRow("SELECT * FROM $test_name WHERE CommentID=:cid", array('cid' => $record['CommentID']));
        $success = $instrument->score();
        $newRecord = $db->pselectRow("SELECT * FROM $test_name WHERE CommentID=:cid", array('cid' => $record['CommentID']));
        unset($oldRecord['Testdate']);
        unset($newRecord['Testdate']);
        $diff = array_diff_assoc($oldRecord, $newRecord);

        if($diff != array()) {

            log_msg("Updated $record[CommentID]:");
            foreach ($diff as $key => $val) {
                $old = $oldRecord[$key] == null ? 'null' : $oldRecord[$key];
                $new = $newRecord[$key] == null ? 'null' : $newRecord[$key];
                log_msg("\t$key: $old => $new");
            }
        }
        else {
            log_msg("No changes made to " . $record['CommentID']);
        }

        fwrite(STDERR, "-- OK! \n");
        // unset
        unset($instrument);
    }
}

fclose($logfp);
fwrite(STDERR, "End \n")
?>

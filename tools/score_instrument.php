<?php

#!/usr/bin/php

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

if (version_compare(phpversion(),'4.3.0','<'))
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
                fclose(STDOUT); fclose(STDERR); fclose($logfp); return true;' ) );
}

require_once __DIR__."/generic_includes.php";

// LOGGING
$dir = __DIR__ . "/logs/";
if (!is_dir($dir)) {
    mkdir($dir);
}
$today= getdate();
$date = sprintf("%04d-%02d-%02d", $today['year'], $today['mon'], $today['mday']);
$logPath = __DIR__ . "/logs/score_instrument.$date.log";
$logfp = fopen($logPath, 'a');

if (!$logfp) {
    printError(
        "No logs can be generated, path:$logPath ".
        "does not exist or can not be written to.\n"
    );
}


/**
 * HELP SCREEN
 * display and stop processing if action=help
 */
if (empty($argv[1]) || $argv[1] == 'help' ||
    (isset($argv[2]) && !in_array($argv[2], array('all','one'))) ||
    (isset($argv[2]) && $argv[2]=='one' && (empty($argv[3]) || empty($argv[4])))
) {
    printOut(
        "Usage:
        score_instrument.php help - displays this msg
        score_instrument.php <test_name> one <candID> <sessionID>
        score_instrument.php <test_name> all
        score_instrument.php all \n\n"
    );
    return;
}

/**
 * get cmd-line arguments
 */
// get $action argument
$test_name = $argv[1];
// get $action argument
$action='';
if (isset($argv[2])) {
    $action = strtolower($argv[2]);
}
// CandID
if (!empty($argv[3])) $candID = $argv[3];
// sessionID
if (!empty($argv[4])) $sessionID = $argv[4];

// include instrument class
if(strtolower($test_name) != 'all') {
    if (!is_file("../project/instruments/NDB_BVL_Instrument_$test_name.class.inc")
        && !is_file("../project/instruments/$test_name.linst")) {
        printError("Included file does not exist (../project/instruments/NDB_BVL_Instrument_$test_name.class.inc)");
        return false;
    }
}

// check that the $test_name is a valid instrument
if($test_name== 'all') {
    $query = "SELECT DISTINCT test_name FROM test_battery WHERE Active='Y'";
} else {
    $query = "SELECT DISTINCT test_name FROM test_battery WHERE Active='Y' AND Test_name = :tnm";
}
$result = $DB->pselect($query, array('tnm' => $test_name));

// if nothing is returned than the instrument DNE
if (!is_array($result) || count($result)==0) {
    printError("Invalid Instrument ($test_name)!");
    return false;
}

// get the list of CommentIDs for valid timepoints
foreach($result as $test) {
    $test_name = $test['test_name'];
    printOut("Running scoring for $test_name");
    logMessage("");
    logMessage("Running scoring for $test_name");
    logMessage("------------------------------");

    $query = "
        SELECT s.CandID, 
            s.Visit_label, 
            s.ID as SessionID, 
            t.CommentID, 
            c.PSCID
        FROM candidate c 
            JOIN session s ON c.CandID=s.CandID, 
            JOIN flag f ON s.ID=f.SessionID, 
            JOIN $test_name t ON f.CommentID=t.CommentID
        WHERE s.Active = 'Y' 
            AND c.Active='Y' 
            AND f.Test_name = :tnm 
            AND f.Administration <> 'None' 
            AND f.Administration IS NOT NULL
            ";
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
    $result = $DB->pselect($query, $params);

    // return error if no candidates/timepoint matched the args
    if (!is_array($result) || empty($result)) {
        // given that the tool might be run with all, $candID and $sessionID might not be defined
        if (!empty($candID) && !empty($sessionID)) {
            printOut(
                "No records match the criteria returned for ".
                "candidate ($candID), timepoint ($sessionID), instrument ($test_name)!"
            );
        } else {
            printOut("No records for instrument $test_name!");
        }
        continue;
    }

    printOut("Start");

    // loop the list and derive scores for each record
    foreach ($result as $record) {
        // make an instance of the instrument's object
        $instrument = NDB_BVL_Instrument::factory($test_name, $record['CommentID'],null);

        // check if the instrument has a scoring method
        if (!method_exists($instrument, "score")) {
            printOut("Error, the instrument ($test_name) does not have a scoring feature");
            continue;
        }

        // print out candidate/session info
        printOut("Candidate: ".$record['CandID']."/".$record['Visit_label']."/".$record['SessionID'].":: (".$record['PSCID'].")");

        // call the score function
        $oldRecord = $DB->pselectRow(
            "SELECT * FROM $test_name WHERE CommentID=:cid",
            array('cid' => $record['CommentID'])
        );
        $success = $instrument->score();
        $newRecord = $DB->pselectRow(
            "SELECT * FROM $test_name WHERE CommentID=:cid",
            array('cid' => $record['CommentID'])
        );
        unset($oldRecord['Testdate']);
        unset($newRecord['Testdate']);
        $diff = array_diff_assoc($oldRecord, $newRecord);

        if($diff != array()) {

            logMessage("Updated $record[CommentID]:");
            foreach ($diff as $key => $val) {
                $old = $oldRecord[$key] == null ? 'null' : $oldRecord[$key];
                $new = $newRecord[$key] == null ? 'null' : $newRecord[$key];
                logMessage("\t$key: $old => $new");
            }
        }
        else {
            logMessage("No changes made to " . $record['CommentID']);
        }

        printOut("-- OK!");
        // unset
        unset($instrument);
    }
}
fclose($logfp);
printOut("End");

/*
 * Prints to log file
 */
function logMessage($message) {
    global $logfp;
    if (!$logfp) {
        //The log file could not be instanciated
        //use print instead
        printOut($message);
    }
    $now_array = getdate();
    $now_string = sprintf("%04d-%02d-%02d %02d:%02d:%02d", $now_array['year'], $now_array['mon'], $now_array['mday'], $now_array['hours'], $now_array['minutes'], $now_array['seconds']);
    fwrite($logfp, "[$now_string] $message\n");

}

/*
 * Prints to STDERR
 */
function printError($message) {
    fwrite(STDERR, "$message \n");
}

/*
 * Prints to STDOUT
 */
function printOut($message) {
    print_r("$message\n");
}

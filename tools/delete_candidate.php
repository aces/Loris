<?php

/**
 * This script deletes the specified candidate information.
 *
 * Delete all table rows for a given candidate
 * "Usage: php delete_candidate.php delete_candidate DCCID PSCID [confirm]";
 * echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007";
 * echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm";
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

/**
 * This script deletes the specified candidate information.
 *
 * Delete all table rows for a given candidate
 * "Usage: php delete_candidate.php delete_candidate DCCID PSCID [confirm]";
 * echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007";
 * echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm";
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

// Possible script actions
$actions = array('delete_candidate');

//define the command line parameters
if (count($argv) < 4 || $argv[1] == 'help' || !in_array($argv[1], $actions)) {
    showHelp();
}

// set default arguments
$action = $argv[1];
$DCCID = $argv[2];
$PSCID = $argv[3];
$confirm = false;

// get the rest of the arguments
switch ($action) {
    case 'delete_candidate':
        if (!empty($argv[4]) && $argv[4] == 'confirm') $confirm = true;
        break;
    default:
        showHelp();
        break;
}

$DB =& Database::singleton();

/*
 * Perform validations on arguments
 */
if ($DB->pselectOne(
    "SELECT COUNT(*) FROM candidate WHERE CandID = :cid AND PSCID = :pid ",
    array('cid'=>$DCCID, 'pid'=>$PSCID)
) ==0
) {
    echo "The Candid : $DCCID  AND PSCID : $PSCID Doesn't Exist in " .
    "the database\n";
    die();
}

/*
 * The switch to execute actions
 */
switch ($action) {
    case 'delete_candidate':
        deleteCandidate($DCCID, $PSCID, $confirm, $DB);
        break;
}

/*
 * Prints the usage and example help text and stop program
 */
function showHelp() {
    echo "*** Delete Candidate Info ***\n\n";

    echo "Usage: php delete_candidate.php delete_candidate DCCID PSCID [confirm]\n";
    echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007\n";
    echo "Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm\n\n";

    die();
}

function deleteCandidate($DCCID, $PSCID, $confirm, $DB) {

    //Find candidate...
    $candidate = new Candidate();
    $candidate->select($DCCID); //find the candidate with the given DCCID

    //find sessions
    $sessions = $candidate->getListOfTimePoints();
    if (is_null($sessions) || empty($sessions)) {
        echo "There are no corresponding session for Candid : $DCCID \n";
    }
    else {
        //find the test_names and commentIDs
        $query = "SELECT ID, Test_name, CommentID FROM flag WHERE SessionID in (" .
            implode(" , ", $sessions) . ")";
        $instruments = $DB->pselect($query, array());

        // Print sessions to delete
        $result = $DB->pselect('SELECT * FROM session WHERE CandID=:cid', array('cid' => $DCCID));
        print_r($result);
        echo "\n";

        // Print instruments to delete
        foreach ($instruments as $instrument) {
            echo "{$instrument['Test_name']}\n";
            $result = $DB->pselect('SELECT * FROM ' . $DB->escape($instrument['Test_name']) . ' WHERE CommentID=:cid', array('cid' => $instrument['CommentID']));
            print_r($result);
            echo "\n";
            $result = $DB->pselect('SELECT * FROM flag WHERE ID=:id', array('id' => $instrument['ID']));
            print_r($result);
            echo "\n";
            $result = $DB->pselect('SELECT * FROM conflicts_resolved WHERE CommentId1=:cid OR CommentID2=:cid', array('cid' => $instrument['CommentID']));
            print_r($result);
            echo "\n";
            $result = $DB->pselect('SELECT * FROM conflicts_unresolved WHERE CommentId1=:cid OR CommentID2=:cid', array('cid' => $instrument['CommentID']));
            print_r($result);
            echo "\n";
            $result = $DB->pselect('SELECT * FROM final_radiological_review WHERE CommentID=:cid', array('cid' => $instrument['CommentID']));
            print_r($result);
            echo "\n";
        }
    }

    // Print feedback related tables
    $Feedbackids = $DB->pselect(
        "SELECT fbt.FeedbackID from feedback_bvl_thread fbt WHERE CandID=:cid",
        array('cid' => $DCCID)
    );

    echo "Behavioural Feedback\n";
    foreach ($Feedbackids as $Feedbackid) {
        $result = $DB->pselect(
            'SELECT * FROM feedback_bvl_entry WHERE FeedbackID=:fid',
            array('fid' => $Feedbackid['FeedbackID'])
        );
        print_r($result);
    }
    $result = $DB->pselect('SELECT * FROM feedback_bvl_thread WHERE CandID=:cid', array('cid' => $DCCID));
    print_r($result);

    // Print participant_status
    echo "Participant Status\n";
    $result = $DB->pselect('SELECT * FROM participant_status WHERE CandID=:cid', array('cid' => $DCCID));
    print_r($result);

    // Print participant_status_history
    echo "Participant Status History\n";
    $result = $DB->pselect('SELECT * FROM participant_status_history WHERE CandID=:cid', array('cid' => $DCCID));
    print_r($result);

    // Print parameter_candidate
    echo "Parameter Candidate\n";
    $result = $DB->pselect('SELECT * FROM parameter_candidate WHERE CandID=:cid', array('cid' => $DCCID));
    print_r($result);

    // Print candidate
    echo "Candidate\n";
    $result = $DB->pselect('SELECT * FROM candidate WHERE CandID=:cid', array('cid' => $DCCID));
    print_r($result);

    // IF CONFIRMED, DELETE CANDIDATE
    if ($confirm) {
        echo "Dropping all DB entries for candidate DCCID: " . $DCCID . "And PSCID: " .
            $PSCID . "\n";

        //delete the sessions
        $DB->delete("session", array("CandID" => $DCCID));

        //delete each instrument table entry
        foreach ($instruments as $instrument) {

            //delete the entry from the instrument table
            $DB->delete(
                $instrument['Test_name'], array("CommentID" => $instrument['CommentID'])
            );

            //delete from flag
            $DB->delete("flag", array("ID" => $instrument['ID']));

            //delete from conflicts_resolved
            $DB->delete(
                "conflicts_resolved", array("CommentId1" => $instrument['CommentID'])
            );
            $DB->delete(
                "conflicts_resolved", array("CommentId2" => $instrument['CommentID'])
            );
            //delete from conflicts_unresolved
            $DB->delete(
                "conflicts_unresolved", array("CommentId1" => $instrument['CommentID'])
            );
            $DB->delete(
                "conflicts_unresolved", array("CommentId2" => $instrument['CommentID'])
            );

            //delete from final_radiological_review
            $DB->delete(
                "final_radiological_review", array("CommentID" => $instrument['CommentID'])
            );
        }

        //Delete from the feedback related tables
        foreach ($Feedbackids as $Feedbackid) {
            $DB->delete(
                "feedback_bvl_entry", array('FeedbackID' => $Feedbackid['FeedbackID'])
            );
        }
        $DB->delete("feedback_bvl_thread", array('CandID' => $DCCID));

        //delete from the participant_status table
        $DB->delete("participant_status", array("CandID" => $DCCID));

        //delete from the participant_status_history table
        $DB->delete("participant_status_history", array("CandID" => $DCCID));

        //delete from parameter_candidate
        $DB->delete("parameter_candidate", array("CandID" => $DCCID));

        //delete from candidate
        $DB->delete("candidate", array("CandID" => $DCCID));
    }
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}

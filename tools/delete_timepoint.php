<?php

/**
 * This script deletes the specified candidate timepoint.
 *
 * Delete all timepoint rows for a given candidate
 * echo "Usage: php delete_timepoint.php delete_timepoint DCCID PSCID SessionID [confirm]";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm";
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
 * This script deletes the specified candidate timepoint.
 *
 * Delete all timepoint rows for a given candidate
 * echo "Usage: php delete_timepoint.php delete_timepoint DCCID PSCID SessionID [confirm]";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm";
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

// Possible script actions
$actions = array('delete_timepoint');

//define the command line parameters
if (count($argv) < 4 || $argv[1] == 'help' || !in_array($argv[1], $actions)) {
    showHelp();
}

// set default arguments
$action = $argv[1];
$DCCID = $argv[2];
$PSCID = $argv[3];
$sessionID = $argv[4];
$confirm = false;

// get the rest of the arguments
switch ($action) {
    case 'delete_timepoint':
        if (empty($argv[4])) {
            echo "Missing SessionID parameter\n\n";
            showHelp();
        }
        if (!empty($argv[5]) && $argv[5] == 'confirm') $confirm = true;
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

if ($sessionID != null) {
    if ($DB->pselectOne('SELECT COUNT(*) FROM session WHERE ID=:sid and CandID=:cid',
            array('sid' => $sessionID, 'cid' => $DCCID)) == 0) {
        echo "Session ID $sessionID for candidate $DCCID does not exist in the database\n";
        die();
    }
}

/*
 * The switch to execute actions
 */
switch ($action) {
    case 'delete_timepoint':
        deleteTimepoint($sessionID, $confirm, $DB);
        break;
}

/*
 * Prints the usage and example help text and stop program
 */
function showHelp() {
    echo "*** Delete Timepoint ***\n\n";

    echo "Usage: php delete_timepoint.php delete_timepoint DCCID PSCID SessionID [confirm]\n";
    echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482\n";
    echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm\n\n";

    die();
}

function deleteTimepoint($sessionID, $confirm, $DB) {

    $instruments = $DB->pselect('SELECT Test_name, CommentID FROM flag WHERE SessionID=:sid', array('sid' => $sessionID));

    // Print each instrument instance
    foreach ($instruments as $instrument) {
        $result = $DB->pselect(
            'SELECT * FROM ' . $DB->escape($instrument['Test_name']) . ' WHERE CommentID=:cid',
            array('cid' => $instrument['CommentID'])
        );
        echo '$instrument["Test_name"]\n';
        print_r($result);

        // Print from conflicts
        echo "Conflicts Unresolved\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_unresolved WHERE CommentId1=:cid OR CommentId2=:cid',
            array('cid' => $instrument['CommentID'])
        );
        print_r($result);
        echo "Conflicts Resolved\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_resolved WHERE CommentId1=:cid OR CommentId2=:cid',
            array('cid' => $instrument['CommentID'])
        );
        print_r($result);
    }
    // Print from flag
    echo "Flag\n";
    $result = $DB->pselect('SELECT * FROM flag WHERE SessionID=:sid', array('sid' => $sessionID));
    print_r($result);

    // Print from session
    echo "Session\n";
    $result = $DB->pselect('SELECT * FROM session WHERE ID=:id', array('id' => $sessionID));
    print_r($result);

    // Print from feedback
    echo "Behavioural Feedback\n";
    $result = $DB->pselect(
        'SELECT * from feedback_bvl_thread WHERE SessionID =:sid',
        array('sid' => $sessionID)
    );
    print_r($result);
    $feedbackIDs = $DB->pselect(
        'SELECT FeedbackID from feedback_bvl_thread WHERE SessionID =:sid',
        array('sid' => $sessionID)
    );
    foreach ($feedbackIDs as $id) {
        $result = $DB->pselect(
            'SELECT * from feedback_bvl_entry WHERE FeedbackID=:fid',
            array('fid' => $id['FeedbackID'])
        );
        print_r($result);
    }

    // IF CONFIRMED, DELETE TIMEPOINT
    if ($confirm) {
        // Delete each instrument instance
        foreach ($instruments as $instrument) {
            echo "Deleting $instrument.\n";
            $DB->delete($instrument['Test_name'], array('CommentID' => $instrument['CommentID']));

            // Delete from conflicts
            $DB->delete('conflicts_unresolved', array('CommentId1' => $instrument['CommentID']));
            $DB->delete('conflicts_unresolved', array('CommentId2' => $instrument['CommentID']));
            $DB->delete('conflicts_resolved', array('CommentId1' => $instrument['CommentID']));
            $DB->delete('conflicts_resolved', array('CommentId2' => $instrument['CommentID']));
        }
        // Delete from flag
        echo "Deleting from flag.\n";
        $DB->delete('flag', array('SessionID' => $sessionID));

        // Delete from session
        echo "Deleting from session.\n";
        $DB->delete('session', array('ID' => $sessionID));

        // Delete from feedback
        echo "Deleting from feedback.\n";
        $DB->delete('feedback_bvl_thread', array('SessionID' => $sessionID));
        foreach ($feedbackIDs as $id) {
            $DB->delete('feedback_bvl_entry', array('FeedbackID' => $id));
        }
    }
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}
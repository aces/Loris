<?php

/**
 * This script deletes the specified candidate timepoint.
 *
 * Delete all timepoint rows for a given candidate
 * echo "Usage: php delete_timepoint.php delete_timepoint CandID PSCID SessionID [confirm] [tosql]";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 tosql";
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

/**
 * This script deletes the specified candidate timepoint.
 *
 * Delete all timepoint rows for a given candidate
 * echo "Usage: php delete_timepoint.php delete_timepoint CandID PSCID SessionID [confirm] [tosql]";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm";
 * echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 tosql";
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
$action    = $argv[1];
$CandID     = $argv[2];
$PSCID     = $argv[3];
$sessionID = $argv[4];
$confirm   = false;

// SQL output
$printToSQL = false;
$output     ="";

// get the rest of the arguments
switch ($action) {
case 'delete_timepoint':
    if (empty($argv[4]) || ($argv[4]) == 'confirm') {
        echo "Missing SessionID parameter\n\n";
        showHelp();
    }
    if (!empty($argv[5]) && $argv[5] == 'confirm') { $confirm = true;
    }
    if (!empty($argv[5]) && $argv[5] == 'tosql') { $printToSQL = true;
    }
    break;
default:
    showHelp();
    break;
}

$DB =& Database::singleton();

/*
 * Perform validations on arguments
 */

$candExists = $DB->pselectOne(
    "SELECT COUNT(*) FROM candidate WHERE CandID = :cid AND PSCID = :pid ",
    array(
     'cid' => $CandID,
     'pid' => $PSCID,
    )
);

if ($candExists == 0) {
    echo "The Candid : $CandID  AND PSCID : $PSCID Doesn't Exist in " .
        "the database\n";
    die();
}

if ($sessionID != null) {
    if ($DB->pselectOne(
        'SELECT COUNT(*) FROM session WHERE ID=:sid and CandID=:cid',
        array(
         'sid' => $sessionID,
         'cid' => $CandID,
        )
    ) == 0) {
        echo "Session ID $sessionID for candidate $CandID does not exist in the database\n";
        die();
    }
}

/*
 * The switch to execute actions
 */
switch ($action) {
case 'delete_timepoint':
    deleteTimepoint($CandID, $sessionID, $confirm, $printToSQL, $DB, $output);
    break;
}

/*
 * Prints the usage and example help text and stop program
 */
function showHelp()
{
    echo "*** Delete Timepoint ***\n\n";

    echo "Usage: php delete_timepoint.php delete_timepoint CandID PSCID SessionID [confirm] [tosql]\n";
    echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482\n";
    echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm\n";
    echo "Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 tosql\n\n";

    echo "When the 'tosql' function is used, the SQL file exported will be located \n".
        "under the following path: loris_root/project/tables_sql/DELETE_session_CandID_session_id.sql\n\n";

    die();
}

function deleteTimepoint($CandID, $sessionID, $confirm, $printToSQL, $DB, $output)
{

    $instruments = $DB->pselect('SELECT Test_name, CommentID FROM flag WHERE SessionID=:sid', array('sid' => $sessionID));

    // Print each instrument instance
    foreach ($instruments as $instrument) {
        $result = $DB->pselect(
            'SELECT * FROM ' . $DB->escape($instrument['Test_name']) . ' WHERE CommentID=:cid',
            array('cid' => $instrument['CommentID'])
        );
        echo "{$instrument['Test_name']}\n";
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

    // Print from media
    echo "Media\n";
    $result = $DB->pselect('SELECT * FROM media WHERE session_id=:sid', array('sid' => $sessionID));
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
            $name = implode(" -> ", $instrument);
            echo "\n-- Deleting Instrument $name.\n";
            $DB->delete($instrument['Test_name'], array('CommentID' => $instrument['CommentID']));

            // Delete from conflicts
            $DB->delete('conflicts_unresolved', array('CommentId1' => $instrument['CommentID']));
            $DB->delete('conflicts_unresolved', array('CommentId2' => $instrument['CommentID']));
            $DB->delete('conflicts_resolved', array('CommentId1' => $instrument['CommentID']));
            $DB->delete('conflicts_resolved', array('CommentId2' => $instrument['CommentID']));
        }
        // Delete from flag
        echo "\n-- Deleting from flag.\n";
        $DB->delete('flag', array('SessionID' => $sessionID));

        echo "\n-- Deleting from media.\n";
        $DB->delete('media', array('session_id' => $sessionID));

        // Delete from session
        echo "\n-- Deleting from session.\n";
        $DB->delete('session', array('ID' => $sessionID));
        // Delete from feedback
        echo "\n-- Deleting from feedback.\n";
        $DB->delete('feedback_bvl_thread', array('SessionID' => $sessionID));
        foreach ($feedbackIDs as $id) {
            $DB->delete('feedback_bvl_entry', array('FeedbackID' => $id));
        }
    } elseif ($printToSQL) {
        // Delete each instrument instance
        foreach ($instruments as $instrument) {
            $name    = implode(" -> ", $instrument);
            $output .= "\n-- Deleting Instrument $name.\n";
            _printResultsSQL($instrument['Test_name'], array('CommentID' => $instrument['CommentID']), $output, $DB);

            // Delete from conflicts
            _printResultsSQL('conflicts_unresolved', array('CommentId1' => $instrument['CommentID']), $output, $DB);
            _printResultsSQL('conflicts_unresolved', array('CommentId2' => $instrument['CommentID']), $output, $DB);
            _printResultsSQL('conflicts_resolved', array('CommentId1' => $instrument['CommentID']), $output, $DB);
            _printResultsSQL('conflicts_resolved', array('CommentId2' => $instrument['CommentID']), $output, $DB);
        }
        // Delete from flag
        $output .= "\n-- Deleting from flag.\n";
        _printResultsSQL('flag', array('SessionID' => $sessionID), $output, $DB);

        $output .= "\n-- Deleting from media.\n";
        _printResultsSQL('media', array('session_id' => $sessionID), $output, $DB);

        // Delete from session
        $output .= "\n-- Deleting from session.\n";
        _printResultsSQL('session', array('ID' => $sessionID), $output, $DB);
        // Delete from feedback
        $output .= "\n-- Deleting from feedback.\n";
        _printResultsSQL('feedback_bvl_thread', array('SessionID' => $sessionID), $output, $DB);
        foreach ($feedbackIDs as $id) {
            _printResultsSQL('feedback_bvl_entry', array('FeedbackID' => $id), $output, $DB);
        }
        
        _exportSQL($output, $CandID, $sessionID);
    }
}

function _printResultsSQL($table, $where, &$output, $DB)
{
    $query  = "DELETE FROM $table WHERE ";
    $where  = $DB->_implodeWithKeys(' AND ', $where);
    $query .= $where;
    $query .= ";\n";

    $output .=$query;
}

function _exportSQL ($output, $CandID, $sessionID) {
    //export file
    $filename = __DIR__ . "/../project/tables_sql/DELETE_session_".$CandID."_".$sessionID.".sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

if ($confirm === false && $printToSQL === false) {
    echo "\n\nRun this tool again with the argument 'confirm' or 'tosql' to ".
        "perform the changes or export them as an SQL patch\n\n";
}

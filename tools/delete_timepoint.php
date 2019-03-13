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
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

/* @var int The minimum number of arguments required to run this script. */
const MIN_NUMBER_OF_ARGS = 4;
// Possible script actions
$actions = array('delete_timepoint');

//define the command line parameters
if (count($argv) < MIN_NUMBER_OF_ARGS 
    || $argv[1] == 'help' 
    || !in_array($argv[1], $actions, true)
) {
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
    "SELECT COUNT(*) 
      FROM candidate 
      WHERE CandID = :cid AND PSCID = :pid AND Active ='Y'",
    array(
        'cid' => $CandID,
        'pid' => $PSCID,
    )
);
if ($candExists == 0) {
    echo "\nThe candidate with CandID : $CandID  and PSCID : $PSCID either does ".
        "not exist in the database or is set to Active='N' state.\n\n";
    die();
}

if ($sessionID != null) {
    $sessionExists = $DB->pselectOne(
        "SELECT COUNT(*) FROM session WHERE ID=:sid AND CandID=:cid AND Active ='Y'",
        array(
            'sid' => $sessionID,
            'cid' => $CandID,
        )
    );
    if ($sessionExists == 0) {
        echo "Session ID $sessionID for candidate $CandID either does not exist ".
            "in the database or is set to Active='N' state.\n\n";
        die();
    }
    // Check for existence of imaging data
    $filesExist = $DB->pselectOne(
        "SELECT COUNT(*) FROM files WHERE SessionID=:sid",
        array(
            'sid' => $sessionID
        )
    );
    $numFiles = (int)$filesExist;
    if ($numFiles > 0) {
        echo "Session ID $sessionID for candidate $CandID has imaging data and files ".
            "in the database, and should not be deleted. Look at `files` and `tarchive` ".
            "tables before deleting timepoint.\n\n";
        die();
    }
}


/*
 * The switch to execute actions
 */
switch ($action) {
case 'delete_timepoint':
    return deleteTimepoint($CandID, $sessionID, $confirm, $printToSQL, $DB, $output);
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
/*
 * All tables with entries to be deleted here are only those with FOREIGN KEY relations to `session`.
 * All other tables with FOREIGN KEY relations to these tables (second-level relations) should
 * have actions on delete specified in the database schema
 */
function deleteTimepoint($CandID, $sessionID, $confirm, $printToSQL, $DB, $output)
{
    echo "\n#########################################################################\n";
    echo "Deleting timepoint data for candidate $CandID and session $sessionID.";
    echo "\n#########################################################################\n";

    $instruments = $DB->pselect('SELECT Test_name, CommentID FROM flag WHERE SessionID=:sid', array('sid' => $sessionID));

    // Print each instrument instance
    foreach ($instruments as $instrument) {
        try {
            $result = $DB->pselect(
                'SELECT CommentID FROM ' . $DB->escape($instrument['Test_name']) . ' WHERE CommentID=:cid',
                array('cid' => $instrument['CommentID'])
            );
            echo "\n{$instrument['Test_name']}\n";
            echo "-----------------------------------------\n";
            print_r($result);
        } catch (DatabaseException $e) {
            echo "\nERROR:\n";
            echo $e->getMessage();
        }
        
        // Print from conflicts
        echo "\nConflicts Unresolved\n";
        echo "----------------------\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_unresolved WHERE CommentId1=:cid OR CommentId2=:cid',
            array('cid' => $instrument['CommentID'])
        );
        print_r($result);
        echo "\nConflicts Resolved\n";
        echo "--------------------\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_resolved WHERE CommentId1=:cid OR CommentId2=:cid',
            array('cid' => $instrument['CommentID'])
        );
        print_r($result);
    }
    // Print from flag
    echo "\nFlag\n";
    echo "------\n";
    $result = $DB->pselect('SELECT * FROM flag WHERE SessionID=:sid', array('sid' => $sessionID));
    print_r($result);

    // Print from media
    echo "\nMedia\n";
    echo "-------\n";
    $result = $DB->pselect('SELECT * FROM media WHERE session_id=:sid', array('sid' => $sessionID));
    print_r($result);

   // Print from issues
    echo "\nIssues\n";
    echo "-------\n";
    $result = $DB->pselect('SELECT * FROM issues WHERE sessionID=:sid', array('sid' => $sessionID));
    print_r($result);

   // Print from mri_acquisition_dates
    echo "\nMRI Acquisition Dates\n";
    echo "-------\n";
    $result = $DB->pselect('SELECT * FROM mri_acquisition_dates WHERE SessionID=:sid', array('sid' => $sessionID));
    print_r($result);

   // Print from mri_upload
    echo "\nMRI Upload\n";
    echo "-------\n";
    $result = $DB->pselect('SELECT * FROM mri_upload WHERE SessionID=:sid', array('sid' => $sessionID));
    print_r($result);

    // Print from session
    echo "\nSession\n";
    echo "---------\n";
    $result = $DB->pselect('SELECT * FROM session WHERE ID=:id', array('id' => $sessionID));
    print_r($result);

    // Print from feedback
    echo "\nBehavioural Feedback\n";
    echo "----------------------\n";
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
            try {
                $name = implode(" -> ", $instrument);
                echo "\n-- Deleting Instrument $name.\n";
                $DB->delete($instrument['Test_name'], array('CommentID' => $instrument['CommentID']));
    
                // Delete from conflicts
                $DB->delete('conflicts_unresolved', array('CommentId1' => $instrument['CommentID']));
                $DB->delete('conflicts_unresolved', array('CommentId2' => $instrument['CommentID']));
                $DB->delete('conflicts_resolved', array('CommentId1' => $instrument['CommentID']));
                $DB->delete('conflicts_resolved', array('CommentId2' => $instrument['CommentID']));
            } catch (DatabaseException $e) {
                echo "\nERROR:\n";
                echo $e->getMessage();
            }
            
        }
        // Delete from flag
        echo "\n-- Deleting from flag.\n";
        $DB->delete('flag', array('SessionID' => $sessionID));

        //Delete from media
        echo "\n-- Deleting from media.\n";
        $DB->delete('media', array('session_id' => $sessionID));

        //Delete from issues
        echo "\n-- Deleting from issues.\n";
        $DB->delete('issues', array('sessionID' => $sessionID));

        // Delete from mri_acquisition_dates
        echo "\n-- Deleting from mri acquisition dates.\n";
        $DB->delete('mri_acquisition_dates', array('SessionID' => $sessionID));

        // Delete from mri_upload
        echo "\n-- Deleting from mri upload.\n";
        $DB->delete('mri_upload', array('SessionID' => $sessionID));

        // Delete from feedback
        echo "\n-- Deleting from feedback.\n";
        foreach ($feedbackIDs as $id) {
            $DB->delete('feedback_bvl_entry', array('FeedbackID' => $id['FeedbackID']));
        }
        $DB->delete('feedback_bvl_thread', array('SessionID' => $sessionID));

        // Delete from session
        echo "\n-- Deleting from session.\n";
        $DB->delete('session', array('ID' => $sessionID));
    } else {
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

        // Delete from media
        $output .= "\n-- Deleting from media.\n";
        _printResultsSQL('media', array('session_id' => $sessionID), $output, $DB);

        // Delete from issues
        $output .= "\n-- Deleting from issues.\n";
        _printResultsSQL('issues', array('sessionID' => $sessionID), $output, $DB);

        // Delete from mri_acquisition_dates
        $output .= "\n-- Deleting from MRI acquisition dates.\n";
        _printResultsSQL('mri_acquisition_dates', array('SessionID' => $sessionID), $output, $DB);

        // Delete from mri_upload
        $output .= "\n-- Deleting from MRI upload.\n";
        _printResultsSQL('mri_upload', array('SessionID' => $sessionID), $output, $DB);

        // Delete from feedback
        $output .= "\n-- Deleting from feedback.\n";
        foreach ($feedbackIDs as $id) {
            _printResultsSQL('feedback_bvl_entry', array('FeedbackID' => $id['FeedbackID']), $output, $DB);
        }
        _printResultsSQL('feedback_bvl_thread', array('SessionID' => $sessionID), $output, $DB);

        // Delete from session
        $output .= "\n-- Deleting from session.\n";
        _printResultsSQL('session', array('ID' => $sessionID), $output, $DB);
        
        if ($printToSQL) {
            _exportSQL($output, $CandID, $sessionID);
        } else {
            echo $output;
            return $output;
        }
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

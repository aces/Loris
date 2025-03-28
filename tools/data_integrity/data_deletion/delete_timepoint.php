<?php declare(strict_types=1);

/**
 * This script deletes the specified candidate timepoint.
 * Delete all timepoint rows for a given candidate.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../../../vendor/autoload.php";
require_once __DIR__ . "/../../generic_includes.php";

/*
 * The minimum number of arguments required to run this script.
 *
 * @var int
 */
const MIN_NUMBER_OF_ARGS = 4;
// Possible script actions
$actions = ['delete_timepoint'];

//define the command line parameters
if (count($argv) < MIN_NUMBER_OF_ARGS
    || $argv[1] == 'help'
    || !in_array($argv[1], $actions, true)
) {
    showHelp();
}

// set default arguments
$action    = $argv[1];
$CandID    = $argv[2];
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
    if (!empty($argv[5]) && $argv[5] == 'confirm') {
        $confirm = true;
    }
    if (!empty($argv[5]) && $argv[5] == 'tosql') {
        $printToSQL = true;
    }
    break;
default:
    showHelp();
    break;
}

$DB = \NDB_Factory::singleton()->database();

/*
 * Perform validations on arguments
 */

$candExists = $DB->pselectOne(
    "SELECT COUNT(*)
      FROM candidate
      WHERE CandID = :cid AND PSCID = :pid AND Active ='Y'",
    ['cid' => $CandID, 'pid' => $PSCID]
);
if ($candExists == 0) {
    echo "\nThe candidate with CandID : $CandID  and PSCID : $PSCID either does ".
        "not exist in the database or is set to Active='N' state.\n\n";
    exit(1);
}

if ($sessionID != null) {
    $sessionExists = $DB->pselectOne(
        "SELECT COUNT(*) FROM session s
        JOIN candidate c ON c.ID = s.CandidateID
        WHERE s.ID=:sid AND c.CandID=:cid AND s.Active ='Y'",
        ['sid' => $sessionID, 'cid' => $CandID]
    );
    if ($sessionExists == 0) {
        echo "Session ID $sessionID for candidate $CandID either does not exist "
            . "in the database or is set to Active='N' state.\n\n";
        exit(1);
    }
    // Check for existence of imaging data
    $filesExist = $DB->pselectOne(
        "SELECT COUNT(*) FROM files WHERE SessionID=:sid",
        ['sid' => $sessionID]
    );
    $physiologicalFilesExist = $DB->pselectOne(
        "SELECT COUNT(*) FROM physiological_file WHERE SessionID=:sid",
        ['sid' => $sessionID]
    );
    $filesExist += $physiologicalFilesExist;
    $numFiles    = (int)$filesExist;
    if ($numFiles > 0) {
        echo <<<MSG
Session ID $sessionID for candidate $CandID has imaging data and files
in the database, and should not be deleted. Look at `files`, `tarchive`,
and `physiological_file` tables before deleting timepoint.\n
MSG;
        exit(1);
    }
}


/*
 * The switch to execute actions
 */
switch ($action) {
case 'delete_timepoint':
    return deleteTimepoint(
        $CandID,
        $sessionID,
        $confirm,
        $printToSQL,
        $DB,
        $output,
        $lorisInstance
    );
}

/**
 * Prints the usage and example help text and stop program
 *
 * @return void
 */
function showHelp(): void
{
    echo <<<USAGE
*** Delete Timepoint ***

php delete_timepoint.php delete_timepoint CandID PSCID SessionID [confirm] [tosql]
Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482
Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 confirm
Example: php delete_timepoint.php delete_timepoint 965327 dcc0007 482 tosql

When the 'tosql' function is used, the SQL file exported will be located
under the following path: 
    loris_root/project/tables_sql/DELETE_session_CandID_session_id.sql
USAGE;
}

/**
 * All tables with entries to be deleted here are only those with FOREIGN KEY
 * relations to `candidate`.
 * All other tables with FOREIGN KEY relations to these tables
 * (second-level relations) should have actions on delete specified in the
 * database schema
 *
 * @param string               $CandID        Identifying the candidate
 * @param string               $sessionID     Identifying the TimePoint
 * @param string               $confirm       Whether to execute the script
 * @param string               $printToSQL    Whether to print the results
 * @param Database             $DB            The database to connect to
 * @param string               $output        The string containing the statements to
 *                                            execute
 * @param \LORIS\LorisInstance $lorisInstance The LORIS instance that data is
 *                                            being checked from.
 *
 * @return void
 */
function deleteTimepoint(
    $CandID,
    $sessionID,
    $confirm,
    $printToSQL,
    $DB,
    $output,
    $lorisInstance
) {
    echo "\n###############################################################\n";
    echo "Deleting timepoint data for candidate $CandID and session $sessionID.";
    echo "\n###############################################################\n";

    $instruments = $DB->pselect(
        'SELECT Test_name, CommentID
         FROM flag
         JOIN test_names ON (test_names.ID = flag.TestID)
         WHERE SessionID=:sid',
        ['sid' => $sessionID]
    );

    // Print each instrument instance
    foreach ($instruments as $instrument) {
        try {
            $instr = \NDB_BVL_Instrument::factory(
                $lorisInstance,
                $instrument['Test_name'],
                $instrument['CommentID']
            );
            echo "\n{$instrument['Test_name']}\n";
            echo "-----------------------------------------\n";
            print_r($instrument['CommentID'] . "\n");
        } catch (Exception $e) {
            echo "\nERROR:\n";
            echo $e->getMessage();
        }

        // Print from conflicts
        echo "\nConflicts Unresolved\n";
        echo "----------------------\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_unresolved 
            WHERE CommentId1=:cid OR CommentId2=:cid',
            ['cid' => $instrument['CommentID']]
        );
        print_r(iterator_to_array($result));
        echo "\nConflicts Resolved\n";
        echo "--------------------\n";
        $result = $DB->pselect(
            'SELECT * FROM conflicts_resolved 
            WHERE CommentId1=:cid OR CommentId2=:cid',
            ['cid' => $instrument['CommentID']]
        );
        print_r(iterator_to_array($result));
    }
    // Print from flag
    echo "\nFlag\n";
    echo "------\n";
    $result = $DB->pselect(
        'SELECT * FROM flag WHERE SessionID=:sid',
        ['sid' => $sessionID]
    );
    print_r(iterator_to_array($result));

    // Print from media
    echo "\nMedia\n";
    echo "-------\n";
    $result = $DB->pselect(
        'SELECT * FROM media WHERE session_id=:sid',
        ['sid' => $sessionID]
    );
    print_r(iterator_to_array($result));

    // Print from issues
    echo "\nIssues\n";
    echo "-------\n";
    $result = $DB->pselect(
        'SELECT * FROM issues WHERE sessionID=:sid',
        ['sid' => $sessionID]
    );
    print_r(iterator_to_array($result));

    // Print from mri_upload
    echo "\nMRI Upload\n";
    echo "-------\n";
    $result = $DB->pselect(
        'SELECT * FROM mri_upload WHERE SessionID=:sid',
        ['sid' => $sessionID]
    );
    print_r(iterator_to_array($result));

    // Print from session
    echo "\nSession\n";
    echo "---------\n";
    $result = $DB->pselect(
        'SELECT * FROM session WHERE ID=:id',
        ['id' => $sessionID]
    );
    print_r(iterator_to_array($result));

    // Print from feedback
    echo "\nBehavioural Feedback\n";
    echo "----------------------\n";
    $feedback_threads = $DB->pselect(
        'SELECT * from feedback_bvl_thread WHERE SessionID =:sid',
        ['sid' => $sessionID]
    );
    $feedback_threads = iterator_to_array($feedback_threads);
    print_r($feedback_threads);
    foreach ($feedback_threads as $feedback) {
        $result = $DB->pselect(
            'SELECT * from feedback_bvl_entry WHERE FeedbackID=:fid',
            ['fid' => $feedback['FeedbackID']]
        );
        print_r(iterator_to_array($result));
    }

    // IF CONFIRMED, DELETE TIMEPOINT
    if ($confirm) {
        // Delete each instrument instance
        foreach ($instruments as $instrument) {
            try {
                $instr = \NDB_BVL_Instrument::factory(
                    $lorisInstance,
                    $instrument['Test_name'],
                    $instrument['CommentID']
                );
            } catch (Exception $e) {
                echo "\nERROR:\n";
                echo $e->getMessage();
            }
            try {
                $name = implode(" -> ", $instrument);
                echo "\n-- Deleting Instrument $name.\n";
                if (!$instr->usesJSONData()) {
                    $DB->delete(
                        $instr->table,
                        ['CommentID' => $instrument['CommentID']]
                    );
                }
                $DB->delete(
                    $instrument['Test_name'],
                    ['CommentID' => $instrument['CommentID']]
                );

                // Delete from conflicts
                $DB->delete(
                    'conflicts_unresolved',
                    ['CommentId1' => $instrument['CommentID']]
                );
                $DB->delete(
                    'conflicts_unresolved',
                    ['CommentId2' => $instrument['CommentID']]
                );
                $DB->delete(
                    'conflicts_resolved',
                    ['CommentId1' => $instrument['CommentID']]
                );
                $DB->delete(
                    'conflicts_resolved',
                    ['CommentId2' => $instrument['CommentID']]
                );
            } catch (DatabaseException $e) {
                echo "\nERROR:\n";
                echo $e->getMessage();
            }
        }
        // Delete from flag
        echo "\n-- Deleting from flag.\n";
        $DB->delete('flag', ['SessionID' => $sessionID]);

        //Delete from media
        echo "\n-- Deleting from media.\n";
        $DB->delete('media', ['session_id' => $sessionID]);

        //Delete from issues
        echo "\n-- Deleting from issues.\n";
        $DB->delete('issues', ['sessionID' => $sessionID]);

        // Delete from mri_upload
        echo "\n-- Deleting from mri upload.\n";
        $DB->delete('mri_upload', ['SessionID' => $sessionID]);

        // Delete from feedback
        echo "\n-- Deleting from feedback.\n";
        foreach ($feedback_threads as $feedback) {
            $DB->delete(
                'feedback_bvl_entry',
                ['FeedbackID' => $feedback['FeedbackID']]
            );
        }
        $DB->delete('feedback_bvl_thread', ['SessionID' => $sessionID]);

        // Delete from session
        echo "\n-- Deleting from session.\n";
        $DB->delete('session', ['ID' => $sessionID]);
    } else {
        // Delete each instrument instance
        foreach ($instruments as $instrument) {
            try {
                $instr = \NDB_BVL_Instrument::factory(
                    $lorisInstance,
                    $instrument['Test_name'],
                    $instrument['CommentID']
                );
            } catch (Exception $e) {
                echo "\nERROR:\n";
                echo $e->getMessage();
            }

            $name    = implode(" -> ", $instrument);
            $output .= "\n-- Deleting Instrument $name.\n";
            if (!$instr->usesJSONData()) {
                _printResultsSQL(
                    $instr->table,
                    ['CommentID' => $instrument['CommentID']],
                    $output,
                    $DB
                );
            }

            // Delete from conflicts
            _printResultsSQL(
                'conflicts_unresolved',
                ['CommentId1' => $instrument['CommentID']],
                $output,
                $DB
            );
            _printResultsSQL(
                'conflicts_unresolved',
                ['CommentId2' => $instrument['CommentID']],
                $output,
                $DB
            );
            _printResultsSQL(
                'conflicts_resolved',
                ['CommentId1' => $instrument['CommentID']],
                $output,
                $DB
            );
            _printResultsSQL(
                'conflicts_resolved',
                ['CommentId2' => $instrument['CommentID']],
                $output,
                $DB
            );
        }
        // Delete from flag
        $output .= "\n-- Deleting from flag.\n";
        _printResultsSQL('flag', ['SessionID' => $sessionID], $output, $DB);

        // Delete from media
        $output .= "\n-- Deleting from media.\n";
        _printResultsSQL('media', ['session_id' => $sessionID], $output, $DB);

        // Delete from issues
        $output .= "\n-- Deleting from issues.\n";
        _printResultsSQL('issues', ['sessionID' => $sessionID], $output, $DB);

        // Delete from mri_upload
        $output .= "\n-- Deleting from MRI upload.\n";
        _printResultsSQL(
            'mri_upload',
            ['SessionID' => $sessionID],
            $output,
            $DB
        );

        // Delete from feedback
        $output .= "\n-- Deleting from feedback.\n";
        foreach ($feedback_threads as $feedback) {
            _printResultsSQL(
                'feedback_bvl_entry',
                ['FeedbackID' => $feedback['FeedbackID']],
                $output,
                $DB
            );
        }
        _printResultsSQL(
            'feedback_bvl_thread',
            ['SessionID' => $sessionID],
            $output,
            $DB
        );

        // Delete from session
        $output .= "\n-- Deleting from session.\n";
        _printResultsSQL('session', ['ID' => $sessionID], $output, $DB);

        if ($printToSQL) {
            _exportSQL($output, $CandID, $sessionID);
        } else {
            echo $output;
            return $output;
        }
    }
}

/**
 * Format delete statements.
 *
 * @param string    $table  The name of a LORIS table.
 * @param string    $where  The where clause of the SQl statement
 * @param string    $output A reference to the string to append to.
 * @param \Database $DB     The database to connect to.
 *
 * @return void
 */
function _printResultsSQL($table, $where, &$output, $DB)
{
    $query  = "DELETE FROM $table WHERE ";
    $where  = $DB->_implodeWithKeys(' AND ', $where);
    $query .= $where;
    $query .= ";\n";

    $output .=$query;
}

/**
 * Write SQL commands to file.
 *
 * @param string $output    SQL statements to write to file.
 * @param string $CandID    The candidate for this TimePoint
 * @param string $sessionID The TimePoint to be deleted
 *
 * @return void
 */
function _exportSQL($output, $CandID, $sessionID): void
{
    //export file
    $filename = __DIR__ . "/../../../project/tables_sql/DELETE_session_"
        .$CandID."_".$sessionID.".sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

if ($confirm === false && $printToSQL === false) {
    echo "\n\nRun this tool again with the argument 'confirm' or 'tosql' to ".
        "perform the changes or export them as an SQL patch\n\n";
}

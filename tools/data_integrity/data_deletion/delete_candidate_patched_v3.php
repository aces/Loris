#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * This script deletes the data associated with a candidate and/or a session.
 * 
 * Command line arguments:
 * --target=<candidate|timepoint> : Specify whether to delete a candidate or a timepoint.
 * --candid=<candid> : The candidate ID to delete.
 * --pscid=<pscid> : The PSCID of the candidate.
 * --visitlabel=<visitlabel> : The visit label to delete (required for timepoint).
 * --mode=<direct|tosql|backuponly> : The mode of operation, either 'direct' to execute the deletion, 'tosql' to generate SQL statements or 'backuponly' to generate the backups (commonly used with tosql when run on different VMs)
 * --backupdir=/path : The directory to store backup files (optional). The script will create a subdirectory for the candidate/timepoint.
 *
 * Delete all table rows for a given candidate and/or session
 * Usage: 
 *   php delete_candidate_data.php --target=<candidate|timepoint> --CandID=<dccid> --PSCID=<pscid> [--mode=<direct|tosql|backuponly>] [--backupdir=/path] [--verbose]
 *   Example: php delete_candidate_data.php --target=candidate --CandID=965327 --PSCID=dcc0007 --mode=direct --backupdir=/path/to/backup/dir --verbose
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/../../../vendor/autoload.php";
require_once __DIR__ . "/../../generic_includes.php";
use \LORIS\StudyEntities\Candidate\CandID;

const MIN_NUMBER_OF_ARGS = 4;
const MAX_NUMBER_OF_ARGS = 6;

// Basic checks for argument numbers
if (count($argv) < MIN_NUMBER_OF_ARGS || count($argv) > MAX_NUMBER_OF_ARGS) {
    showHelp();
}

$targetOptions = ['candidate','timepoint'];
$target     = null;
$candID     = null;
$PSCID      = null;
$mode       = null;
$printToSQL = false;
$backupDir  = null;
$confirm    = false;
$output     = "";
$verbose    = false; 

// TODO add --noimaging
// --backuponly for use with toSQL

foreach ($argv as $arg) {
    if (strpos($arg, '--backupdir=') === 0) {
        $backupDir = substr($arg, strlen('--backupdir='));
    } elseif (strpos($arg, '--candid=') === 0) {
        $candID = substr($arg, strlen('--candid='));
    } elseif (strpos($arg, '--pscid=') === 0) {
        $PSCID = substr($arg, strlen('--pscid='));
    } elseif (strpos($arg, '--visitlabel=') === 0) {
        $visit = substr($arg, strlen('--visitlabel='));
    } elseif (strpos($arg, '--mode=') === 0) {
        $mode = substr($arg, strlen('--mode='));
    } elseif (strpos($arg, '--target=') === 0) {
        $target = substr($arg, strlen('--target='));
    } elseif (strpos($arg, '--verbose') === 0) {
        $verbose = true;
    } else {
        // If an argument is not in the list above show help
        showHelp();
    }
}

// VALIDATE INPUT - START
// VALIDATE Candidate
if (!isset($candID)) {
    fwrite(STDERR, "[ERROR] Missing --candid argument. It should be a valid CandID.\n");
    die();
}
if (!isset($PSCID)) {
    fwrite(STDERR, "[ERROR] Missing --pscid argument. It should be a valid pscid.\n");
    die();
}
$candInfo = $DB->pselectOne(
    "SELECT *
      FROM candidate
      WHERE CandID = :cid AND PSCID = :pid AND Active ='Y'",
    [
        'cid' => $candID,
        'pid' => $PSCID,
    ]
);
if (empty($candInfo)) {
    fwrite(STDERR, "[ERROR] The candidate with CandID : $candID  and PSCID : $PSCID either does ".
        "not exist in the database or is set to Active='N' state.\n");
    die();
}

if ($candInfo['Entity_type'] === "Scanner") {
    fwrite(STDERR, "[ERROR] The candidate with CandID : $candID  and PSCID : $PSCID is a scanner ".
        "and should not be deleted using this script.\n");
    die();
}
// VALIDATE Session
if ($target === "timepoint") {
    if (!isset($visit)) {
        fwrite(STDERR, "[ERROR] The --visitlabel argument is required when deleting a timepoint.\n");
        die();
    }

    $sessionID = $DB->pselectOne(
        "SELECT ID FROM session WHERE Visit_label = :vl AND CandidateID = :cid",
        ['vl' => $visit, 'cid' => $candID]
    );

    if (empty($sessionID)) {
        fwrite(STDERR, "[ERROR] The visit label '$visit' does not exist for candidate with CandID: $candID.\n");
        die();
    }
}
// VALIDATE Mode
if (isset($mode) && !in_array($mode, ['direct', 'tosql', 'backuponly'], true)) {
    fwrite(STDERR, "[ERROR] Invalid mode '$mode'. Valid modes are 'direct', 'tosql' or 'backuponly'.\n");
    die();
}

// VALIDATE Backup Directory
if (isset($backupDir)) {
    $backupDir= rtrim($backupDir, "/");

    if (!is_dir($backupDir) || !is_writable($backupDir)) {
        fwrite(STDERR, "[ERROR] Backup directory does not exist or is not writable: {$backupDir}\n"); 
        die; 
    }
}
// TODO combination validation
// -- backuponly requires backupdir

// VALIDATE Target
if(!isset($target) || !in_array($target, $targetOptions, true)) {
    fwrite(STDERR, "[ERROR] Invalid target '$target'. Valid targets are: " . implode(", ", $targetOptions) . ".\n");
    die();
}
// VALIDATE INPUT - END

// SETUP - START
$directMode = $mode === "direct";
$SQLMode     = $mode === "tosql";
$BackupMode  = $mode === "backuponly";

$backupEnabled = !empty($backupDir);
$backupCandidateDir = null;
$backupSQLPath = null;
if ($backupEnabled) {
    $prefix = $PSCID . "_" . $candID;
    if ($target === 'timepoint') {
        $prefix .= "_".$visit;
    }
    $backupCandidateDir = rtrim($baseDir, "/") . "/" . $prefix . "_" . date('Ymd_His');
    if (!is_dir($backupCandidateDir) && !mkdir($backupCandidateDir, 0770, true)) { 
        fwrite(STDERR, "[ERROR] Cannot create backup dir: {$run}\n"); 
        die();
    }
    $backupSQLPath = $backupCandidateDir . "/" . $prefix . ".sql";
    file_put_contents($backupSQLPath, "-- Candidate backup " . $prefix . " generated " . date('c') . "\n");
}
// Get CandidateID from CandID
$candidate = new Candidate();

// find the candidate with the given CandID
try {
    $candidate->select(new CandID($candID));
} catch (LorisException $e) {
    fwrite(STDERR, "No candidate found for combination for $candID $PSCID\n");
    exit(1);
}

// SETUP - END


// RUN
switch ($target) {
    case 'candidate':
        deleteCandidate($candidate, $confirm, $printToSQL, $DB, $output);
        break;
    case 'timepoint':
        deleteTimepoint($candidate, $sessionID, $confirm, $printToSQL, $DB, $output);
        break;
    case 'timepoint':
        deleteInstrument($candidate, $sessionID, $instrumentName, $confirm, $printToSQL, $DB, $output);
        break;    
    case 'help':
        showHelp();
        break;
}

// Create ZIP of the run directory (includes SQL and any other files added)
if (!empty($backupRunDir)) {
    $zipName = $backupDir . "/" . basename($backupRunDir) . ".zip";
    $ok = zip_directory($backupRunDir, $zipName);
    if ($ok) { echo "Backup ZIP created: " . $zipName . PHP_EOL; }
    else { fwrite(STDERR, "[WARN] Failed to create ZIP archive at {$zipName}\n"); }
}

if ($confirm === false && $printToSQL === false) {
    echo "\n\nRun this tool again with the argument 'confirm' or 'tosql' to ".
        "perform the changes or export them as an SQL patch\n\n";
}

/**
 * Prints the usage and example help text and stop program
 *
 * @return void
 */
function showHelp()
{
    echo <<<USAGE
*** Delete Candidate Data ***

Usage:
  php delete_candidate_data.php --action=<candidate|timepoint> --CandID=<dccid> --PSCID=<pscid> [--mode=<confirm|tosql>] [--backupdir=/path]
  Example: php delete_candidate_data.php --target=candidate --CandID=965327 --PSCID=dcc0007 --mode=confirm --backupdir=/path/to/backup/dir

When the 'tosql' function is used, the SQL file exported will be located
under the following path:
    loris_root/project/tables_sql/DELETE_candidate_CandID.sql
USAGE;
    die();
}
/**
 * All tables with entries to be deleted here are only those with FOREIGN KEY
 * relations to `candidate`.
 * All other tables with FOREIGN KEY relations to these tables
 * (second-level relations) should have actions on delete specified in the
 * database schema
 *
 * @param CandID   $candID     Identifying the candidate
 * @param string   $PSCID      Identifying the candidate
 * @param string   $confirm    Whether to execute the script
 * @param string   $printToSQL Whether to print the results
 * @param Database $DB         The database to connect to
 * @param string   $output     The string containing the statements to execute
 *
 * @return void
 */
function deleteCandidate($candidate, $confirm, $printToSQL, $DB, &$output, $verbose)
{
    $candID = $candidate->getCandID();
    $PSCID  = $candidate->getPSCID();
    $candidateID = $candidate->getID();

    fwrite(STDOUT, "Building deletion instructions for $PSCID ($candID)\n");

    //find sessions
    $sessionIDs = $candidate->getListOfTimePoints();
    if (empty($sessions)) {
        fwrite(STDOUT, "\tThere are no corresponding sessions for $PSCID\n");
    } else {
        foreach ($sessionIDs as $sessionID) {
            deleteTimepoint($candID, $PSCID, $sessionID, $confirm, $printToSQL, $DB, $output);
        }
    }

    /**
     * Array below contains all tables with entries to be deleted. In some cases a 
     * table can have dependents to delete first in which case the dependents get 
     * dleted first then the parent.
     */
    $resources = [
        ['table' => 'participant_status','field' => 'CandidateID'],
        ['table' => 'participant_status_history','field' => 'CandidateID'],
        ['table' => 'candidate_consent_rel','field' => 'CandidateID'],
        ['table' => 'parameter_candidate','field' => 'CandidateID'],
        ['table' => 'SNP_candidate_rel','field' => 'CandidateID'],
        ['table' => 'CNV','field' => 'CandidateID'],
        ['table' => 'genomic_candidate_files_rel','field' => 'CandidateID'],
        ['table' => 'genomic_sample_candidate_rel','field' => 'CandidateID'],
        ['table' => 'issues','field' => 'CandidateID'],
        ['table' => 'family','field' => 'CandidateID'],
        ['table' => 'dataquery_run_results','field' => 'CandidateID'],
        [
            'table' => 'feedback_bvl_thread', 'field' => 'CandidateID',
            'referencedBy' => [
                ['table' => 'feedback_bvl_entry', 'field' => 'FeedbackID', 'parent_key' => 'FeedbackID'],
            ],
        ],
        ['table' => 'candidate','field' => 'ID'],
    ];

    $refTableData = [];
    foreach ($resources as $row) {
        printout("Table: ".$row["table"]);
        // Query the data and retrieve a count of rows to be deleted
        $data = getTableData($DB, $row['table'], $row['field'], $candidateID);
        printTableData($data, $verbose);
        // Check if this table is referenced by others that need to be handled as well
        if (isset($row['referencedBy'])) {
            // Store parent table data for later use
            $refTableData[$row["table"]] = $data;

            printout("-> Referenced By: ");
            foreach ($row['referencedBy'] as $ref) {
                // foreach of the tables referencing the main table
                foreach ($data as $entry) {
                    // foreach of the results from the main table that matched the candidate
                    $mainID = $entry[$row['parent_key']];
            
                    printout("Table: ".$ref["table"]);
                    $refdata = getTableData($DB, $ref['table'], $ref['field'], $mainID);
                    printTableData($refdata, $verbose);
                }
            }
        }
        
    }
    


    //TODO do imaging

    // IF CONFIRMED, DELETE CANDIDATE
    if ($confirm) {
        echo "\nDELETE Mode - Dropping all DB entries for candidate CandID: " . $candID
            . " And PSCID: " . $PSCID . "\n";

        //delete from the participant_status table
        $DB->delete("participant_status", ["CandidateID" => $candidateID]);

        //delete from the participant_status_history table
        $DB->delete("participant_status_history", ["CandidateID" => $candidateID]);

        //delete from the candidate_consent_rel table
        $DB->delete("candidate_consent_rel", ["CandidateID" => $candidateID]);

        //delete from parameter_candidate
        $DB->delete("parameter_candidate", ["CandidateID" => $candidateID]);

        //delete from SNP_candidate_rel
        $DB->delete("SNP_candidate_rel", ["CandidateID" => $candidateID]);

        //delete from CNV
        $DB->delete("CNV", ["CandidateID" => $candidateID]);

        //delete from genomic_candidate_files_rel
        $DB->delete(
            "genomic_candidate_files_rel",
            ["CandidateID" => $candidateID]
        );

        //delete from genomic_sample_candidate_rel
        $DB->delete(
            "genomic_sample_candidate_rel",
            ["CandidateID" => $candidateID]
        );

        //delete from issues
        $DB->delete("issues", ["CandidateID" => $candidateID]);

        //delete from feedback_bvl_entry
        foreach ($feedback_threads as $feedback) {
            $DB->delete(
                "feedback_bvl_entry",
                ["FeedbackID" => $feedback['FeedbackID']]
            );
        }

        //delete from feedback_bvl_thread
        $DB->delete("feedback_bvl_thread", ["CandidateID" => $candidateID]);

        //delete from family
        $DB->delete("family", ["CandidateID" => $candidateID]);

        //delete from dataquery_run_results
        $DB->delete("dataquery_run_results", ["CandidateID" => $candidateID]);

        //delete from mri_protocol_violated_scans
        $DB->delete("mri_protocol_violated_scans", ["CandidateID" => $candidateID]);

        //delete from candidate
        $DB->delete("candidate", ["ID" => $candidateID]);
    } elseif ($printToSQL) {
        echo "Generating all DELETE statements for CandID: " . $candID
            . " And PSCID: " .
            $PSCID . "\n";

        //delete from the participant_status table
        _printResultsSQL(
            "participant_status",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from the participant_status_history table
        _printResultsSQL(
            "participant_status_history",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from the candidate_consent_rel table
        _printResultsSQL(
            "candidate_consent_rel",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from parameter_candidate
        _printResultsSQL(
            "parameter_candidate",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from SNP_candidate_rel
        _printResultsSQL(
            "SNP_candidate_rel",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from CNV
        _printResultsSQL("CNV", ["CandidateID" => $candidateID], $output, $DB);

        //delete from genomic_candidate_files_rel
        _printResultsSQL(
            "genomic_candidate_files_rel",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from genomic_sample_candidate_rel
        _printResultsSQL(
            "genomic_sample_candidate_rel",
            ["CandidateID" => $candidateID],
            $output,
            $DB
        );

        //delete from issues
        _printResultsSQL("issues", ["CandidateID" => $candidateID], $output, $DB);

        //delete from candidate
        _printResultsSQL("candidate", ["CandidateID" => $candidateID], $output, $DB);

        _exportSQL($output, $candID);
    }
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

function printout($string) 
{
    fwrite(STDOUT, $string);
}

function printerr($string)
{
    fwrite(STDERR, $string);
}

/**
 * Query the database for data in a specific table.
 */
function getTableData($DB, $table, $field, $value)
{
    $result = $DB->pselect(
        "SELECT * FROM $table WHERE $field = :val",
        ['val' => $value]
    );
    
    return $result;
}
/**
 * Print the data from the iterator.
 *
 * @param Iterator $data    The data to print.
 * @param bool     $verbose Whether to print verbose output.
 *
 * @return void
 */
function printTableData(Iterator $data, $verbose)
{
    $dataCount = iterator_count($data);
    if ($dataCount === 0) {
        printout(" -> No entries to delete\n");
        return;
    }
    printout(" -> Found $dataCount entries to delete\n");
    if ($verbose) {
        printout("\t".print_r(iterator_to_array($data), true));
    };
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
 * @param string $output SQL statements to write to file.
 * @param string $candID The candidate to be deleted.
 *
 * @return void
 */
function _exportSQL($output, $candID)
{
    //export file
    $filename = __DIR__
        . "/../../../project/tables_sql/DELETE_candidate_$candID.sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

function zip_directory($sourceDir, $zipPath) {
    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
            fwrite(STDERR, "[ERROR] Cannot open zip: {$zipPath}\n"); return false;
        }
        $sourceDir = rtrim($sourceDir, "/");
        $len = strlen($sourceDir) + 1;
        $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($sourceDir, FilesystemIterator::SKIP_DOTS));
        foreach ($rii as $file) {
            $filePath = $file->getPathname();
            if (is_dir($filePath)) continue;
            $local = substr($filePath, $len);
            $zip->addFile($filePath, $local);
        }
        $zip->close();
        return true;
    } else {
        $cmd = "zip -r " . escapeshellarg($zipPath) . " " . escapeshellarg($sourceDir);
        $rc = 0; system($cmd, $rc); return $rc == 0;
    }
}

// Config-aware temp my.cnf (prefers $config->getSetting('database') admin creds; falls back to env)
function setupDatabaseDumpCredentials($config) {
    $dumpDB = $config->getSetting('database');
    $host   = $dumpDB['host'];
    $user   = $dumpDB['adminUser'];
    $pass   = $dumpDB['adminPassword'];
    $port   = $dumpDB['port'];
    
    $tmp = tempnam(sys_get_temp_dir(), 'mycnf_');
    $cnf = "[client]\nuser={$user}\npassword={$pass}\nhost={$host}\nport={$port}\n";
    file_put_contents($tmp, $cnf); 
    chmod($tmp, 0600); 
    return $tmp;
}

// Append-only mysqldump (INSERTs only) into a single SQL file
function dump($table, $where, $appendSQLPath, $config) {
    $cnf = setupDatabaseDumpCredentials($config);
    $db  = $config->getSetting('database')['database'];
    if ($cnf === null || $db === null) {
        fwrite(STDERR, "[ERROR] Failed dump for {$table}: MYSQL/config not set.\n"); 
        die(); 
    }
    file_put_contents($appendSQLPath, "-- BACKUP table=" . $table . " WHERE " . $where . "\n", FILE_APPEND);
    $cmd = "mysqldump --defaults-extra-file=" . escapeshellarg($cnf)
        . " --single-transaction --quick --skip-lock-tables"
        . " --no-create-info --skip-triggers --complete-insert --skip-add-drop-table"
        . " --set-gtid-purged=OFF " . escapeshellarg($db) . " " . escapeshellarg($table)
        . " --where=" . escapeshellarg($where)
        . " >> " . escapeshellarg($appendSQLPath);
    $rc = 0; 
    system($cmd, $rc);
    if ($rc !== 0) {
        fwrite(STDERR, "[ERROR] mysqldump failed for {$table} (rc={$rc}).\n");
        die(); 
    }
    file_put_contents($appendSQLPath, "-- END table=" . $table . "\n", FILE_APPEND);
    return true;
}


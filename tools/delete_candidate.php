#!/usr/bin/env php
<?php

/**
 * This script deletes the specified candidate information.
 *
 * Delete all table rows for a given candidate
 * "Usage: php delete_candidate.php delete_candidate CandID PSCID [confirm] [tosql]";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007 tosql";
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

use LORIS\StudyEntities\Candidate\CandID;

set_include_path(
    get_include_path().":".
    __DIR__."/../project/tools:".
    __DIR__."/../php/tools:"
);

require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";

/**
 * This script deletes the specified candidate information.
 *
 * Delete all table rows for a given candidate
 * "Usage: php delete_candidate.php delete_candidate CandID PSCID [confirm] [tosql]";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm";
 * "Example: php delete_candidate.php delete_candidate 965327 dcc0007 tosql";
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
const MIN_NUMBER_OF_ARGS = 4;

// Possible script actions
$actions = ['delete_candidate'];

//define the command line parameters
if (count($argv) < MIN_NUMBER_OF_ARGS
    || $argv[1] == 'help'
    || !in_array($argv[1], $actions, true)
) {
    showHelp();
}

// set default arguments
$action  = $argv[1];
$CandID  = new CandID($argv[2]);
$PSCID   = $argv[3];
$confirm = false;

// SQL output
$printToSQL = false;
$output     = "";

// get the rest of the arguments
switch ($action) {
case 'delete_candidate':
    if (!empty($argv[4]) && $argv[4] == 'confirm') {
        $confirm = true;
    }
    if (!empty($argv[4]) && $argv[4] == 'tosql') {
        $printToSQL = true;
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
    [
        'cid' => $CandID,
        'pid' => $PSCID,
    ]
);
if ($candExists == 0) {
    echo "\nThe candidate with CandID : $CandID  and PSCID : $PSCID either does ".
        "not exist in the database or is set to Active='N' state.\n\n";
    die();
}
$entityType = $DB->pselectOne(
    "SELECT Entity_type
      FROM candidate
      WHERE CandID = :cid AND PSCID = :pid AND Active ='Y'",
    [
        'cid' => $CandID,
        'pid' => $PSCID,
    ]
);
if ($entityType === "Scanner") {
    echo "\nThe candidate with CandID : $CandID  and PSCID : $PSCID is a scanner ".
        "and should not be deleted using this script.\n\n";
    die();
}
/*
 * The switch to execute actions
 */
switch ($action) {
case 'delete_candidate':
    deleteCandidate($CandID, $PSCID, $confirm, $printToSQL, $DB, $output);
    break;
}

/**
 * Prints the usage and example help text and stop program
 *
 * @return void
 */
function showHelp()
{
    echo <<<USAGE
*** Delete Candidate Info ***

Usage: php delete_candidate.php delete_candidate CandID PSCID [confirm]
Example: php delete_candidate.php delete_candidate 965327 dcc0007
Example: php delete_candidate.php delete_candidate 965327 dcc0007 confirm
Example: php delete_candidate.php delete_candidate 965327 dcc0007 tosql

When the 'tosql' function is used, the SQL file exported will be located
under the following path:
    loris_root/project/tables_sql/DELETE_candidate_CandID.sql
USAGE;
    die;
}
/**
 * All tables with entries to be deleted here are only those with FOREIGN KEY
 * relations to `candidate`.
 * All other tables with FOREIGN KEY relations to these tables
 * (second-level relations) should have actions on delete specified in the
 * database schema
 *
 * @param CandID   $CandID     Identifying the candidate
 * @param string   $PSCID      Identifying the candidate
 * @param string   $confirm    Whether to execute the script
 * @param string   $printToSQL Whether to print the results
 * @param Database $DB         The database to connect to
 * @param string   $output     The string containing the statements to execute
 *
 * @return void
 */
function deleteCandidate($CandID, $PSCID, $confirm, $printToSQL, $DB, &$output)
{

    //Find candidate...
    $candidate = new Candidate();
    $candidate->select($CandID); //find the candidate with the given CandID

    // Passing argument to delete session script
    $outputType ="";
    if ($printToSQL) {
        $outputType ="tosql";
    } elseif ($confirm) {
        $outputType ="confirm";
    }

    //find sessions
    $sessions = $candidate->getListOfTimePoints();
    if (is_null($sessions) || empty($sessions)) {
        echo "There are no corresponding sessions for CandID: $CandID \n";
    } else {
        $subOutputType = "";
        if ($outputType == "tosql") {
            $subOutputType = "";
        } else {
            $subOutputType = $outputType;
        }
        foreach ($sessions as $sid) {
            $out = shell_exec(
                "php ".__DIR__."/delete_timepoint.php delete_timepoint".
                " $CandID $PSCID $sid $subOutputType"
            );
            //echo $out;
            $match    = [];
            $nbDelete = preg_match_all("/(DELETE FROM .*;)/", $out, $match);
            if ($nbDelete > 0) {
                for ($i=0; $i < $nbDelete; $i++) {
                    $output .= $match[0][$i];
                    $output .= "\n";
                }
            }
        }
    }

    // Print participant_status
    echo "\nParticipant Status\n";
    echo "--------------------\n";
    $result = $DB->pselect(
        'SELECT * FROM participant_status WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print participant_status_history
    echo "\nParticipant Status History\n";
    echo "----------------------------\n";
    $result = $DB->pselect(
        'SELECT * FROM participant_status_history WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print parameter_candidate
    echo "\nParameter Candidate\n";
    echo "---------------------\n";
    $result = $DB->pselect(
        'SELECT * FROM parameter_candidate WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print SNP_candidate_rel
    echo "\nSNP_candidate_rel\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM SNP_candidate_rel WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print CNV
    echo "\nCNV\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM CNV WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print genomic_candidate_files_rel
    echo "\nGenomic Candidate Files Relation\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM genomic_candidate_files_rel WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print genomic_sample_candidate_rel
    echo "\nGenomic Sample Candidate Relation\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM genomic_sample_candidate_rel WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print issues
    echo "\nIssues\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM issues WHERE candID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // Print candidate
    echo "\nCandidate\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM candidate WHERE CandID=:cid',
        ['cid' => $CandID]
    );
    print_r($result);

    // IF CONFIRMED, DELETE CANDIDATE
    if ($confirm) {
        echo "\nDropping all DB entries for candidate CandID: " . $CandID
            . " And PSCID: " .
            $PSCID . "\n";

        //delete from the participant_status table
        $DB->delete("participant_status", ["CandID" => $CandID]);

        //delete from the participant_status_history table
        $DB->delete("participant_status_history", ["CandID" => $CandID]);

        //delete from parameter_candidate
        $DB->delete("parameter_candidate", ["CandID" => $CandID]);

        //delete from SNP_candidate_rel
        $result = $DB->delete("SNP_candidate_rel", ["CandID" => $CandID]);

        //delete from CNV
        $result = $DB->delete("CNV", ["CandID" => $CandID]);

        //delete from genomic_candidate_files_rel
        $result = $DB->delete(
            "genomic_candidate_files_rel",
            ["CandID" => $CandID]
        );

        //delete from genomic_sample_candidate_rel
        $result = $DB->delete(
            "genomic_sample_candidate_rel",
            ["CandID" => $CandID]
        );

        //delete from issues
        $result = $DB->delete("issues", ["candID" => $CandID]);

        //delete from candidate
        $DB->delete("candidate", ["CandID" => $CandID]);
    } elseif ($printToSQL) {
        echo "Generating all DELETE statements for CandID: " . $CandID
            . " And PSCID: " .
            $PSCID . "\n";

        //delete from the participant_status table
        _printResultsSQL(
            "participant_status",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from the participant_status_history table
        _printResultsSQL(
            "participant_status_history",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from parameter_candidate
        _printResultsSQL(
            "parameter_candidate",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from SNP_candidate_rel
        _printResultsSQL(
            "SNP_candidate_rel",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from CNV
        _printResultsSQL("CNV", ["CandID" => $CandID], $output, $DB);

        //delete from genomic_candidate_files_rel
        _printResultsSQL(
            "genomic_candidate_files_rel",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from genomic_sample_candidate_rel
        _printResultsSQL(
            "genomic_sample_candidate_rel",
            ["CandID" => $CandID],
            $output,
            $DB
        );

        //delete from issues
        _printResultsSQL("issues", ["candID" => $CandID], $output, $DB);

        //delete from candidate
        _printResultsSQL("candidate", ["CandID" => $CandID], $output, $DB);

        _exportSQL($output, $CandID);
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
 * @param string $output SQL statements to write to file.
 * @param string $CandID The candidate to be deleted.
 *
 * @return void
 */
function _exportSQL($output, $CandID)
{
    //export file
    $filename = __DIR__ . "/../project/tables_sql/DELETE_candidate_$CandID.sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

if ($confirm === false && $printToSQL === false) {
    echo "\n\nRun this tool again with the argument 'confirm' or 'tosql' to ".
        "perform the changes or export them as an SQL patch\n\n";
}

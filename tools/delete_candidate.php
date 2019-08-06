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
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
const MIN_NUMBER_OF_ARGS = 4;

// Possible script actions
$actions = array('delete_candidate');

//define the command line parameters
if (count($argv) < MIN_NUMBER_OF_ARGS
    || $argv[1] == 'help'
    || !in_array($argv[1], $actions, true)
) {
    showHelp();
}

// set default arguments
$action  = $argv[1];
$CandID  = $argv[2];
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
$entityType = $DB->pselectOne(
    "SELECT Entity_type 
      FROM candidate 
      WHERE CandID = :cid AND PSCID = :pid AND Active ='Y'",
    array(
        'cid' => $CandID,
        'pid' => $PSCID,
    )
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
function showHelp(): void
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

    die();
}
/**
 * All tables with entries to be deleted here are only those with FOREIGN KEY
 * relations to `candidate`.
 * All other tables with FOREIGN KEY relations to these tables
 * (second-level relations) should
 * have actions on delete specified in the database schema
 *
 * @param int      $CandID     The CandID of the candidate to delete
 * @param string   $PSCID      The PSCID of the candidate to delete
 * @param string   $confirm    Whether the script should execute or just display
 * @param string   $printToSQL Whether to print the SQL that will be run
 * @param Database $DB         A LORIS Database object
 * @param string   $output     A record of the SQL commands to run
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
    } else if ($confirm) {
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
            $match    = array();
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
        array('cid' => $CandID)
    );
    print_r($result);

    // Print participant_status_history
    echo "\nParticipant Status History\n";
    echo "----------------------------\n";
    $result = $DB->pselect(
        'SELECT * FROM participant_status_history WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print parameter_candidate
    echo "\nParameter Candidate\n";
    echo "---------------------\n";
    $result = $DB->pselect(
        'SELECT * FROM parameter_candidate WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print SNP_candidate_rel
    echo "\nSNP_candidate_rel\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM SNP_candidate_rel WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print CNV
    echo "\nCNV\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM CNV WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print genomic_candidate_files_rel
    echo "\nGenomic Candidate Files Relation\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM genomic_candidate_files_rel WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print genomic_sample_candidate_rel
    echo "\nGenomic Sample Candidate Relation\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM genomic_sample_candidate_rel WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print issues
    echo "\nIssues\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM issues WHERE candID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // Print candidate
    echo "\nCandidate\n";
    echo "-----------\n";
    $result = $DB->pselect(
        'SELECT * FROM candidate WHERE CandID=:cid',
        array('cid' => $CandID)
    );
    print_r($result);

    // IF CONFIRMED, DELETE CANDIDATE
    if ($confirm) {
        echo "\nDropping all DB entries for candidate CandID: "
            . $CandID
            . " And PSCID: "
            . $PSCID . "\n";

        //delete from the participant_status table
        $DB->delete("participant_status", array("CandID" => $CandID));

        //delete from the participant_status_history table
        $DB->delete("participant_status_history", array("CandID" => $CandID));

        //delete from parameter_candidate
        $DB->delete("parameter_candidate", array("CandID" => $CandID));

        //delete from SNP_candidate_rel
        $result = $DB->delete("SNP_candidate_rel", array("CandID" => $CandID));

        //delete from CNV
        $result = $DB->delete("CNV", array("CandID" => $CandID));

        //delete from genomic_candidate_files_rel
        $result = $DB->delete(
            "genomic_candidate_files_rel",
            array("CandID" => $CandID)
        );

        //delete from genomic_sample_candidate_rel
        $result = $DB->delete(
            "genomic_sample_candidate_rel",
            array("CandID" => $CandID)
        );

        //delete from issues
        $result = $DB->delete("issues", array("candID" => $CandID));

        //delete from candidate
        $DB->delete("candidate", array("CandID" => $CandID));
    } elseif ($printToSQL) {
        echo "Generating all DELETE statements for CandID: "
            . $CandID
            . " And PSCID: "
            . $PSCID . "\n";

        //delete from the participant_status table
        _printResultsSQL(
            "participant_status",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from the participant_status_history table
        _printResultsSQL(
            "participant_status_history",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from parameter_candidate
        _printResultsSQL(
            "parameter_candidate",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from SNP_candidate_rel
        _printResultsSQL(
            "SNP_candidate_rel",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from CNV
        _printResultsSQL("CNV", array("CandID" => $CandID), $output, $DB);

        //delete from genomic_candidate_files_rel
        _printResultsSQL(
            "genomic_candidate_files_rel",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from genomic_sample_candidate_rel
        _printResultsSQL(
            "genomic_sample_candidate_rel",
            array("CandID" => $CandID),
            $output,
            $DB
        );

        //delete from issues
        _printResultsSQL("issues", array("candID" => $CandID), $output, $DB);

        //delete from candidate
        _printResultsSQL("candidate", array("CandID" => $CandID), $output, $DB);

        _exportSQL($output, $CandID);
    }
}

/**
 * Print SQL command to the output variable
 *
 * @param string   $table  A table in the database
 * @param string   $where  The WHERE strement for the query
 * @param string   $output A reference to the DB SQL output
 * @param Database $DB     A Database object
 *
 * @return void
 */
function _printResultsSQL($table, $where, &$output, $DB): void
{
    $query  = "DELETE FROM $table WHERE ";
    $where  = $DB->_implodeWithKeys(' AND ', $where);
    $query .= $where;
    $query .= ";\n";

    $output .=$query;
}

/**
 * Write SQL commands to a file
 *
 * @param string $output SQL output to write to file.
 * @param string $CandID The CandID of the candidate to be deleted.
 *
 * @return void
 */
function _exportSQL($output, $CandID): void
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

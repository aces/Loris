#!/usr/bin/php
<?php declare(strict_types=1);

/**
 * - Option to detect conflicts for the given instrument
 * and create corresponding CSV file
 * - Option to insert the missing conflict for the given instrument
 * - Option to remove and re-insert conflict for the given instrument
 *
 * PHP version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "ConflictDetector.class.inc";
require_once "NDB_BVL_InstrumentStatus.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "User.class.inc";
require_once "Utility.class.inc";
require_once "NDB_Client.class.inc";
require_once "TimePoint.class.inc";

/*
 * The minimum number of arguments required to run this script.
 *
 * @var int
 */
const MIN_NUMBER_OF_ARGS = 2;

/*
 * The maximum number of arguments to run this script.
 *
 * @var int
 */
const MAX_NUMBER_OF_ARGS = 6;

/// User prompt

if ((count($argv) < MIN_NUMBER_OF_ARGS)
    || (count($argv) > MAX_NUMBER_OF_ARGS)
) {
    echo <<<USAGE
Usage: php detect_conflicts.php -i [instrument] -t [timepoint]
Example: php detect_conflicts.php -i bdi -t 3month

Usage: php detect_conflicts.php -i [instrument]
Example: php detect_conflicts.php -i bdi

Usage: php detect_conflicts.php -r [instrument/all] [-y to confirm]
Example: php detect_conflicts.php -r all -y
Example: php detect_conflicts.php -r bdi -y

to insert the conflicts into conflicts_unresolved table type -c -i
to remove all/re-insert the conflicts into conflicts_unresolved table type -m
to run the script for all the instruments simply type -i all
to remove ignored conflicts type -r
NOTE: ONLY THE FAILED VISITS ARE EXCLUDED BY THIS SCRIPT
USAGE;
    die();
}

// parse the options
$opts       = getopt("m:i:t:r:c:y");
$change     = false;
$change_all = false;
$confirm    = false;
$delete_ignored_conflicts = false;
$instrument_ignored       = null;
$instrument  = null;
$visit_label = null;

if (!is_array($opts)) {
    print "There was a problem reading in the options.\n\n";
    exit(1);
}

// if it's an instrument
if (array_key_exists('i', $opts) && $opts['i']!=null) {
    $instrument = $opts['i'];
}

// if it's an visit
if (array_key_exists('t', $opts) && $opts['t'] !=null) {
    $visit_label = $opts['t'];
}

// if ignored but existing conflicts should be included
if (array_key_exists('r', $opts) && $opts['r'] !=null) {
    $delete_ignored_conflicts = true;
    $instrument_ignored[0]    = $opts['r'];
}

// Set the variables $change and $change_all
if (array_key_exists('c', $opts)) {
    $change = true;
}

if (array_key_exists('m', $opts)) {
    $change_all = true;
}

if (array_key_exists('y', $opts)) {
    $confirm = true;
}
print_r($opts);

if (($change && $change_all)
    || ($delete_ignored_conflicts && ($change || $change_all))
) {
    die(
        "Choose either Change (-c) or remove and re-insert all conflicts " .
        "(-m) or remove ignored conflicts (-r)"
    );
}

/// Initialization
$config = NDB_Config::singleton();
$db     = $lorisInstance->getDatabaseConnection();
$ddeInstruments = array_keys(
    \NDB_BVL_Instrument::getDDEInstrumentNamesList($lorisInstance)
);
$db_config      = $config->getSetting('database');
$paths          = $config->getSetting('paths');
$dataDir        = $paths['base'] . $config->getSetting('log');
$diff           = null;
$new_conflicts  = [];
$detected_conflicts       = [];
$current_conflicts        = [];
$conflicts_to_be_excluded = [];
if ((!$change) && (!$change_all)) {
    //just show the conflicts
        print "This will only display the conflicts needed to be inserted \n";
        print "To re-create the conflict, run this script with -c option \n";
}

if ($delete_ignored_conflicts) {
    if ($instrument_ignored[0] == "all") {
        $instrument_ignored = $ddeInstruments;
    }
    if (isset($instrument_ignored)) {
        if ($confirm) {
            echo "Removing ignored conflicts\n\n";
        } else {
            echo "Detecting ignored conflicts\n\n";
        }
        detectIgnoreColumns($lorisInstance, $instrument_ignored, $confirm);
        if ($confirm) {
            echo "Finished.\n\n";
        } else {
            echo "\n\nRun this tool again with the argument '-y' to ".
                "perform the changes\n\n";
        }
    } else {
        echo "No DDE instruments found to remove ignored columns.";
    }
} else {
    // Check to see if the variable instrument is set
    if (($instrument=='all') ||($instrument=='All')) {
        $instruments_q = $db->pselect(
            "SELECT Test_name FROM test_names",
            []
        );

        $instruments = [];

        foreach ($instruments_q as $row) {
            if (isset($row['Test_name'])) {
                $instruments[$row['Test_name']] =$row['Test_name'];
            }
        }
    } else {
        $instruments = [$instrument => $instrument];
    }

    foreach ($instruments as $instrument) {
        if (isset($instrument)) {
            print  "instrument is $instrument \n";

            //Run the script for all the instruments
            $commentids = getCommentIDs($instrument, $visit_label);


            //check to make sure that the commentids are set
            if (isset($commentids) && !empty($commentids)) {
                //get the current conflicts
                $current_conflicts  = getCurrentUnresolvedConflicts(
                    $instrument,
                    $visit_label
                );
                $detected_conflicts = detectConflicts(
                    $instrument,
                    $commentids,
                    $current_conflicts
                );

                $new_conflicts            = getNewConflicts(
                    $current_conflicts,
                    $detected_conflicts
                );
                $conflicts_to_be_excluded = detectConflictsTobeExcluded(
                    $instrument,
                    $commentids,
                    $current_conflicts
                );
                /**
                 * Only create report for the conflicts
                 * 1) that should be inserted into the conflicts_unresolved table
                 * 2) that should be deleted from the conflicts_unresolved table
                 */
                if ((!$change) && (!$change_all)) {
                    if ((empty($new_conflicts))
                        && empty($conflicts_to_be_excluded)
                    ) {
                        print "No new conflicts or current conflicts to be
                removed are detected for instrument $instrument \n";
                    } else {
                        writeCSV(
                            $new_conflicts,
                            $dataDir,
                            $instrument,
                            $visit_label,
                            "Conflicts_to_be_inserted"
                        );
                        writeCSV(
                            $conflicts_to_be_excluded,
                            $dataDir,
                            $instrument,
                            $visit_label,
                            "Conflicts_to_be_removed"
                        );
                    }
                }
                /**
                 * Only insert those conflicts which are new and are not
                 * currently in the conflict_unresolved
                 * 1) remove/clear the existing conflicts
                 * 2) And then re-create the conflicts
                 */

                // if the instrument is not provided,
                // run it only for all the instruments
                if ($change) {
                    if ((empty($new_conflicts)) || (!isset($new_conflicts))) {
                        die("There are no new conflicts to be inserted\n");
                    }
                    foreach ($new_conflicts as $conflict) {
                        if (($conflict != null) && (!empty($conflict))) {
                            ConflictDetector::clearConflictsForInstance(
                                $conflict['CommentId1']
                            ); // clear the conflicts
                        }
                    }
                    // re-insert them into the table
                    ConflictDetector::recordUnresolvedConflicts($new_conflicts);
                }


                /**
                 * Remove all the current conflicts for the givent
                 * instrument/visit_label and re-insert them
                 */
                if ($change_all) {
                    foreach ($commentids as $cid) {
                        ConflictDetector::clearConflictsForInstance(
                            $cid['CommentID']
                        );
                        $diff = ConflictDetector::detectConflictsForCommentIds(
                            $test_name,
                            $cid['CommentID'],
                            $cid['DDECommentID']
                        );
                        ConflictDetector::recordUnresolvedConflicts($diff);
                    }
                }
            }
        } else {
            die("the instrument is not set or there are no commentids \n");
        }
    }
}


/**
 * Get the commentids for the given instrument, candidate and visit_label
 *
 * @param String  $test_name   The instrument been searched
 * @param ?string $visit_label The  visit_label been searched
 * @param ?string $candid      The  candid been searched
 *
 * @return array $commentids An array of commentids found
 */
function getCommentIDs($test_name, $visit_label = null, $candid = null)
{
    global $db;
    $params = [];
    $query  = "SELECT CommentID, s.visit_label,Test_name,
        CONCAT('DDE_', CommentID) AS DDECommentID FROM flag f
        JOIN session s ON (s.ID=f.SessionID)
        JOIN candidate c ON (c.ID=s.CandidateID)
        LEFT JOIN test_names tn ON (tn.ID = f.TestID)";
    $where  = " WHERE CommentID NOT LIKE 'DDE%'
        AND s.Active='Y' AND c.Active='Y'
        AND s.Visit <> 'Failure'";
    if ($test_name!=null) {
        $where .= " AND tn.Test_name= :instrument ";
        $params['instrument'] = $test_name;

        if (($visit_label!=null) && (isset($visit_label))) {
            $where           .= " AND s.visit_label= :vlabel";
            $params['vlabel'] = $visit_label ;
        }
    }

    $query     .=$where;
    $commentids = $GLOBALS['DB']->pselect($query, $params);
    print_r($params);
    return iterator_to_array($commentids);
}

/**
 * Get the conflicts currently in the conflicts_unresolved table
 *
 * @param String  $test_name   The instrument been searched
 * @param ?string $visit_label The visit_label been searched
 *
 * @return array $conflicts An array of conflicts detected
 */
function getCurrentUnresolvedConflicts($test_name, $visit_label = null): array
{
    global $db;
    $params = [];
    $query  = "SELECT cu.* FROM conflicts_unresolved cu
        JOIN flag f on (f.commentid = cu.commentid1)
        JOIN session s on (s.id = f.sessionid)
        JOIN candidate c on (c.ID = s.CandidateID)
        LEFT JOIN test_names tn ON (tn.ID = f.TestID)";

    $where = " WHERE c.Active='Y' AND  s.Active='Y'
        AND s.Visit <> 'Failure'";
    if ($test_name!=null) {
        $where .= " AND tn.Test_name= :instrument ";
        $params['instrument'] = $test_name;

        if ($visit_label!=null) {
            $where          .= " AND s.visit_label= :visit";
            $params['visit'] = $visit_label ;
        }
    }
    $query    .=$where;
    $conflicts = $db->pselect($query, $params);
    return iterator_to_array($conflicts);
}

/**
 * Detect the conflicts by
 * 1) instantiating the instrument for each given commmentid
 * 2) and then taking the diff
 *
 * @param String $test_name         The instrument been searched
 * @param Array  $commentids        An array of commentids used as haystack
 * @param Array  $current_conflicts An array of current conflicts detected
 *
 * @return Array $detected_conflicts List of newly detected conflicts
 */
function detectConflicts($test_name, $commentids, $current_conflicts)
{
    global $lorisInstance;
    $detected_conflicts = [];
    /**
     * Go through each commentid
     */
    foreach ($commentids as $cid) {
        /**
         * Detect new conflicts
         */
        $diff =ConflictDetector::detectConflictsForCommentIds(
            $lorisInstance,
            $test_name,
            $cid['CommentID'],
            $cid['DDECommentID']
        );
        if ($diff!=null) {
            foreach ($diff as $row) {
                $detected_conflicts[] = $row;
            }
        }
    }
    return $detected_conflicts;
}



/**
 *  Write the data into a csv file
 *
 * @param String $output      Array of data been written into csv
 * @param String $path        The file path
 * @param String $instrument  The name of the instrument
 * @param String $visit_label The name of the visit
 * @param String $prefix      The type of csv file
 *
 * @return Null
 */
function writeCSV($output, $path, $instrument, $visit_label, $prefix)
{

    /**
     * Construct the file-path
     */
    if ($output!=null) {
        if ($visit_label!=null) {
            $name = $prefix . "_" . $instrument . "_" . $visit_label. "_" .
            date('ymd-His') . ".csv";
        } else {
            $name = $prefix . "_". $instrument . "_" . date('ymd-His') . ".csv";
        }
        $path = $path.$name;
        /// Write the header into the file
        $fp = fopen($path, 'w');
        $column_headers = $output[0];
        unset($column_headers['ExtraKeyColumn']);
        unset($column_headers['ExtraKey1']);
        unset($column_headers['ExtraKey2']);

        $column_headers   = array_keys($column_headers);
        $column_headers[] = "Visit_label";
        $column_headers[] = "PSCID";
        $column_headers[] = "CandID";
        fputcsv($fp, $column_headers, "\t"); //write the headers to the CSV file

        //// insert the data into the csv file
        foreach ($output as $data) {
            unset($data['ExtraKeyColumn']);
            unset($data['ExtraKey1']);
            unset($data['ExtraKey2']);
            $info = getInfoUsingCommentID($data['CommentId1']);
            $data['Visit_label'] = $info['Visit_label'];
            $data['CandID']      = $info['CandID'];
            $data['PSCID']       = $info['PSCID'];
            fputcsv($fp, $data, "\t"); //write the headers to the CSV file
        }
        fclose($fp);
        print "The CSV output for $prefix (for instrument $instrument)
         is available under $path \n";
    }
}



/**
 * Return data using the commentid
 *
 * @param String $commentid extract data using commentid
 *
 * @return Array $data        Result of the query
 */
function getInfoUsingCommentID($commentid)
{
    global $db;
    $data =  $db->pselectRow(
        "SELECT c.PSCID, c.CandID, s.Visit_label FROM flag f
        JOIN session s on (f.sessionid=s.ID)
        JOIN candidate c on (c.ID=s.CandidateID)
        WHERE f.CommentID = :cid",
        ['cid' => $commentid]
    );
    return $data;
}



/**
 * Detect those conflicts which are currently in the conflicts_unresolved table
 * But should be excluded based on the _doubleDataEntryDiffIgnoreColumns array
 *
 * @param String $instrument        The instrument used for conflict detection
 * @param Array  $commentids        Used for creation of instrument-instantiation
 * @param Array  $current_conflicts An array of current conflicts detected
 *
 * @return Array $conflicts_to_excluded Array of confllicts to be execluded
 */
function detectConflictsTobeExcluded($instrument, $commentids, $current_conflicts)
{
    global $lorisInstance;
    $conflicts_to_excluded = [];
    $instance1      = NDB_BVL_Instrument::factory(
        $lorisInstance,
        $instrument,
        $commentids[0]['CommentID']
    );
    $ignore_columns = $instance1->_doubleDataEntryDiffIgnoreColumns;
    foreach ($current_conflicts as $conflict) {
         // if the field is part of the ignore_columns,
         // and it doesn exist in the conflict array
         // then track it
        if (in_array($conflict['FieldName'], $ignore_columns)) {
            $conflicts_to_excluded[] = $conflict;
        }
    }
    return $conflicts_to_excluded;
}

/**
 * Detect those conflicts not currently in conflicts unresolved table
 *
 * @param Array $current_conflicts  The list of current conflicts detected
 * @param Array $detected_conflicts The list of newly created conflicts
 *
 * @return Array $new_conflicts  The list of conflicts to be included
 */
function getNewConflicts($current_conflicts, $detected_conflicts)
{
    $new_conflicts = [];

    /**
     * 1) Make sure that the $detected_conflicts is not empty
     * 2) if the current_conflicts is empty, then the
     * new conflicts = $detected_conflicts
     */
    if (!(empty($detected_conflicts))) {
        /**
         * 1) go through the current conflicts
         * 2) and detect those conflicts in recreated conflicts
         * which are not in the current_conflicts
         */
        foreach ($detected_conflicts as $re_conflict) {
            if (empty($current_conflicts)) {///if the conflict doesn't exist
                $new_conflicts[] = $re_conflict;
            } else {
                if (!findConflict($re_conflict, $current_conflicts)) {
                    $new_conflicts[] = $re_conflict;
                }
            }
        }
    }
    return $new_conflicts;
}

/**
 * Check to see if the commentid and fieldname exist in the array of conflicts
 * if it doesn't then return false
 * and if they do, then check to see if the values are the same,
 * if not the same, return false
 *
 * @param String $conflict  The needle
 * @param Array  $conflicts The Haystack
 *
 * @return boolean true if needle exists , else false
 */
function findConflict($conflict, $conflicts)
{
    $found =false;
    foreach ($conflicts as $cf) {
        ////////if the value exists then set found to true////
        if ((in_array($conflict['CommentId1'], $cf))
            && (in_array($conflict['FieldName'], $cf))
        ) {
            ///if the values are the same////////////
            if (($conflict['Value1'] == $cf['Value1'])
                && ($conflict['Value2'] == $cf['Value2'])
            ) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Populates the DDE ignore fields for each instrument and runs
 * the ignoreColumn function on the instrument for the given fields
 *
 * @param string $lorisInstance The Loris instance
 * @param array  $instruments   The instruments to check
 * @param bool   $confirm       Whether to execute
 *
 * @return void
 *
 * @throws Exception
 */
function detectIgnoreColumns($lorisInstance, $instruments, $confirm)
{
    $instrumentFields = [];

    foreach ($instruments as $instrument) {
        $instance        = NDB_BVL_Instrument::factory(
            $lorisInstance,
            $instrument
        );
        $DDEIgnoreFields = $instance->_doubleDataEntryDiffIgnoreColumns;

        if ($DDEIgnoreFields != null) {
            foreach ($DDEIgnoreFields as $key => $DDEField) {
                $instrumentFields = array_merge(
                    $instrumentFields,
                    [$DDEField => $instrument]
                );
            }
        } else {
            echo "No DDE ignore fields found for " . $instrument;
        }
        ignoreColumn($instrument, $instrumentFields, $confirm);
    }
}


/**
 * Prints the instrument-specific ignore columns to be removed
 * Removes the fields if confirmation is set
 *
 * @param string $instrument       The instrument name
 * @param array  $instrumentFields The instrument fields
 * @param bool   $confirm          whether to execute the command or not
 *
 * @return void
 */
function ignoreColumn($instrument, $instrumentFields, $confirm)
{
    global $db;

    foreach ($instrumentFields as $field => $instr) {
        $query        = "SELECT TestName, FieldName, Value1, Value2 
            FROM conflicts_unresolved 
            WHERE TestName = '$instrument' AND FieldName = '$field'";
        $ignoreColumn = $db->pselectOne($query, []);

        if (!empty($ignoreColumn)) {
            $query = "SELECT 
                TestName, FieldName, CommentId1, Value1, CommentId2, Value2 
                FROM conflicts_unresolved 
                WHERE TestName = '$instrument' AND FieldName = '$field'";
            $conflictsToRemove = $db->pselect($query, []);
            print_r($conflictsToRemove);

            if ($confirm) {
                $query = "DELETE FROM conflicts_unresolved 
                    WHERE TestName = '$instrument' AND FieldName = '$field'";
                $db->run($query);
            }
        }
    }
    echo "\n";
}

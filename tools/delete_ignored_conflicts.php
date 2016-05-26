<?php

/**
 *
 * This script removes the 'ignored' fields from the Conflict Resolver table.
 * Should be run after any fields are added to the _doubleDataEntryDiffIgnoreColumns
 * after the instrument has been completed.
 *
 * It has two modes:
 *     regular mode -> Prints the conflicts to be removed, but does not remove them.
 *
 *     confirm mode -> Actually removes the conflicts.
 *
 * Usage: php assign_missing_instrument.php [Test_name] [confirm]
 *
 * Example: php delete_ignored_conflicts.php tsi
 * (Will use regular mode and print the obsolete conflicts)
 *
 * Example: php delete_ignored_conflicts.php tsi confirm
 * (Will use confirm mode and remove obsolete tsi conflicts)
 *
 * Example: php delete_ignored_conflicts.php confirm
 * (Will use confirm mode and remove all obsolete conflicts)
 *
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
require_once"Utility.class.inc";
require_once"Database.class.inc";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize('../project/config.xml');
$config        =& NDB_Config::singleton();

// Meta fields that should be removed
$defaultFields = array(
    'CommentID', 'UserID', 'Testdate', 'Window_Difference',
    'Candidate_Age', 'Data_entry_completion_status'
);

$instruments = array();
$instrumentSpecified = false;

$confirm = false;
if ((isset($argv[1]) && $argv[1] === "confirm")
    || (isset($argv[2]) && $argv[2] === "confirm")) {
    $confirm = true;
}

if (!empty($argv[1]) && $argv[1]!="confirm") {
    $instruments[0] = $argv[1];
    $instrumentSpecified = true;
} else {
    $instruments = $config->getSetting('DoubleDataEntryInstruments');
}

if (isset($instruments)) {
    detectIgnoreColumns($instruments);
}
else {
    echo "No instruments found";
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}

/**
 *Get the commentids for the given instrument, candidate and visit_label
 *
 * @param String $test_name   The instrument been searched
 * @param string $visit_label The  visit_label been searched
 * @param string $candid      The  candid been searched
 *
 * @return array $commentids An array of commentids found
 */

function getCommentIDs($test_name, $visit_label=null, $candid=null)
{
    $db =& Database::singleton();
    $params = array();
    $query = "SELECT CommentID, s.visit_label,Test_name,
        CONCAT('DDE_', CommentID) AS DDECommentID FROM flag f
        JOIN session s ON (s.ID=f.SessionID)
        JOIN candidate c ON (c.CandID=s.CandID)";
    $where = " WHERE CommentID NOT LIKE 'DDE%'
        AND s.Active='Y' AND c.Active='Y'
        AND s.Visit <> 'Failure'";
    if ($test_name!=null) {
        $where .= " AND f.Test_name= :instrument ";
        $params['instrument'] = $test_name;

        if (($visit_label!=null) && (isset($visit_label))) {
            $where .= " AND s.visit_label= :vlabel";
            $params['vlabel'] = $visit_label ;
        }
    }

    $query .=$where;
    $commentids = $GLOBALS['DB']->pselect($query, $params);
    return $commentids;
}



/**
 * Populates the DDE ignore fields for each instrument and runs
 * the ignoreColumn function on the instrument for the given fields
 * @param $instruments
 * @throws Exception
 */
function detectIgnoreColumns($instruments)
{
    $instrumentFields = array();

    foreach ($instruments as $instrument) {
        $file = "../project/instruments/NDB_BVL_Instrument_$instrument.class.inc";
        if (file_exists($file)) {
            include $file;
            $commentids = getCommentIDs($instrument, null);
            $instance =& NDB_BVL_Instrument::factory($instrument, $commentids[0]['CommentID'], null);
            $DDEIgnoreFields = $instance->_doubleDataEntryDiffIgnoreColumns;

            if ($DDEIgnoreFields != null) {
                foreach ($DDEIgnoreFields as $key => $DDEField) {
                    if (!in_array($DDEField, $this->defaultFields)) {
                        $instrumentFields = array_merge($instrumentFields, array($DDEField => $instrument));
                    }
                }
            } else {
                echo "No DDE ignore fields found for " . $instrument;
            }
            if (!$this->instrumentSpecified) {
                defaultIgnoreColumns();
            }
            ignoreColumn($instrument, $instrumentFields);
        }
        else {
            echo $file . " was not found.\n";
        }
    }
}

/*
 * Prints the default ignore columns to be removed
 * Removes the fields if confirmation is set
 */
function defaultIgnoreColumns() {
    $db =& Database::singleton();

    if ($this->confirm) {
        foreach ($this->defaultFields as $field) {
            $defaultQuery = "DELETE FROM conflicts_unresolved WHERE FieldName = '$field'";
            $changes = $db->run($defaultQuery);
            echo $changes;
        }
    }
    else {
        foreach ($this->defaultFields as $field) {
            $defaultQuery = "SELECT TableName, FieldName, Value1, Value2 
          FROM conflicts_unresolved WHERE FieldName = '$field'";
            $defaultColumn = $db->pselectOne($defaultQuery, array());
            echo "TableName, FieldName, Value1, Value2: ";
            print_r($defaultColumn);
        }
    }
}

/*
 * Prints the instrument-specific ignore columns to be removed
 * Removes the fields if confirmation is set
 */
function ignoreColumn($instrument, $instrumentFields) {
    $db =& Database::singleton();

    if ($this->confirm) {
        foreach ($instrumentFields as $field => $instr) {
            $query = "DELETE FROM conflicts_unresolved WHERE TableName = '$instrument' AND FieldName = '$field'";
            $changes = $db->run($query);
            echo $changes;
        }
    }
    else {
        foreach ($instrumentFields as $field => $instr) {
            $query = "SELECT TableName, FieldName, Value1, Value2 FROM conflicts_unresolved 
          WHERE TableName = '$instrument' AND FieldName = '$field'";
            $ignoreColumn = $db->pselectOne($query, array());
            echo "TableName, FieldName, Value1, Value2: ";
            print_r($ignoreColumn);
        }
    }
}

?>

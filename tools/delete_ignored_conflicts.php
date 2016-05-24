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
 * Example: php .php tsi
 * (Will use regular mode and print the deprecated conflicts)
 *
 * Example: php .php tsi confirm
 * (Will use confirm mode and remove deprecated tsi conflicts)
 *
 * Example: php .php confirm
 * (Will use confirm mode and remove all deprecated conflicts)
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

if (isset($instrument)) {
    detectIgnoreColumns($instrument);
}
else {
    echo "No instruments found";
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}

function detectIgnoreColumns($instruments)
{
    $instrumentFields = array();

    foreach ($instruments as $instrument) {
        include "../instruments/NDB_BVL_Instrument_$instrument.class.inc";
        $instance =& NDB_BVL_Instrument::factory($instrument, null, null);
        $DDEIgnoreFields = $instance->_doubleDataEntryDiffIgnoreColumns;

        if ($DDEIgnoreFields != null) {
            foreach ($DDEIgnoreFields as $key => $DDEField) {
                if (!in_array($DDEField, $this->defaultFields)) {
                    $instrumentFields = array_merge($instrumentFields, array($DDEField => $instrument));
                }
            }
        }
        else {
            echo "No DDE ignore fields found for " . $instrument;
        }
        if (!$this->instrumentSpecified) {
            defaultIgnoreColumns();
        }
        ignoreColumn($instrument, $instrumentFields);
    }
}


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

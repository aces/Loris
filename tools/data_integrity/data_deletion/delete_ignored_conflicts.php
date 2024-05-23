#!/usr/bin/env php
<?php

/**
 * This script removes the 'ignored' fields from the Conflict Resolver table.
 * Should be run after any fields are added to the _doubleDataEntryDiffIgnoreColumns
 * after the instrument has been completed.
 *
 * It has two modes:
 *     regular mode -> Prints the conflicts to be removed, but does not remove them.
 *
 *     confirm mode -> Actually removes the conflicts.
 *
 * Usage: php delete_ignored_conflicts.php [Test_name] [confirm]
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
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

set_include_path(
    get_include_path().":".
    __DIR__."../../../project/libraries:" .
    __DIR__."../../../php/libraries:"
);

require_once __DIR__ . "/../../../vendor/autoload.php";
require_once __DIR__ . "/../../generic_includes.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config =& NDB_Config::singleton();

// Meta fields that should be removed
$defaultFields = [
    'CommentID',
    'UserID',
    'Testdate',
    'Window_Difference',
    'Candidate_Age',
];

$instruments         = [];
$instrumentSpecified = false;

$confirm = false;
if ((isset($argv[1]) && $argv[1] === "confirm")
    || (isset($argv[2]) && $argv[2] === "confirm")
) {
    $confirm = true;
}

if (!empty($argv[1]) && $argv[1]!="confirm") {
    $instruments[0]      = $argv[1];
    $instrumentSpecified = true;
} else {
    $instruments = $config->getSetting('DoubleDataEntryInstruments');
}

if (isset($instruments)) {
    $instrumentFields = [];

    foreach ($instruments as $instrument) {
        echo "Checking DDE ignore fields for " . $instrument . "\n";

        $instance = NDB_BVL_Instrument::factory($lorisInstance, $instrument);

        $DDEIgnoreFields = $instance->_doubleDataEntryDiffIgnoreColumns;

        if ($DDEIgnoreFields != null) {
            foreach ($DDEIgnoreFields as $key => $DDEField) {
                if (!in_array($DDEField, $defaultFields)) {
                    $instrumentFields = array_merge(
                        $instrumentFields,
                        [$DDEField => $instrument]
                    );
                }
            }
        } else {
            echo "No DDE ignore fields found for " . $instrument . "\n";
        }
        if (!$instrumentSpecified) {
            defaultIgnoreColumns($defaultFields, $confirm);
        }
        ignoreColumn($instrument, $instrumentFields, $confirm);
    }
    echo "Done.";
} else {
    echo "No instruments found";
}

if ($confirm === false) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}

/**
 * Prints the default ignore columns to be removed
 * Removes the fields if confirmation is set
 *
 * @param array $defaultFields The fields for the instrument
 * @param bool  $confirm       True if data should be deleted
 *
 * @return void
 */
function defaultIgnoreColumns($defaultFields, $confirm)
{
    $db = \NDB_Factory::singleton()->database();

    if ($confirm) {
        foreach ($defaultFields as $field) {
            $defaultQuery = "DELETE FROM conflicts_unresolved
                WHERE FieldName = '$field'";
            $changes      = $db->run($defaultQuery);
        }
    } else {
        foreach ($defaultFields as $field) {
            $defaultQuery  = "SELECT TestName, FieldName, Value1, Value2
          FROM conflicts_unresolved WHERE FieldName = :field";
            $defaultColumn = $db->pselect($defaultQuery, ['field' => $field]);

            if ($defaultColumn) {
                echo "TestName, FieldName, Value1, Value2: \n";
                foreach ($defaultColumn AS $key => $conflicts) {
                    echo $conflicts['TestName'] . " " .
                    $conflicts['FieldName'] . " " .
                    $conflicts['Value1'] . " " .
                    $conflicts['Value2'] . "\n";
                }
            }
        }
    }
}

/**
 * Prints the instrument-specific ignore columns to be removed
 * Removes the fields if confirmation is set
 *
 * @param string $instrument       The name of the instrument
 * @param array  $instrumentFields The fields for the instrument
 * @param bool   $confirm          True if data should be deleted
 *
 * @return void
 */
function ignoreColumn($instrument, $instrumentFields, $confirm)
{
    $db = \NDB_Factory::singleton()->database();

    if ($confirm) {
        foreach ($instrumentFields as $field => $instr) {
            $query   = "DELETE FROM conflicts_unresolved 
                WHERE TestName ='$instrument' AND FieldName ='$field'";
            $changes = $db->run($query);
        }
    } else {
        foreach ($instrumentFields as $field => $instr) {
            $query        = "SELECT TestName, FieldName, Value1, Value2 
                FROM conflicts_unresolved 
                WHERE TestName = :tn AND FieldName = :field";
            $ignoreColumn = $db->pselect(
                $query,
                ['tn' => $instrument, 'field' => $field]
            );
            if ($ignoreColumn) {
                echo "TestName, FieldName, Value1, Value2: \n";
                foreach ($ignoreColumn AS $key => $conflicts) {
                    echo $conflicts['TestName'] . " " .
                    $conflicts['FieldName'] . " " .
                    $conflicts['Value1'] . " " .
                    $conflicts['Value2'] . "\n";
                }
            }
        }
    }
}

?>

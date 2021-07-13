#!/usr/bin/env php
<?php

/**
 * Tools for viewing and manipulating instrument JSON data
 *
 * PHP version 7
 *
 * @category Main
 * @package  Loris
 * @author   Camille Beaudoin  <camille.beaudoin@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once "generic_includes.php";
require_once "JSONToolkit.class.inc";

use LORIS\JSONToolkit;

// Help message
if(count($argv) <  3 || $argv[1] === 'help') {
    showHelp();
}

// Get test name from argument
$test_name = $argv[1];
if (!is_file(__DIR__."/../project/instruments/NDB_BVL_Instrument_$test_name.class.inc")
    && !is_file(__DIR__."/../project/instruments/$test_name.linst")) {
    throw new Exception(
        "Included file does not exist (".__DIR__."/../project/instruments/NDB_BVL_Instrument_$test_name.class.inc)"
    );
}

$action = strtolower($argv[2]);

// instantiate toolkit
$toolkit = new JSONToolkit($test_name);

switch ($action) {
    case 'select':
        if (count($argv) !== 5) {
            showHelp();
        }
        $field = $argv[3];
        $val = $argv[4];

        $conditions = array($field => $val);
        // Execute action, set array of commentIDs
        $cmids = $toolkit->selectCMIDs($conditions);
        print_r("\n#########################################################\n");
        print_r("The following is a list of CommentIDs where the field\n".
            "$field has the value $val in the instrument $test_name:\n");
        print_r("#########################################################\n");
        print_r($cmids);
        break;

    case 'selectall':
        if (count($argv) !== 5) {
            showHelp();
        }
        $field = $argv[3];
        $val = $argv[4];

        $conditions = array($field => $val);

        // Perform action, set results array
        $results = $toolkit->selectAll($conditions);
        print_r("\n#########################################################\n");
        print_r("The following is a list of CommentIDs and full data\n".
            "where the field $field has the value $val \n".
            "in the instrument $test_name:\n");
        print_r("#########################################################\n");
        print_r($results);
        break;

    case 'selectfield':
        if (count($argv) !== 6) {
            showHelp();
        }
        $selected = $argv[3];
        $field = $argv[4];
        $val = $argv[5];

        $conditions = array($field => $val);

        // Perform action, set results array
        $results = $toolkit->selectField($selected, $conditions);
        print_r("\n#########################################################\n");
        print_r("The following is a list of CommentIDs and values for \n".
            "field $selected where the field $field has the value \n".
            "$val in the instrument $test_name:\n");
        print_r("#########################################################\n");

        print_r($results);
        break;

    case 'rename':
        if (count($argv) != 5) {
            showHelp();
        }
        $oldName = $argv[3];
        $newName = $argv[4];

        // Do not rename if metadata field
        if($toolkit->checkMetaData($oldName) || $toolkit->checkMetaData($newName)) {
            metaDataMessage();
        }

        // Execute command & get number of changes
        $fieldsChanged = $toolkit->rename($oldName, $newName);
        if($fieldsChanged) {
            print_r("\n#########################################################\n");
            print_r("The command was performed with $fieldsChanged changes made.\n");
            print_r("#########################################################\n");
        } else {
            print_r("\n#########################################################\n");
            print_r("No changes were made in the database. The field $oldName may not \n".
                "exist or there may already be a field named $newName \n");
            print_r("#########################################################\n");

        }

        // Check for status field
        if($toolkit->checkStatusField($oldName)) {
            print_r("*** A status field " . $oldName . "_status has been detected. ***\n");
        }
        break;

    case 'drop':
        if (count($argv) != 4) {
            showHelp();
        }

        $field = $argv[3];

        // Do not drop if metadata field
        if($toolkit->checkMetaData($field)) {
            metaDataMessage();
        }

        // Execute command & get number of changes
        $fieldsChanged = $toolkit->drop($field);
        if($fieldsChanged) {
            print_r("\n#########################################################\n");
            print_r("The command was performed with $fieldsChanged changes made.\n");
            print_r("#########################################################\n");
        } else {
            print_r("\n#########################################################\n");
            print_r("No changes were made in the database. The field $field was not found.\n");
            print_r("#########################################################\n");
        }

        // Check for status field
        if($toolkit->checkStatusField($field)) {
            print_r("*** A status field " . $field . "_status has been detected. ***\n");
        }
        break;

    case 'modify':
        if (count($argv) !== 7) {
            showHelp();
        }

        $field = $argv[3];
        $newVal = $argv[4];
        $conditionalField = $argv[5];
        $conditionalVal = $argv[6];

        // Do not modify if metadata field
        if($toolkit->checkMetaData($field)) {
            metaDataMessage();
        }

        $conditions = array($conditionalField => $conditionalVal);

        // Execute command & get number of fields changed
        $fieldsChanged = $toolkit->modify(
            $field,
            $newVal,
            $conditions
        );

        if($fieldsChanged) {
            print_r("\n#########################################################\n");
            print_r("The command was performed with $fieldsChanged changes made.\n");
            print_r("#########################################################\n");
        } else {
            print_r("\n#########################################################\n");
            print_r("No changes were made in the database. Possible reasons include field \n".
                "$field and/or $conditionalField do not exist, the field $conditionalField \n".
                "never has the value $conditionalVal, or the field $field already has the value $newVal\n");
            print_r("#########################################################\n");

        }

        // Check for status field
        if($toolkit->checkStatusField($field)) {
            print_r("*** A status field $field" . "_status has been detected. ***\n");
        }
        break;

    case 'custommodify':
        if (count($argv) < 6 || count($argv) > 8) {
            showHelp();
        }

        $field = $argv[3];
        $operation = $argv[4];
        $opVal = $argv[5];
        $fn;

        // Do not modify if metadata field
        if($toolkit->checkMetaData($field)) {
            metaDataMessage();
        }

        // Set anonymous function
        if ($operation === 'add') {
            $fn = function ($val) use($opVal) {
                // if value is null don't alter
                if (!isset($val)) {
                    return $val;
                }
                if (!is_numeric($val) || !is_numeric($opVal)) {
                    throw new Exception("Non-numeric value given for addition operation");
                }
                return $val + $opVal;
            };

        } elseif ($operation === 'multiply') {
            $fn = function ($val) use($opVal) {
                // if value is null don't alter
                if (!isset($val)) {
                    return $val;
                }
                if (!is_numeric($val) || !is_numeric($opVal)) {
                    throw new Exception("Non-numeric value given for multiplication operation");
                }
                return $val * $opVal;
            };

        } elseif ($operation === 'divide') {
            $fn = function ($val) use($opVal) {
                // if value is null don't alter
                if (!isset($val)) {
                    return $val;
                }
                if (!is_numeric($val) || !is_numeric($opVal)) {
                    throw new Exception("Non-numeric value given for division operation");
                }
                return $val / $opVal;
            };

        } elseif ($operation === 'concat') {
            $fn = function ($val) use($opVal) {
                return $val . $opVal;
            };

        } else {
            showHelp();
        }

        // if conditional values are set, include as parameters
        // Otherwise, do not
        if(isset($argv[6]) && isset($argv[7])) {
            $conditionalField = $argv[6];
            $conditionalVal = $argv[7];
            $conditions = array($conditionalField => $conditionalVal);

            // Execute action and get number of changes
            $fieldsChanged = $toolkit->customModify(
                $fn,
                $field,
                $conditions
            );

        } else {
            // Execute action and get number of changes
            $fieldsChanged = $toolkit->customModify(
                $fn,
                $field
            );
        }
        // Print how many changes made (if any)
        if($fieldsChanged) {
            print_r("\n#########################################################\n");
            print_r("The command was performed with $fieldsChanged changes made.\n");
            print_r("#########################################################\n");

        } else {
            print_r("\n#########################################################\n");
            print_r("No changes were made in the database. \n");
            print_r("#########################################################\n");
        }

        // check for status field
        if($toolkit->checkStatusField($field)) {
            print_r("*** A status field  $field"."_status has been detected. ***\n");
        }
        break;

    default:
        print_r("\n#########################################################\n");
        print_r("Action $action not recognized.\n");
        print_r("#########################################################\n");
        showHelp();
}

/*
 * Prints the usage and example help text and stop program
 */
function showHelp()
{

    echo <<<USAGE
*** Usage Info ***

php JSON_data.php [instrument] [action] [parameters]
php JSON_data.php help

ACTIONS
Select:         php JSON_data.php [tbl] select [field] [value]
                -   Select CommentIDs for instrument [tbl] where [field] has value [value]
SelectAll:      php JSON_data.php [tbl] selectAll [field] [value]
                -   Select full data for instrument [tbl] where [conField] has value [value]
SelectField:    php JSON_data.php [tbl] select [field] [conField] [value]
                -   Select CommentIDs and the value of [field] for instrument [tbl] where 
                    [conField] has value [value]                    
Rename:         php JSON_data.php [tbl] rename [oldName] [newName]
                -   Rename the field [oldName] to [newName] in instrument [tbl]
                
Drop:           php JSON_data.php [tbl] drop [field]
                -   Drop [field] for instrument [instr]. NOTE: data will be lost for this field
                
Modify:         php JSON_data.php [tbl] modify [field] [newVal] [conField] [conVal] 
                -   Set [field] to [newVal] where [conField] has value [conVal] for instrument [tbl]
                
customModify:   php JSON_data.php [tbl] customModify [field] [operation] [opVal]
                -   Perform [operation]* with value [opVal] on [field] in instrument [tbl]
                
                php JSON_data.php [tbl] customModify [field] [operation] [opVal] [conField] [conVal]
                -   Perform [operation]* with value [opVal] on [field] in instrument [tbl] 
                    when [conField] has value [conVal]
                    
                * [operation] may be one of the following:
                    add         Add [opVal] to field
                    multiply    Multiple field by [opVal]
                    divide      Divide field by [opVal]
                    concat      Concatenate field with [opVal]

USAGE;
    die();
}

function metaDataMessage() {
    print_r("#########################################################\n");
    print_r("Can not alter metadata values:\n");
    print_r("Date_taken \nExaminer \nCandidate_Age \nWindow_Difference\n");
    print_r("#########################################################\n");
    die();
}
?>

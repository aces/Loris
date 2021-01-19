<?php declare(strict_types=1);
/**
 * This tool checks instrument data for multi-escaped characters that have
 * been stored in the database due to a bug present in LORIS since before
 * version 19.0.
 *
 * This tool can be used to report cases of multi-escaped character as well
 * as identify if the escaping caused data truncation.
 *
 * This tool does not fix or modify the data in anyway, it simply reads from t
 * he database.
 *
 */

require_once __DIR__."/../generic_includes.php";

// LOGGING
$dir = __DIR__ . "/../logs/";
if (!is_dir($dir)) {
    mkdir($dir);
}
$today   = getdate();
$date    = strftime("%Y-%m-%d_%H:%M");
$logPath = "$dir/instrument_double_escape_report_$date.log";
$logfp   = fopen($logPath, 'a');

if (!$logfp) {
    printError(
        "No logs can be generated, path:$logPath ".
        "does not exist or can not be written to.\n"
    );
}
//PARSE ARGUMENTS
$actions = array(
    'use-database',
    'use-objects',
);
if (
    !isset($argv[1])
    || $argv[1] === 'help'
    || in_array('-h', $argv, true)
    || !in_array($argv[1], $actions, true)
    || $argc !== 2
) {
    showHelp();
}
$useDatabase = false;
if (isset($argv[1]) && $argv[1] === 'use-database') {
    $useDatabase =true;
}
$useObjects = false;
if (isset($argv[1]) && $argv[1] === 'use-objects') {
    $useObjects =true;
}

// DEFINE VARIABLES
// All instruments looked at
$instrumentNames = $DB->pselectCol("SELECT Test_name FROM test_names", array());
// Array of all fields containing any escaped characters
$escapedEntries = array();
// Array of database tables and columns containing escaped characters.
$escapedFields = array();
// Array of confirmed truncations based on size of fields and content
$confirmedTruncations = array();
// Boolean flag for identify non-impacted databases and terminating.
$errorsDetected = false;
// Array of CHARACTER_MAXIMUM_LENGTH for each affected field.
$maxFieldLengths = array();

$databaseName = $config->getSetting('database')['database'];

// FIRST loop just reporting all potential problematic fields
foreach($instrumentNames as $instrumentName) {
    printOut("Checking $instrumentName");

    //default value for table name
    $tableName=$instrumentName;

    $instrumentCIDs = $DB->pselectCol(
        "SELECT CommentID FROM flag WHERE Test_name=:tn",
        array("tn" => $instrumentName)
    );

    $instrumentData=array();
    if ($useObjects) {
        try {
            $instrument = \NDB_BVL_Instrument::factory($instrumentName);
        } catch (Exception $e) {
            printError(
                "There was an error instantiating instrument $instrumentName.
            This instrument will be skipped."
            );
            printError($e->getMessage());
            continue;
        }
        foreach ($instrumentCIDs as $cid) {
            $instrumentInstance = \NDB_BVL_Instrument::factory($instrumentName, $cid);
            $instrumentCandData = $instrumentInstance->getInstanceData();

            // instrument name and table name might differ
            $tableName = $instrumentInstance->table;
            $instrumentData[$cid] = $instrumentCandData;
        }
    } else if ($useDatabase) {
        //Check if table by that name exists
        if(!$DB->tableExists($instrumentName)) {
            printError("No table by the name `$instrumentName` was found in the
            database. This instrument will be skipped");
        };
        $instrumentData = $DB->pselectWithIndexKey(
            "SELECT * FROM $instrumentName",
            array(),
            "CommentID"
        );
    }
    // Go through all fields and identify which have any escaped characters
    foreach ($instrumentData as $cid => $instrumentCandData) {
        foreach ($instrumentCandData as $field => $value) {
            // regex detecting any escaped character in the database
            if (!empty($value) && preg_match('/&(amp;)+(gt;|lt;|quot;|amp;)/', $value)) {
                $escapedEntries[$tableName][$cid][$field] = $value;
                $escapedFields[$tableName][] = $field;
                $errorsDetected = true;
            }
        }
    }
}

//SECOND loop, depending on flags, report or fix values.
if ($errorsDetected) {
    foreach ($escapedFields as $tableName => $fieldsArray) {
        $fieldsList = "'" . implode($fieldsArray, "','") . "'";

        $maxFieldLengths[$tableName] = $DB->pselectWithIndexKey(
            "SELECT TABLE_NAME, COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
			FROM INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_SCHEMA=:dbn AND TABLE_NAME=:tbl AND COLUMN_NAME IN ($fieldsList)",
            array('dbn'=>$databaseName,'tbl' => $tableName),
            'COLUMN_NAME'
        );
    }

    // Start comparing the value length of the escaped entry to the character maximum for that field
    // In order to begin identifying cases of truncation
    foreach ($escapedEntries as $tableName => $rows) {
        foreach ($rows as $cid => $entries) {
            foreach ($entries as $field => $value) {
                if (strlen($value) == $maxFieldLengths[$tableName][$field]['CHARACTER_MAXIMUM_LENGTH']) {
                    $confirmedTruncations[$tableName][$cid][$field] = $value;
                }
            }
        }
    }

    if(!empty($escapedEntries)) {
        printOut(
            "Below is a list of all entries in the database instruemnts which " .
            "contain escaped characters"
        );
        print_r($escapedEntries);
        print_r("\n\n");
    }
    if (!empty($confirmedTruncations)) {
        printOut(
            "Below is the list of truncations automatically detected. This " .
            "list might not be exhaustive, truncation can occur without being " .
            "automatically detected by this script."
        );
        print_r($confirmedTruncations);
    }
} else {
    printOut("No errors have been detected. End !");
}

fclose($logfp);


/*
 * Prints to log file
 */
function logMessage($message)
{
    global $logfp;
    if (!$logfp) {
        //The log file could not be instantiated
        //use print instead
        print_r($message);
    }
    $now_string = strftime("%Y-%m-%d %H:%M:%S");
    fwrite($logfp, "[$now_string] $message\n");

}

/*
 * Prints to STDERR
 */
function printError($message)
{
    logMessage($message);
    fwrite(STDERR, "$message \n");
}

/*
 * Prints to STDOUT
 */
function printOut($message)
{
    logMessage($message);
    print_r("$message\n");
}

function showHelp()
{
    echo "\n\n*** Fix Double Escaped Fields ***\n\n";

    echo "Usage:
    instrument_double_escape_report.php [help | -h]  -> displays this message
    instrument_double_escape_report.php use-database -> Runs the reporter using only the database instrument names and tables
    instrument_double_escape_report.php use-objects  -> Runs the reporter using the database and instantiating Instrument objects.

    Note: in the event where use-objects fails, try use-database.
    \n\n";

    die();
}

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
 */

require_once __DIR__."/../generic_includes.php";

// LOGGING
$dir = __DIR__ . "/../logs/";
if (!is_dir($dir)) {
    mkdir($dir);
}
$date    = strftime("%Y-%m-%d_%H:%M");
$logPath = "$dir/instrument_HTML_escape_repair_$date.log";
$logfp   = fopen($logPath, 'a');

if (!$logfp) {
    printError(
        "No logs can be generated, path:$logPath ".
        "does not exist or can not be written to.\n"
    );
}
//PARSE ARGUMENTS
$actions = [
    'use-database',
    'use-objects',
];

if (!isset($argv[1])
    || $argv[1] === 'help'
    || in_array('-h', $argv, true)
    || !in_array($argv[1], $actions, true)
    || ($argc === 3 && $argv[2] !== "repair")
    || $argc > 3
) {
    showHelp();
}

// Flag enabling/disabling repair mode
$repair = false;
if (isset($argv[2]) && $argv[2] === 'repair') {
    $repair = true;
}

// Flag targeting use or database only without instantiation of Instrument objects
$useDatabase = false;
if (isset($argv[1]) && $argv[1] === 'use-database') {
    $useDatabase =true;
}

// Flag targeting use of Instrument objects
$useObjects = false;
if (isset($argv[1]) && $argv[1] === 'use-objects') {
    $useObjects =true;
}

$loris = new \LORIS\LorisInstance(
    $DB,
    $config,
    [
        __DIR__ . "/../../project/modules",
        __DIR__ . "/../../modules/",
    ]
);

// DEFINE VARIABLES
// All instruments looked at
$instrumentNames = $DB->pselectCol("SELECT Test_name FROM test_names", []);
// Array of all fields containing any escaped characters
$escapedEntries = [];
// Array of database tables and columns containing escaped characters.
$escapedFields = [];
// Boolean flag for identify non-impacted databases and terminating.
$escapeDetected = false;

$databaseName = $config->getSetting('database')['database'];

// FIRST loop just reporting all potential problematic fields
foreach ($instrumentNames as $instrumentName) {
    printOut("Checking $instrumentName");

    $instrumentCIDs = $DB->pselectCol(
        "SELECT CommentID FROM flag WHERE Test_name=:tn",
        ["tn" => $instrumentName]
    );

    $instrumentData =[];
    if ($useObjects) {
        try {
            $instrument = \NDB_BVL_Instrument::factory($loris, $instrumentName);
        } catch (Exception $e) {
            printError(
                "There was an error instantiating instrument $instrumentName.
            This instrument will be skipped."
            );
            printError($e->getMessage());
            continue;
        }
        foreach ($instrumentCIDs as $cid) {
            $instrumentInstance = \NDB_BVL_Instrument::factory(
                $loris,
                $instrumentName,
                $cid
            );
            $instrumentCandData = $instrumentInstance->getInstanceData();

            $instrumentData[$cid] = $instrumentCandData;
        }
    } else if ($useDatabase) {
        //Check if table by that name exists
        if (!$DB->tableExists($instrumentName)) {
            printError(
                "No table by the name `$instrumentName` was found in the
            database. This instrument will be skipped"
            );
        };
        $instrumentData = $DB->pselectWithIndexKey(
            "SELECT * FROM $instrumentName",
            [],
            "CommentID"
        );
    }
    // Go through all fields and identify which have any escaped characters
    foreach ($instrumentData as $cid => $instrumentCandData) {
        foreach ($instrumentCandData as $field => $value) {
            // regex detecting any escaped character in the database
            if (!empty($value)
                && preg_match('/&(amp;)*(gt;|lt;|quot;|amp;)/', $value)
            ) {
                $escapedEntries[$instrumentName][$cid][$field] = $value;
                $escapedFields[$instrumentName][] = $field;
                $escapeDetected = true;
            }
        }
    }
}

//SECOND loop, depending on flags, report or fix values.
if ($escapeDetected && !empty($escapedEntries)) {
    printOut(
        "Below is a list of all entries in the database instruments which " .
        "contain escaped characters"
    );
    printOut($escapedEntries);
    printOut("\n\n");
} else {
    printOut("No errors have been detected. End !");
}

// Check if repair mode enabled and attempt to fix data
if ($repair) {
    foreach ($escapedEntries as $instrumentName=>$CIDs) {
        foreach ($CIDs as $cid=>$fields) {

            //preg_replace will replace each escape type with it's couterpart
            $newValues = preg_replace(
                [
                    '/&(amp;)*(gt;)/',
                    '/&(amp;)*(lt;)/',
                    '/&(amp;)*(quot;)/',
                    '/&(amp;)*(amp;)/'
                ],
                ['>','<','"','&'],
                $fields
            );
            printOut("Fixing Data in $instrumentName instrument for CommentID:$cid");
            if ($useObjects) {
                $instrumentInstance = \NDB_BVL_Instrument::factory(
                    $loris,
                    $instrumentName,
                    $cid
                );
                $instrumentInstance->_saveValues($newValues);
            } else if ($useDatabase) {
                // LOGIC BELOW IS AN EXACT COPY OF THE NDB_BVL_INSTRUMENT
                // CLASS SAVING LOGIC
                $DB->unsafeupdate(
                    $instrumentName,
                    $newValues,
                    ["CommentID"=>$cid]
                );
                // Extract the old data and merge it with what was submitted so
                // that we don't overwrite data from other pages.
                $oldData = $DB->pselectOne(
                    "SELECT Data FROM flag WHERE CommentID=:cid",
                    ['cid' => $cid]
                );

                if (!empty($oldData) && $oldData !== "null") {
                    $oldData = json_decode($oldData, true);
                } else {
                    $oldData = [];
                }
                $newData = array_merge($oldData ?? [], $newValues);

                // Save the JSON to the flag.Data column.
                //
                // json_encode ensures that this is safe. If we use the safe wrapper,
                // HTML encoding the quotation marks will make it invalid JSON.
                $DB->unsafeUpdate(
                    "flag",
                    ["Data" => json_encode($newData)],
                    ['CommentID' => $cid]
                );

            }
            //log modified values
            printOut("Old Values:");
            printOut($fields);
            printOut("New Values:");
            printOut($newValues);
        }
    }
}

fclose($logfp);


/**
 * Prints to log file
 *
 * @param $message Message
 *
 * @return void
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
    fwrite($logfp, "[$now_string] ".print_r($message, true)."\n");

}

/**
 * Prints to STDERR
 *
 * @param $message Message
 *
 * @return void
 */
function printError($message)
{
    logMessage($message);
    fwrite(STDERR, "$message \n");
}

/**
 * Prints to STDOUT
 *
 * @param $message Message
 *
 * @return void
 */
function printOut($message)
{
    logMessage($message);
    print_r($message);
    print_r("\n");
}

/**
 * Show help
 *
 * @return void
 */
function showHelp()
{
    echo "\n\n*** Fix Double Escaped Fields ***\n\n";

    echo "Usage:
    instrument_HTML_escape_repair.php [help | -h]  -> ".
        "displays this message
    instrument_HTML_escape_repair.php use-database -> ".
        "Runs in reporting mode using only the database instrument names and tables
    instrument_HTML_escape_repair.php use-objects  -> ".
        "Runs in reporting mode using the database and ".
        "instantiating Instrument objects.
    instrument_HTML_escape_repair.php [use-database | use-objects] repair -> ".
        "Runs in repair mode and uses the selected method ".
        "(database or Instrument objects) to do it

    Note: in the event where use-objects fails, try use-database.
    \n\n";

    die();
}

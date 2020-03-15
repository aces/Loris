<?php
/**
 * This tool scores any registered instrument that was built using the
 * NDB_BVL_Instrument class and that has a working score() method.
 * The command line arguments need to contain a valid test_name, a 'all' or 'one'
 * option, a CandID and a SessionID.
 *
 * The 'all' option scores all existing records of an instrument if and only if
 *  - They belong to an active timepoint
 *  - The data-entry status of the timepoint is set to `complete`
 *  - The administration of the timepoint is NOT `none`
 *
 * Note: This tool can also be used to debug the scoring algorithms for development.
 *
 * Limitation: This tool does not reset or nullify the score of an instrument
 * which was previously scored but no longer meets the criteria above (i.e. if the
 * administration was changed from `all` to `none`, the score will not be removed).
 *
 * @package behavioural
 */

require_once __DIR__."/../generic_includes.php";

// LOGGING
$dir = __DIR__ . "/../logs/";
if (!is_dir($dir)) {
    mkdir($dir);
}
$today   = getdate();
$date    = strftime("%Y-%m-%d_%H:%M");
$logPath = "$dir/fix_double_escaped_fields_$date.log";
$logfp   = fopen($logPath, 'a');

if (!$logfp) {
    printError(
        "No logs can be generated, path:$logPath ".
        "does not exist or can not be written to.\n"
    );
}

if (isset($argv[1]) && $argv[1] === 'help' || in_array('-h', $argv, true)) {
    showHelp();
}
$confirm = false;
if (isset($argv[1]) && $argv[1] === 'confirm') {
    $confirm =true;
}

$instrumentNames      = $DB->pselectCol("SELECT Test_name FROM test_names", array());
$errorsDetected       = false;
$potentialTruncations = array();

// get the list of CommentIDs for valid timepoints
foreach($instrumentNames as $instrumentName) {
    printOut("Checking $instrumentName");
    try{
        $instrument = \NDB_BVL_Instrument::factory($instrumentName);
    } catch (Exception $e) {
        printError(
            "There was an error instantiating instrument $instrumentName.
            This instrument will be skipped."
        );
        continue;
    }
    $instrumentCIDs = $DB->pselectCol(
        "SELECT CommentID FROM flag WHERE Test_name=:tn",
        array("tn" => $instrumentName)
    );
    foreach ($instrumentCIDs as $cid) {
        $instrumentInstance = \NDB_BVL_Instrument::factory($instrumentName, $cid);

        $instrumentData = \NDB_BVL_Instrument::loadInstanceData(
            $instrumentInstance
        );
        $set            = array();
        foreach ($instrumentData as $field=>$value){
            // Each of the expressions below uniquely match each of the targeted
            // characters indicated in the comment above the function.

            // < : match any substring starting with `&`
            // followed by 1 or more `amp;` and ending with `lt;`
            $newValue = preg_replace('/&(amp;)+lt;/', '<', $value);
            // > : match any substring starting with `&`
            // followed by 1 or more `amp;` and ending with `gt;`
            $newValue = preg_replace('/&(amp;)+gt;/', '>', $newValue);
            // " : match any substring starting with `&`
            // followed by 1 or more `amp;` and ending with `quot;`
            $newValue = preg_replace('/&(amp;)+quot;/', '"', $newValue);
            // & : match any substring starting with `&`
            // followed by 2 or more `amp;` (because 1 is normal in the database
            // since it is the escaped form of `&`) and
            // NOT ending with `lt;` or `gt;` or `quot;` or `amp;`
            // (the last one is to ensure we don't match subsequences from the
            // case above).
            $newValue = preg_replace('/&(amp;){2,}(?!(lt;|gt;|quot;|amp;))/', '&', $newValue);


            if (preg_match('/&(amp;)*[a|g|l|q](m|t|u)?(p|o|;)?(t|;)?(;)?$/', $value)) {
                // This checks for signs of truncation, it matches any string that
                // ENDS with either a complete or incomplete escaped expression.
                // THIS DOES NOT GUARANTEE that other fields are not truncated as
                // truncation could occur even if field does not end with the escaped
                // characters.
                printError("WARNING: CommentID: $cid - Value at $field shows sign of truncation !");
                $potentialTruncations[$instrumentName][$cid][$field] = $value;
            }

            if (!empty($value) && !empty($newValue) && $newValue != $value) {
                printOut(
                    "CommentID: $cid - Value at $field will be modified. ".
                    "\n\tCurrent Value: $value".
                    "\n\tWill be replaced by: $newValue\n"
                );

                $set[$field]    = $newValue;
                $errorsDetected = true;
            }
        }
        if (!empty($set) && $confirm) {
            $instrumentInstance->_save($set);
        }
    }
}
if(!empty($potentialTruncations)) {
    printOut(
        "This is the list of potential truncations automatically detected. this list
is not exhaustive, truncation can occur without being automatically detected 
by this script."
    );
    print_r($potentialTruncations);
}
if (!$confirm && $errorsDetected) {
    printOut("\nRun tool again with `confirm` argument to apply changes");
} else {
    printOut("End");
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
    fix_double_escape.php [help | -h]   -> displays this message
    fix_double_escape.php               -> runs tool without making any changes
    fix_double_escape.php confirm       -> runs tool and rectifies erroneous data
    \n\n";

    die();
}
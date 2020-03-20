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
//PARSE ARGUMENTS
$actions = array(
            'report',
            'repair',
           );
if (!isset($argv[1]) || $argv[1] === 'help' || in_array('-h', $argv, true) || !in_array($argv[1], $actions, true)) {
    showHelp();
}
$report = false;
if (isset($argv[1]) && $argv[1] === 'report') {
    $report =true;
}
$repair = false;
if (isset($argv[1]) && $argv[1] === 'repair') {
    $repair =true;
}
$useHistory =false;
if (in_array('use-history', $argv, true)) {
    $useHistory =true;
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
// Array of non-truncated data
$untruncatedValues = array();
// Variables used for history table query
$CIDs = array();
$allFields = array();
$allTables = array();

// FIRST loop just reporting all potential problematic fields

foreach($instrumentNames as $instrumentName) {
    printOut("Checking $instrumentName");
    try {
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
	$instrumentData = \NDB_BVL_Instrument::loadInstanceData($instrumentInstance);
	
	// instrument name and table name might differ
	$tableName = $instrumentInstance->table;
        $set            = array();

        // Go through all fields and identify which have any escaped characters
        foreach ($instrumentData as $field => $value) {
            // regex detecting any escaped character in the database
            if (preg_match('/&(amp;)+(gt;|lt;|quot;|amp;)/', $value)) {
                $escapedEntries[$tableName][$cid][$field] = $value;
		$escapedFields[$tableName][] = $field;
                $errorsDetected = true;
            }
        }
    }
}

// A list of all escaped characters has been built. Forloop through and start fixing.

//SECOND loop, depending on flags, report or fix values.
if ($errorsDetected) {
	foreach ($escapedFields as $tableName => $fieldsArray) {
		$fieldsList = "'" . implode($fieldsArray, "','") . "'";

		$maxFieldLengths[$tableName] = $DB->pselectWithIndexKey(
			"SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
			FROM INFORMATION_SCHEMA.COLUMNS 
			WHERE TABLE_NAME=:tbl AND COLUMN_NAME IN ($fieldsList)",
			array('tbl' => $tableName),
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
					$CIDs[] = $cid;
					$allFields[] = $field;
					$allTables[] = $tableName;
				}
			}
		}
	}

if ($useHistory) {
	// Construct history query
	$listCIDs = "'" . implode($CIDs, "','") . "'";
	$listFields = "'" . implode($allFields, "','") . "'";
	$listTables = "'" . implode($allTables, "','") . "'";
	$query = "SELECT primaryVals as CommentID, col, tbl, new, changeDate
		FROM history 
		WHERE primaryCols='CommentID' AND
		primaryVals IN ($listCIDs) AND
		tbl IN ($listTables) AND
		col IN ($listFields)";	
	
	$result = $DB->pselect(
		$query, 
		[]
	);

	// Reverse the array obtained from history data so that it is in anti-chronological order
	// Does not preserve keys, assuming that the keys are indexes & not relevant info
	$historyData = array_reverse($result, false);
	// Go through history data starting with most recent changes
	foreach($historyData as $key => $data) {
    		$tbl = $data['tbl'];
    		$cid = $data['CommentID'];
    		$field = $data['col'];
   		$val = $data['new'];
    		
		// Check if in confirmed truncations list & length of field is less than max field length
    		// & no value has been assigned to untruncatedValues yet
    		// I.E. if this is the most recent value with character length < max
    		if (array_key_exists($field, $confirmedTruncations[$tbl][$cid]) &&
        		strlen($val) < $maxFieldLengths[$tbl][$field] &&
        		!isset($untruncatedValues[$tbl][$cid][$field])
		) {
        		$untruncatedValues[$tbl][$cid][$field] = $val;
    		}
	}	
    }

    if ($report) {
        printOut(
            "Below is a list of all entries in the database instruemnts which ".
            "contain escaped characters"
        );
        print_r($escapedEntries);
        print_r("\n\n");
        printOut(
            "Below is the list of truncations automatically detected. This ".
            "list might not be exhaustive, truncation can occur without being ".
            "automatically detected by this script."
        );
        print_r($confirmedTruncations);
        printOut(
            "Below are the suggested repairs automatically generated from ".
            "latest values in the fields."
        );
	print_r($untruncatedValues);

        if ($useHistory) {
            printOut(
                "Due to possible truncation of data, some suggestions are ".
                "derived from the history table of the database."
            );
        }
    } elseif ($repair) {
        printOut("Attempting repairs");
    }



    foreach ($escapedEntries as $tableName=>$cids) {
        printOut("Opening $tableName");
        foreach ($cids as $cid => $fields) {
            try {
                $instrumentInstance = \NDB_BVL_Instrument::factory($tableName, $cid);
            } catch (Exception $e) {
                printError(
                    "There was an error instantiating instrument $tableName for " .
                    "$cid.This instrument will be skipped."
                );
                continue;
            }
            foreach ($fields as $field => $value) {
		if ($useHistory &&
        		array_key_exists($field, $confirmedTruncations[$tableName][$cid]) &&
        		array_key_exists($field, $untruncatedValues[$tableName][$cid])
		) {
			printOut("CommentID:$cid - Replacing a truncated value by a non-truncated history entry" .
			 	"\n\tTruncated Value: $value " .
				"\n\tWill be replaced by:  {$untruncatedValues[$instrumentName][$cid][$field]} \n"
			);
			$value = $untruncatedValues[$instrumentName][$cid][$field];
                }

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


                if (!empty($value) && !empty($newValue) && $newValue != $value) {
                    printOut(
                        "CommentID: $cid - Value at $field will be modified. " .
                        "\n\tCurrent Value: $value" .
                        "\n\tWill be replaced by: $newValue\n"
                    );
                    $set[$field] = $newValue;
                }
            }
            if (!empty($set) && $repair) {
                $instrumentInstance->_save($set);
            }
        }
    }

    if (!$repair) {
        printOut("\nRun tool again with `repair` argument to apply changes");
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
    fix_double_escape.php [help | -h]                -> displays this message
    fix_double_escape.php report [use-history]       -> runs tool and reports erroneous data and potential fixes 
                                                        without making any changes. (with use-history flag, proposes 
                                                        data repairs by looking through the instrument's historical 
                                                        entries in the LORIS history table)
    fix_double_escape.php repair [use-history]       -> runs tool and rectifies erroneous data when possible (with 
                                                        use-history flag, repairs data by looking through the 
                                                        instrument's historical entries in the LORIS history table)
                                                        
    Note: Using the `use-history` flag will considerably slow down the script.
    \n\n";

    die();
}

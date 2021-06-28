<?php
/**
 * RUN-TIME WARNING FOR PROJECTS: It can take up to a whole day to run this script.
 * It took 14 hours to run the script on the CCNA DB during testing.
 *
 * This script is intended for a one-time use only to restore the value of the
 * `UserID` column of instrument tables and the `UserID` key of the instrument
 * JSON `Data` in the flag table.
 *
 * This tool queries data from the `history` table and meaningfully imports
 * data from its `userID` column back into the instrument and `flag` tables.
 *
 * Example use:
 * $ php SaveUserIDToInstrumentData.php [confirm]

 * PHP Version 7
 *
 * @category Tools
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @licence  LORIS License
 * @link     https://www.github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$confirm = false;
if (isset($argv[1]) && $argv[1] === 'confirm') {
    $confirm = true;
}

echo "\n\nQuerying data...\n\n";

// Get history DB
$DBInfo = $config->getSetting('database');
$hDB    = isset($DBInfo['historydb']) ? $DBInfo['historydb'] : $DBInfo['database'];

$result_count = 1;

// Query entries in the history table for the latest change
// made to the flag table, for every CommentID.
$history = $DB->pselect(
    "SELECT f.Test_name, f.CommentID, h1.userID
      FROM flag f
      JOIN " . $DB->escape($hDB) . ".history h1 on (f.CommentID=h1.primaryVals)
      JOIN
        (
          SELECT primaryVals, MAX(changeDate) as changeDate
            FROM " . $DB->escape($hDB) . ".history
            WHERE userID <> 'unknown'
              AND type='U'
              AND NOT (
                col='Data_entry' AND old IS NULL
              )
            GROUP BY primaryVals
        ) h2 USING (primaryVals, changeDate)
            GROUP BY CommentID, h1.userID",
    []
);
// Loop and index results from history by testname
$idxHist = [];
foreach ($history as $entry) {
    $idxHist[$entry['Test_name']][] = $entry;
}

foreach (\Utility::getAllInstruments() as $testname => $fullName) {
    // Instantiate instrument object to get information
    try {
        $instrument = \NDB_BVL_Instrument::factory($testname, '', '');
    } catch (Exception $e) {
        echo "$testname does not seem to be a valid instrument.\n";
        continue;
    }

    // Check if instrument saves data in JSON format i.e. no-SQL table
    $JSONData = $instrument->usesJSONData();
    $table    = null;
    if ($JSONData === false) {
        $table = $instrument->table;
        if (!$table) {
            echo "\n\nERROR: The table name for instrument ".
                "$testname cannot be found.\n";
            continue;
        } else if (!$DB->tableExists($table)) {
            echo "Table $table for instrument $testname does not ".
                "exist in the Database.\n";
            continue;
        } else if (!$DB->columnExists($table, 'UserID')) {
            echo "Column 'UserID' does not exist in the $table table.\n";
            continue;
        }
    }

    if (empty($idxHist[$testname])) {
        echo "\n\nThere is no data to import into $testname.\n";
        continue;
    } else {
        echo "\n\nThe following data can be imported into $testname:\n\n";
        foreach ($idxHist[$testname] as $row) {
            $commentID = $row['CommentID'];
            $userID    = $row['userID'];
            echo "\nResult $result_count: $commentID userID: $userID\n";
            $result_count++;
        }
    }

    // Update the instrument table
    if ($confirm) {
        echo "\nImporting data into $testname...\n\n";

        // Instantiate instrument at the session level in order to
        // use _save() function
        foreach ($idxHist[$testname] as $row) {
            $commentID = $row['CommentID'];
            $userID    = $row['userID'];

            try {
                $sessionInst = \NDB_BVL_Instrument::factory(
                    $testname,
                    $commentID,
                    ''
                );
            } catch (Exception $e) {
                echo "\t$testname instrument row with CommentID: $commentID was ".
                    " Ignored for one of the following reasons:\n".
                    "  - The candidate is inactive.\n".
                    "  - The session is inactive.\n\n";
                continue;
            }

            if (!$sessionInst) {
                // instrument does not exist
                echo "\t$testname for CommentID: $CommentID could ".
                    "not be instantiated.\n";
                continue;
            }

            // Save userID
            echo "\tSaving userID $userID for CommentID: $commentID\n\n";
            $sessionInst->_save(
                [
                    'UserID' => $userID
                ]
            );
        }
    }
}

if (!$confirm) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
         "perform the changes.\n";
}

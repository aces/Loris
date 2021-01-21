<?php
/**
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

echo "\n\nQuerying data...\n";

$db = \NDB_Factory::singleton()->database();

$result_count = 1;
foreach(\Utility::getAllInstruments() as $table => $name) {
    // Query entries in the history table for the latest change
    // made to the Data column of the flag table, for every CommentID.
    $history = $db->pselect(
        "SELECT h1.primaryVals AS CommentID, h1.userID, JSON_MERGE_PATCH(
            f.Data, CONCAT('{\"UserID\": \"', h1.userID, '\"}')
         ) AS new_Data
            FROM $table
            LEFT JOIN flag f USING (CommentID)
            LEFT JOIN history h1 ON (f.CommentID=h1.primaryVals)
            LEFT JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE tbl = 'flag'
                        AND col = 'Data'
                        AND userID <> 'unknown'    
                    GROUP BY primaryVals
            ) h2 USING (primaryVals)
                WHERE h1.tbl = 'flag'
                    AND h1.col = 'Data'
                    AND h1.userID <> 'unknown'
                    AND h1.changeDate = h2.max_date
                    AND $table.UserID IS NULL",
            array()
        );
    if (empty($history)) {
        echo "\n\nThere is no data to import into $table.\n";
        continue;
    } else {
        echo "\n\nThe following data can be imported into $table:\n";
        foreach ($history as $row) {
            echo "\n\nResult $result_count:\n";
            print_r($row);
            $result_count++;
        }
    }

    // Update the intsrument table
    if ($confirm) {
        echo "\n\nImporting data into $table...\n";
        $table_query = "UPDATE $table
            LEFT JOIN flag f USING (CommentID)
            LEFT JOIN history h1 ON (f.CommentID=h1.primaryVals)
            LEFT JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE tbl = 'flag'
                        AND col = 'Data'
                        AND userID <> 'unknown'    
                    GROUP BY primaryVals
            ) h2 USING (primaryVals)
            SET $table.UserID = h1.userID
                WHERE h1.tbl = 'flag'
                    AND h1.col = 'Data'
                    AND h1.userID <> 'unknown'
                    AND h1.changeDate = h2.max_date
                    AND $table.UserID IS NULL";

        $flag_query = "UPDATE flag f
            LEFT JOIN $table USING (CommentID)
            LEFT JOIN history h1 ON (f.CommentID=h1.primaryVals)
            LEFT JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE tbl = 'flag'
                        AND col = 'Data'
                        AND userID <> 'unknown'    
                    GROUP BY primaryVals
            ) h2 USING (primaryVals)
            SET f.Data = JSON_MERGE_PATCH(
                f.Data, CONCAT('{\"UserID\": \"', h1.userID, '\"}')
            )
                WHERE h1.tbl = 'flag'
                    AND h1.col = 'Data'
                    AND h1.userID <> 'unknown'
                    AND h1.changeDate = h2.max_date
                    AND $table.UserID IS NULL";

        $stmt_table = $db->prepare($table_query);
        $stmt_flag  = $db->prepare($flag_query);
        try {
            $db->beginTransaction();
            $stmt_table->execute();
            $stmt_flag->execute();
            $db->commit();
            echo "\n\nData import done for $table.\n";
        } catch (Exception $e) {
            $db->rollBack();
            $print("$table was not updated.");
            $print($e->getMessage());
        }
    }
}

if (!$confirm) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
         "perform the changes.\n";
}

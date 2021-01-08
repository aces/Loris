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
$db      = \NDB_Factory::singleton()->database();
// Query CommentIDs with DECS 'Complete', and
// userID for latest changes made to the instrument data
$history = $db->pselect(
        "SELECT h1.tbl, h1.primaryVals AS CommentID, h1.userID
            FROM history h1
            INNER JOIN
            (
                SELECT primaryVals, MAX(changeDate) AS max_date
                    FROM history
                    WHERE primaryVals IN (
                        SELECT primaryVals
                        FROM history
                        WHERE col = 'Data_entry_completion_status'
                            AND primaryCols = 'CommentID'
                            AND new = 'Complete'
                    )
                    GROUP BY primaryVals
            ) h2
                ON h1.primaryVals = h2.primaryVals
                    AND h1.changeDate = h2.max_date
                WHERE userID <> 'unknown'
                    AND tbl <> 'flag'
                    AND col <> 'CommentID'
                GROUP BY h1.primaryVals, h1.changeDate, h1.userID",
        array()
);
if (empty($history)) {
    echo "\n\nThere is no data to import.\n";
    die();
}
echo "\n\nThe following data can be imported into the instrument tables:\n";
foreach ($history as $index => $row) {
    $result = $index + 1;
    echo "\n\nResult $result:\n";
    print_r($row);

    $table     = $row['tbl'];
    $commentID = $row['CommentID'];
    $userID    = $row['userID'];

    // Extract old data from flag so we can update it with merge so that we
    // don't overwrite it
    $oldData = $db->pselectOne(
        "SELECT Data FROM flag WHERE CommentID=:cid",
        array('cid' => $commentID)
    );
    echo "\n\nOld Data: \n";
    print_r($oldData);

    // (The PDO driver seems to return null as "null" for JSON column types)
    if (!empty($oldData) && $oldData !== "null") {
        $oldData = json_decode($oldData, true);
    } else {
        $oldData = array();
    }
    $newData = array_merge(
        $oldData ?? array(),
        array('UserID' => $userID)
    ); 
    echo "\n\nNew Data: \n";
    print_r(json_encode($newData));

    if ($confirm) {
        echo "\n\nImporting data into respective instrument tables and commentID flag entries...\n";
        // Update instrument table
        $db->update(
            $table,
            array('UserID' => $userID),
            array('CommentID' => $commentID)
        );

        // Save the JSON to the flag.Data column.
        //
        // json_encode ensures that this is safe. If we use the safe wrapper,
        // HTML encoding the quotation marks will make it invalid JSON.
        $db->unsafeUpdate(
            "flag",
            array("Data" => json_encode($newData)),
            array('CommentID' => $commentID)
        );
        echo "\n\nDone. $userID saved as UserID in $table and flag tables for CommentID $commentID.\n";
    }
}

if (!$confirm) {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
         "perform the changes.\n";
}

<?php
/**
 * Migrate an existing instrument from having its data stored in
 * an SQL table to having its data stored in the flag.Data column
 * in JSON format.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . "/generic_includes.php";

if ($argc < 2) {
    fwrite(STDERR, "Usage: $argv[0] instrumentname\n");
    exit(1);
}
$testname = $argv[1];

$commentIDs = $DB->pselectCol("SELECT CommentID FROM flag WHERE Test_name=:instrument",
    array("instrument" => $testname)
);

foreach ($commentIDs as $commentID) {
    $inst = NDB_BVL_Instrument::factory($testname, $commentID, "", true);

    // query taken from loadInstanceData in the case where jsonData is false.
    // We can't just temporarily switch the flag because it's protected and this
    // script is run outside the class.
    $values = $DB->pselectRow(
        "SELECT * FROM $inst->table WHERE CommentID=:CID",
                array('CID' => $inst->getCommentID())
    );

    // Query taken from _save
    //
    // We do this instead of calling _save so that this will work regardless
    // of the value of $inst->jsonData
    //
    // json_encode ensures that this is safe. If we use the safe wrapper,
    // HTML encoding the quotation marks will make it invalid JSON.
    $DB->unsafeUpdate(
            "flag",
            array("Data" => json_encode($values)),
            array('CommentID' => $inst->getCommentID())
        );

}

<?php

require_once __DIR__ . "/../vendor/autoload.php";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$config = NDB_Config::singleton();
$db = Database::singleton();

$rows = $db->pselect("SELECT Test_name, CommentID FROM flag WHERE Data IS NULL ORDER BY Test_name", array());

foreach ($rows as $row) {
    $inst = NDB_BVL_Instrument::factory($row['Test_name'], $row['CommentID'], "");
    $data = NDB_BVL_Instrument::loadInstanceData($inst);
    // Unset things that are on the flag table
    unset($data['CommentID'], $data['UserID'], $data['Testdate']);
    // FIXME: Figure out what to do with this. Is should be moved to the flag table?
    //unset($data['Data_entry_completion_status']);
    // FIXME: It would also make sense to move Examiner to the flag table, since every instrument
    //        has it and that way it could include a foreign key (or be null for instruments that don't have it).
    print $row['Test_name'] . " " . $row['CommentID'] . "\n";
    $db->unsafeUpdate(
        "flag",
        array("Data" => json_encode($data)),
        array('CommentID' => $row['CommentID'])
    );
}


<?php
/**
 * This script is written for a one time use only to migrate the
 * 'Data_entry_completion_status' field from the instrument table /
 * Data column of the flag table to it's own column in the flag table
 * called "Required_elements_completed".
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @licence  Loris license
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

echo "\n*** Set Data_entry_completion_satus in flag table***

This script is to be run for one time use only to migrate and rename the 
Data_entry_completion_status field. 

If the instrument has a valid table in the database, Data_entry_completion_status 
will be taken for back-population from the instrument table. Otherwise, it will be 
taken from the data column of the flag table. An update on the flag table will set 
the Required_elements_completed column to the Data_entry_completion_status. 

After running this script, run Remove_Data_entry_completion_status_instr_column.php 
to generate a DROP COLUMN patch to remove the old column from instrument tables.
\n";
$DB = \Database::singleton();

$flagData = $DB->pselectWithIndexKey(
    "SELECT Data, CommentID, Test_name 
                FROM flag",
    [],
    'CommentID'
);

foreach ($flagData as $cmid => $data) {
    print_r($cmid."\n");

    $instrument = NDB_BVL_Instrument::factory(
        $data['Test_name'],
        $cmid,
        ''
    );
    $dataArray = $instrument->getInstanceData();
    $desc = $data['Data_entry_completion_status'];

<<<<<<< HEAD
    // change value from complete / incomplete to Y / N
    if ($decs === 'Complete') {
        $dataToUpdate['Required_elements_completed'] = 'Y';
    } 

// $instrument->save() is not used here in order to explicitly REMOVE the 
// Data_entry_completion_status field from the JSON string saved in the Data 
// column in flag.
    if (isset($dataArray['Data_entry_completion_status'])) {
        unset($dataArray['Data_entry_completion_status']);
        $dataToUpdate['Data'] = json_encode($dataArray);
    }

    if (!empty($dataToUpdate)) {
        $DB->update(
            'flag',
            $dataToUpdate,
            ['CommentID' => $cmid]
        );
    }
}

<?php
/**
 * This script is written for a one time use only to migrate the
 * 'Data_entry_completion_status' field from the instrument table /
 * Data column of the flag table to it's own column in the flag table.
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @licence Loris license
 * @link https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$db     = \Database::singleton();

$flagData = $db->pselectWithIndexKey(
    "SELECT Data, CommentID, Test_name 
                FROM flag",
    [],
    'CommentID'
);

foreach($flagData as $cmid => $data) {
    print_r($cmid."\n");

    $instrument = NDB_BVL_Instrument::factory(
        $data['Test_name'],
        $cmid,
        ''
    );

    $dataArray = json_decode($data['Data'], true);

    $dataToUpdate = [];

    if ($instrument->usesJSONData() === true) {
        // If json instrument, take value from flag data
        if(isset($dataArray['Data_entry_completion_status'])) {
            $dataToUpdate['Data_entry_completion_status']
                = $dataArray['Data_entry_completion_status'];
        }
    } else {
        // Otherwise, take value from instrument table
        $instrData = $instrument->getInstanceData();

        if (isset($instrData['Data_entry_completion_status'])) {
            $dataToUpdate['Data_entry_completion_status']
                = $instrData['Data_entry_completion_status'];
        }
    }

    if(isset($dataArray['Data_entry_completion_status'])) {
        unset($dataArray['Data_entry_completion_status']);
        $dataToUpdate['Data'] = json_encode($dataArray);
    }

    if (!empty($dataToUpdate)) {
        $db->update(
            'flag',
            $dataToUpdate,
            ['CommentID' => $cmid]
        );
    }
}

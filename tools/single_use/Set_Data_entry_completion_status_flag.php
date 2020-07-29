
<?php
/**
 * This script is written for a one time use only to clean up existing data in the 'candidate_consent_rel' table to conform to the new front-end validation for entering consent.
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

$query       = "SELECT Data, CommentID FROM flag WHERE Data IS NOT NULL";
$flagData = $db->pselectWithIndexKey($query, array(), 'CommentID');
$dataToUpdate = array();

foreach($flagData as $cmid => $data) {
    $dataArray = json_decode($data['Data'], true);

    if(isset($dataArray['Data_entry_completion_status'])) {
        print_r($dataArray);

        if($dataArray['Data_entry_completion_status'] === 'Complete') {
            $dataToUpdate['Data_entry_completion_status'] = 'Complete';
        }

        unset($dataArray['Data_entry_completion_status']);
        $dataToUpdate['Data'] = $dataArray;


        $db->update(
            'flag',
            $dataToUpdate,
            ['CommentID' => $cmid]
        );
    }
}

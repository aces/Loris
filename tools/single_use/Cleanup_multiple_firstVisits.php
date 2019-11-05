<?php
/**
 * This script is written for a one time use only to clean up existing data in the 'session' table
 * where there are multiple first visits, i.e. VisitNo=1, for a candidate.
 *
 * PHP Version 7
 *
 * @category Main
 * @package Loris
 * @author Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @licence Loris license
 * @link https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$db = \Database::singleton();

// Find CandIDs where there are multiple first visits
$query_candID = "SELECT CandID FROM `session` WHERE VisitNo=1 GROUP BY CandID HAVING COUNT(CandID) > 1";
$candIDs      = $db->pselect($query_candID, array());

if (empty($candIDs)) {
  echo "No multiple first visits.\n";
} else {
    foreach($candIDs as $entry) {
        // Order session IDs by date of visit
        $candID          = $entry['CandID'];
        $query_sessionID = "SELECT ID FROM `session` where CandID=:candID ORDER BY Date_visit";
        $where           = array('candID' => $candID);
        $sessionIDs      = $db->pselect($query_sessionID, $where);

        // Reset visit number in order of date of visit
        $visitNo = 1;
        foreach ($sessionIDs as $result) {
            $sessionID       = $result['ID'];
            $set             = array('VisitNo' => $visitNo);
            $where_sessionID = array('ID' => $sessionID);
            $db->update('session', $set, $where_sessionID);
            $visitNo++;
        }
    }
}
echo "Done.\n";

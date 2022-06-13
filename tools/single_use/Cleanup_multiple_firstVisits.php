<?php
/**
 * This script is written for a one time use only to clean up existing data in the
 * 'session' table where there are multiple first visits, i.e. VisitNo=1,
 * for a candidate.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

$confirm = false;
if (isset($argv[1]) && $argv[1] === "confirm") {
    $confirm = true;
}

$db = \Database::singleton();

// Find CandIDs where there are multiple first visits
$query_candID = "SELECT CandID 
                  FROM `session` 
                  WHERE VisitNo=1 
                  GROUP BY CandID 
                  HAVING COUNT(CandID) > 1";
$candIDs      = $db->pselect($query_candID, []);

if (empty($candIDs)) {
    echo "No multiple first visits.\n";
} else {
    foreach ($candIDs as $entry) {
        // Order session IDs by date of visit
        echo "Multiple first visits detected for CandID $entry[CandID]\n";
        $candID          = $entry['CandID'];
        $query_sessionID = "SELECT ID, VisitNo 
                            FROM `session` 
                            WHERE CandID=:candID 
                            ORDER BY Date_visit";
        $where           = ['candID' => $candID];
        $sessionIDs      = $db->pselect($query_sessionID, $where);

        // Reset visit number in order of date of visit
        $visitNo = 1;
        foreach ($sessionIDs as $result) {
            echo "      Changing visit number: $result[VisitNo] to $visitNo\n";
            $sessionID = $result['ID'];
            $set       = ['VisitNo' => $visitNo];
            $where_sessionID = ['ID' => $sessionID];
            if ($confirm) {
                $db->update('session', $set, $where_sessionID);
            }
            $visitNo++;
        }
    }
}
if ($confirm) {
    echo "Done.\n";
} else {
    echo "\n\nRun this tool again with the argument 'confirm' to ".
        "perform the changes\n\n";
}

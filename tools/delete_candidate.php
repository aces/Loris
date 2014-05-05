<?php

/**
 * This script Deletes all DB table entries for one candidate, given their DCCID.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once "generic_includes.php";
require_once "Candidate.class.inc";
require_once "Utility.class.inc";

/**
 * Deletes all DB table entries for one candidate, given their DCCID.
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */


//define the command line parameters
if (count($argv)!=2) {
    echo "Usage: php delete_candidate DCCID\n";
    echo "Example: php delete_candidate 608858\n";
    die();
} else {
    $DCCID = $argv[1];
}

if ($DB->pselectOne(
    "SELECT COUNT(*) FROM candidate WHERE CandID = :cid",
    array('cid'=>$DCCID)
) ==0
) {
    echo "The Candid : $DCCID Doesn't Exist in the database\n";
    die();
}

//Find candidate...
$candidate = new Candidate();
$candidate->select($DCCID); //find the candidate with the given DCCID

echo "Dropping all DB entries for candidate DCCID: " . $DCCID . "\n";

//find sessions
$sessions = $candidate->getListOfTimePoints();
if (is_null($sessions) || empty($sessions)) {
    echo "There are no coressponding session for Candid : $DCCID \n";
    die();
}

//find the test_names and commentIDs
$query = "SELECT ID, Test_name, CommentID FROM flag WHERE SessionID in (" . 
         implode(" , ", $sessions) . ")";
$instruments = $DB->pselect($query, array()); 

//delete the sessions
$DB->delete("session", array("CandID" => $DCCID));

//delete each instrument table entry
foreach ($instruments as $instrument) {

    //delete the entry from the instrument table

    $DB->delete(
        $instrument['Test_name'], array("CommentID" => $instrument['CommentID'])
    );

    //delete its flag
    $DB->delete("flag", array("ID" => $instrument['ID']));
    
     //delete from conflicts_resolved
    $DB->delete(
        "conflicts_resolved", array("CommentId1" => $instrument['CommentID'])
    );
    $DB->delete(
        "conflicts_resolved", array("CommentId2" => $instrument['CommentID'])
    );
    //delete from conflicts_unresolved
    $DB->delete(
        "conflicts_unresolved", array("CommentId1" => $instrument['CommentID'])
    );
    $DB->delete(
        "conflicts_unresolved", array("CommentId2" => $instrument['CommentID'])
    );
}

//delete from the participant_status table
$DB->delete("participant_status", array("CandID" => $DCCID));

//delete from the participant_status_history table
$DB->delete("participant_status", array("CandID" => $DCCID));

//delete the candidate
$DB->delete("candidate", array("CandID" => $DCCID));

?>
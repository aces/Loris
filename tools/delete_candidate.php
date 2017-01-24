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
require_once __DIR__ . "/../vendor/autoload.php";
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
if (count($argv)!=3) {
    echo "Usage: php delete_candidate DCCID PSCID\n";
    echo "Example: php delete_candidate 608858 SEA0252\n";
    die();
} else {
    $DCCID = $argv[1];
    $PSCID = $argv[2];
}

echo "Dropping all DB entries for candidate DCCID: " . $DCCID . "And PSCID:" .
$PSCID. "\n";

if ($DB->pselectOne(
    "SELECT COUNT(*) FROM candidate WHERE CandID = :cid AND PSCID = :pid ",
    array('cid'=>$DCCID, 'pid'=>$PSCID)
) ==0
) {
    echo "The Candid : $DCCID  AND PSCID : $PSCID Doesn't Exist in " .
    "the database\n";
    die();
}

//Find candidate...
$candidate = new Candidate();
$candidate->select($DCCID); //find the candidate with the given DCCID

//Find Issues id with candidate foreign key
$issueIDs = $DB->pselect("SELECT issueID 
                FROM issues 
                WHERE candID=:candID",
                array('candID' => $DCCID)
		);

//delete issues_comments
//delete issues_history
foreach ($issueIDs as $issueID) {
$DB->delete("issues_comments", array("issueID" => $issueID['issueID']));  
$DB->delete("issues_history", array("issueID" => $issueID['issueID'])); 
};
echo "----------------------delete issues_comments-------------------\n";  
echo "----------------------delete issues_history--------------------\n";
//find sessions
$sessions = $candidate->getListOfTimePoints();
if (is_null($sessions) || empty($sessions)) {
    echo "There are no coressponding session for Candid : $DCCID \n";
    die();
}
//delete from issues
$DB->delete("issues", array("CandID" => $DCCID));
echo "----------------------delete issues----------------------------\n";

//find the test_names and commentIDs
$query = "SELECT ID, Test_name, CommentID FROM flag WHERE SessionID in (" . 
         implode(" , ", $sessions) . ")";
$instruments = $DB->pselect($query, array()); 
//delete from genomic_candidate_files_rel
$DB->delete("genomic_candidate_files_rel", array("CandID" => $DCCID));
echo "----------------------delete genomic_candidate_files_rel-------\n";

//delete from genomic_cpg
$sample_labels = $DB->pselect("SELECT sample_label 
                FROM genomic_sample_candidate_rel 
                WHERE candID=:candID",
                array('candID' => $DCCID)
                );

foreach ($sample_labels as $sample_label) {
         $DB->delete("genomic_cpg", 
                 array("sample_label" => $sample_label['sample_label']));      
};
echo "----------------------delete genomic_cpg----------------------\n";


//delete from genomic_sample_candidate_rel
$DB->delete("genomic_sample_candidate_rel", array("CandID" => $DCCID));
echo "----------------------delete genomic_sample_candidate_rel------\n";

//to do: for deleting  mri_scanner
$mri_scannerIDs = $DB->pselect("SELECT ID 
                FROM mri_scanner 
                WHERE candID=:candID",
                array('candID' => $DCCID)
                );

foreach ($mri_scannerIDs as $mri_scannerID) {
      $DB->delete("mri_protocol",
                           array("ScannerID" => $mri_scannerID['ID']));

      $fileIDs = $DB->pselect("SELECT FileID 
                FROM files 
                WHERE ScannerID=:ScannerID",
                array('ScannerID' => $mri_scannerID['ID'])
                );      
      
      foreach ($fileIDs as $fileID) {
      
      $DB->delete("feedback_mri_comments",
                           array("FileID" => $fileID['FileID']));
      $DB->delete("files_intermediary",
                           array("Input_FileID" => $fileID['FileID']));
      $DB->delete("files_intermediary",
                           array("Output_FileID" => $fileID['FileID']));     
      $DB->delete("parameter_file", 
                           array("FileID" => $fileID['FileID']));
      
      };       

      $DB->delete("files", 
                           array("ScannerID" => $mri_scannerID['ID']));       
};
echo "----------------------delete feedback_mri_comments-------------\n";
echo "----------------------delete files_intermediary----------------\n";
echo "----------------------delete parameter_file--------------------\n";
echo "----------------------delete mri_protocol----------------------\n";
echo "----------------------delete files-----------------------------\n";

//delete from mri_scanner
$DB->delete("mri_scanner", array("CandID" => $DCCID));
echo "----------------------delete mri_scanner-----------------------\n";
//delete from parameter_candidate
$DB->delete("parameter_candidate", array("CandID" => $DCCID));
echo "----------------------delete parameter candidate---------------\n";
//find session id
$sessionIDs = $DB->pselect("SELECT ID 
                FROM session 
                WHERE candID=:candID",
                array('candID' => $DCCID)
                );

foreach ($sessionIDs as $sessionID) {
$DB->delete("media", array("session_id" => $sessionID['ID']));

$fileIDs = $DB->pselect("SELECT FileID 
                FROM files 
                WHERE SessionID=:SessionID",
                array('SessionID' => $sessionID['ID'])
                );
         foreach ($fileIDs as $fileID) {
//delete from parameter_file
         $DB->delete("parameter_file",
                      array("FileID" => $fileID['FileID']));
         
//delete from feedback_mri_comments
         $DB->delete("feedback_mri_comments", 
                      array("FileID" => $fileID['FileID']));
          };
//delete from feedback_mri_comments
$DB->delete("feedback_mri_comments",
                    array("SessionID" => $sessionID['ID']));

//delete from flag
$DB->delete("flag", 
                    array("SessionID" => $sessionID['ID']));

//delete from mri_acquisition_dates
$DB->delete("mri_acquisition_dates",                 
                    array("SessionID" => $sessionID['ID']));

//delete from parameter_session
$DB->delete("parameter_session",
                    array("SessionID" => $sessionID['ID']));

//delete from issues
$DB->delete("issues",
                    array("SessionID" => $sessionID['ID']));

//delete all foreign constraint of files

$fileIDs = $DB->pselect("SELECT FileID 
                FROM files 
                WHERE SessionID=:SessionID",
                array('SessionID' => $sessionID['ID'])
                );


      foreach ($fileIDs as $fileID) {

      $DB->delete("feedback_mri_comments",
                           array("FileID" => $fileID['FileID']));
      $DB->delete("files_intermediary",
                           array("Input_FileID" => $fileID['FileID']));
      $DB->delete("files_intermediary",
                           array("Output_FileID" => $fileID['FileID']));
      $DB->delete("parameter_file",
                           array("FileID" => $fileID['FileID']));

      };

//delete from files
$DB->delete("files", array("SessionID" => $sessionID['ID']));
};
echo "----------------------delete parameter_file--------------------\n";
echo "----------------------delete feedback_mri_comments-------------\n";
echo "----------------------delete files (session)-------------------\n";
echo "----------------------delete media-----------------------------\n";
//delete the sessions
$DB->delete("session", array("CandID" => $DCCID));
echo "----------------------delete session---------------------------\n";
//delete each instrument table entry
foreach ($instruments as $instrument) {

    //delete the entry from the instrument table
    $DB->delete(
        $instrument['Test_name'], array("CommentID" => $instrument['CommentID'])
    );

    //delete from flag
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
    
    //delete from final_radiological_review
    $DB->delete(
        "final_radiological_review", 
               array("CommentID" => $instrument['CommentID'])
    );
    
}
echo "----------------------delete each instrument table entry-------\n";

//Delete from the feedback related tables
$Feedbackids = $DB->pselect(
    "SELECT fbt.FeedbackID from feedback_bvl_thread fbt WHERE CandID =:cid",
    array('cid'=>$DCCID)
);
foreach ($Feedbackids as $Feedbackid) {
    $DB->delete(
        "feedback_bvl_entry", array('FeedbackID'=>$Feedbackid['FeedbackID'])
    );
}

$DB->delete("feedback_bvl_thread", array('CandID'=>$DCCID));
echo "----------------------delete feedback_bvl_thread---------------\n";

//delete from the participant_status table
$DB->delete("participant_status", array("CandID" => $DCCID));
echo "----------------------delete participant_status----------------\n";
//delete from the SNP_candidate_rel table
$DB->delete("SNP_candidate_rel", array("CandID" => $DCCID));
echo "----------------------delete SNP_candidate_rel-----------------\n";
//delete from the participant_status_history table
$DB->delete("participant_status_history", array("CandID" => $DCCID));
echo "----------------------delete participant_status_history--------\n";
//delete from candidate
$DB->delete("candidate", array("CandID" => $DCCID));
echo "----------------------delete candidate-------------------------\n";
?>

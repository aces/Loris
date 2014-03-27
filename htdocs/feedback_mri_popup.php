<?php
/**
 * @package mri
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ob_start('ob_gzhandler');
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "FeedbackMRI.class.inc";

// create DB object
$DB =& Database::singleton();
if(PEAR::isError($DB)) {
    return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
}

// user is logged in, let's continue with the show...
$user =& User::singleton($_SESSION['State']->getUsername());
if(PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}

// check permissions
if ($user->hasPermission('mri_feedback')) {
    $tpl_data['has_permission'] = true;
}

// instantiate feedback mri object
$comments = new FeedbackMRI($_REQUEST['fileID'], $_REQUEST['sessionID']);

/*
 * UPDATE SECTION
 */
if ($_POST['fire_away'] && $user->hasPermission('mri_feedback'))
{
  // clear all predefined comments
  $comments->clearAllComments();

  // set selected predefined comments
  $comments->setPredefinedComments($_POST['savecomments']['predefined']);

  // save all textual comments but only if there is an entry [sebas]
  foreach ($_POST['savecomments']['text'] as $comment_type_id => $comment_message) {
      if (trim($comment_message)) {
          $comments->addTextComment(trim($comment_message), $comment_type_id);
      }
  }

  // save all comment status fields
  if (is_array($_POST['saveCommentStatusField'])) {
      foreach ($_POST['saveCommentStatusField'] as $status_field => $value) {
          $comments->setMRIValue($status_field, $value);
      }
  }

}

// get the currently saved comments
$saved_comments = $comments->getComments();

/*
 * DISPLAY HTML PAGES
 */

// show identifier of subject/volume
if($comments->objectType == 'volume') {
    $query = "SELECT c.CandID AS DCCID, c.PSCID, s.Visit_label, s.SubprojectID, f.File AS File_name, st.Scan_type FROM files AS f, session AS s, candidate AS c, mri_scan_type AS st WHERE f.FileID='$comments->fileID' AND f.SessionID=s.ID AND s.CandID=c.CandID and f.AcquisitionProtocolID=st.ID AND s.Active='Y'";
} elseif ($comments->objectType == 'visit') {
    $query = "SELECT c.CandID, c.PSCID, s.Visit_label, s.SubprojectID FROM session AS s, candidate AS c WHERE s.ID='$comments->sessionID' AND s.CandID=c.CandID AND s.Active='Y'"; //AND VisitNo='$comments->visitNo'
} else {
    $query = "SELECT c.CandID FROM session AS s, candidate AS c WHERE s.ID='$comments->sessionID' AND s.CandID=c.CandID AND s.Active='Y'";
}

$DB->select($query, $result);
if (PEAR::isError($result)) {
    $tpl_data['error_message'][] = $result->getMessage();
}

if (count($result) > 0) {
    $i = 0;
    foreach ($result[0] as $key => $value) {
        $tpl_data['identifier'][$i]['name'] = str_replace('_', ' ', $key);
        $tpl_data['identifier'][$i]['value'] = $value;
        $i++;
    }
}

// get the list of comment types
$comment_types = $comments->getAllCommentTypes();

// loop through the comment types
$i = 0;
foreach ($comment_types AS $comment_type_id => $comment_array) {

    // print the status select field if it exists
    if(!empty($comment_array['field']) && ($comments->objectType == 'volume')) {
        if ($user->hasPermission('mri_feedback')) {
            $tpl_data['comment'][$i]['select_name'] = $comment_array['field'];
            $tpl_data['comment'][$i]['select_value_array'] = $comment_array['values'];
        }
        $tpl_data['comment'][$i]['selected'] = $comments->getMRIValue($comment_array['field']);
    }

    $tpl_data['comment'][$i]['name'] = $comment_array['name'];

    // get the list of predefined comments for the current type
    $predefined_comments = $comments->getAllPredefinedComments($comment_type_id);
   
    // loop through the predefined comments
    $j = 0;
    foreach ($predefined_comments AS $predefined_comment_id => $predefined_comment_text) {
        // print a form element
        $tpl_data['comment'][$i]['predefined'][$j]['id'] = $predefined_comment_id;
        $tpl_data['comment'][$i]['predefined'][$j]['predefined_text'] = $predefined_comment_text;
        
        // print the comment text
        if ($saved_comments[$comment_type_id]['predefined'][$predefined_comment_id]) {
            $tpl_data['comment'][$i]['predefined'][$j]['checked'] = true;
        }
        $j++;
    }

    // print a form element for a free-form comment
    $tpl_data['comment'][$i]['type'] = $comment_type_id;
    $tpl_data['comment'][$i]['saved_text'] = $saved_comments[$comment_type_id]['text'];
    $i++;
}

//Output template using Smarty
$config =& NDB_Config::singleton();
$tpl_data['css']=$config->getSetting('css');
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('feedback_mri_popup.tpl');

ob_end_flush();

exit;
?>

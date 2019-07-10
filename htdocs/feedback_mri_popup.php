<?php
/**
 * This file represents the MRI Feedback popup window in Loris.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
*/
require_once __DIR__ . "/../vendor/autoload.php";
$client = new NDB_Client;
if ($client->initialize() == false) {
    http_response_code(401);
    echo "User not authenticated.";
    return;
}

// create DB object
$DB = \Database::singleton();

// user is logged in, let's continue with the show...
$user = \User::singleton($_SESSION['State']->getUsername());

// check permissions
if (!$user->hasPermission('imaging_browser_qc')
    && $_SERVER['REQUEST_METHOD'] !== 'GET'
) {
    http_response_code(403);
    return;
}

$tpl_data['has_permission'] = $user->hasPermission('imaging_browser_qc');

// instantiate feedback mri object
$comments = new FeedbackMRI($_REQUEST['fileID'] ?? '', $_REQUEST['sessionID'] ?? '');

/*
 * UPDATE SECTION
 */
if (isset($_POST['fire_away']) && $_POST['fire_away']) {
    // clear all predefined comments
    $comments->clearAllComments();

    // set selected predefined comments
    $comments->setPredefinedComments($_POST['savecomments']['predefined']);

    // save all textual comments but only if there is an entry [sebas]
    foreach (\Utility::asArray($_POST['savecomments']['text'])
        as $comment_type_id => $comment_message
    ) {
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
if ($comments->objectType == 'volume') {
    $query = "SELECT c.CandID AS DCCID, c.PSCID, s.Visit_label, s.SubprojectID,
                    f.File AS File_name, st.Scan_type
                FROM files AS f, session AS s, candidate AS c, mri_scan_type AS st
                WHERE f.FileID=:FID
                    AND f.SessionID=s.ID
                    AND s.CandID=c.CandID
                    AND f.AcquisitionProtocolID=st.ID
                    AND s.Active='Y'";

    $qparams = array('FID' => $comments->fileID);
} elseif ($comments->objectType == 'visit') {
    $query = "SELECT c.CandID, c.PSCID, s.Visit_label, s.SubprojectID
                FROM session AS s, candidate AS c
              WHERE s.ID=:SID AND s.CandID=c.CandID AND s.Active='Y'";

    $qparams = array('SID' => $comments->sessionID);
} else {
    $query = "SELECT c.CandID FROM session AS s, candidate AS c
                WHERE s.ID=:SID AND s.CandID=c.CandID AND s.Active='Y'";

    $qparams = array('SID' => $comments->sessionID);
}

$result = $DB->pselect($query, $qparams);

if (count($result) > 0) {
    $i = 0;
    foreach ($result[0] as $key => $value) {
        $tpl_data['identifier'][$i]['name']  = str_replace('_', ' ', $key);
        $tpl_data['identifier'][$i]['value'] = $value;
        $i++;
    }
}

// get the list of comment types
$comment_types = $comments->getAllCommentTypes();

// loop through the comment types
$i = 0;
foreach ($comment_types AS $comment_type_id => $comment_array) {
    $CommentTpl =& $tpl_data['comment'][$i];

    // print the status select field if it exists
    if (!empty($comment_array['field']) && ($comments->objectType == 'volume')) {
        if ($user->hasPermission('imaging_browser_qc')) {
            $CommentTpl['select_name']        = $comment_array['field'];
            $CommentTpl['select_value_array'] = $comment_array['values'];
        }
        $CommentTpl['selected'] = $comments
            ->getMRIValue(
                $comment_array['field']
            );
    }

    if (is_array($comment_array)) {
        $CommentTpl['name'] = $comment_array['name'];
    }

    // get the list of predefined comments for the current type
    $predefined_comments = $comments->getAllPredefinedComments($comment_type_id);

    // loop through the predefined comments
    $j = 0;
    foreach ($predefined_comments
        AS $predefined_comment_id => $predefined_comment_text
    ) {
        $PredefinedTpl =& $CommentTpl['predefined'][$j];
        // print a form element
        $PredefinedTpl['id'] = $predefined_comment_id;
        $PredefinedTpl['predefined_text'] = $predefined_comment_text['Comment'];

        // print the comment text
        $Saved = $saved_comments[$comment_type_id] ?? array();
        if ($Saved['predefined'][$predefined_comment_id] ?? false) {
            $CommentTpl['predefined'][$j]['checked'] = true;
        }
        $j++;
    }

    // print a form element for a free-form comment
    $CommentTpl['type']       = $comment_type_id;
    $CommentTpl['saved_text'] = $saved_comments[$comment_type_id]['text'] ?? '';
    $i++;
}

//Output template using Smarty
$config          = \NDB_Config::singleton();
$tpl_data['css'] = $config->getSetting('css');
$smarty          = new Smarty_neurodb;
$smarty->assign($tpl_data);
$smarty->display('feedback_mri_popup.tpl');

ob_end_flush();


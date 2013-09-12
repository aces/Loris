<?
/**
 * @version $Id: feedback_bvl_popup.php,v 3.13 2007/03/02 16:16:41 sebas Exp $
 * @package behavioural
 */
ob_start('ob_gzhandler');

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();
$config =& NDB_Config::singleton();

$DB =& Database::singleton();

// create user object
$user =& User::singleton();
if(PEAR::isError($user)) {
	die("Error creating user object: ".$user->getMessage());
}
$tpl_data['userID'] = $user->getData('UserID');

// set permissions
if ($user->hasPermission('bvl_feedback')) {
	$tpl_data['has_permission'] = true;
}


$candidate = $_REQUEST['CandID'];
$comment_id = $_REQUEST['commentID'];
$session_id = $_REQUEST['sessionID'];

// get the list of threads


$threads = getThreadList($comment_id,$session_id);
// assign thread data from the getThreadList()
$tpl_data['thread_list_data'] = $threads;
$z = 0;

foreach ($threads as $thread) {

	$tpl_data['thread_list_data'][$z]['Public'] = $thread['Public'];
	$tpl_data['thread_list_data'][$z]['FieldName'] = $thread['FieldName'];
	$tpl_data['thread_list_data'][$z]['Type'] = $thread['Type'];
	$tpl_data['thread_list_data'][$z]['Status'] = $thread['QC_status'];
	$threads2 = getThreadEntries($thread["FeedbackID"]);
	$tpl_data['thread_entry'][] = $threads2;
	$z++;
}
//set study name
$tpl_data['study_title'] = $config->getSetting('title');

//Output template using Smarty
$tpl_data['css']="gusto.css";
$smarty = new Smarty_neurodb;
if (is_array($tpl_data)) $smarty->assign($tpl_data);
$smarty->display('feedback_bvl_closed_popup.tpl');


/**
    * returns the list of feedback threads
    * @throws PEAR:Error
    * @return array
    * @param int $CandID
    * @param int @SessionID
    * @param string $CommentID
    */
function getThreadList($commentid,$session_id)
{

	$user =& User::singleton();
	if(PEAR::isError($user)) {
		return "Unable to create user object".$user->getMessage();
	}
	$result = $GLOBALS['DB']->pselect("SELECT c.CandID as CandID, c.PSCID as PSCID, s.VisitNo as Visit, s.SubprojectID, s.ID as SessionID, ft.FeedbackID, ft.Feedback_level as QC_class, ftp.Description as Type, ftp.Feedback_type as TypeID, ft.Status as QC_status, ft.Active as Active, ft.Public as Public,ft.FieldName, ft.UserID as User, ft.Date_taken as Date, DATE_FORMAT(ft.Testdate, '%Y-%m-%d') as Modified, f.Test_name as Instrument, f.CommentID FROM
	candidate as c, history_db.feedback_bvl_thread_closed as ft 
	LEFT JOIN session as s ON (s.ID = ft.SessionID), feedback_bvl_type as ftp, flag as f 
	WHERE c.CandID = ft.CandID AND ftp.Feedback_type = ft.Feedback_type AND 
	ft.SessionID =:sid AND 
	ft.CommentID =:cid AND ft.CommentID = f.CommentID AND (ft.Active='Y' OR (ft.Active='N' AND ft.UserID='zia')) ORDER BY ft.CandID, ft.Feedback_level, ft.Status, ft.Testdate DESC",array('sid'=>$session_id,'cid'=>$commentid));

	if (PEAR::isError($result)) {
		return PEAR::raiseError("dbError: " . $result->getMessage());
	}
	return $result;
}


/**
    * returns the list of entries for the thread
    * @return array
    * @throws PEAR::Error
    * @param string $feedbackID, feedback_bvl_thread.FeedbackID field
    */
function getThreadEntries($feedbackID)
{
	// new DB Object

	//select the entries (details) for the thread
	$result = $GLOBALS['DB']->pselect("SELECT fe.ID as EntryID, fe.FeedbackID, fe.Comment, fe.UserID as UserID, DATE_FORMAT(fe.Testdate, '%Y-%m-%d') as Date
	FROM history_db.feedback_bvl_thread_closed as ft, history_db.feedback_bvl_entry_closed as fe, feedback_bvl_type as ftp
	WHERE ft.FeedbackID =:fid 
	AND ft.FeedbackID = fe.FeedbackID 
	AND ft.Feedback_type = ftp.Feedback_type
	ORDER BY ft.FeedbackID, fe.Testdate DESC",array('fid'=>$feedbackID));

	if (PEAR::isError($result)) {
		return PEAR::raiseError("dbError: " . $result->getMessage());
	}
	return $result;
}

ob_end_flush();
?>

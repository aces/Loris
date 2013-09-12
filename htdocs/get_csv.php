<?php
require_once "../tools/generic_includes.php";
//fputcsv($output, array('Column 1', 'Column 2', 'Column 3'));
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=data.csv');
$output = fopen('php://output', 'w');
$instrument = $_REQUEST['instrument'];
$sourcefield =  $_REQUEST['sourcefield'];
$completion_status = $_REQUEST['completion_status'];
$sent_to_dcc_status =  $_REQUEST['sent_to_dcc_status'];
$download_feedbacks =  $_REQUEST['download_feedbacks'];
$visit_label = $_REQUEST['visit_label'];
$type = $_REQUEST['type'];
$feedback_status = 'opened'; //default
if (($_REQUEST['feedback_status']) !=null){
	$feedback_status = $_REQUEST['feedback_status'];
}



/////////////////////////////////////////////////////////////////////
/////////////////////////////Feedback Download/////////////////////////
/////////////////////////////////////////////////////////////////////////

if ($download_feedbacks == TRUE){
	
	$header = array("FeedbackID","Feedback_Type", "Feedback_Status","SubjectID","VisitLabel","Instrument","Fieldname","Comments", "Corrective_Action","RF_Comment","To_Delete_BVL","To_Close_BVL", "Convert_To_Comment","To_Replace_Value","New_Value");
	
	////extract commented feedbacks for data_cleaning type and all(both comment and open) feedbacks for instrument-based typ
	if ($feedback_status =='all_comment'){
		$results = array_merge(getFeedbacks($instrument,$visit_label,'all','Input',getFeedbacks($instrument,$visit_label,'comment','data_cleaning')));
	}
	else{
		$results = getFeedbacks($instrument,$visit_label,$feedback_status,$type);
	}
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////Instrument Data Download/////////////////////////
/////////////////////////////////////////////////////////////////////////
else{
	$query = "Select c.PSCID, s.Visit_label, $sourcefield as Field,f.data_entry from $instrument i , flag f,session s,candidate c
where i.commentid = f.commentid and f.sessionid = s.ID and s.Candid = c.Candid";
	if (($completion_status!='any') && (!empty($completion_status))) {
		$query .= " And f.data_entry = '$completion_status'";
	}
	if (($sent_to_dcc_status!='any') && (!empty($sent_to_dcc_status))){
		$query .= " And s.current_stage = '$sent_to_dcc_status'";
	}

	$header = array("PSCID","Visit_lable",$sourcefield,"data_entry");

	$DB->select($query,$results);
}

fputcsv($output,$header,"\t");
///Create the csv file
foreach($results as $result){
	fputcsv($output,$result,"\t");
}



/**
 * return the array of feedbacks based on the type, visit_label,instrument and feedbacks_status
 *
 * @param unknown_type $type
 * @param unknown_type $instrument
 * @param unknown_type $visit_label
 * @param unknown_type $feedback_status
 * @return unknown
 */

function getFeedbacks($instrument,$visit_label,$feedback_status,$type){
	$select = "SELECT b.FeedbackID,ftp.Name as Feedback_Type, b.Status, c.PSCID as SubjectID , s.Visit_label as VisitLabel, f.test_name AS Instrument,
				  b.FieldName AS Fieldname, be.Comment AS Comments
				  FROM session s
					JOIN flag f ON (s.ID = f.SessionID)
					JOIN feedback_bvl_thread b ON (b.commentid = f.commentid)
					
					JOIN feedback_bvl_entry be ON (be.FeedbackID = b.FeedbackID)
					JOIN candidate c ON (c.Candid = s.Candid)
					JOIN psc ON (s.CenterID = psc.CenterID)
					JOIN feedback_bvl_type ftp ON (b.Feedback_type = ftp.Feedback_type)";

	//if it's data_cleaning use data_integrity_flag
	if ($type == 'data_cleaning'){
		$select .= " JOIN data_integrity_flag df ON (b.dataflag_id = df.dataflag_id) ";
	}

	$where = " WHERE c.PSCID NOT LIKE '%999-99999%' AND c.Active = 'Y' AND s.Active = 'Y'
	                AND f.test_name = '$instrument' 
	                AND psc.Centerid!= '1' 
					AND ftp.Name ='$type' 
					AND s.visit_label = '$visit_label'";


	//include the feedback_status
	if 	($feedback_status == 'all'){
		$where.=" AND (b.Status = 'opened' or b.Status = 'comment') ";
	}
	/*	if 	($feedback_status == 'all_comment'){
	$where.=" AND (b.Status = 'opened' or b.Status = 'comment') ";
	}
	*/
	else{
		$where.=" AND (b.Status = '$feedback_status') ";
	}

	//if it's data_cleaning use data_integrity_flag
	if ($type == 'data_cleaning'){
		$where .= " AND df.latest_entry = '1'";
	}

	$order_by = " ORDER BY FeedbackID";

	$query .= $select . $where . $order_by;

	

	$GLOBALS['DB']->select($query,$results);
	return $results;
}

?>
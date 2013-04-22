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



/////////////////////////////////////////////////////////////////////
/////////////////////////////Instrument Data Download/////////////////////////
/////////////////////////////////////////////////////////////////////////

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


fputcsv($output,$header,"\t");
///Create the csv file
foreach($results as $result){
	fputcsv($output,$result,"\t");
}


?>
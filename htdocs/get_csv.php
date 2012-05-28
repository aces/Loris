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
$visit_label = $_REQUEST['visit_label'];
/*
   $instrument = '3week_infancy';
   $sourcefield = 'data_entry_date';
 */


$params = array();
	$query = "SELECT c.PSCID, s.Visit_label, $sourcefield AS Field,f.Data_entry FROM $instrument i
	JOIN flag f ON (i.commentid = f.commentid)
	JOIN session s ON (f.sessionid = s.ID)
    JOIN candidate c ON (s.Candid = c.Candid)
	where s.Visit_label = :vl";
	$params['vl']=$visit_label;

	if (($completion_status!='any') && (!empty($completion_status))) {
		$query .= " AND f.Data_entry = :cs";
		$params['cs'] = $completion_status;
	}

if (($sent_to_dcc_status!='any') && (!empty($sent_to_dcc_status))) {
	$query .= " AND s.current_stage = :sts";
	$params['sts'] = $sent_to_dcc_status;
}
$header = array("PSCID","Visit_label",$sourcefield,"data_entry");
fputcsv($output,$header);

$results =  $DB->pselect($query,$params);
foreach($results as $result) {
	fputcsv($output,$result);
}
?>

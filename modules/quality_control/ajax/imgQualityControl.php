<?php
/**
* Quality Control
*
**/ 

echo getData();

function getData(){

	$db =& Database::singleton();

	$headers = ['Patient ID','Uploaded By', 'Upload Date', 'SessionID', 'Center Name', 'Comment', 'Linkw'];

	$query= 
	"SELECT t.PatientName, UploadedBy, UploadDate, t.SessionID , CenterName
	FROM 
		mri_upload m 
		JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID)
		JOIN flag f ON (f.SessionID = t.SessionID)
	WHERE f.CommentID NOT LIKE 'DDE%' 
		AND f.CommentID NOT IN (SELECT CommentId FROM mri_parameter_form)
	GROUP BY UploadedBy, UploadDate,PatientName,SessionID, CenterName";

	$data = $db->pselect($query, array());

	$MappedData = array();
	foreach($data as $row){
		$MappedData[] = array_values($row);
	}

	$table = array("headers"=> $headers, "data"=>$MappedData);
	

	return json_encode($table);
}
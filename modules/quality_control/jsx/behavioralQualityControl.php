<?php
/**
 * Quality Control
 *
 **/
error_log("got here");
echo json_encode(getData());
error_log("got to here");
function getData(){
    $db =& Database::singleton();
    $query= "Select * from mri_parameter_form mpf
	join flag f on (f.CommentID = mpf.CommentID)
	join tarchive t on (t.SessionID = f.SessionID)
	join mri_upload m on (m.TarchiveID = t.TarchiveID)
	where not mpf.t1_Scan_done = 'Complete'
		and not mpf.t1_Scan_done = 'Partial'";
    $data = $db->pselect($query, array());
    return $data;
}
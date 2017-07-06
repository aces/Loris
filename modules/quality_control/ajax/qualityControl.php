<?php
/**
* Quality Control
*
**/ 

error_log("got to getData");

echo getData();

function getData(){

	$db =& Database::singleton();

	$imgHeaders = ['Patient ID','Uploaded By', 'Upload Date', 'SessionID', 'Center Name', 'Comment', 'Linkw'];

	$query= 
	"SELECT t.PatientName, UploadedBy, UploadDate, t.SessionID , CenterName
	FROM 
  mri_upload m 
  JOIN tarchive t ON (t.TarchiveID = m.TarchiveID OR t.SessionID = m.SessionID)
  JOIN flag f ON (f.SessionID = t.SessionID)
  WHERE f.CommentID NOT LIKE 'DDE%' 
  AND f.CommentID NOT IN (SELECT CommentId FROM mri_parameter_form)
  GROUP BY UploadedBy, UploadDate,PatientName,SessionID, CenterName";

  $imgData = $db->pselect($query, array());

  $imgData = array();
  foreach($imgData as $row){
      $imgData[] = array_values($row);
  }

  $config         =& NDB_Config::singleton();
  $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
  for ($i=0; $i<count($ddeInstruments); ++$i) {
    $ddeInstruments[$i] = Database::singleton()->quote($ddeInstruments[$i]);
    }
$query = " 
SELECT s.visit_label,
s.candid,
c.PSCID,
t.Full_name,
s.ID,
f.SessionID,
f.data_entry,
f.commentid, 
f.test_name
FROM session s JOIN flag f ON (f.sessionid = s.id)".
" JOIN candidate c ON (c.candid = s.candid)".
" JOIN test_names t ON (t.Test_name = f.Test_name)".
" JOIN psc ON (s.CenterID = psc.CenterID)";
$where = " WHERE s.Active = 'Y' AND c.Active = 'Y'".
" AND coalesce(f.data_entry,'In Progress') = 'In Progress'".
" AND psc.Centerid!= '1' AND c.Entity_type != 'Scanner'";
if (count($ddeInstruments) > 0) {
    $ddeInstruments = implode(",", $ddeInstruments);
    $where         .= "
    AND (f.test_name IN ($ddeInstruments) OR
    f.commentid NOT LIKE 'DDE_%')
    ";
} else {
    $where .= "
    AND (f.commentid NOT LIKE 'DDE_%')
    ";
}
$where .= "ORDER BY f.commentid";
$query = $query . $where;
$behaviouralData = $db->pselect($query, array());
        /*if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND c.CenterID IN (" . $site_arr . ")";
        }*/
        $behaviouralHeaders  = [
        'Visit',
        'DCCID',
        'PSCID',
        'Instrument',
        ];

        $behaviouralData = array();
        foreach($behaviouralData as $row){
            $behavouralData[] = array_values($row);
        }

        $table = array("imgHeaders"=> $imgHeaders, 
          "imgData"=>$imgData,
          "behaviouralHeaders" => $behaviouralHeaders,
          "behaviouralData" => $behaviouralData);

        return json_encode($table);
    }
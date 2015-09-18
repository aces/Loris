<?php
/**
 * This script download the data for the given instrument column
 * And it is used by Data_team_helper
 * 
 * PHP Version 5
 *
 *  @category Loris
 *  @package  Behavioural
 *  @author   Zia Mohaddes <zia.mohades@gmail.com>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 *
 */
require_once "../tools/generic_includes.php";
//fputcsv($output, array('Column 1', 'Column 2', 'Column 3'));
header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=data.csv');
$output = fopen('php://output', 'w');
$instrument = $_REQUEST['instrument'];
$sourcefield =  $_REQUEST['sourcefield'];
$completion_status = $_REQUEST['completion_status'];
$sent_to_dcc_status =  $_REQUEST['sent_to_dcc_status'];


// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../project/config.xml");


/////////////////////////////////////////////////////////////////////
/////////////////////////////Instrument Data Download/////////////////////////
/////////////////////////////////////////////////////////////////////////
if (empty($instrument) || empty($sourcefield)) {
    error_log("ERROR: The neccessary parameters are missing");
    header("HTTP/1.1 500 Internal Server Error"); 
    exit(1);
}

$params = array();

$query = "SELECT c.PSCID, s.Visit_label, `$sourcefield` AS Field,f.data_entry FROM
          `$instrument` i 
          JOIN flag f ON (i.commentid = f.commentid)
          JOIN session s on (s.ID=f.sessionid)
          JOIN candidate c on (c.CandID = s.CandID)
          WHERE 1=1 ";

if (($completion_status!='any') && (!empty($completion_status))) {

    $query .= " AND f.data_entry = :cstatus ";
    $params['cstatus'] = $completion_status;
}
if (($sent_to_dcc_status!='any') && (!empty($sent_to_dcc_status))) {
    $query .= " AND s.Current_stage = :dcc_status";
    $params['dcc_status'] = $sent_to_dcc_status;
}

$header = array("PSCID", "Visit_label", $sourcefield, "data_entry");

$results = $DB->pselect($query, $params);

fputcsv($output, $header, "\t");
///Create the csv file
foreach ($results as $result) {
    fputcsv($output, $result, "\t");
}
?>
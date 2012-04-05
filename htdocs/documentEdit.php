<?php
require_once "Utility.class.inc";
require_once "Database.class.inc";

$db =& Database::singleton();

$db =& Database::singleton();

$con = mysql_connect("localhost","root","abc123!");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("preventAD", $con);


$category = $_POST['categoryP'];
$instrument = $_POST['instrumentP'];
$site = $_POST['siteP'];
$pscid = $_POST['pscidP'];
$visit = $_POST['visitP'];
$comments = $_POST['commentsP'];
$version = $_POST['versionP'];

//mysql_query("UPDATE document_repository SET File_category = '$category'");
//, For_site, comments, version) VALUES ('$category', '$site', '$comments', '$version')");


//$editFile = array('File_category'=>$category, 'version'=>$version);
//$whereArray = array('record_id'=>'100');
//$db->update("document_repository", $editFile, $whereArray);
//"Insert into document_repository(record_id, File_category, Instrument, For_site, PSCID, visitLabel, comments, version) values('', '$category', '$instrument', '$site', '$pscid', '$visit', '$comments', '$version')";
//if($this->isError($success)) {
//return $this->raiseError('Could not save to database');
//}



?>

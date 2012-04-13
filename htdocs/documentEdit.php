<?php
require_once "generic_includes.php";

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

mysql_query("UPDATE document_repository SET File_category = '$category' where record_id = '519'");


//$editFile = array('File_category'=>$category, 'version'=>$version);
//$whereArray = array('record_id'=>'519');
//$db->update("document_repository", $editFile, $whereArray);
//if($this->isError($success)) {
//return $this->raiseError('Could not save to database');
//}



?>

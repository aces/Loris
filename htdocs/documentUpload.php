<?php

require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../project/config.xml");

// create Database object
$DB =& Database::singleton();
if(PEAR::isError($DB)) { print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); }

/*
$con = mysql_connect("localhost","root","abc123!");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("preventAD", $con);
*/

$action = $_POST['action'];


if ($action == 'upload')
{

$user = $_POST['user'];
$category = $_POST['category'];
$site = $_POST['site'];
$instrument = $_POST['instrument'];
$pscid = $_POST['pscid'];
$visit = $_POST['visit'];
$comments = $_POST['comments'];
$version = $_POST['version'];


$fileName = $_FILES["file"]["name"];
$base_path = "document_repository";
$target_path = $base_path; //. basename($_FILES["file"]["name"]);

if (!file_exists($base_path . $user))
	mkdir("document_repository/" . $user, 0777);

$target_path = $target_path . "/" . $user ."/" . $fileName;  //{$_POST["fileselect"]["name"]}"; 

/*
  if($dh = opendir($base_path)) {
        $files = Array();

        while($file = readdir($dh)) {
            if($file == $user) {
		echo "file" . $file . "\n";
		$target_path = "document_repository/" . $user ."/"; //. basename($_FILES["file"]["name"]);
		}
            else
		{
		echo "file: " . $file . "\n";
		mkdir($user, 0777);
		}
	}
}
*/

if ($_FILES["file"]["error"] > 0)
  {
  echo "Error: " . $_FILES["file"]["error"] . "<br />";
  }
else
  {
  echo "Upload: " . $_FILES["file"]["name"] . "<br />";
  echo "Type: " . $_FILES["file"]["type"] . "<br />";
  echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
  echo "Stored in: " . $_FILES["file"]["tmp_name"];
  }

//echo "target path " . $target_path . "\n";
  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path))
{
      echo "The file " . basename($_FILES["file"]["name"]) . " has been uploaded";
}
else
{
	echo "There was an error uploading the file";
}
chmod($target_path, 0777);
//}
//}
//shell_exec("sudo chgrp lorisdev $target_path");

$success = $DB->insert('document_repository', array('File_category'=>$category, 'For_site'=>$site, 'comments'=>$comments, 'version'=>$version, 'File_name'=>$fileName, 'Data_dir'=>$target_path, 'uploaded_by'=>$user)); 

//	mysql_query("INSERT INTO document_repository (File_category, For_site, comments, version, File_name, Data_dir, uploaded_by)
//	VALUES ('$category', '$site', '$comments', '$version', '$fileName', '$target_path', '$user')");

header("Location: http://132.216.67.69:7080/main.php?test_name=document_repository");


//$newFile = array('File_category'=>$category, 'version'=>$version);
//print_r($newFile);
//$db->insert("document_repository", $newFile);
//"Insert into document_repository(record_id, File_category, Instrument, For_site, PSCID, visitLabel, comments, version) values('', '$category', '$instrument', '$site', '$pscid', '$visit', '$comments', '$version')";
//if($this->isError($success)) {
//return $this->raiseError('Could not save to database');
//}

//header("Location: http://132.216.67.69:7080/main.php?test_name=document_repository");
}


elseif ($action == 'edit')
{
$id = $_POST['idEdit'];
$category = $_POST['categoryEdit'];
$instrument = $_POST['nameEdit'];
$site = $_POST['siteEdit'];
$pscid = $_POST['pscidEdit'];
$visit = $_POST['visitEdit'];
$comments = $_POST['commentsEdit'];
$version = $_POST['versionEdit'];

$values = array('File_category' => $category, 'Instrument' => $instrument, 'For_site' => $site, 'PSCID' => $pscid, 'visitLabel' => $visit, 'comments' => $comments, 'version' => $version); 
$DB->update('document_repository', $values, array('record_id'=>$id));

//mysql_query("UPDATE document_repository SET File_category = '$category', Instrument = '$instrument', For_site = '$site', PSCID = '$pscid', visitLabel = '$visit', comments = '$comments', version = '$version'  where record_id = '$id'");


//$editFile = array('File_category'=>$category, 'version'=>$version);
//$whereArray = array('record_id'=>'519');
//$db->update("document_repository", $editFile, $whereArray);
//if($this->isError($success)) {
//return $this->raiseError('Could not save to database');
//}
}

?>

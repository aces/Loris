<?php

// TEMPORARY: disabling authentication simply to make testing easier
// and faster...  should be reenabled later for prod use (to protect
// data)


// make local instances of objects



//$db =& Database::singleton();

$con = mysql_connect("localhost","root","abc123!");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("preventAD", $con);

$user = $_POST['user'];
$category = $_POST['category'];
//$instrument = $_POST['instrumentP'];
$site = $_POST['site'];
//$pscid = $_POST['pscidP'];
//$visit = $_POST['visitP'];
$comments = $_POST['comments'];
$version = $_POST['version'];

//echo "USER: " . $user;

$fileName = $_FILES["file"]["name"];
$base_path = "document_repository";
$target_path = $base_path; //. basename($_FILES["file"]["name"]);

if (!file_exists($base_path . $user))
	mkdir("document_repository/" . $user, 0777);

$target_path = $target_path . "/" . $user ."/{$_FILES["file"]["name"]}"; 

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

echo "target path " . $target_path . "\n";
  if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path))
{
      echo "The file " . basename($_FILES["file"]["name"]) . " has been uploaded";
}
else
{
	echo "There was an error uploading the file";
}
chmod($target_path, 0777);
//shell_exec("sudo chgrp lorisdev $target_path");
mysql_query("INSERT INTO document_repository (File_category, For_site, comments, version, File_name, Data_dir, uploaded_by)
VALUES ('$category', '$site', '$comments', '$version', '$fileName', '$target_path', '$user')");
//$newFile = array('File_category'=>$category, 'version'=>$version);
//print_r($newFile);
//$db->insert("document_repository", $newFile);
//"Insert into document_repository(record_id, File_category, Instrument, For_site, PSCID, visitLabel, comments, version) values('', '$category', '$instrument', '$site', '$pscid', '$visit', '$comments', '$version')";
//if($this->isError($success)) {
//return $this->raiseError('Could not save to database');
//}

//header("Location: http://132.216.67.69:7080/main.php?test_name=document_repository");

?>

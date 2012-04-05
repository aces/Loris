<?php
/*
$client =& new NDB_Client();
$client->makeCommandLine();
$client->initialize();


$db =& Database::singleton();
//if(PEAR::isError($db)) { print "Could not connect to database: ".$db->getMessage()."<br>\n"; }
*/

header("Content-Length: 0");
//print "asdf asdf asdf asdf ";

$con = mysql_connect("localhost","root","abc123!");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }
mysql_select_db("preventAD", $con);

$rid = $_POST['id'];
//$rid = '513';

$file = mysql_query("Select File_name from document_repository where record_id = '$rid'"); 
$fileName = mysql_result($file, 0);
$user = mysql_query("Select uploaded_by from document_repository where record_id = '$rid'"); 
$userName = mysql_result($user, 0);
mysql_query("Delete from document_repository where record_id = '$rid'");


$path = "document_repository/" . $userName . "/" . $fileName;
echo "path is: " . $path;

if (file_exists($path))
        unlink($path);

//echo 'OK';
//$db->delete("document_repository", array("record_id" => $rid));




?>

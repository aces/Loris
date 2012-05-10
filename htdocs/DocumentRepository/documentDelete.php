<?php

require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../project/config.xml");

// create Database object
$DB =& Database::singleton();
if(PEAR::isError($DB)) { print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); }

$rid = $_POST['id'];

$fileName = $DB->selectOne("Select File_name from document_repository where record_id = '$rid'"); 
$userName = $DB->selectOne("Select uploaded_by from document_repository where record_id = '$rid'"); 
$DB->delete("document_repository", array("record_id" => $rid));


$path = "document_repository/" . $userName . "/" . $fileName;

if (file_exists($path))
        unlink($path);

?>

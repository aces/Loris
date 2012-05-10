<?php

require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();
if(PEAR::isError($DB)) { 
    print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); 
}

$rid = $_POST['id'];

$fileName = $DB->pselectOne("Select File_name from document_repository where record_id =:identifier", array(':identifier' => $rid)); 
$userName = $DB->pselectOne("Select uploaded_by from document_repository where record_id =:identifier", array(':identifier'=> $rid)); 
$DB->delete("document_repository", array("record_id" => $rid));


$path = "document_repository/" . $userName . "/" . $fileName;

if (file_exists($path))
    unlink($path);

?>

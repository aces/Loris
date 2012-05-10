<?php

require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();
if(PEAR::isError($DB)) { print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); }

$id = $_GET['id'];
$DB->selectRow("SELECT * FROM document_repository where record_id = '$id'", $result);

echo json_encode($result);

?>

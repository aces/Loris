<?php

$user =& User::singleton();
if (!$user->hasPermission('document_repository_view') && !$user->hasPermission('document_repository_delete')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();

$result = $DB->pselectRow("SELECT * FROM document_repository where record_id =:identifier", array(':identifier'=> $_GET['id']));

echo json_encode($result);

?>

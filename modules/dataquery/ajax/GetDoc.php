<?php

$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");
header("Content-Type: application/json");


$cdb = CouchDB::singleton();
$docID = $_REQUEST['DocID'];

$results = $cdb->getDoc(
    $docID
);


print json_encode($results);
?>

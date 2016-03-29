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

$cdb = CouchDB::singleton();

$doc = $cdb->getDoc($_REQUEST["DocID"]);
error_log("IN HERE");
error_log(print_r($doc, true));

print json_encode($doc);
?>
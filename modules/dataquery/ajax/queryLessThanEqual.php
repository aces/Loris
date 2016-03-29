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
$category = $_REQUEST['category'];
$fieldName = $_REQUEST['field'];
$value = $_REQUEST['value'];

$results = $cdb->queryView(
    "DQG-2.0",
    "search",
    array("reduce" => "false",
          "startkey" => "[\"$category\", \"$fieldName\"]",
          "endkey" => "[\"$category\", \"$fieldName\", \"$value\"]",
      )
);

$sessionResults = array_map(function($element) { return $element['value']; }, $results);

print json_encode($sessionResults);
?>

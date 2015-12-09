<?php

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");


$cdb = CouchDB::singleton();

$results = $cdb->queryView(
    "DQG-2.0",
    "sessions",
    array(
        "reduce" => "true",
        "group" => "true",
    )
);

$sessionResults = array_map(function($element) { return $element['key']; }, $results);

print json_encode($sessionResults);

?>

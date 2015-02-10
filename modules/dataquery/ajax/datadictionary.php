<?php

require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");


$cdb = CouchDB::singleton();
$category = $_REQUEST['category'];

$results = $cdb->queryView(
    "DQG-2.0",
    "datadictionary",
    array("reduce" => "false",
          "startkey" => "[\"$category\"]",
          "endkey" =>  "[\"$category\", \"ZZZZZZZZ\"]"
      )
);


print json_encode($results);
?>

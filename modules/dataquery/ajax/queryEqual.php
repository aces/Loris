<?php

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
          "key" => "[\"$category\", \"$fieldName\", \"$value\"]",
      )
);

$sessionResults = array();
foreach($results as $row) {
    $sessionResults[] = $row['value'];
}

print json_encode($sessionResults);
?>

<?php
ini_set("max_input_vars", 10000);

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
$category = $_REQUEST['DocType'];
$sessions = $_REQUEST['Sessions'];

$keys = array_map(function($row) use ($category) {
    return array_merge(array($category), $row);
}, $sessions);

$results = $cdb->queryView(
    "DQG-2.0",
    "instruments",
    array("reduce" => "false",
        "include_docs" => "true",
        "keys" =>  $keys,
    ),
    true
);

$keys = null;
$cdb = null;
$client = null;
//print $results;
/*
$justTheDocs = array_map(function($row) {
    return $row['doc'];
},
$results);

print json_encode($justTheDocs);
 */
?>

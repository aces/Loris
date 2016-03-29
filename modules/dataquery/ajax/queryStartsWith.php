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
          "startkey" => "[\"$category\", \"$fieldName\", \"$value\"]",
          "endkey" => "[\"$category\", \"$fieldName\", \"$value"
                          // PHP doesn't have any /u9999 unicode escaping, so
                          //  we use mb_convert_encoding to embed a high
                          //  unicode character
                          . mb_convert_encoding('&#x9999;', 'UTF-8', 'HTML-ENTITIES')
                          . "\"]",
      )
);

$sessionResults = array_map(function($element) { return $element['value']; }, $results);

print json_encode($sessionResults);
?>

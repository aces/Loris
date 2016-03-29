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

// There's no way to do "not" in an index, so we need to
// get all the values of the field name, and then iterate
// through them and exclude the ones where the value is
// equal in PHP.
$results = $cdb->queryView(
    "DQG-2.0",
    "search",
    array("reduce" => "false",
          "startkey" => "[\"$category\", \"$fieldName\"]",
          "endkey" => "[\"$category\", \"$fieldName\", {}]",
      )
);

// TODO: Rewrite this using array_filter and array_map.
$sessionResults = array();
foreach($results as $row) {
    if($row['key'][2] == $value) {
        continue;
    }
    $sessionResults[] = $row['value'];
}

print json_encode($sessionResults);
?>

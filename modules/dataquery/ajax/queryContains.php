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
          "endkey" => "[\"$category\", \"$fieldName\", {} ]"
      )
);

$sessionResults = array_filter($results,
    function($element) use ($value) {
        /* Element is of the form:
        Array
            (
                [id] => 929342e78fd78dfe38e2732d7207b82e
                [key] => Array
                (
                    [0] => adi_r_proband
                    [1] => Administration
                    [2] => All
                )

                [value] => Array
                (
                    [0] => STL0138
                    [1] => V06
                )

            );
         */
        $fieldVal = $element['key'][2];

        return strpos($fieldVal, $value) !== false;
    }
);
$sessionResults = array_values(array_map(function($element) { return $element['value']; }, $sessionResults));

print json_encode($sessionResults);
?>

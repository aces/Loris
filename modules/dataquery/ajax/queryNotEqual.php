<?php
/**
 * Data Querying Module
 *
 * PHP Version 5
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");
$config      = \NDB_Config::singleton();
$couchConfig = $config->getSetting('CouchDB');
$cdb         = \NDB_Factory::singleton()->couchDB(
    $couchConfig['dbName'],
    $couchConfig['hostname'],
    intval($couchConfig['port']),
    $couchConfig['admin'],
    $couchConfig['adminpass']
);
$category    = $_REQUEST['category'];
$fieldName   = $_REQUEST['field'];
$value       = $_REQUEST['value'];
// There's no way to do "not" in an index, so we need to
// get all the values of the field name, and then iterate
// through them and exclude the ones where the value is
// equal in PHP.
$results = $cdb->queryView(
    "DQG-2.0",
    "search",
    array(
        "reduce"   => "false",
        "startkey" => "[\"$category\", \"$fieldName\"]",
        "endkey"   => "[\"$category\", \"$fieldName\", {}]",
    )
);
// TODO: Rewrite this using array_filter and array_map.
$sessionResults = array();
foreach ($results as $row) {
    if ($row['key'][2] == $value) {
        continue;
    }
    if ($value === "null" && is_null($row['key'][2])) {
        continue;
    }
    $sessionResults[] = $row['value'];
}
print json_encode($sessionResults);


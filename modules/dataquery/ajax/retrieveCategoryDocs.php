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


ini_set("max_input_vars", '10000');
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
$category    = $_REQUEST['DocType'];
$sessions    = json_decode($_REQUEST['Sessions']);
$keys        = array_map(
    function ($row) use ($category) {
        return array_merge(array($category), $row);
    },
    $sessions
);
$results     = $cdb->queryView(
    "DQG-2.0",
    "instruments",
    array(
        "reduce"       => "false",
        "include_docs" => "true",
        "keys"         => $keys,
    ),
    true
);
$keys        = null;
$cdb         = null;
$client      = null;
//print $results;
/*
$justTheDocs = array_map(function($row) {
    return $row['doc'];
},
$results);
print json_encode($justTheDocs);
 */


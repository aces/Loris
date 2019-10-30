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
$results     = $cdb->queryView(
    "DQG-2.0",
    "search",
    array(
     "reduce"   => "false",
     "startkey" => "[\"$category\", \"$fieldName\", \"$value\"]",
     "endkey"   => "[\"$category\", \"$fieldName\", \"$value"
                          // PHP doesn't have any /u9999 unicode escaping, so
                          //  we use mb_convert_encoding to embed a high
                          //  unicode character
                          . mb_convert_encoding('&#x9999;', 'UTF-8', 'HTML-ENTITIES')
                          . "\"]",
    )
);
$sessionResults = array_map(
    function ($element) {
        return $element['value'];
    },
    $results
);
print json_encode($sessionResults);


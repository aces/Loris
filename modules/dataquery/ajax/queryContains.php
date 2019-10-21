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
$config         = \NDB_Config::singleton();
$couchConfig    = $config->getSetting('CouchDB');
$cdb            = \NDB_Factory::singleton()->couchDB(
    $couchConfig['dbName'],
    $couchConfig['hostname'],
    intval($couchConfig['port']),
    $couchConfig['admin'],
    $couchConfig['adminpass']
);
$category       = $_REQUEST['category'];
$fieldName      = $_REQUEST['field'];
$value          = $_REQUEST['value'];
$results        = $cdb->queryView(
    "DQG-2.0",
    "search",
    array(
        "reduce"   => "false",
        "startkey" => "[\"$category\", \"$fieldName\"]",
        "endkey"   => "[\"$category\", \"$fieldName\", {} ]",
    )
);
$sessionResults = array_filter(
    $results,
    function ($element) use ($value) {
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
$sessionResults = array_values(
    array_map(
        function ($element) {
            return $element['value'];
        },
        $sessionResults
    )
);
print json_encode($sessionResults);


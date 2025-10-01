<?php declare(strict_types=1);

/**
 * Data Querying Module
 *
 * PHP Version 8
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
$user =& User::singleton();
if (!$user->hasPermission('dqt_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit(0);
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
$results        = $cdb->queryView(
    "DQG-2.0",
    "sessions",
    [
        "reduce" => "true",
        "group"  => "true",
    ]
);
$sessionResults = array_map(
    function ($element) {
        return $element['key'];
    },
    $results
);
print json_encode($sessionResults);


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
header("Content-Type: application/json");
$config      = \NDB_Config::singleton();
$couchConfig = $config->getSetting('CouchDB');
$cdb         = \NDB_Factory::singleton()->couchDB(
    $couchConfig['dbName'],
    $couchConfig['hostname'],
    intval($couchConfig['port']),
    $couchConfig['admin'],
    $couchConfig['adminpass']
);
$is_author   = false;
$docID       = urlencode($_REQUEST['DocID']);
$user        = User::singleton();
$tmp_author  = explode("_", $docID);
$doc_author  = str_replace("global:", '', $tmp_author[0]);
if ($doc_author == $user->getUsername()) {
    $is_author = true;
}

if ($user->hasPermission('superuser') || $is_author) {
    $results = $cdb->deleteDoc($docID);
    print json_encode($results);
} else {
    header("HTTP/1.1 403 Forbidden");
}

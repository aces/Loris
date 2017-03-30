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
ini_set("max_input_vars", 4000);
$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . "/../../../project/config.xml");
$user         = User::singleton();
$baseDocument = array(
                 'Meta'       => array(
                                  'DocType' => 'SavedQuery',
                                  'user'    => $user->getUserName(),
                                 ),
                 'Fields'     => array(),
                 'Conditions' => array(),
                );
if (isset($_REQUEST['QueryName'])) {
    $baseDocument['Meta']['name'] = $_REQUEST['QueryName'];
}
if ($_REQUEST['SharedQuery'] === "true") {
    error_log("IN HERE");
    $baseDocument['Meta']['user'] = 'global';
    $baseDocument['Meta']['name'] = $user->getUserName() .
                                    ': ' .
                                    $_REQUEST['QueryName'];
}
$fields = $_REQUEST['Fields'];
$cond   = $_REQUEST['Filters'];
$baseDocument['Conditions'] = $cond;
$baseDocument['Fields']     = $fields;
$cdb = CouchDB::singleton();
print $cdb->postDoc($baseDocument);
?>

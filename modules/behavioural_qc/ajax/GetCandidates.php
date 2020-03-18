<?php
/**
 * This is a file called used by the behavioural qc browser
 * auto-complete to retrieve candidates for a given
 * instrument and/or visit.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
header("content-type:application/json");
ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once "NDB_Client.class.inc";

$user = \User::singleton();
if (!$user->hasPermission('quality_control')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$db          = \NDB_Factory::singleton()->database();
$searchArray = array();

$query = "SELECT DISTINCT ses.candID FROM session AS ses
            JOIN test_battery AS tst
            ON ses.Visit_label = tst.Visit_label
            WHERE ses.candID
            LIKE :searchTerm";

$searchArray[':searchTerm'] = $_REQUEST["query"] . '%';

//Instrument is set adding that to the query.
if (isset($_REQUEST['instrument']) && !empty($_REQUEST['instrument'])
    && $_REQUEST['instrument'] != 'All Instruments'
) {
    $query   .= " AND tst.Test_Name = :NAM";
    $testname = $db->pselect(
        "SELECT Test_name FROM test_names WHERE Full_name =:fname",
        array('fname' => $_REQUEST['instrument'])
    );
    $searchArray['NAM'] = $testname;
}

$result = $db->pselect($query, $searchArray);

$flattened_result = [];

if ($result == null) {
    $flattened_result[0] = "Not found";
} else {
    foreach ($result as $k => $v) {
        $flattened_result[$k] = $v['candID'];
    }
}

$response = [];
$response["suggestions"] = $flattened_result;
print json_encode($response);




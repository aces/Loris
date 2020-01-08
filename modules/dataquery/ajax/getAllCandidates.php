<?php
/**
 * Data Querying for CSVs
 *
 * PHP Version 7
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';

$DB    = \Database::singleton();
$query = $_GET['type'] === 'PSCID'
    ? 'Select PSCID as `value` from candidate'
    : 'Select CandID as `value` from candidate';

$statement = $DB->prepare($query);
$results   = $DB->execute($statement, array());

$sessions = array();

foreach ($results as &$val) {
    $val['field']      = $_GET['type'] === 'PSCID'
    ? 'PSCID'
    : 'CandID';
    $val['fieldType']  = 'varchar(255)';
    $val['instrument'] = 'demographics';
    $val['operator']   = 'equal';
    $val['type']       = 'rule';
    $val['visit']      = 'All';
    $val['session']    = array($val['value']);
    array_push($sessions, $val['value']);
}
$results = array(
    'session'  => $sessions,
    'children' => $results,
);
echo json_encode($results);

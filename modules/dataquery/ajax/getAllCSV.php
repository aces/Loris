<?php

$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';

$DB    = \Database::singleton();
$query = $_GET['type'] === 'PSCID'
    ? 'Select PSCID as `value` from candidate'
    : 'Select CandID as `value` from candidate';

$statement = $DB->prepare($query);
$results   = $DB->execute($statement, array(), array());

foreach ($results as &$val) {
    $val['field'] = $_GET['type'] === 'PSCID'
    ? 'PSCID'
    : 'CandID';
    $val['operator'] = 'equal';
    $val['instrument'] = 'demographics';
    $val['visit'] = 'All';
}

$test = '1234';

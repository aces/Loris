<?php
/**
 * This file is used by the Dashboard to get the data for
 * scan line chart via AJAX
 */

header("content-type:application/json");

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB =& Database::singleton();

$scanData = array();
$scanStartDate = $DB->pselectOne(
    "SELECT min(AcquisitionDate) FROM mri_acquisition_dates", array()
);
$scanEndDate = $DB->pselectOne(
    "SELECT max(AcquisitionDate) FROM mri_acquisition_dates", array()
);
$scanData['labels'] 
    = createChartLabels($scanStartDate, $scanEndDate);
$list_of_sites =& Utility::getSiteList();
foreach ($list_of_sites as $dataset) {
    $scanData['datasets'][] = array(
        "name" => $dataset,
        "data" => getScanData($dataset, $scanData['labels'])
    );
}

print json_encode($scanData);

exit();

function createChartLabels($startDate, $endDate)
{
    $startDateYear = substr($startDate, 0, 4);
    $endDateYear = substr($endDate, 0, 4);
    $startDateMonth = substr($startDate, 5, 2);
    $endDateMonth = substr($endDate, 5, 2);
    $labels = array();
    for ($year = (int)$startDateYear; $year <= (int)$endDateYear; $year++) {
        $startMonth = ($year == (int)$startDateYear) ? (int)$startDateMonth : 1;
        $endMonth = ($year == (int)$endDateYear) ? (int)$endDateMonth : 12;
        for ($month = $startMonth; $month <= $endMonth; $month++) {
            $labels[] = $month . "-" . $year;
        }
    }
    return $labels;
}

function getScanData($dataset, $labels)
{
    $DB =& Database::singleton();
    $data = array();
    foreach ($labels as $label) {
        $month = (strlen($label) == 6) 
            ? substr($label, 0, 1) : substr($label, 0, 2);
        $year = substr($label, -4, 4);
        $data[]= $DB->pselectOne(
            "SELECT count(f.FileID) 
            FROM files f
            LEFT JOIN mri_acquisition_dates mad ON (mad.SessionID=f.SessionID)
            LEFT JOIN session s ON (s.ID=f.SessionID) 
            LEFT JOIN psc ON (psc.CenterID=s.CenterID) 
            WHERE psc.Name=:Dataset 
            AND MONTH(mad.AcquisitionDate)=:Month 
            AND YEAR(mad.AcquisitionDate)=:Year", 
            array('Dataset' => $dataset, 'Month' => $month, 'Year' => $year)
        );
    }
    return $data;
}

?>
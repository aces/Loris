<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment line chart via AJAX
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

$recruitmentData = array();
$recruitmentStartDate = $DB->pselectOne(
    "SELECT min(Date_registered) FROM candidate", array()
);
$recruitmentEndDate = $DB->pselectOne(
    "SELECT max(Date_registered) FROM candidate", array()
);
$recruitmentData['labels'] 
    = createChartLabels($recruitmentStartDate, $recruitmentEndDate);
$list_of_sites =& Utility::getSiteList();
foreach ($list_of_sites as $dataset) {
    $recruitmentData['datasets'][] = array(
        "name" => $dataset,
        "data" => getRecruitmentData(
            $dataset, $recruitmentData['labels']
        )
    );
}

print json_encode($recruitmentData);

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

function getRecruitmentData($dataset, $labels)
{
    $DB =& Database::singleton();
    $data = array();
    foreach ($labels as $label) {
        $month = (strlen($label) == 6) 
            ? substr($label, 0, 1) : substr($label, 0, 2);
        $year = substr($label, -4, 4);
        $data[]= $DB->pselectOne(
            "SELECT count(c.CandID) FROM candidate c 
            LEFT JOIN psc ON (psc.CenterID=c.CenterID) 
            WHERE psc.Name=:Dataset AND MONTH(Date_registered)=$month 
            AND YEAR(Date_registered)=:Year", 
            array('Dataset' => $dataset, 'Year' => $year)
        );
    }
    return $data;
}

?>
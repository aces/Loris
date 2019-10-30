<?php
/**
 * This file is used by the Dashboard to get the data for
 * scan line chart via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */

header("content-type:application/json");

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB = Database::singleton();

$scanData           = array();
$scanStartDate      = $DB->pselectOne(
    "SELECT MIN(AcquisitionDate) FROM mri_acquisition_dates",
    array()
);
$scanEndDate        = $DB->pselectOne(
    "SELECT MAX(AcquisitionDate) FROM mri_acquisition_dates",
    array()
);
$scanData['labels']
    = createLineChartLabels($scanStartDate, $scanEndDate);
$list_of_sites      = Utility::getAssociativeSiteList(true, false);
foreach ($list_of_sites as $siteID => $siteName) {
    $scanData['datasets'][] = array(
                               "name" => $siteName,
                               "data" => getScanData($siteID, $scanData['labels']),
                              );
}

print json_encode($scanData);

return 0;

/**
 * Create chart labels (dates)
 *
 * @param string $startDate start date of scans
 * @param string $endDate   end date of scans
 *
 * @return array
 */
function createLineChartLabels($startDate, $endDate)
{
    $startDateYear  = substr($startDate, 0, 4);
    $endDateYear    = substr($endDate, 0, 4);
    $startDateMonth = substr($startDate, 5, 2);
    $endDateMonth   = substr($endDate, 5, 2);
    $labels         = array();
    for ($year = (int)$startDateYear; $year <= (int)$endDateYear; $year++) {
        $startMonth = ($year == (int)$startDateYear) ? (int)$startDateMonth : 1;
        $endMonth   = ($year == (int)$endDateYear) ? (int)$endDateMonth : 12;
        for ($month = $startMonth; $month <= $endMonth; $month++) {
            $labels[] = $month . "-" . $year;
        }
    }
    return $labels;
}

/**
 * Get scan data for each month in the label array
 *
 * @param string $siteID ID of a site
 * @param array  $labels chart labels (months to query)
 *
 * @return array
 */
function getScanData($siteID, $labels)
{
    $DB   = Database::singleton();
    $data = array();
    foreach ($labels as $label) {
        $month  = (strlen($label) == 6)
            ? substr($label, 0, 1) : substr($label, 0, 2);
        $year   = substr($label, -4, 4);
        $data[] = $DB->pselectOne(
            "SELECT COUNT(distinct s.ID) 
             FROM files f
             LEFT JOIN mri_acquisition_dates mad ON (mad.SessionID=f.SessionID)
             LEFT JOIN session s ON (s.ID=f.SessionID) 
             WHERE s.CenterID=:Site
             AND MONTH(mad.AcquisitionDate)=:Month 
             AND YEAR(mad.AcquisitionDate)=:Year",
            array(
             'Site'  => $siteID,
             'Month' => $month,
             'Year'  => $year,
            )
        );
    }
    return $data;
}



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

$DB            = Database::singleton();
$currentUser   = \User::singleton();
$site          = array();
$list_of_sites = array();

//TODO: Create a permission specific to statistics
if ($currentUser->hasPermission('access_all_profiles')) {
    $list_of_sites = \Utility::getSiteList();
} else {
    $site_id_arr = $currentUser->getCenterIDs();
    foreach ($site_id_arr as $key => $val) {
        $site[$key]          = &Site::singleton($val);
        $list_of_sites[$val] = $site[$key]->getCenterName();
    }
}

$scanData           = array();
$scanStartDate      = $DB->pselectOne(
    "SELECT MIN(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
    array()
);
$scanEndDate        = $DB->pselectOne(
    "SELECT MAX(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
    array()
);
$scanData['labels']
    = createLineChartLabels($scanStartDate, $scanEndDate);
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
    $startDateMonth = substr($startDate, 4, 2);
    $endDateMonth   = substr($endDate, 4, 2);
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
             LEFT JOIN parameter_file pf USING (FileID)
             LEFT JOIN session s ON (s.ID=f.SessionID) 
             JOIN parameter_type pt USING (ParameterTypeID)
             WHERE s.CenterID=:Site
             AND pt.Name='acquisition_date'
             AND MONTH(pf.Value)=:Month 
             AND YEAR(pf.Value)=:Year",
            array(
                'Site'  => $siteID,
                'Month' => $month,
                'Year'  => $year,
            )
        );
    }
    return $data;
}



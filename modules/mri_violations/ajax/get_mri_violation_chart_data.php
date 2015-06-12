<?php
/**
 * This file is used by the MRI Vilations module to get the data for
 * the charts via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Ted Strauss
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

$DB = Database::singleton();

$violationData      = array();
$violationStartDate = $DB->pselectOne(
    "SELECT MIN(Date_registered) FROM candidate",
    array()
);
$violationEndDate   = $DB->pselectOne(
    "SELECT MAX(Date_registered) FROM candidate",
    array()
);

$violationData['labels']
    = createChartLabels($violationStartDate, $violationEndDate);

$list_of_sites = Utility::getAssociativeSiteList(true, false);

foreach ($list_of_sites as $siteID => $siteName) {
    $violationData['datasets'][] = array(
        "name" => $siteName,
        "data" => getViolationData(
            $siteID,
            $violationData['labels']
        ),
    );
}

print json_encode($violationData);

exit();

/**
 * Create chart labels (dates)
 *
 * @param date $startDate start date of recruitment
 * @param date $endDate   end date of recruitment
 *
 * @return array
 */
function createChartLabels($startDate, $endDate)
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
 * Get violation data for each month in the label array
 *
 * @param string $siteID ID of a site
 * @param array  $labels chart labels (months to query)
 *
 * @return array
 */
function getViolationData($siteID, $labels)
{
    $DB   = Database::singleton();
    $data = array();

    foreach ($labels as $label) {
        $month  = (strlen($label) == 6)
            ? substr($label, 0, 1) : substr($label, 0, 2);
        $year   = substr($label, -4, 4);
        $data[] = $DB->pselectOne(
            "SELECT COUNT(c.CandID)
             FROM candidate c
             WHERE c.CenterID=:Site
             AND MONTH(c.Date_registered)=:Month
             AND YEAR(c.Date_registered)=:Year
             AND c.Entity_type='Human'",
            array(
                'Site'  => $siteID,
                'Month' => $month,
                'Year'  => $year,
            )
        );
    }
    return $data;
}

?>

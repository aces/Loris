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

$scanData      = array();
$scanStartDate = $DB->pselectOne(
    "SELECT MIN(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
    array()
);
$scanEndDate   = $DB->pselectOne(
    "SELECT MAX(pf.Value) 
     FROM parameter_file pf 
     JOIN parameter_type pt USING (ParameterTypeID) 
     WHERE pt.Name='acquisition_date'",
    array()
);

// Run a query to get all the data. Order matters to ensure that the labels
// are calculated in the correct order.
$data = $DB->pselect(
    "SELECT s.CenterID, 
        CONCAT(MONTH(pf.Value), '-', YEAR(pf.Value)) as datelabel,
        COUNT(distinct s.ID) as count
    FROM files f
        LEFT JOIN parameter_file pf USING (FileID)
        LEFT JOIN session s ON (s.ID=f.SessionID)
        JOIN parameter_type pt USING (ParameterTypeID)
    WHERE pt.Name='acquisition_date'
    GROUP BY MONTH(pf.Value), YEAR(pf.Value), s.CenterID
    ORDER BY YEAR(pf.Value), MONTH(pf.Value), s.CenterID",
    array()
);

$scanData['labels'] = createLineChartLabels($data);

$list_of_sites = Utility::getSiteList(true, false);
foreach ($list_of_sites as $siteID => $siteName) {
    $scanData['datasets'][] = array(
        "name" => $siteName,
        "data" => getScanData($data, $siteID, $scanData['labels'])
    );
}

/**
 * Massages the data passed into the format expected by C3.
 * Extracts the data for $siteID from $data, and ensures
 * that each label has a value in the correct index of the
 * returned array. Labels not in $data for site are given
 * a value of 0.
 *
 * @param array $data   The data to be extracted from
 * @param int   $siteID The siteID to be extracted
 * @param array $labels A list of labels that should appear
 *                      in the result in the correct order.
 *
 * @return array The data for $siteID massaged into the correct form.
 */
function getScanData(array $data, int $siteID, array $labels)
{
    $sitedata   = array_filter(
        $data,
        function ($row) use ($siteID) {
            return $row['CenterID'] == $siteID;
        }
    );
    $mappeddata = [];
    foreach ($sitedata as $row) {
        $mappeddata[$row['datelabel']] = $row['count'];
    }

    $data = [];
    foreach ($labels as $i => $label) {
        $data[$i] = $mappeddata[$label] ?? 0;
    }
    return $data;
}

/**
 * Extract all month labels that are in $data.
 *
 * @param array $data The data to extract labels from
 *
 * @return array An array of date labels that appear in the data.
 */
function createLineChartLabels(array $data)
{
    // Order was determined by the SQL statement. This should
    // ensure that duplicates (for different sites) are stripped
    // out.
    $labels = [];
    foreach ($data as $row) {
        $labels[$row['datelabel']] = true;
    }
    return array_keys($labels);
}

print json_encode($scanData);

return 0;


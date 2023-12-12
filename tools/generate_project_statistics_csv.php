#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * Generates a CSV report of various statistics about this study.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';

$helper      = new OutputWrapper();
$output_file = sprintf("project_statistics_%s.csv", date('Y-m-d'));
$projectname = $config->getSetting('title');
$helper->printSuccess("Generating project statistics for $projectname");

$headers = [
    'Project',
    'Number of Scanning - Visits',
    'Number of Sites',
    'Variable Count',
    'Number of instruments',
    'total number of visits (for all candidates)',
    'number of candidates',
    'GB of imaging data (raw and processed)',
    'number of scans',
];

// initialize array that will contain the CSV data.
$project_statistics            = [];
$project_statistics['Project'] = $projectname;
// Number of Scanning - Visits
$project_statistics['Number of Scanning - Visits'] = $DB->pselectOne(
    "select count(*) from session where Scan_done='Y'",
    []
);
// Number of Sites
$project_statistics['Number of Sites'] = $DB->pselectOne(
    "select count(*) from psc WHERE CenterID <>1",
    []
);
// Variable Count
$project_statistics['Variable Count'] = $DB->pselectOne(
    "select count(*) from parameter_type 
    where queryable='1' and Name not like '%_status'",
    []
);

// Number of instruments
$project_statistics['Number of instruments'] = $DB->pselectOne(
    "select count(*) from test_names",
    []
);
// Total number of visits (for all candidates)
$project_statistics['total number of visits (for all candidates)'] = $DB->pselectOne(
    "select count(*) from session 
    where Active='Y' AND Current_stage <> 'Not Started'",
    []
);

// Number of candidates
$project_statistics['number of candidates'] = $DB->pselectOne(
    "SELECT count(*) FROM candidate c 
    WHERE c.Active = 'Y' 
    and c.RegistrationCenterID <> 1 
    and c.Entity_type != 'Scanner'",
    []
);

// GB of imaging data (raw and processed).
$project_statistics['GB of imaging data (raw and processed)'] = 'Unknown';
$dir_path = $config->getSetting('imagePath');
if (is_dir($dir_path)) {
    $result = shell_exec(
        sprintf(
            "du --total %s | tail -n 1 | cut -f 1",
            escapeshellarg($dir_path)
        )
    );
    // Convert bytes to GB and format to nine decimal places. This is done
    // because the desired unit is GB but it's hard to distinguish a small
    // folder from a rounding error without this level of precision.
    $project_statistics['GB of imaging data (raw and processed)']
        = number_format(
            floatval(trim($result) / 1000000000),
            9,
            '.',
            ''
        );
} else {
    $helper->printError(
        'Image path setting is invalid. Cannot calculate size of imaging data'
    );
}
// number of scans
$project_statistics['number of scans'] = $DB->pselectOne(
    "select count(*) from files",
    []
);

// Extracts data from each query and puts into $project_statistics array
$project_statistics['Project'] = $projectname;

// Adds headers and project statistics into csv file
$fp = fopen($output_file, 'w');
fputcsv($fp, $headers);
fputcsv($fp, $project_statistics);
fclose($fp);

$recipient = 'loris.info@mcin.ca';
$helper->printSuccess("Project statistics generated: $output_file");
$helper->printSuccess("Please email this file to $recipient.");

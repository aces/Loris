#!/usr/bin/env php
<?php
/**
 * Generates a CSV report of various statistics about this study.
 *
 * @license Loris license
 */

require_once 'generic_includes.php';

$date        = date("m_d_Y");
$output_file = "project_statistics_$date.csv";
$fp          = fopen($output_file, 'w');
echo "PROJECT STATISTICS SCRIPT - $date\n\n";
echo "Data can be found in $output_file.\n\n";

$headers = array(
    'Project',
    'Number of Scanning - Visits',
    'Number of Sites',
    'Variable Count',
    'Number of instruments',
    'total number of visits (for all candidates)',
    'number of candidates',
    'GB of imaging data (raw and processed)',
    '# of scans',
);

$counter = 0;


// Where project's statistics will be stored
$project_statistics = array();
// Project name
$projectname = $config->getSetting('title');
// Number of Scanning - Visits
$number_scanning_visits = $db->pselectOne(
    "select count(*) from session where Scan_done='Y'",
    array()
);
// Number of Sites
$number_sites = $db->pselectOne(
    "select count(*) from psc WHERE CenterID <>1",
    array()
);
// Variable Count
$variable_count = $db->pselectOne(
    "select count(*) from parameter_type 
    where queryable='1' and Name not like '%_status'",
    array()
);

// Number of instruments
$number_instruments = $db->pselectOne("select count(*) from test_names", array());
// Total number of visits (for all candidates)
$number_visits = $db->pselect(
    "select count(*) from session 
    where Active='Y' AND Current_stage <> 'Not Started'",
    array()
);

// Number of candidates
$number_candidates = $db->pselectOne(
    "SELECT count(*) FROM candidate c 
    WHERE c.Active = 'Y' 
    and c.RegistrationCenterID <> 1 
    and c.Entity_type != 'Scanner'",
    array()
);

// GB of imaging data (raw and processed)
$dir_path = $config->getSetting('imagePath');
if (file_exists($dir_path)) {
    exec("du -h $dir_path");
} else {
}
// of scans
$number_scans = $db->pselect("select count(*) from files", array());

$queries = array(
    'number_scanning_visits',
    'number_sites',
    'variable_count',
    'number_instruments',
    'number_visits',
    'number_candidates',
    'gb_imaging_data',
    'number_scans',
);

// Extracts data from each query and puts into $project_statistics array
$project_statistics[$headers[0]] = $projectname;
$i = 1;
// @var int The number of remaining headers to check after the first header
// has been manually added above. NOTE This comment not written by the author
// of the script.
$numHeaders = count($queries) - 1;

foreach ($queries as $query) {
    if ($i != $numHeaders) {
        foreach ($query as $j => $row) {
            foreach ($row as $k => $count) {
                $project_statistics[$headers[$i]] = $count;
            }
            $i++;
            break;
        }
    } elseif ($i == $numHeaders) {
        $units_array = array(
            'B' => 0.000000001,
            'K' => 0.000001,
            'M' => 0.001,
            'G' => 1,
        );
        $sum         = 0.0;

        foreach ($gb_imaging_data_array as $key => $row) {
            $data = explode('./', $row, 2);

            $data_size = (float)substr($data[0], 0, -2);
            $data_unit = rtrim(substr($data[0], -2));
            foreach ($units_array as $unit => $numBytes) {
                if ($unit == $data_unit) {
                    $sum += $data_size * $numBytes;
                    break;
                }
            }
        }
        $project_statistics[$headers[$i]] = $sum;
        $i++;
    }
}

// If query is blank, populate csv with "Unknown"
foreach ($headers as $header) {
    if ($project_statistics[$header] == null) {
        $project_statistics[$header] = "Unknown";
    }
}

// Adds headers and project statistics into csv file
fputcsv($fp, $headers);
fputcsv($fp, $project_statistics);

echo "File writing for $projectname complete.\n\n";

fclose($fp);

$recipient = "loris-dev@bic.mni.mcgill.ca";

echo "Please email $output_file to $recipient.\n\n";

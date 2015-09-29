<?php
/**
 * Created by PhpStorm.
 * User: Stella
 * Date: 15-08-15
 * Time: 12:08 PM
 *
 * Project Statistics - Updating Counts From Each LORIS
 *
 */

set_include_path(get_include_path().":../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";
require_once"Utility.class.inc";
require_once"Database.class.inc";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize('../project/config.xml');

$db =& Database::singleton();

//$projects = array(
//    'IBIS',
//    'GUSTO',
//    'Prevent-AD',
//    'NeuroDevNet (total)',
//    'Memory Clinic',
//    '1000 Gehirne-Studie',
//    'MAVAN',
//    'Korea',
//    'Vermont',
//    'India',
//    'Gen-R',
//    'Parkinson Network',
//    'Resting State (Mathieu)',
//    'ABIDE',
//    'AddNeuroMed',
//    'CCNA',
//    'BigBrain',
//    'CanadaChina',
//    'MEG - R2M',
//    'NIHPD',
//    'CIMA-Q',
//    'Cuba?',
//    'CITA?'
//);

// Location of Project Statistics Google Doc
$google_doc = 'https://docs.google.com/spreadsheets/d/11MY91v0SrygAKI9bUQ7JXA5JGBXwJZPfmtZAmt23pKM/edit#gid=0';

$date = date("m_d_Y");
$output_file = "redmine8083_$date.csv";
$fp = fopen($output_file, 'w');
echo "PROJECT STATISTICS SCRIPT - $date\n\n";
echo "Data can be found in $output_file.\n\n";

// project name used for Header 1 and to find project size (in GB, query 7)
$user_input = readline("What is the name of your project? ");
$projectname = rtrim($user_input);

// Where project's statistics will be stored
$project1 = array();

// Number of Scanning - Visits
$query1 = $db->pselect("select count(*) from session where Scan_done='Y'", array());

// Number of Sites
$query2 = $db->pselect("select count(*), Name from psc WHERE CenterID <>1", array());

// Variable Count
$query3 = $db->pselect("select count(*) from parameter_type where queryable='1' and Name not like '%_status'", array());

// Number of instruments
$query4 = $db->pselect("select count(*) from test_names", array());

// Total number of visits (for all candidates)
$query5 = $db->pselect("select count(*) from session where Active='Y' AND Current_stage <> 'Not Started'", array());

// Number of candidates
$query6 = $db->pselect("SELECT count(*) FROM candidate c WHERE c.Active = 'Y' and c.CenterID <> 1 and pscid <> 'scanner'", array());

// GB of imaging data (raw and processed)
$handle = fopen ('php://stdin', 'r');
$dir_name = "/data/$projectname/data";
if(file_exists($dir_name)) {
    exec("cd /data/$projectname/data;du -h .");
    $query7 = fgets($handle);
} else {
    $query7 = NULL;
}
fclose($handle);

// # of scans
$query8 = $db->pselect("select count(*) from files", array());


$headers = array(
    'Project',
    'Number of Scanning - Visits',
    'Number of Sites',
    'Variable Count',
    'Number of instruments',
    'total number of visits (for all candidates)',
    'number of candidates',
    'GB of imaging data (raw and processed)',
    '# of scans'
);

// Extracts data from each query and puts into $project1 array
$project1[$headers[0]] = $projectname;

foreach($query1 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[1]] = $count;
    }
    break;
}
foreach($query2 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[2]] = $count;
    }
    break;
}
foreach($query3 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[3]] = $count;
    }
    break;
}
foreach($query4 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[4]] = $count;
    }
    break;
}
foreach($query5 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[5]] = $count;
    }
    break;
}
foreach($query6 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[6]] = $count;
    }
    break;
}

$project1[$headers[7]] = $query7;

foreach($query8 as $i => $row) {
    foreach($row as $j => $count) {
        $project1[$headers[8]] = $count;
    }
    break;
}

foreach($headers as $header) {
    if($project1[$header] == NULL) {
        $project1[$header] = "Unknown";
    }
}

// Adds headers and project statistics into csv file
fputcsv($fp, $headers);

fputcsv($fp, $project1);

echo "File writing for $projectname complete.\n\n";

fclose($fp);

echo "PLEASE UPDATE $google_doc\n";

?>


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


set_include_path(get_include_path().":../libraries:../../php/libraries:");
require_once __DIR__ . "/../../vendor/autoload.php";
require_once "NDB_Client.class.inc";
require_once"Utility.class.inc";
require_once"Database.class.inc";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize('../config.xml');

$db =& Database::singleton();


$projects = array(
    'IBIS',
    'GUSTO',
    'Prevent-AD',
    'NeuroDevNet (total)',
    'Memory Clinic',
    '1000 Gehirne-Studie',
    'MAVAN',
    'Korea',
    'Vermont',
    'India',
    'Gen-R',
    'Parkinson Network',
    'Resting State (Mathieu)',
    'ABIDE',
    'AddNeuroMed',
    'CCNA',
    'BigBrain',
    'CanadaChina',
    'MEG - R2M',
    'NIHPD',
    'CIMA-Q',
    'Cuba?',
    'CITA?'
);

$date = date(m_d_Y);

$fp = fopen("redmine8083_$date.csv", 'w');

$query = array();
//Project Name
$query[0]= '?';
//Number of Scanning - Visits
$query[1] = $db->pselect("select count(*) from session where Scan_done='Y'", array());
//Number of Sites
$query[2] = $db->pselect("select count(*), Name from psc WHERE CenterID <>1", array());
//Variable Count
$query[3] = $db->pselect("select count(*) from parameter_type where queryable='1' and Name not like '%_status'", array());
//Number of instruments
$query[4] = $db->pselect("select count(*) from test_names", array());
//total number of visits (for all candidates)
$query[5] = $db->pselect("select count(*) from session where Active='Y' AND Current_stage <> 'Not Started'", array());
//number of candidates
$query[6] = $db->pselect("SELECT count(*) FROM candidate c WHERE c.Active = 'Y' and c.CenterID <> 1 and pscid <> 'scanner'", array());
//GB of imaging data (raw and processed)
$handle = fopen ('php://stdin', 'r');
exec('cd /data/$projectname/data;du -h .');
$query[7] = fgets($handle);
fclose($handle);
//# of scans
$query[8] = $db->pselect("select count(*) from files", array());

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

$project1 = array();

$i=0;
foreach ($headers as $header) {
    fputcsv($fp, $header);
    $project1 = array_merge($project1, array($header => $query[$i][0]));
    $i++;
}


foreach ($project1 as $fields) {
    fputcsv($fp, $fields);
}


fclose($fp);

?>


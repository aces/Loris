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



/*
 * Project List:
IBIS
GUSTO
Prevent-AD
NeuroDevNet (total)
Memory Clinic
1000 Gehirne-Studie
MAVAN
Korea
Vermont
India
Gen-R
Parkinson Network
Resting State (Mathieu)
ABIDE
AddNeuroMed
CCNA
BigBrain
CanadaChina
MEG - R2M
NIHPD
CIMA-Q
Cuba?
CITA?
*/

//Number of Scanning - Visits
$query1 = $db->pselect("select count(*) from session where Scan_done='Y'");
//Number of Sites
$query2 = $db->pselect("select count(*), Name from psc WHERE CenterID <>1");
//Variable Count
$query3 = $db->pselect("select count(*) from parameter_type where queryable='1' and Name not like '%_status'");
//Number of instruments
$query4 = $db->pselect("select count(*) from test_names");
//total number of visits (for all candidates)
$query5 = $db->pselect("select count(*) from session where Active='Y' AND Current_stage <> 'Not Started'");
//number of candidates
$query6 = $db->pselect("SELECT count(*) FROM candidate c WHERE c.Active = 'Y' and c.CenterID <> 1 and pscid <> 'scanner'");
//GB of imaging data (raw and processed)
//cd /data/$projectname/data;du -h .
//# of scans
$query7 = $db->pselect("select count(*) from files");



?>
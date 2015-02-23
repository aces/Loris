<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment bar chart via AJAX
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

$DB =& Database::singleton();
$genderData = array();
$list_of_sites = Utility::getSiteList();
foreach ($list_of_sites as $site) {
    $genderData['labels'][] = $site;
    $genderData['datasets']['female'][] = $DB->pselectOne(
        "SELECT count(c.CandID) FROM candidate c
        LEFT JOIN psc ON (psc.CenterID=c.CenterID)
        WHERE c.Gender='female' AND c.Active='Y' AND psc.Name=:Site", array('Site' => $site)
    );
    $genderData['datasets']['male'][] = $DB->pselectOne(
        "SELECT count(c.CandID) FROM candidate c
        LEFT JOIN psc ON (psc.CenterID=c.CenterID)
        WHERE c.Gender='male' AND c.Active='Y' AND psc.Name=:Site", array('Site' => $site)
    );
}
print json_encode($genderData);

exit();

?>

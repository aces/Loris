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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

header("content-type:application/json");
ini_set('default_charset', 'utf-8');

$DB            = Database::singleton();
$genderData    = array();
$list_of_sites = Utility::getAssociativeSiteList(true, false);

foreach ($list_of_sites as $site) {
    $genderData['labels'][] = $site;
    $genderData['datasets']['female'][] = $DB->pselectOne(
        "SELECT count(c.CandID)
         FROM candidate c
         LEFT JOIN psc ON (psc.CenterID=c.CenterID)
         WHERE c.Gender='female' AND c.Active='Y'
         AND c.Entity_type='Human' AND psc.Name=:Site",
        array('Site' => $site)
    );
    $genderData['datasets']['male'][]   = $DB->pselectOne(
        "SELECT count(c.CandID)
         FROM candidate c
         LEFT JOIN psc ON (psc.CenterID=c.CenterID)
         WHERE c.Gender='male' AND c.Active='Y'
         AND c.Entity_type='Human' AND psc.Name=:Site",
        array('Site' => $site)
    );
}

print json_encode($genderData);

exit();

?>

<?php
/**
 * This file is used by the Dashboard to get the data for
 * the recruitment pie chart via AJAX
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

ini_set('default_charset', 'utf-8');

$DB = Database::singleton();

$recruitmentBySiteData = array();
$list_of_sites         = Utility::getSiteList();

foreach ($list_of_sites as $site) {

    $totalRecruitment = $DB->pselectOne(
        "SELECT count(c.CandID)
         FROM candidate c LEFT JOIN psc ON (psc.CenterID=c.CenterID)
         WHERE c.Active='Y' AND psc.Name=:Site",
        array('Site' => $site)
    );

    $recruitmentBySiteData[] = array(
                                "label" => $site,
                                "total" => $totalRecruitment,
                               );
}

print json_encode($recruitmentBySiteData);

exit();

?>

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
$list_of_sites         = Utility::getAssociativeSiteList(true, false);

foreach ($list_of_sites as $siteID => $siteName) {

    $totalRecruitment = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE
           c.RegistrationCenterID=:Site AND
           c.Active='Y' AND
           c.Entity_type='Human'",
        array('Site' => $siteID)
    );

    $recruitmentBySiteData[] = array(
        "label" => $siteName,
        "total" => $totalRecruitment,
    );
}

print json_encode($recruitmentBySiteData);

return 0;



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
$sexData       = array();
$currentUser   = \User::singleton();
$site          = array();
$list_of_sites = array();


//TODO: Create a permission specific to statistics
if ($currentUser->hasPermission('access_all_profiles')) {
    $list_of_sites = \Utility::getSiteList();
} else {
    $site_id_arr = $currentUser->getCenterIDs();
    foreach ($site_id_arr as $key => $val) {
        $site[$key]          = &Site::singleton($val);
        $list_of_sites[$val] = $site[$key]->getCenterName();
    }
}

foreach ($list_of_sites as $siteID => $siteName) {
    $sexData['labels'][] = $siteName;
    $sexData['datasets']['female'][] = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE c.RegistrationCenterID=:Site AND c.Sex='female' AND c.Active='Y'
         AND c.Entity_type='Human'",
        array('Site' => $siteID)
    );
    $sexData['datasets']['male'][]   = $DB->pselectOne(
        "SELECT COUNT(c.CandID)
         FROM candidate c
         WHERE c.RegistrationCenterID=:Site AND c.Sex='male' AND c.Active='Y'
         AND c.Entity_type='Human'",
        array('Site' => $siteID)
    );
}

print json_encode($sexData);

return 0;



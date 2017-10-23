<?php
/**
 * This is a hack to get some dynamic variables which aren't easily
 * available through the API that are required for populating filters.
 * It should be removed if the functionality is added to a new version
 * of the LORIS API.
 *
 * The list of visits is only available on a per-project, not a per-LORIS
 * basis, and the list of subprojects is not available through the API.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_List
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

// FIXME: This is a stupid requirement, but it holds over from before
// the code was reactified..
require_once __DIR__
    . "/../../candidate_parameters/php/"
    . "NDB_Form_candidate_parameters.class.inc";
$user = User::singleton();

// Construct the list of sites in the same way it was done in the NDB_Menu_Filter
// before being switched to react. FIXME: This should be changed to API calls if possible.
$list_of_sites = array();
if ($user->hasPermission('access_all_profiles')) {
    // get the list of study sites - to be replaced by the Site object
    $list_of_sites = Utility::getSiteList();
    if (is_array($list_of_sites)) {
        $list_of_sites = array('' => 'All') + $list_of_sites;
    }
} else {
    // allow only to view own site data
    $list_of_sites = array();
    $site_arr      = $user->getData('CenterIDs');
    foreach ($site_arr as $key => $val) {
        $site[$key] = &Site::singleton($val);
        if ($site[$key]->isStudySite()) {
            $list_of_sites[$val] = $site[$key]->getCenterName();
        }
    }
    $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
}

$pOptions = NDB_Form_candidate_parameters::getParticipantStatusOptions();
print json_encode(array(
    'subprojects' => Utility::getSubprojectList(),
    'visits' => Utility::getVisitList(),
    'sites' => $list_of_sites,
    'participantstatus' => $pOptions, 
));

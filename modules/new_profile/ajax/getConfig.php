<?php
/**
 * Media downloader.
 *
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Alex I. <ailea.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */
require_once "Utility.class.inc";
        $user = \User::singleton();
if (!$user->hasPermission('media_write')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
        $DB   = \Database::singleton();
        $config =& \NDB_Config::singleton();
        $result    = array();
        $config    =& \NDB_Config::singleton();
        $result['startYear'] = $config->getSetting('startYear');
        $result['endYear']   = $config->getSetting('endYear');
        $result['ageMax']    = $config->getSetting('ageMax');
        $result['ageMin']    = $config->getSetting('ageMin');
        $result['dobFormat'] = $config->getSetting('dobFormat');
        $result['edc']       = $config->getSetting('useEDC');
        $result['useProject']= $config->getSetting('useProjects');
        $result['gender']    = ['male' =>  "Male",'female' =>  "Female"];
        $result['pscidSet']  = "false";
        //get sites for the select dropdown  
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);

        if ($num_sites >1) {
            foreach ($user_list_of_sites as $key => $siteID) {
                $center = $DB->pselectRow(
                    "SELECT CenterID as ID, Name FROM psc WHERE CenterID =:cid",
                    array('cid' => $siteID)
                );
                $psc_labelOptions[$siteID] = $center['Name'];
            }
        } else {
          $psc_labelOptions = array(null => '');
        }

        $result['site']       = $psc_labelOptions;

        //get projects for the select dropdown
        $projects         = \Utility::getProjectList();
        foreach ($projects as $key=>$value) {
             $list_of_projects[$key] = $value;
        }
        $result['project']       = $list_of_projects;

        //get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $result['pscidSet']  = "true";
        }

        //returned as a string
        echo json_encode($result);
?>

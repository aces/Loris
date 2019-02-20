<?php
/**
 * New_profile
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\new_profile;
/**
 * New_profile
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class New_Profile extends \NDB_Page
{
    public $result;
    public $AjaxModule   = true;
    public $skipTemplate = true;
    
    /**
     * Tie the access to a data_entry permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        $site_arr      = $user->getData('CenterIDs');
        $userInDCCSite = in_array("1", $site_arr);
        if ($user->hasStudySite() or $userInDCCSite) {
            return $user->hasPermission('data_entry');
        }

        return false;
    }
    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        $DB = \Database::singleton();
        $config    = \NDB_Config::singleton();
        $user      = \User::singleton();
        $this->result['startYear']  = $config->getSetting('startYear');
        $this->result['endYear']    = $config->getSetting('endYear');
        $this->result['ageMax']     = $config->getSetting('ageMax');
        $this->result['ageMin']     = $config->getSetting('ageMin');
        $this->result['dobFormat']  = $config->getSetting('dobFormat');
        $this->result['edc']        = $config->getSetting('useEDC');
        $this->result['useProject'] = $config->getSetting('useProjects');
        $this->result['gender']     = [
                                       'male'   => "Male",
                                       'female' => "Female",
                                      ];
        $this->result['pscidSet']   = "false";
        //get sites for the select dropdown
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites >=1) {
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
         $this->result['site'] = $psc_labelOptions;
         //get projects for the select dropdown
        $projects = \Utility::getProjectList();
        foreach ($projects as $key=>$value) {
             $list_of_projects[$key] = $value;
        }
        $this->result['project'] = $list_of_projects;
         //get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $result['pscidSet'] = "true";
        }
        return true;
    }
   /**
    * Call toJSON to display a json file on the page.
    */
    function display()
    {
       return $this->toJSON();
    }
    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $results = $this->result;
        return json_encode($results);
    }
    /**
     * Include additional JS files:
     *  1. editForm.js - reactified form to update media
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/new_profile/js/NewProfileIndex.js"]
        );
    }

}

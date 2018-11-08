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
class New_Profile extends \NDB_Form
{
    /**
     * Tie the access to a data_entry permission
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

        $site_arr      = $user->getData('CenterIDs');
        $userInDCCSite = in_array("1", $site_arr);
        if ($user->hasStudySite() or $userInDCCSite) {
            return $user->hasPermission('data_entry');
        }

        return false;
    }
    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        // set up the arguments to Candidate::createNew
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();
        $dob    = empty($values['dob1']) ? null : $values['dob1'];

        $edc = null;
        if ($config->getSetting('useEDC') == "true") {
            $edc = empty($values['edc1']) ? null : $values['edc1'];
        }

        // create the candidate
        $DB        = \Database::singleton();
        $site_arr  = $user->getData('CenterIDs');
        $num_sites = count($site_arr);

        if ($num_sites >1) {
            $candID = \Candidate::createNew(
                $values['psc'],
                $dob,
                $edc,
                $values['gender'],
                $values['PSCID'] ?? null
            );
        } else {
            $centerIDs = $user->getData('CenterIDs');
            $centerID  = $centerIDs[0];
            $candID    = \Candidate::createNew(
                $centerID,
                $dob,
                $edc,
                $values['gender'],
                $values['PSCID'] ?? null
            );
        }

        // get the candidate
        $candidate =& \Candidate::singleton($candID);

        if ($config->getSetting('useProjects') == "true") {
            $candidate->setData('ProjectID', $values['ProjectID']);

        }

        //------------------------------------------------------------

        $this->tpl_data['success'] = true;
        $this->tpl_data['candID']  = $candID;
        $this->tpl_data['PSCID']   = $candidate->getPSCID();

        // freeze it, just in case
        $this->form->freeze();
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function _setupVariables()
    {
        $result    = array();
        $config    =& \NDB_Config::singleton();
        $result['startYear'] = $config->getSetting('startYear');
        $result['endYear']   = $config->getSetting('endYear');
        $result['ageMax']    = $config->getSetting('ageMax');
        $result['ageMin']    = $config->getSetting('ageMin');
        $result['dobFormat'] = $config->getSetting('dobFormat');
        $result['edc']       = $config->getSetting('useEDC');
        //returned as a string
        return json_encode($result);
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
            [$baseURL . "/new_profile/js/newIndex.js"]
        );
    }
}

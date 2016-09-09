<?php
/**
 * This file contains the NDB_Form_candidate_parameters class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Candidate Parameter
 * @author   MOB <mob@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once 'NDB_Form.class.inc';

/**
 * Main class for candidate_parameters module corresponding to /candidate_parameters/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of candidate_parameters files and control panel to search them and upload
 * new ones.
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Candidate Parameter
 * @author   MOB <mob@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form_candidate_parameters extends NDB_Form
{
    public $hasWritePermission = false;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& User::singleton();

        // Set global permission to control access to different modules of candidate_parameters page
        $this->hasWritePermission = $user->hasPermission('candidate_parameter_edit');

        return $user->hasPermission('candidate_parameter_view');
    }

    /**
     * @throws DatabaseException
     */
    function candidate_parameters()
    {
        $DB =& Database::singleton();
        $config =& NDB_Config::singleton();

        $candidate =& Candidate::singleton($this->identifier);

        // candID
        $this->tpl_data['candID'] = $candidate->getData('CandID');

        // consent
        $consent = $config->getSetting('ConsentModule');

        $this->tpl_data['useConsent'] = $consent['useConsent'];
    }

    /**
     * Gets the participant_status options from participant_status_options
     * getParticipantStatusOptions()
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusOptions()
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description FROM participant_status_options WHERE parentID IS NULL",
            array()
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Gets the participant_status options suboptions from participant_status_options
     * getParticipantStatusSubOptions()
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusSubOptions($parentID)
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description FROM participant_status_options WHERE parentID=:pid",
            array('pid'=>$parentID)
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Include additional CSS files:
     *  1. candidate_parameters.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/candidate_parameters/css/candidate_parameters.css"]
        );
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *  1. candidateInfo.js
     *  2. probandInfo.js
     *  3. familyInfo.js
     *  4. participantStatus.js
     *  5. consentStatus.js
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/candidate_parameters/js/candidateInfo.js",
                $baseURL . "/candidate_parameters/js/probandInfo.js",
                $baseURL . "/candidate_parameters/js/familyInfo.js",
                $baseURL . "/candidate_parameters/js/participantStatus.js",
                $baseURL . "/candidate_parameters/js/consentStatus.js"
            )
        );
    }
}
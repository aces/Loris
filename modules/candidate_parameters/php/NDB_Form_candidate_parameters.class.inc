<?php
/**
 * This file contains the NDB_Form_candidate_parameters class
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_Parameters
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Main class for candidate_parameters module
 * corresponding to /candidate_parameters/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of candidate_parameter categories
 * and tabs to view them.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_Parameters
 * @author   MOB <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form_Candidate_Parameters extends NDB_Form
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

        // Set global permission to control access
        // to different modules of candidate_parameters page
        $this->hasWritePermission = $user->hasPermission('candidate_parameter_edit');

        return $user->hasPermission('candidate_parameter_view');
    }

    /**
     * Override default behaviour, since the page is loaded from index.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }

    /**
     * Gets CandID and whether the consent tab should be displayed
     *
     * @throws DatabaseException
     *
     * @return void
     */
    function candidate_parameters()//@codingStandardsIgnoreLine
    {
        $config    =& NDB_Config::singleton();
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
    static function getParticipantStatusOptions()
    {
        $DB           =& Database::singleton();
        $options      = $DB->pselect(
            "SELECT ID,Description
            FROM participant_status_options
            WHERE parentID IS NULL",
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
     * @param int $parentID parent ID of the participant status option
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusSubOptions($parentID)
    {
        $DB           =& Database::singleton();
        $options      = $DB->pselect(
            "SELECT ID,Description 
            FROM participant_status_options 
            WHERE parentID=:pid",
            array('pid' => $parentID)
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Include the Tabs.js and index.js (entry point of the module)
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/js/components/Tabs.js",
             $baseURL . "/candidate_parameters/js/index.js",
            )
        );
    }
}

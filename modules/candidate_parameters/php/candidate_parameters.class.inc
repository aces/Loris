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
namespace LORIS\candidate_parameters;
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
class Candidate_Parameters extends \NDB_Form
{
    public $hasWritePermission = false;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws \ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();

        // Set global permission to control access
        // to different modules of candidate_parameters page
        $this->hasWritePermission = $user->hasPermission('candidate_parameter_edit');

        return $user->hasPermission('candidate_parameter_view');
    }

    /**
     * Override default behaviour, since the page is loaded from index.js
     *
     * @return string
     */
    function display()
    {
        return "";
    }

    /**
     * Gets the participant_status options from participant_status_options
     * getParticipantStatusOptions()
     *
     * @note   This function was moved to the Candidate class and should be removed
     *       in the next major release
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    static function getParticipantStatusOptions()
    {
        error_log(
            "Function getParticipantStatusOptions() was moved out of ".
            "the NDB_Form_Candidate_Parameters class and will be removed in ".
            "the next Major release. Refer to the Candidate class for new location."
        );
        $DB      =& \Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description
            FROM participant_status_options
            WHERE parentID IS NULL",
            array()
        );
        return \Candidate::getParticipantStatusOptions();
    }

    /**
     * Gets the participant_status options suboptions from participant_status_options
     * getParticipantStatusSubOptions()
     *
     * @param int $parentID parent ID of the participant status option
     *
     * @note This function was moved to the Candidate class and should be removed
     *       in the next major release
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusSubOptions($parentID)
    {
        error_log(
            "Function getParticipantStatusSubOptions() was moved out of ".
            "the NDB_Form_Candidate_Parameters class and will be removed in ".
            "the next Major release. Refer to the Candidate class for new location."
        );
        $DB      =& \Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description 
            FROM participant_status_options 
            WHERE parentID=:pid",
            array('pid' => $parentID)
        );
        return Candidate::getParticipantStatusSubOptions($parentID);
    }

    /**
     * Include the Tabs.js and index.js (entry point of the module)
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
            array(
             $baseURL . "/candidate_parameters/js/CandidateParameters.js",
            )
        );
    }
}

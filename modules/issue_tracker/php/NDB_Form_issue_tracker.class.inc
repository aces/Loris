<?php
/**
 * This file contains the NDB_Form_issue_tracker class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  issue_tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once "NDB_Form.class.inc";
require_once __DIR__ . '/issue_tracker_ControlPanel.class.inc';

/**
 * Creates the form for NDB_Form_issue_tracker
 *
 * @category Loris
 * @package  issue_tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class NDB_Form_issue_tracker extends NDB_Form
{
    /**
     * Entry point for issue_tracker/edit.
     * No id is required; if no id is provided then the user will have the option to create a new issue.
     * If no id is provided and the user does not have permission to create an issue then 403 forbidden will be displayed.
     *
     * @return void
     */
    function edit()
    {
        $user =& User::singleton();
        $issueID = $_GET['issueID'];

        // Check if media file exists, if not redirect to /media/ page
        if (empty($issueID) && !$user->hasPermission('issue_tracker_can_assign')){ //todo: fix this when you change permissions
            header("HTTP/1.1 403 Forbidden");
        }
    }


    /**
     * Include issue_tracker.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/issue_tracker/css/issue_tracker.css"]
        );
    }


    /**
    * Gets control panel
    *
    * @return $controlPanel
    */
    function getControlPanel() 
    {
        $controlPanel = new issue_tracker_ControlPanel($_REQUEST['sessionID']);
        return $controlPanel->display();
    }


    /**
     * Include editIssue.js
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
            [$baseURL . "/issue_tracker/js/editIssue.js"]
        );
    }

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

        return $user->hasPermission('issue_tracker_can_change_status'); //todo: change this to something more appropriate.
    }

}

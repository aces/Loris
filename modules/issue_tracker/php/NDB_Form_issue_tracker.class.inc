<?php

/**
 * This file features the code for the form portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 * @category   Loris
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */

require_once "NDB_Form.class.inc";
require_once __DIR__ . '/issue_tracker_ControlPanel.class.inc';

/**
 * Creates the form for NDB_Form_issue_tracker
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class NDB_Form_Issue_Tracker extends NDB_Form
{

    /**
 * Entry point for issue_tracker/edit.
 *
 * @return void
 */
    function edit()
    {
        $user    =& User::singleton();
        $issueID = $_GET['issueID'];

        if ((empty($issueID)
            || !isset($issueID))
            && !$user->hasPermission('issue_tracker_reporter')
        ) {
            header("HTTP/1.1 403 Forbidden");
        }
    }

    /**
     * Entry point for issue_tracker/edit.
     *
     * @return void
     */
    function newIssue()
    {
        $user    =& User::singleton();
        $issueID = $_GET['issueID'];

        if ((empty($issueID)
            || !isset($issueID))
            && !$user->hasPermission('issue_tracker_reporter')
        ) {
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
        $controlPanel = new issue_tracker_ControlPanel($_GET['issueID']);
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
     * Checks if the user has the ability to *view* the issue page
     * Does not govern editing abilities; those are controlled by editIssue.js
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        $user    =& User::singleton();
        $db      = Database::singleton();
        $issueID = $_GET['issueID'];

        if (!$issueID) {
            return true;
        }

        $issueData = $db->pselectRow(
            "SELECT centerID FROM issues WHERE issueID=:issueID",
            ['issueID' => $issueID]
        );

        if (($issueData['centerID'] == $user->getData('CenterID'))
            || ($user->hasPermission('access_all_profiles'))
            || (!empty($issueData['centerID']))
        ) {
            return true;
        } else {
            return false;
        }
    }

}

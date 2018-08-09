<?php
/**
 * This file contains the NDB_Form_media class
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\battery_manager;

/**
 * Creates the Edit form for NDB_Form_battery_manager
 *
 * @category Loris
 * @package  Battery_Manager
 * @author   Victoria Foing <victoria.foing@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Entry point for /battery_manager/edit/
     * Checks if entry id is provided and otherwise redirects to
     * /battery_manager/ page
     *
     * @return none
     */
    function setup()
    {
        parent::setup();

        $db      =& \Database::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        // Get ID of entry that was selected for editing
        $entryID = $_GET['id'];

        // Check if entry exists, if not redirect to /battery_manager/ page
        if (isset($entryID)) {
            $result = $db->pselectRow(
                "SELECT id FROM test_battery WHERE id = :entryID",
                array('entryID' => $entryID)
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/battery_manager/');
            }
        } else {
            header('Location: ' . $baseURL . '/battery_manager/');
        }
    }

    /**
     * Include additional CSS files:
     *  1. battery_manager.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/battery_manager/css/battery_manager.css",
            )
        );
    }

    /**
     * Include additional JS files:
     *  1. editEntry.js - reactified form to update test_battery
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
             $baseURL . "/battery_manager/js/editEntryIndex.js",
            )
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
        $user =& \User::singleton();

        return $user->hasPermission('battery_manager_edit');
    }

}

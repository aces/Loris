<?php
/**
 * This file contains the NDB_Form_media class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

/**
 * Creates the form for NDB_Form_media
 *
 * @category Loris
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Form_Media extends NDB_Form
{
    /**
     * Entry point for /media/edit/
     * Checks if file id is provided and otherwise redirects to /media/ page
     *
     * @throws DatabaseException
     *
     * @return void
     */
    function edit()
    {
        $db      =& Database::singleton();
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $idMediaFile = $_GET['id'];

        // Check if media file exists, if not redirect to /media/ page
        if (isset($idMediaFile)) {
            $result = $db->pselectRow(
                "SELECT id FROM media WHERE id = $idMediaFile",
                []
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/media/');
            }
        } else {
            header('Location: ' . $baseURL . '/media/');
        }
    }

    /**
     * Include additional CSS files:
     *  1. media.js
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
            [$baseURL . "/media/css/media.css"]
        );
    }

    /**
     * Include additional JS files:
     *  1. editForm.js - reactified form to update media
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
            [$baseURL . "/media/js/editForm.js"]
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

        return $user->hasPermission('media_write');
    }

}

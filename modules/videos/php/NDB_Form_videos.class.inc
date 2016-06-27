<?php
/**
 * This file contains the NDB_Form_videos
 * class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

require_once "NDB_Form.class.inc";

/**
 * Creates the form for NDB_Form_videos
 *
 * @category Loris
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Form_videos extends NDB_Form
{
    /**
     * Entry point for /videos/video_edit/
     * Checks if video id is provided and otherwise redirects to /videos/ page
     *
     * @throws DatabaseException
     */
    function edit_video()
    {
        $db =& Database::singleton();
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $idVideo = $_GET['id'];

        // Check if video exists, if not redirect to /videos/ page
        if (isset($idVideo)) {
            $result = $db->pselectRow(
                "SELECT id FROM videos WHERE id = $idVideo", []
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/videos/');
            }
        } else {
            header('Location: ' . $baseURL . '/videos/');
        }
    }

    /**
     * Include additional CSS files:
     *  1. videos.js
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/videos/css/videos.css"
            ]
        );
    }

    /**
     * Include additional JS files:
     *  1. editForm.js - reactified form to update videos
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
            [
                $baseURL . "/videos/js/editForm.js"
            ]
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

        return $user->hasPermission('video_upload');
    }

}

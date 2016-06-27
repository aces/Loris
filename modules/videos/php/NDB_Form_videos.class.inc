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
require_once "Utility.class.inc";

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
        if ($idVideo) {
            $result = $db->pselectRow(
                "SELECT record_id FROM videos WHERE record_id = $idVideo", []
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/videos/');
            }
        } else {
            header('Location: ' . $baseURL . '/videos/');
        }

    }

    /**
     * Additional js files
     *
     * @return array
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
     * @return bool - has access
     *
     * @throws ConfigurationException
     * @throws Exception
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        $site =& Site::singleton($user->getData('CenterID'));

        if ($site->isStudySite()) {
            return $user->hasPermission('video_upload');
        }

        return false;
    }

}

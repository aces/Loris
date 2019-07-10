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
namespace LORIS\media;

/**
 * Creates the form for NDB_Form_media
 *
 * @category Loris
 * @package  Media
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class Edit extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Entry point for /media/edit/
     * Checks if file id is provided and otherwise redirects to /media/ page
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $db      =& \Database::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $idMediaFile = $_GET['id'];

        // Check if media file exists, if not redirect to /media/ page
        if (isset($idMediaFile)) {
            $result = $db->pselectRow(
                "SELECT id FROM media WHERE id = :mid",
                array('mid' => $idMediaFile)
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
        $factory = \NDB_Factory::singleton();
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
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/media/js/editFormIndex.js"]
        );
    }

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('media_write');
    }

}

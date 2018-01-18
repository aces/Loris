<?php
namespace LORIS\publication;

/**
 * Creates the form for NDB_Form_media
 *
 * @category Loris
 * @package  Publications
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class View_Project extends \NDB_Form
{
    public $skipTemplate = true;

    /**
     * Entry point for /publications/view_project
     * Checks if project id is provided and otherwise redirects to /publications/ page
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $db      =& \Database::singleton();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $pubID = $_GET['id'];

        // check that project exists
        if (isset($pubID)) {
            $result = $db->pselectRow(
                "SELECT PublicationID FROM publication WHERE PublicationID = :pid",
                array('pid' => $pubID)
            );
            if (count($result) < 1) {
                header('Location: ' . $baseURL . '/publication/');
            }
        } else {
            header('Location: ' . $baseURL . '/publication/');
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
            array()
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
            array($baseURL . "/publication/js/viewProjectIndex.js")
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

        return true;
    }

}

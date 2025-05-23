<?php declare(strict_types=1);

/**
 * This file contains the NDB_Form_media class
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Publication
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
namespace LORIS\publication;

/**
 * Let's you view a project proposal's details
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
     * Returns true if user has access to this page.
     *
     * You do not need to overload hasAccess() if there are no access restrictions.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();
        $pubID   = $_GET['id'];

        $nProjects = $db->pselectOne(
            'SELECT COUNT(*) FROM publication_users_edit_perm_rel '.
            'WHERE UserID=:uid AND PublicationID=:pid',
            [
                'uid' => $user->getId(),
                'pid' => $pubID,
            ]
        );
        return ($user->hasPermission('publication_view')
            || $user->hasPermission('publication_propose')
            || $user->hasPermission('publication_approve')
            || $nProjects > 0
        );
    }
    /**
     * Entry point for /publications/view_project
     * Checks if project id is provided and otherwise
     * redirects to /publications/ page
     *
     * @return void
     */
    function _setupPage() : void
    {
        $db      = $this->loris->getDatabaseConnection();
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();

        $pubID = $_GET['id'];

        // check that project exists
        if (isset($pubID)) {
            $result = $db->pselectRow(
                "SELECT PublicationID FROM publication WHERE PublicationID = :pid",
                ['pid' => $pubID]
            );
            if (count($result ?? []) < 1) {
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
    function getCSSDependencies() : array
    {
        $deps = parent::getCSSDependencies();
        return array_merge(
            $deps,
            []
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label = ucwords(str_replace('_', ' ', $this->name));
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb(
                'View Project',
                "/publication/view_project?id=" . $_GET['id']
            )
        );
    }

    /**
     * Include additional JS files:
     *  1. editForm.js - reactified form to update media
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/publication/js/viewProjectIndex.js"]
        );
    }

}

<?php
/**
 * File implements the AnonymousUser class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS;

/**
 * This class defines an anonymous user subclass for users who are not logged in.
 * This allows one to type hint User parameters or return values without needing
 * to worry about the case where the user is not logged in.
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AnonymousUser extends \User
{
    /**
     * An anonymous user username
     *
     * @return string
     */
    function getUsername(): string
    {
        return "";
    }

    /**
     * An anonymous user is not a member of any site.
     *
     * @return array An empty array
     */
    public function getSiteNames() : array
    {
        return [];
    }

    /**
     * An anonymous user real name
     *
     * @return string
     */
    function getFullname(): string
    {
        return "AnonymousUser";
    }

    /**
     * An anonymous user is not a member of any site.
     *
     * @return array An empty array
     */
    function getCenterIDs(): array
    {
        return [];
    }

    /**
     * An anonymous user is not a member of any project.
     *
     * @return array An empty array
     */
    function getProjectIDs(): array
    {
        return [];
    }

    /**
     * Returns all sites where Examiner is active
     *
     * @return array
     */
    function getExaminerSites(): array
    {
        return [];
    }
}

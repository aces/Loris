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
     * An anonymous user is not a member of any site.
     *
     * @return array The empty string
     */
    public function getSiteNames() : array
    {
        return array();
    }
}

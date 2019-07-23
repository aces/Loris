<?php declare(strict_types=1);
/**
 * This file contains an interface to describe a User
 * in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Interface for User objects.
 *
 * This deals with properties that may be accessed regarding
 * a user.
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface IUser
{
    /**
     * Return the user's full name.
     *
     * @return string
     */
    public function getFullname(): string;

    /**
     * Get the user's username. NB. This is
     * sometimes called the 'UserID' in LORIS
     * for no known reason.
     *
     * @return string
     */
    public function getUsername(): string;

    /**
     * Returns an array of sites a user belongs to.
     *
     * @return Site[]
     */
    public function getSites(): array;

    /**
     * Returns true if the user is Active (ie. has been
     * approved and was not explicitly deactivated for
     * other reasons.)
     *
     * @return bool
     */
    public function isActive() : bool;

    /**
     * Returns true if the user has requested an account
     * which has not yet been reviewed/approved.
     *
     * @return bool
     */
    public function pendingApproval() : bool;
}


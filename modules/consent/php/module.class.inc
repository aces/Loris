<?php declare(strict_types=1);
/**
 * File contains the LORIS\consent\Module class.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\consent;

/**
 * The module class serves as a hint that this directory contains
 * a valid LORIS module.
 *
 * @category   Core
 * @package    Main
 * @subpackage Consent
 * @author     Camille Beaudoin <camille.beaudoin@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('access_all_profiles')
            || $user->hasPermission('consent_view')
            || $user->hasPermission('consent_edit')
        );
    }

    /**
     * The login module must be accessible publicly, so that non-logged in
     * users can login.
     *
     * @return true
     */
    public function isPublicModule() : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Admin";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "Consent";
    }
}
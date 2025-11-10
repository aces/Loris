<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category Documentation
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\api_docs;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Documentation
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    public function hasAccess(\User $user): bool
    {
        return parent::hasAccess($user) && $user->hasPermission('api_docs');
    }

    /**
     * Return the long name of this module. The long name is intended
     * to be the friendly, human-readable name and can not be automatically
     * derived. It may contain spaces, punctuation, or capitalization. The
     * long name of the module is how it should be referred to in
     * user-facing text.
     *
     * By default, the long name is used as the name in the LORIS menu
     * (if the module has a menu category defined by getMenuCategory().
     *
     * @return string The human friendly name for this module.
     */
    public function getLongName() : string
    {
        return dgettext("api_docs", "API Documentation");
    }

    /**
     * {@inheritDoc}
     *
     * @return ?\LORIS\GUI\MenuCategory
     */
    public function getMenuCategory() : ?\LORIS\GUI\MenuCategory
    {
        return \LORIS\GUI\MenuCategory::singleton("Tools");
    }
}

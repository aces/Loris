<?php
/**
 * This file provides an implementation of the UserSiteMatchWithPermission filter.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Filters
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data\Filters;

use \LORIS\Data\Filter;
use \LORIS\Data\DataInstance;

/**
 * This class will apply the userSiteMatch filter is the user do not have any of the
 * given permissions. For instance, if a user do not have 'access_all_profiles' then
 * the UserSiteMatch will be applied.
 *
 * @category   Data
 * @package    Main
 * @subpackage Filters
 * @author     Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class HasAnyPermissionOrUserSiteMatch extends UserSiteMatch
{
    /**
     * Constructor
     *
     * @param string[] $permissions An array of permission objects.
     */
    public function __construct(array $permissions)
    {
        $this->_permissions = $permissions;
    }

    /**
     * Will return true if the user has any of the permissions or if the user's
     * site(s) match the resource's.
     *
     * @param \User        $user     The user that request access to the ressouce.
     * @param DataInstance $resource The data being filtered.
     *
     * @return bool
     */
    public function filter(\User $user, DataInstance $resource) : bool
    {
        if ($user->hasAnyPermission($this->_permissions)) {
            return true;
        }
        return parent::filter($user, $resource);
    }
}

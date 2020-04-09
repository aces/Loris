<?php
/**
 * The menu for user accounts
 *
 * PHP Version 5
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\user_accounts;

/**
 * The menu for user accounts
 *
 * PHP Version 5
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

class User_Accounts extends \DataFrameworkMenu
{
    /**
     * Overloading this method to allow access to users account
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('user_accounts');
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * UserSiteMatch filter.
     *
     * @return bool
     */
    public function useSiteFilter() : bool
    {
        return false;
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of permissions or null
     */
    public function useSitePermissionsFilter() : ?array
    {
        return ['user_account_multisite'];
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * UserProjectMatch filter.
     *
     * @return bool true
     */
    public function useProjectFilter() : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        $yesNoOptions = array(
            'Y' => 'Yes',
            'N' => 'No',
        );

        return array(
            'sites'            => \Utility::getSiteList(false),
            'projects'         => \Utility::getProjectList(),
            'actives'          => $yesNoOptions,
            'pendingApprovals' => $yesNoOptions,
        );
    }

    /**
     * {@inheritDoc}
     *
     * @return \Loris\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new UserAccountRowProvisioner();
    }

    /**
     * Gathers JS dependecies and merge them with the parent
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
            array($baseURL . "/user_accounts/js/userAccountsIndex.js")
        );
    }
}


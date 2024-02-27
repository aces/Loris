<?php
/**
 * The menu for user accounts
 *
 * PHP Version 7
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
 * PHP Version 7
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

class User_Accounts extends \DataFrameworkMenu
{
    const PERMISSIONS    = [
        'user_accounts',
        'user_accounts_multisite',
    ];
    public $skipTemplate = true;

    /**
     * Overloading this method to allow access to users account
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(self::PERMISSIONS);
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['user_accounts_multisite'];
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
        $yesNoOptions = [
            'Y' => 'Yes',
            'N' => 'No',
        ];

        return [
            'sites'            => \Utility::getSiteList(false),
            'projects'         => \Utility::getProjectList(),
            'actives'          => $yesNoOptions,
            'pendingApprovals' => $yesNoOptions,
        ];
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
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/user_accounts/js/userAccountsIndex.js',
        ];
    }
}

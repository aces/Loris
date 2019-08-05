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

class User_Accounts extends \NDB_Menu_Filter
{
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
        return $user->hasPermission('user_accounts');
    }

    /**
     * Setup Variables
     *
     * @note   Setup Variables
     * @return void
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query = " FROM users
            LEFT JOIN user_psc_rel ON (user_psc_rel.UserID=users.ID)
            LEFT JOIN psc ON (user_psc_rel.CenterID=psc.CenterID)
            WHERE 1=1";
        if (!$user->hasPermission('user_accounts_multisite')) {
            $site_arr = implode(",", $user->getCenterIDs());
            $query   .= " AND FIND_IN_SET(user_psc_rel.CenterID,'$site_arr')";
        }

        // set the class variables
        $this->columns      = array(
            "COALESCE(GROUP_CONCAT(
                                psc.Name SEPARATOR '; '),'Not Assigned'
                                ) AS Sites",
            'users.UserID AS Username',
            'Real_name AS Full_name',
            'Email',
            'Active',
            'Pending_approval',
        );
        $this->query        = $query;
        $this->order_by     = 'Username';
        $this->group_by     = 'users.ID';
        $this->validFilters = array(
            'user_psc_rel.CenterID',
            'users.UserID',
            'users.Real_name',
            'users.Email',
            'users.Active',
            'users.Examiner',
            'users.Pending_approval',
        );

        $this->formToFilter = array(
            'centerID'  => 'user_psc_rel.CenterID',
            'active'    => 'users.Active',
            'userID'    => 'users.UserID',
            'real_name' => 'users.Real_name',
            'email'     => 'users.Email',
            'pending'   => 'users.Pending_approval',
        );
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        // create user object
        $user =& \User::singleton();

        // PSC
        if ($user->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = array();
            $site_arr      = \Utility::getSiteList(false);
            foreach ($site_arr as $key=>$val) {
                $list_of_sites[$val] = $val;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = array();
            $site_arr      = $user->getData('CenterIDs');
            foreach ($site_arr as $key=>$val) {
                $site[$key] = \Site::singleton($val);
                $list_of_sites[$site[$key]->getCenterName()]
                    = $site[$key]->getCenterName();
            }
        }
        $yesNoOptions = array(
            'Y' => 'Yes',
            'N' => 'No',
        );

        $this->fieldOptions = array(
            'sites'            => $list_of_sites,
            'actives'          => $yesNoOptions,
            'pendingApprovals' => $yesNoOptions,
        );
        return true;
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


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

class NDB_Menu_Filter_User_Accounts extends NDB_Menu_Filter
{
    /**
     * Overloading this method to allow access to users account
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();

        return $user->hasPermission('user_accounts');
    }
    /**
    * Setup Variables
    *
    * @note   Setup Variables
    * @return bool
    * @access private
    */
    function _setupVariables()
    {
        $user =& User::singleton();
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
        return true;
    }
    /**
    * Set Filter Form
    *
    * @note   Set Filter Form
    * @return bool
    * @access private
    */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();

        // PSC
        if ($user->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList(false);
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'All') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = array();
            $site_arr      = $user->getData('CenterIDs');
            foreach ($site_arr as $key=>$val) {
                $site[$key]          = & Site::singleton($val);
                $list_of_sites[$val] = $site[$key]->getCenterName();
            }
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }
        // add form elements
        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addSelect(
            'active',
            'Active:',
            array(
             ''  => 'All',
             'Y' => 'Y',
             'N' => 'N',
            )
        );
        $this->addBasicText('userID', 'Username:');
        $this->addBasicText('real_name', 'Full name:');
        $this->addBasicText('email', 'Email:');
        $this->addSelect(
            'pending',
            'Pending Approval:',
            array(
             ''  => 'All',
             'N' => 'N',
             'Y' => 'Y',
            )
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
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/user_accounts/js/columnFormatter.js")
        );
    }
}
?>

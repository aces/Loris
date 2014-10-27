<?php
require_once 'NDB_Menu_Filter.class.inc';

/**
 * The menu for user accounts
 * @package main
 */
class NDB_Menu_Filter_user_accounts extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('user_accounts');
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM users LEFT JOIN psc ON (psc.CenterID = users.CenterID) WHERE 1=1 ";
        if (!$user->hasPermission('user_accounts_multisite')) {
            $query .= " AND users.CenterID = '" . $user->getData('CenterID') . "' ";
        }

        // set the class variables
        $this->columns = array("COALESCE(psc.Name,'Not Assigned') AS PSC", 'UserID AS Username', 'Real_name AS Full_name', 'Email', 'Active', 'Examiner', 'Pending_approval');
        $this->query = $query;
        $this->order_by = 'Username';
        $this->validFilters = array('users.CenterID', 'users.UserID', 'users.Real_name', 'users.Email', 'users.Active', 'users.Examiner', 'users.Pending_approval');

        $this->formToFilter = array(
                                    'centerID' => 'users.CenterID',
                                    'active' => 'users.Active',
                                    'examiner' => 'users.Examiner',
                                    'userID' => 'users.UserID',
                                    'real_name' => 'users.Real_name',
                                    'email' => 'users.Email',
                                    'pending' => 'users.Pending_approval'
                                    );
        return true;
    }


    function _setFilterForm()
    {
    	// create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // PSC
        if ($user->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites =& Utility::getSiteList(false);
            if(Utility::isErrorX($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            } 
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'All',0=>'Not Assigned') + $list_of_sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (Utility::isErrorX($site)) {
                return PEAR::raiseError("Unable to construct the list_of_sites array: ".$site->getMessage());
            }
            $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
        }

        // add form elements
        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addSelect('active', 'Active:', array('' => 'All', 'Y' => 'Y', 'N' => 'N'));
        $this->addSelect('examiner', 'Examiner:', array('' => 'All', 'Y' => 'Y', 'N' => 'N'));
        $this->addBasicText('userID', 'Username:');
        $this->addBasicText('real_name', 'Full name:');
        $this->addBasicText('email', 'Email:');
        $this->addSelect('pending', 'Pending Approval:', array(''=>'All', 'N'=>'N', 'Y'=>'Y'));

        return true;
    }
}
?>

<?php
require_once 'NDB_Menu_Filter.class.inc';

/**
 * The menu for user accounts
 * @package main
 */
class NDB_Menu_Filter_participant_accounts extends NDB_Menu_Filter
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
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM participant_accounts p 
            JOIN session s ON (p.SessionID=s.ID)
            JOIN candidate c ON (c.CandID=s.CandID)";

        // set the class variables
        $this->columns = array('c.PSCID AS PSCID', 's.Visit_label AS Visit', 'p.Email as Email', 'p.Test_name as SurveyName', 'p.OneTimePassword as URL','p.Status');
        $this->query = $query;
        $this->order_by = 'PSCID';
        $this->validFilters = array();
        //'users.CenterID', 'users.UserID', 'users.Real_name', 'users.Email', 'users.Active', 'users.Examiner', 'users.Pending_approval');

        $this->formToFilter = array();/*
                                    'centerID' => 'users.CenterID',
                                    'active' => 'users.Active',
                                    'examiner' => 'users.Examiner',
                                    'userID' => 'users.UserID',
                                    'real_name' => 'users.Real_name',
                                    'email' => 'users.Email',
                                    'pending' => 'users.Pending_approval'
                                );*/
        return true;
    }


    function _setFilterForm()
    {
    	// create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // add form elements
        $this->addSelect('centerID', 'Site:', $list_of_sites);
        $this->addSelect('active', 'Active:', array('' => 'Any', 'Y' => 'Y', 'N' => 'N'));
        $this->addSelect('examiner', 'Examiner:', array('' => 'Any', 'Y' => 'Y', 'N' => 'N'));
        $this->addBasicText('userID', 'Username:');
        $this->addBasicText('real_name', 'Full name:');
        $this->addBasicText('email', 'Email:');
        $this->addSelect('pending', 'Pending Approval:', array(''=>'Any', '0'=>'N', '1'=>'Y'));

        return true;
    }
}
?>

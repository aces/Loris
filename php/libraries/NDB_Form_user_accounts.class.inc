<?php
require_once "NDB_Form.class.inc";
require_once "Email.class.inc";

/**
 * The forms for the user accounts menu
 * @package main
 */
class NDB_Form_user_accounts extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $editor =& User::singleton();
        if (PEAR::isError($editor)) {
            return PEAR::raiseError("User Error: ".$editor->getMessage());
        }

        if ($this->page == 'edit_user') {
            if(!empty($this->identifier)) {
                $user =& User::factory($this->identifier);
                if(PEAR::isError($user)) {
                    return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
                }
            }

            return ($editor->hasPermission('user_accounts') && ($editor->hasPermission('user_accounts_multisite') || (empty($this->identifier) || $editor->getData('CenterID') == $user->getData('CenterID'))));
        }

        return true;
    }

    function _getDefaults()
    {
        $defaults = array();
 
        if (!empty($this->identifier)) {
            $user =& User::factory($this->identifier);
            if(PEAR::isError($user)) {
                return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
            }

            // get the user defaults
	        $defaults = $user->getData();

     	    // remove the password hash
	        unset($defaults['Password_md5']);

            // get the user's permissions
            $perms = $user->getPermissionIDs();

            // set the user's permission defaults
            foreach ($perms as $value) {
                $defaults["permID[$value]"] = 1;
            }
        }

        return $defaults;
    }

    function _process($values)
    {
    	// build the "real name"
    	$values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];
    	
	    // store the permission IDs
	    if (!empty($values['permID'])) {
            $permIDs = $values['permID'];
	        unset($values['permID']);
	    }

        // store whether to send an email or not
        if (!empty($values['SendEmail'])) {
            $send = $values['SendEmail'];
	        unset($values['SendEmail']);
	    }

        // make user name match email address
	    if (!empty($values['NA_UserID'])) {
	        $values['UserID'] = $values['Email'];
            unset($values['NA_UserID']);
	    }

        // generate new password
	    if (!empty($values['NA_Password'])) {
	        $values['Password_md5'] = User::newPassword();
            $values['Password_expiry'] = '0000-00-00';
            unset($values['NA_Password']);
	    }

        // make the set
        foreach ($values as $key => $value) {
            if (!empty($value) || $value === '0') {
                $set[$key] = $value;
            }
        }

        // prepend two random characters
        if (isset($set['Password_md5'])) {
            $set['Password_md5'] = User::md5_salt($set['Password_md5']);
        }


        // update the user
        if (empty($this->identifier)) {
            // insert a new user
            $success = User::insert($set);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("user_accounts::_process() insert: ".$success->getMessage());
            }

            $user =& User::factory($set['UserID']);
            if (PEAR::isError($user)) {
                return PEAR::raiseError("User Error (".$set['UserID'] ."): ".$user->getMessage());
            }
        }
        else {
            // update the user
            $user =& User::factory($this->identifier);
            if (PEAR::isError($user)) {
                return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
            }

            $success = $user->update($set);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("user_accounts::_process() update: ".$success->getMessage());
            }
        }

        // update Mantis account if applicable
        $config =& NDB_Config::singleton();
        $mantis_dir = $config->getSetting('mantis');
        if (!empty($mantis_dir)) {
            // update mantis records
            $user->updateMantisUser($values['Password_md5']);
        }
        
        // update the user permissions if applicable
        if (!empty($permIDs)) {
            $success = $user->removePermissions();
            if (PEAR::isError($success)) {
                return PEAR::raiseError("user_accounts::_process() remove permissions: ".$success->getMessage());
            }

            foreach ($permIDs as $key => $value) {
                if ($value == 0) {
                    unset($permIDs[$key]);
                }
            }

            $success = $user->addPermissions(array_keys($permIDs));
            if (PEAR::isError($success)) {
                return PEAR::raiseError("user_accounts::_process() add permissions: ".$success->getMessage());
            }
        }

        // get config options relating to proftpd
        $config =& NDB_Config::singleton();
        $ftpSettings = $config->getSetting("proftpd");
        
        // if proftpd stuff is enabled:
        if($ftpSettings['enabled'] == 'true') {
            
            // connect to proftpd database
            $ftpdb = new Database();
	    $success = $ftpdb->connect($ftpSettings['database'], $ftpSettings['username'], $ftpSettings['password'], $ftpSettings['host'], false);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("Could not connect to database: ".$success->getMessage());
            }
            
            // check users table to see if we have a valid user 
            $query = "SELECT COUNT(*) AS User_count FROM ftpusers WHERE userid = '".$values['UserID']."'"; 
            $ftpdb->selectRow($query, $row);
            if (PEAR::isError($row)) {
                return PEAR::raiseError("DB Error: ".$row->getMessage());
            }
            
            // update password
            if($row['User_count'] == 1) {
                
                $setArray['passwd'] = crypt($values['Password_md5']);
                $success = $ftpdb->update('ftpusers', $setArray, array('userid' => $values['UserID']));
                if (PEAR::isError($success)) {
                    return PEAR::raiseError("SinglePointLogin::save(): ".$success->getMessage());
                }
            } 
            
            // if user does not exist, insert user data
            else {                  
                
                $query = "SELECT MAX(uid) as Max_UID FROM ftpusers";
                
                $maxUID = $ftpdb->selectOne($query);
                if (PEAR::isError($maxUID)) {
                    return PEAR::raiseError("DB Error: ".$maxUID->getMessage());
                }
                
                $setArray['userid'] = $values['UserID'];
                $setArray['passwd'] = crypt($values['Password_md5']);
                $setArray['uid'] = $maxUID + 1;
                $setArray['homedir'] = "/"; 
                
                // insert into proftpd
                $success = $ftpdb->insert("ftpusers", $setArray);
                if (PEAR::isError($success)) {
                    return PEAR::raiseError("SinglePointLogin::save(): ".$success->getMessage());
                }
            }
        }

        // send the user an email
        if (!empty($send)) {
            // create an instance of the config object
            $config =& NDB_Config::singleton();

            // send the user an email
            $msg_data['study'] = $config->getSetting('title');
            $msg_data['url'] = $config->getSetting('url');
            $msg_data['realname'] = $values['Real_name'];
            $msg_data['username'] = $values['UserID'];
            $msg_data['password'] = $values['Password_md5'];

            $template = (empty($this->identifier)) ? 'new_user.tpl' : 'edit_user.tpl';

            Email::send($values['Email'], $template, $msg_data);
        }

        $this->tpl_data['success'] = true;
        $this->form->freeze();
    }

    function edit_user()
    {
        $this->redirect = "test_name=$this->name";

        //------------------------------------------------------------

        // register RequiredIfGroup rule
        $this->form->registerRule('requiredIfGroup', null, 'HTML_QuickForm_Rule_RequiredIfGroup', 'RequiredIfGroup.inc');

        //------------------------------------------------------------

        // it is a new user
        if (empty($this->identifier)) {
            // user name
            $group[] = $this->form->createElement('text', 'UserID', 'User name');
            $group[] = $this->form->createElement('advcheckbox', 'NA_UserID', null, 'Make user name match email address');
            $this->form->addGroup($group, 'UserID_Group', 'User name', $this->_GUIDelimiter, FALSE);
            unset($group);

            // user name rules - only required if user name is user-defined
            $this->form->addGroupRule('UserID_Group', array('UserID' => array(array('The user name must be less than 255 characters long', 'maxlength', 255))));
            $reqIfSettings = array('controller' => 'NA_UserID', 'operator' => '!=', 'value' => 1);
            $this->form->addRule('UserID_Group', 'User name is required', 'requiredIfGroup', 
                                 array_merge($reqIfSettings, array('element' => 'UserID')));
        }
        // it is an existing user
        else {
            // user name
            $this->form->addElement('text', 'UserID', 'User name');
            $username =& $this->form->getElement('UserID');
            $username->freeze();
        }

        // password
        $group[] = $this->form->createElement('password', 'Password_md5');
        $group[] = $this->form->createElement('advcheckbox', 'NA_Password', null, 'Generate new password');
        $this->form->addGroup($group, 'Password_Group', 'Password', $this->_GUIDelimiter, FALSE);
        $this->form->addElement('password', '__Confirm', 'Confirm Password');
        unset($group);

        // it is a new user
        if (empty($this->identifier)) {
            // password rules - only required if password is user-defined
            $reqIfSettings = array('controller' => 'NA_Password', 'operator' => '!=', 'value' => 1);
            $this->form->addRule('Password_Group', 'Password is required', 'requiredIfGroup', 
                                 array_merge($reqIfSettings, array('element' => 'Password_md5')));
        }

        // full name
        //$this->form->addElement('text', 'Real_name', 'Full name');
        $this->form->addElement('text', 'First_name', 'First name');
        $this->form->addElement('text', 'Last_name', 'Last name');

        // full name rules
        //$this->form->addRule('Real_name', 'Full name is required', 'required');
        //$this->form->addRule('Real_name', 'Full name must be less than 50 characters long', 'maxlength', 50);

        $this->form->addRule('First_name', 'First name is required', 'required');
        $this->form->addRule('Last_name', 'Last name is required', 'required');
        $this->form->addRule('First_name', 'First name must be less than 120 characters long', 'maxlength', 120);
		$this->form->addRule('Last_name', 'Last name must be less than 120 characters long', 'maxlength', 120);

        // extra info
        $this->form->addElement('text', 'Degree', 'Degree');
        $this->form->addElement('text', 'Position_title', 'Academic Position');
        $this->form->addElement('text', 'Institution', 'Institution');
        $this->form->addElement('text', 'Department', 'Department');
        $this->form->addElement('text', 'Address', 'Street Address');
        $this->form->addElement('text', 'City', 'City');
        $this->form->addElement('text', 'State', 'Sta te/Province');
        $this->form->addElement('text', 'Zip_code', 'Zip/Postal Code');
        $this->form->addElement('text', 'Country', 'Country');
        $this->form->addElement('text', 'Fax', 'FAX');

        
        // email address
        $group[] = $this->form->createElement('text', 'Email');
        $group[] = $this->form->createElement('checkbox', 'SendEmail', null, 'Send email to user');
        $this->form->addGroup($group, 'Email_Group', 'Email address', $this->_GUIDelimiter, FALSE);
        unset($group);

        // email address rules
        $this->form->addGroupRule('Email_Group', array('Email' => array(array('Email address is required', 'required'))));
        $this->form->addGroupRule('Email_Group', array('Email' => array(array('The email address must be valid', 'email'))));
        $this->form->addGroupRule('Email_Group', array('Email' => array(array('The email address must be less than 255 characters long', 'maxlength', 255))));

        //------------------------------------------------------------

        // get user permissions
        $editor =& User::singleton();
        if(PEAR::isError($editor)) {
            return PEAR::raiseError("User Error: ".$editor->getMessage());
        }

        // center ID
        if ($editor->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $siteOptions =& Utility::getSiteList(false);
        }
        else {
            // allow only to add to their own site
            $siteOptions = array($editor->getData('CenterID') => $editor->getData('Site'));
        }
        $this->form->addElement('select', 'CenterID', 'Site', $siteOptions);

        // active and examiner
    	$this->form->addElement('select', 'Active', 'Active', array('Y' => 'Yes', 'N' => 'No'));
	    $this->form->addElement('select', 'Pending_approval', 'Pending approval', array('1' => 'Yes', '0' => 'No'));
	    $this->form->addElement('select', 'Examiner', 'Examiner', array('N' => 'No', 'Y' => 'Yes'));

        //------------------------------------------------------------

        // get the editor's permissions
        $perms = $editor->getPermissionsVerbose();
        $lastRole = '';
        foreach ($perms as $row) {
            if($row['type'] != $lastRole) {
                $lastRole = $row['type'];
                $group[] = $this->form->createElement('static', null, null, '<b>'.ucwords($row['type']).'</b>');
            }
            $group[] = $this->form->createElement('advcheckbox', 'permID['.$row['permID'].']', null, $row['description']);
        }
        $this->form->addGroup($group, 'PermID_Group', 'Permissions', "<br />\n", FALSE);
        unset($group);

        if (!empty($this->identifier)) {
            $user =& User::factory($this->identifier);
            if(PEAR::isError($user)) {
                return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
            }

            // add hidden permissions if editor has less permissions than user being edited
            $perms = array_diff($user->getPermissionIDs(), $editor->getPermissionIDs());
            foreach ($perms as $value) {
                $this->form->addElement('hidden', "permID[$value]", 1);
            }
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validate_edit_user'));
    }


    function my_preferences()
    {
        $this->identifier = $_SESSION['State']->getUsername();

        //------------------------------------------------------------

        // user name
        $this->form->addElement('text', 'UserID', 'User name');
        $username =& $this->form->getElement('UserID');
        $username->freeze();

        // full name
        //$this->form->addElement('text', 'Real_name', 'Full name');
        $this->form->addElement('text', 'First_name', 'First name');
        $this->form->addElement('text', 'Last_name', 'Last name');

        // full name rules
        //$this->form->addRule('Real_name', 'Full name is required', 'required');
        //$this->form->addRule('Real_name', 'Full name must be less than 50 characters long', 'maxlength', 50);

        $this->form->addRule('First_name', 'First name is required', 'required');
        $this->form->addRule('Last_name', 'Last name is required', 'required');
        $this->form->addRule('First_name', 'First name must be less than 120 characters long', 'maxlength', 120);
		$this->form->addRule('Last_name', 'Last name must be less than 120 characters long', 'maxlength', 120);

        // extra info
        $this->form->addElement('text', 'Degree', 'Degree');
        $this->form->addElement('text', 'Position_title', 'Academic Position');
        $this->form->addElement('text', 'Institution', 'Institution');
        $this->form->addElement('text', 'Department', 'Department');
        $this->form->addElement('text', 'Address', 'Street Address');
        $this->form->addElement('text', 'City', 'City');
        $this->form->addElement('text', 'State', 'Sta te/Province');
        $this->form->addElement('text', 'Zip_code', 'Zip/Postal Code');
        $this->form->addElement('text', 'Country', 'Country');
        $this->form->addElement('text', 'Fax', 'FAX');

        // email address
        $this->form->addElement('text', 'Email', 'Email address');

        // email address rules
        $this->form->addRule('Email', 'Email address is required', 'required');
        $this->form->addRule('Email', 'Your email address must be valid', 'email');
        $this->form->addRule('Email', 'Your email address must be less than 255 characters long', 'maxlength', 255);

        // password
        $this->form->addElement('password', 'Password_md5', 'New Password');
        $this->form->addElement('password', '__Confirm', 'Confirm Password');

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validate_my_preferences'));
    }


    function _validate_edit_user($values)
    {
        // create DB object
        $DB =& Database::singleton();
        if(PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $errors = array();

        // if username is user-defined, and it is a new user
        if (empty($values['NA_UserID']) && empty($values['UserID'])) {
            // check username's uniqueness
            $result = $DB->selectOne("SELECT COUNT(*) FROM users WHERE UserID = '" . $values['UserID'] . "'");
            if (PEAR::isError($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }
    
            if ($result > 0) {
                $errors['UserID_Group'] = 'The user name already exists';
            }
        }

        // if password is user-defined, and user wants to change password
        if (empty($values['NA_Password']) && !empty($values['Password_md5'])) {
            // check password strength
            if (!User::isPasswordStrong($values['Password_md5'], array($values['__Confirm'], $values['UserID'], $values['Email']), array('==', '!=', '!='))) {
                $errors['Password_Group'] = 'The password is weak, or the passwords do not match';
            }
        }

        // check email address' uniqueness
        $result = $DB->selectOne("SELECT COUNT(*) FROM users WHERE Email = '" . $values['Email'] . "' AND UserID != '" . $values['UserID']  . "'");
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
    
        if ($result > 0) {
            $errors['Email_Group'] = 'The email address already exists';
        }

        return $errors;
    }


    function _validate_my_preferences($values)
    {
        // create DB object
        $DB =& Database::singleton();
        if(PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $errors = array();

        // if password is user-defined, and user wants to change password
        if (!empty($values['Password_md5'])) {
            // check password strength
            if (!User::isPasswordStrong($values['Password_md5'], array($values['__Confirm'], $values['identifier'], $values['Email']), array('==', '!=', '!='))) {
                $errors['Password_md5'] = 'The password is weak, or the passwords do not match';
            }
        }

        // check email address' uniqueness
        $result = $DB->selectOne("SELECT COUNT(*) FROM users WHERE Email = '" . $values['Email'] . "' AND UserID != '" . $values['identifier']  . "'");
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
    
        if ($result > 0) {
            $errors['Email'] = 'The email address already exists';
        }

        return $errors;
    }
}
?>

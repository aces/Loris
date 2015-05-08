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
        if (Utility::isErrorX($editor)) {
            return PEAR::raiseError("User Error: ".$editor->getMessage());
        }

        if ($this->page == 'edit_user') {
            if(!empty($this->identifier)) {
                $user =& User::factory($this->identifier);
                if(Utility::isErrorX($user)) {
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
            if(Utility::isErrorX($user)) {
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
        $config = NDB_Config::singleton();
    	// build the "real name"
    	$values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];
    	
        //create the user
        if (!empty($this->identifier)) {
            $user =& User::factory($this->identifier);
        }
        else{
            // Since the form has been validated there are two possibilities:
            //    - UID is set
            //    - UID is not set but the "Match UID to email" checkbox is checked
            $effectiveUID 
                = $values['NA_UserID'] == 'on' ? $values['Email'] : $values['UserID'];
            $user =& User::factory($effectiveUID);
        }
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
        }
        ////Get the current permissions/////
        $current_permissionids = $user->getPermissionIDs();


    	
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

        // update the user
        if (empty($this->identifier)) {
            // insert a new user
            $success = User::insert($set);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("user_accounts::_process() insert: ".$success->getMessage());
            }

            $user =& User::factory($set['UserID']);
            if (Utility::isErrorX($user)) {
                return PEAR::raiseError("User Error (".$set['UserID'] ."): ".$user->getMessage());
            }
        }
        else {
            // update the user
            $user =& User::factory($this->identifier);
            if (Utility::isErrorX($user)) {
                return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
            }

            $success = $user->update($set);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("user_accounts::_process() update: ".$success->getMessage());
            }
        }

        // prepend two random characters
        if (isset($set['Password_md5'])) {
            // Update CouchDB. Must do before password is salted/hashed.
            $user->updatePassword($set['Password_md5']);
        }

        // update the user permissions if applicable
        if (!empty($permIDs)) {
            $success = $user->removePermissions();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("user_accounts::_process() remove permissions: ".$success->getMessage());
            }

            foreach ($permIDs as $key => $value) {
                if ($value == 0) {
                    //if the permission existed before and it's removed now///
                    ///Then insert into the user_account_history as 'D'
                    if (in_array($key, $current_permissionids)) {
                        $user->insertIntoUserAccountHistory($key, 'D');
                    }
                    unset($permIDs[$key]);
                } else {
                    /* if the user didn't have the permission 
                    and the permission is now assigned then insert 
                    insert into the user_account_history as 'I'
                    */
                    if (!(in_array($key, $current_permissionids))) {
                        $user->insertIntoUserAccountHistory($key, 'I');
                    }
                }
            }

            $success = $user->addPermissions(array_keys($permIDs));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("user_accounts::_process() add permissions: ".$success->getMessage());
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
            $msg_data['username'] = $user->getUsername();
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

        ///get the value for additional_user_info flag
        $config =& NDB_Config::singleton();
        $additional_user_info = $config->getSetting('additional_user_info');

        //------------------------------------------------------------


        // it is a new user
        if (empty($this->identifier)) {
            // user name
            $group[] = $this->createText('UserID', 'User name');
            $group[] = $this->createCheckbox('NA_UserID', "Make user name match email address");
            $this->addGroup($group, 'UserID_Group', 'User name', $this->_GUIDelimiter, FALSE);
            unset($group);

        }
        // it is an existing user
        else {
            // display user name
            $this->addScoreColumn('UserID', 'User name');
        }

        // password
        $group[] = $this->createPassword('Password_md5');
        $group[] = $this->createCheckbox('NA_Password', 'Generate new password');
        $this->addGroup($group, 'Password_Group', 'Password', $this->_GUIDelimiter, FALSE);
        $this->addPassword('__Confirm', 'Confirm Password');
        unset($group);

        // full name
        //$this->addBasicText('Real_name', 'Full name');
        $this->addBasicText('First_name', 'First name');
        $this->addBasicText('Last_name', 'Last name');

        // full name rules
        //$this->form->addRule('Real_name', 'Full name is required', 'required');
        //$this->form->addRule('Real_name', 'Full name must be less than 50 characters long', 'maxlength', 50);

        $this->addRule('First_name', 'First name is required', 'required');
        $this->addRule('Last_name', 'Last name is required', 'required');
        $this->addRule('First_name', 'First name must be less than 120 characters long', 'maxlength', 120);
		$this->addRule('Last_name', 'Last name must be less than 120 characters long', 'maxlength', 120);

        // extra info

        ////if the option is not set or if it's and it's true then display it 

        if (isset($additional_user_info) && $additional_user_info){
            $this->addBasicText('Degree', 'Degree');
            $this->addBasicText('Position_title', 'Academic Position');
            $this->addBasicText('Institution', 'Institution');
            $this->addBasicText('Department', 'Department');
            $this->addBasicText('Address', 'Street Address');
            $this->addBasicText('City', 'City');
            $this->addBasicText('State', 'State/Province');
            $this->addBasicText('Zip_code', 'Zip/Postal Code');
            $this->addBasicText('Country', 'Country');
            $this->addBasicText('Fax', 'FAX');
        }
        
        // email address
        $group[] = $this->createText('Email', 'Email address');
        $group[] = $this->createCheckbox('SendEmail', 'Send email to user');
        $this->addGroup($group, 'Email_Group', 'Email address', $this->_GUIDelimiter, FALSE);
        unset($group);

        //------------------------------------------------------------

        // get user permissions
        $editor =& User::singleton();
        if(Utility::isErrorX($editor)) {
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
        $this->addSelect('CenterID', 'Site', $siteOptions);

        // active
    	 $this->addSelect('Active', 'Active', array('Y' => 'Yes', 'N' => 'No'));
	    $this->addSelect('Pending_approval', 'Pending approval', array('Y' => 'Yes', 'N' => 'No'));

        //------------------------------------------------------------

        // get the editor's permissions
        $perms = $editor->getPermissionsVerbose();
        $lastRole = '';
        foreach ($perms as $row) {
            if($row['type'] != $lastRole) {
                $lastRole = $row['type'];
                $group[] = $this->form->createElement('static', null, null, '</div>' .
                        "<h3 id=\"header_$lastRole\" class=\"perm_header button\" style=\"text-align: center; margin-top: 5px;\">".ucwords($row['type']).'</h3>'
                        . "<div id=\"perms_$lastRole\" style=\"margin-top: 5px;\">");
            }
            $group[] = $this->createCheckbox(
                'permID['.$row['permID'].']',
                "$row[description]<br>",
                array(
                 "class" => "perm_$lastRole",
                )
            );
        }
        $this->addGroup($group, 'PermID_Group', 'Permissions', "", FALSE);
        unset($group);

        if (!empty($this->identifier)) {
            $user =& User::factory($this->identifier);
            if(Utility::isErrorX($user)) {
                return PEAR::raiseError("User Error ($this->identifier): ".$user->getMessage());
            }

            // add hidden permissions if editor has less permissions than user being edited
            $perms = array_diff($user->getPermissionIDs(), $editor->getPermissionIDs());
            foreach ($perms as $value) {
                $this->addHidden("permID[$value]", 1);
            }
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validate_edit_user'));
    }


    function my_preferences()
    {
        $this->identifier = $_SESSION['State']->getUsername();

        ///get the value for additional_user_info flag
        $config =& NDB_Config::singleton();
        $additional_user_info = $config->getSetting('additional_user_info');

        //------------------------------------------------------------

        // user name
        $this->addScoreColumn('UserID', 'User name');

        // full name
        //$this->addBasicText('Real_name', 'Full name');
        $this->addBasicText('First_name', 'First name');
        $this->addBasicText('Last_name', 'Last name');

        // full name rules
        //$this->form->addRule('Real_name', 'Full name is required', 'required');
        //$this->form->addRule('Real_name', 'Full name must be less than 50 characters long', 'maxlength', 50);

        $this->addRule('First_name', 'First name is required', 'required');
        $this->addRule('Last_name', 'Last name is required', 'required');
        $this->addRule('First_name', 'First name must be less than 120 characters long', 'maxlength', 120);
		$this->addRule('Last_name', 'Last name must be less than 120 characters long', 'maxlength', 120);

        // extra info
        ////if the option is not set or if it's and it's true then display it 
        if ((!isset($additional_user_info)) || ($additional_user_info)){
            
            $this->addBasicText('Degree', 'Degree');
            $this->addBasicText('Position_title', 'Academic Position');
            $this->addBasicText('Institution', 'Institution');
            $this->addBasicText('Department', 'Department');
            $this->addBasicText('Address', 'Street Address');
            $this->addBasicText('City', 'City');
            $this->addBasicText('State', 'State/Province');
            $this->addBasicText('Zip_code', 'Zip/Postal Code');
            $this->addBasicText('Country', 'Country');
            $this->addBasicText('Fax', 'FAX');
        }
        // email address
        $this->addBasicText('Email', 'Email address');

        // email address rules
        $this->addRule('Email', 'Email address is required', 'required');
        $this->addRule('Email', 'Your email address must be valid', 'email');
        $this->addRule('Email', 'Your email address must be less than 255 characters long', 'maxlength', 255);

        // password
        $this->form->addElement('password', 'Password_md5', 'New Password');
        $this->form->addElement('password', '__Confirm', 'Confirm Password');

        // document repository notifications
        $editor =& User::singleton();
        if ($editor->hasPermission('document_repository_view') || $editor->hasPermission('document_repository_delete')) {
                $doc_Repo_Notifications_Options = array('N' => 'No', 'Y' => 'Yes');
                $this->addSelect('Doc_Repo_Notifications', 'Receive Document Repository email notifications', $doc_Repo_Notifications_Options); 
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validate_my_preferences'));
    }


    function _validate_edit_user($values)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $errors = array();

        //============================================
        //         Validate UserID and NA_UserID
        //============================================
        
        if(empty($this->identifier)) {
            // Clicked on "UID == email" and specified a UID
            if(!empty($values['UserID']) && $values['NA_UserID'] == 'on') {
                $errors['UserID_Group'] = 'You cannot enter a user name if you want it to match the email address';
            }
            // Not clicked on "UID == email" and not specified a UID
            elseif(empty($values['UserID']) && $values['NA_UserID'] != 'on') {
                $errors['UserID_Group'] = 'You must enter a user name or choose to make it match the email address';
            }
            // Either specified a UID or clicked on "UID = email" with a non-empty email
            elseif(!empty($values['UserID']) || ($values['NA_UserID'] == 'on' && $values['Email'])) { 
        	       $effectiveUID = empty($values['UserID']) ? $values['Email'] : $values['UserID'];
        	       
                // check username's uniqueness
                $result = $DB->pselectOne("SELECT COUNT(*) FROM users WHERE UserID = :UID",
                    array('UID' => $effectiveUID)
                );

                if (Utility::isErrorX($result)) {
                    return PEAR::raiseError("DB Error: ".$result->getMessage());
                }

                if ($result > 0) {
                    $errors['UserID_Group'] = 'The user name already exists';
                }

                if (strlen($effectiveUID) > 255) {
                    $errors['UserID_Group'] = 'The user name must not exsceed 255 characters';
                }
            }
        }
        
        //==================================
        //        Password validation
        //==================================
        if(!empty($this->identifier)) {
            $pass = $DB->pselectOne("SELECT COALESCE(Password_hash, Password_md5) as Current_password FROM users WHERE UserID = :UID",
                                    array('UID' => $this->identifier) );
             //case of new user the password column will be null so either password should be set or
            // password should be generated
            if (empty($pass) && empty($values['Password_md5']) && $values['NA_Password'] != 'on') {
                $errors['Password_Group'] = 'Please specify password or click Generate new password';
            }
        }
        
        // if password is user-defined, and user wants to change password
        if (empty($values['NA_Password']) 
            && (!empty($values['Password_md5']) || !empty($values['__Confirm']))
        ) {
            // check password strength
            if (!User::isPasswordStrong($values['Password_md5'], array($values['__Confirm'], $values['UserID'], $values['Email']), array('==', '!=', '!='))) {
                $errors['Password_Group'] = 'The password is weak, or the passwords do not match';
            }
        }
        
        // if password is generated then the email user button should be clicked
        if ($values['NA_Password'] == "on" && $values['SendEmail'] != "on") {
               $errors['Email_Group'] = 'When generating a new password, please notify the user by checking Send email to user box';
        }

        if (empty($this->identifier) && ($values['NA_Password'] != 'on') && empty($values['Password_md5']) ) {
               $errors['Password_Group'] = 'Password is required';
        }

        //======================================
        //           Validate Email
        //======================================

        // If an email was entered
        if (!empty($values['Email'])) {
            $emailError = $this->getEmailError($DB, $values['Email']);
            if(!is_null($emailError)) {
                $errors['Email_Group'] = $emailError;
            }
        } else {
            // No email entered: error
            $errors['Email_Group'] = 'You must enter an email address';
        }

        return $errors;
    }


    function _validate_my_preferences($values)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
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

        // Validate email
        $emailError = $this->getEmailError($DB, $values['Email']);
        if(!is_null($emailError)) {
            $errors['Email'] = $emailError;
        }

        return $errors;
    }
    
    private function getEmailError($DB, $email) {
        // check email address' uniqueness
        $query  = "SELECT COUNT(*) FROM users WHERE Email = :VEmail ";
        $params = array('VEmail' => $email);
        if (!is_null($this->identifier)) {
            $query        .= " AND userID <> :UID";
            $params['UID'] = $this->identifier;
        }
        $result = $DB->pselectOne($query, $params);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }

        // Email already exists in database
        if ($result > 0) {
            return 'The email address already exists';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // If email not syntactically valid
            return "Invalid email address";
        }

        return null;
    }
}
?>

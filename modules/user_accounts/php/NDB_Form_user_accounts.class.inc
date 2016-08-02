<?php
/**
* The user account page
*
* PHP Version 5
*
* @category Main
* @package  User_Account
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/

/**
* Implements the user account page
*
* @category Main
* @package  User_Account
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/
class NDB_Form_User_Accounts extends NDB_Form
{
    /**
     * Determines whether this form is in edit or create mode.
     *
     * @return boolean true if in crete mode, false otherwise.
     */
    function isCreatingNewUser()
    {
        return $this->page == 'edit_user' && $this->identifier == '';
    }

    /**
     * Controls who's got access to this page, namely those who have the
     * 'user_accounts' and who either have permission
     * 'user_accounts_multisite' or whose site matches the site of the user they
     * are trying to edit.
     *
     * @return true if user has access, false otherwise.
     */
    function _hasAccess()
    {
        // create user object
        $editor =& User::singleton();

        if ($this->page == 'edit_user') {
            if (!$this->isCreatingNewUser()) {
                $user =& User::factory($this->identifier);
            }

            if ($editor->hasPermission('user_accounts')) {
                if ($editor->hasPermission('user_accounts_multisite')) {
                    return true;
                }

                if ($this->isCreatingNewUser()) {
                    return true;
                }

                return $editor->getData('CenterID') == $user->getData('CenterID');
            }

            return false;
        }

        // User can always access My Preferences page
        return true;
    }

    /**
     * Computes the initial values this page will be filled with.
     *
     * @return the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = array();

        if (!$this->isCreatingNewUser()) {
            $user =& User::factory($this->identifier);
            // get the user defaults
            $defaults = $user->getData();
            // remove the password hash
            unset($defaults['Password_md5']);

            // get the user's permissions
            $perms = $user->getPermissionIDs();

            // set the user's permission defaults
            foreach ($perms as $value) {
                $defaults["permID[$value]"] = 'on';
            }

            // Prevent Javascript injection on all fields
            $defaults['UserID']      = htmlspecialchars($defaults['UserID']);
            $defaults['First_name']  = htmlspecialchars($defaults['First_name']);
            $defaults['Last_name']   = htmlspecialchars($defaults['Last_name']);
            $defaults['Real_name']   = htmlspecialchars($defaults['Real_name']);
            $defaults['Email']       = htmlspecialchars($defaults['Email']);
            $defaults['Degree']      = htmlspecialchars($defaults['Degree']);
            $defaults['Institution'] = htmlspecialchars($defaults['Institution']);
            $defaults['Address']     = htmlspecialchars($defaults['Address']);
            $defaults['City']        = htmlspecialchars($defaults['City']);
            $defaults['State']       = htmlspecialchars($defaults['State']);
            $defaults['Zip_code']    = htmlspecialchars($defaults['Zip_code']);
            $defaults['Country']     = htmlspecialchars($defaults['Country']);
            $defaults['Fax']         = htmlspecialchars($defaults['Fax']);

        }

        return $defaults;
    }

    /**
     * Determines if the user is currently editing his/her own account.
     *
     * @return true if the user is editing his/her own account, false otherwise.
     */
    function _isEditingOwnAccount()
    {
        $editor = &User::singleton();
        return !$this->isCreatingNewUser()
            && ($editor->getUsername() == $this->identifier);
    }

    /**
     * Processes the data entered in the form.
     *
     * @param array $values values entered in the form.
     *
     * @return void
     */
    function _process($values)
    {
        $config = NDB_Config::singleton();

        //The arrays that contain the edited permissions
        $permissionsRemoved = array();
        $permissionsAdded   = array();

        $editor =& User::singleton();

        // build the "real name"
        $values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];

        //create the user
        if (!is_null($this->identifier)) {
            $user =& User::factory($this->identifier);
        } else {
            // Since the form has been validated there are two possibilities:
            //    - UID is set
            //    - UID is not set but the "Match UID to email" checkbox is checked
            $effectiveUID = $values['NA_UserID'] == 'on'
                ? $values['Email'] : $values['UserID'];
            $user         =& User::factory($effectiveUID);
        }

        ////Get the current permissions/////
        $current_permissionids = $user->getPermissionIDs();

        $permIDs = array();
        // store the permission IDs
        if (!empty($values['permID'])) {
            $permIDs = $values['permID'];
        }
        unset($values['permID']);

        // store whether to send an email or not
        if (!empty($values['SendEmail'])) {
            $send = $values['SendEmail'];
        }
        unset($values['SendEmail']);

        //store the supervisors emails
        if (!empty($values['supervisorEmail'])) {
            $supervisorEmails = $values['supervisorEmail'];
        }
        unset($values['supervisorEmail']);

        // make user name match email address
        if (!empty($values['NA_UserID'])) {
            $values['UserID'] = $values['Email'];
        }
        if ($this->isCreatingNewUser()) {
            $values['UserID'] = trim($values['UserID']);
        }
        unset($values['NA_UserID']);

        // generate new password
        if (!empty($values['NA_Password'])) {
            $values['Password_md5']    = User::newPassword();
            $values['Password_expiry'] = '0000-00-00';
        }
        unset($values['NA_Password']);

        // If editing a user and nothing was specified in the password text field
        // remove Password_md5 from the value set, otherwise Password_md5
        // will be set to '' by the system
        if ($values['Password_md5'] == '' && !$this->isCreatingNewUser()) {
            unset($values['Password_md5']);
        }

        // make the set
        foreach ($values as $key => $value) {
            $set[$key] = $value;
        }

        // update the user
        if ($this->isCreatingNewUser()) {
            // insert a new user
            $success = User::insert($set);
            $user    =& User::factory($set['UserID']);
        } else {
            // update the user
            $user    =& User::factory($this->identifier);
            $success = $user->update($set);
        }

        // prepend two random characters
        if (isset($set['Password_md5'])) {
            // Update CouchDB. Must do before password is salted/hashed.
            $expiry = isset($values['Password_expiry'])
                ? $values['Password_expiry'] : null;
            $user->updatePassword($set['Password_md5'], $expiry);
        }

        // update the user permissions if applicable
        // If the user is editing his/her own account, skip the part where
        // changes to the permissions are handled (there should not be any
        // change to the user's permission set since all the checkboxes are
        // disabled)
        if (!$this->_isEditingOwnAccount()) {
            $success = $user->removePermissions();

            // Check for new permissions
            if (!empty($permIDs)) {
                foreach ($permIDs as $key => $value) {
                    /* if the user didn't have the permission
                       and the permission is now assigned then insert
                       insert into the user_account_history as 'I'
                     */
                    if (!(in_array($key, $current_permissionids))) {
                        $user->insertIntoUserAccountHistory($key, 'I');
                        $permissionsAdded[] = $this->getDescriptionUsingPermID($key);
                    }
                }
            }

            if (!empty($current_permissionids)) {
                // Check for permissions that are to be deleted
                foreach ($current_permissionids as $key) {
                    //if the permission existed before and it's removed now///
                    ///Then insert into the user_account_history as 'D'
                    if (!in_array($key, array_keys($permIDs))) {
                        $user->insertIntoUserAccountHistory($key, 'D');
                        $permissionsRemoved[]
                            = $this->getDescriptionUsingPermID($key);
                    }
                }
            }

            // send the selected supervisors an email
            // (only if permissions have changed for the user)
            if (isset($supervisorEmails)) {
                foreach ($supervisorEmails as $email => $checkValue) {
                    if (!empty($permissionsAdded) || !empty($permissionsRemoved)) {
                        if ($checkValue == 'on') {
                            $msg_data['current_user'] = $editor->getFullname();
                            $msg_data['study']        = $config->getSetting('title');
                            $msg_data['realname']     = $values['Real_name'];
                            $msg_data['username']     = $user->getUsername();
                            $msg_data['permissions_added']   = $permissionsAdded;
                            $msg_data['permissions_removed'] = $permissionsRemoved;
                            Email::send(
                                $email,
                                'permissions_change_notify_supervisor.tpl',
                                $msg_data
                            );
                        }
                    }
                }
            }

            if (!empty($permIDs)) {
                $user->addPermissions(array_keys($permIDs));
            }
        }

        // send the user an email
        if (!empty($send)) {
            // create an instance of the config object
            $config =& NDB_Config::singleton();

            // send the user an email
            $msg_data['study']    = $config->getSetting('title');
            $msg_data['url']      = $config->getSetting('url');
            $msg_data['realname'] = $values['Real_name'];
            $msg_data['username'] = $user->getUsername();
            $msg_data['password'] = $values['Password_md5'];

            $template = (is_null($this->identifier))
                ? 'new_user.tpl' : 'edit_user.tpl';
            Email::send($values['Email'], $template, $msg_data);
        }

        $this->tpl_data['success'] = true;
        $this->form->freeze();
    }

    /**
     * Controls the output/behaviour of the form when in "edit" mode
     * (i.e user already exists in the database).
     *
     * @return void
     */
    // @codingStandardsIgnoreStart
    function edit_user()
    {
    // @codingStandardsIgnoreEnd
        $this->redirect = "test_name=$this->name";

        ///get the value for additional_user_info flag
        $config =& NDB_Config::singleton();
        $additional_user_info = $config->getSetting('additional_user_info');

        //------------------------------------------------------------

        // it is a new user
        if ($this->identifier == '') {
            // user name
            $group[] = $this->createText('UserID', 'User name');
            $group[] = $this->createCheckbox(
                'NA_UserID',
                'Make user name match email address'
            );
            $this->addGroup(
                $group,
                'UserID_Group',
                'User name',
                $this->_GUIDelimiter,
                false
            );
            unset($group);

        } else {
            // It is an existing user:
            //     display user name
            $this->addScoreColumn('UserID', 'User name');
        }

        // password
        $group[] = $this->createPassword('Password_md5');
        $group[] = $this->createCheckbox('NA_Password', 'Generate new password');
        $this->addGroup(
            $group,
            'Password_Group',
            'Password',
            $this->_GUIDelimiter,
            false
        );
        $this->addPassword('__Confirm', 'Confirm Password');
        unset($group);

        // The supplied pattern is:
        //   - must have at least one non-whitespace characters
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $onInvalidMsg
            = "this.setCustomValidity('First name is required and "
              . "should not exceed 120 characters')";
        $this->addBasicText(
            'First_name',
            'First name',
            array(
             'oninvalid' => $onInvalidMsg,
             'onchange'  => "this.setCustomValidity('')",
             'pattern'   => '^\s*\S.{0,119}\s*$',
             'required'  => true,
            )
        );
        // The supplied pattern is:
        //   - must have at least one non-whitespace characters
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $onInvalidMsg
            = "this.setCustomValidity('Last name is required and "
              . "should not exceed 120 characters')";
        $this->addBasicText(
            'Last_name',
            'Last name',
            array(
             'oninvalid' => $onInvalidMsg,
             'onchange'  => "this.setCustomValidity('')",
             'pattern'   => '^\s*\S.{0,119}\s*$',
             'required'  => true,
            )
        );

        // extra info

        ////if the option is not set or if it's and it's true then display it

        if ($additional_user_info) {
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
        $this->addGroup(
            $group,
            'Email_Group',
            'Email address',
            $this->_GUIDelimiter,
            false
        );
        unset($group);

        // Add a confirm email text field only if creating a new user
        // (to make sure that account creation email goes through)
        if ($this->isCreatingNewUser()) {
            $this->addBasicText('__ConfirmEmail', 'Confirm Email');
        }

        //------------------------------------------------------------

        // get user permissions
        $editor =& User::singleton();

        // center ID
        if ($editor->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $siteOptions =& Utility::getSiteList(false);
        } else {
            // allow only to add to their own site
            $siteOptions
                = array(
                   $editor->getData('CenterID') => $editor->getData('Site'),
                  );
        }
        $this->addSelect('CenterID', 'Site', $siteOptions);

        // active
        $this->addSelect('Active', 'Active', array('Y' => 'Yes', 'N' => 'No'));
        $this->addSelect(
            'Pending_approval',
            'Pending approval',
            array(
             'Y' => 'Yes',
             'N' => 'No',
            )
        );

        //------------------------------------------------------------

        // get the editor's permissions
        $perms    = $editor->getPermissionsVerbose();
        $lastRole = '';
        foreach ($perms as $row) {
            if ($row['type'] != $lastRole) {
                $lastRole = $row['type'];
                $group[]  = $this->form->createElement(
                    'static',
                    null,
                    null,
                    '</div>'
                    . "<h3 id=\"header_$lastRole\" "
                    . "class=\"perm_header button\" "
                    . "style=\"text-align: center; margin-top: 5px;\">"
                    .ucwords($row['type'])
                    . '</h3>'
                    . "<div id=\"perms_$lastRole\" style=\"margin-top: 5px;\">"
                );
            }

            // If the user is editing his/her own account, disable all permission
            // checkboxes. Note that they will not be submitted when the form is
            // saved
            $attribs = array("class" => "perm_$lastRole");
            if ($this->_isEditingOwnAccount()) {
                $attribs['disabled'] = true;
            }
            $group[] = $this->createCheckbox(
                'permID['.$row['permID'].']',
                htmlspecialchars($row['description']) . "<br>",
                $attribs
            );
        }
        $this->addGroup($group, 'PermID_Group', 'Permissions', "", false);
        unset($group);

        //getting users name and emails to create checkboxes
        // to email supervisors on permissions changes
        $DB_factory =& NDB_Factory::singleton();
        $DB         = $DB_factory->database();

        $query = "SELECT u.Real_Name, u.email FROM permissions p
                  JOIN user_perm_rel up ON (p.permID = up.PermID)
                  JOIN users u ON (u.ID = up.userID)
                  WHERE p.code = 'send_to_dcc'";

        $results = $DB->pselect($query, array());

        $group[] = $this->form->createElement(
            'static',
            null,
            null,
            '</div>'
            . "<h3 id=\"header_supervisors\" class=\"perm_header button\" "
            . "style=\"text-align: center; margin-top: 5px;\"> "
            . "Data Supervisors to Email </h3> "
            . "<div id=\"perms_supervisors\" style=\"margin-top: 5px;\">"
        );

        $attribs = $this->_isEditingOwnAccount() ? array('disabled' => true) : null;
        foreach ($results as $row) {
            $group[] = $this->createCheckbox(
                'supervisorEmail[' . $row['email'] .']',
                htmlspecialchars($row['Real_Name']) . "<br>",
                $attribs
            );
        }

        $this->addGroup($group, 'Supervisors_Group', 'Supervisors', "", false);
        unset($group);

        if (!$this->isCreatingNewUser()) {
            $user =& User::factory($this->identifier);

            // add hidden permissions if editor has less permissions than user
            // being edited
            $perms = array_diff(
                $user->getPermissionIDs(),
                $editor->getPermissionIDs()
            );
            foreach ($perms as $value) {
                $this->addHidden("permID[$value]", 1);
            }
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validateEditUser'));
    }

    /**
     * Controls the output/behaviour of the form is used to edit
     * the user's preferences.
     *
     * @return void
     */
    // @codingStandardsIgnoreStart
    function my_preferences()
    {
    // @codingStandardsIgnoreEnd
        $this->identifier = $_SESSION['State']->getUsername();

        ///get the value for additional_user_info flag
        $config =& NDB_Config::singleton();
        $additional_user_info = $config->getSetting('additional_user_info');

        //------------------------------------------------------------

        // user name
        $this->addScoreColumn('UserID', 'User name');

        // full name
        // The supplied pattern is:
        //   - must have at least one non-whitespace characters (i.e. required)
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $fistNameInvalidMsg = "First name is required and "
            . "should not exceed 120 characters";
        $this->addBasicText(
            'First_name',
            'First name',
            array(
             'oninvalid' => "this.setCustomValidity('$firstNameInvalidMsg')",
             'onchange'  => "this.setCustomValidity('')",
             'pattern'   => '^\s*\S.{0,119}\s*$',
             'required'  => true,
            )
        );
        // The supplied pattern is:
        //   - must have at least one non-whitespace characters (i.e. required)
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $lastNameInvalidMsg = "Last name is required and "
            . "should not exceed 120 characters";
        $this->addBasicText(
            'Last_name',
            'Last name',
            array(
             'oninvalid' => "this.setCustomValidity('$lastNameInvalidMsg')",
             'onchange'  => "this.setCustomValidity('')",
             'pattern'   => '^\s*\S.{0,119}\s*$',
             'required'  => true,
            )
        );

        // extra info
        ////if the option is not set or if it's and it's true then display it
        if ($additional_user_info) {
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
        $this->addBasicText(
            'Email',
            'Email address',
            array(
             'oninvalid' => "this.setCustomValidity('Email address is required')",
             'onchange'  => "this.setCustomValidity('')",
            )
        );

        // email address rules
        $this->addRule('Email', 'Email address is required', 'required');
        $this->addRule('Email', 'Your email address must be valid', 'email');
        $this->addRule(
            'Email',
            'Your email address must be less than 255 characters long',
            'maxlength',
            255
        );

        // password
        $this->form->addElement('password', 'Password_md5', 'New Password');
        $this->form->addElement('password', '__Confirm', 'Confirm Password');

        // document repository notifications
        $editor =& User::singleton();
        if ($editor->hasPermission('document_repository_view')
            || $editor->hasPermission('document_repository_delete')
        ) {
                $doc_Repo_Notifications_Options
                    = array(
                       'N' => 'No',
                       'Y' => 'Yes',
                      );
                $this->addSelect(
                    'Doc_Repo_Notifications',
                    'Receive Document Repository email notifications',
                    $doc_Repo_Notifications_Options
                );
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validateMyPreferences'));
    }


    /**
     * Validates the data entered in the edit user form.
     *
     * @param array $values what the user entered on the form.
     *
     * @return array $errors all the errors found.
     */
    function _validateEditUser($values)
    {
        // create DB object
        $DB     =& Database::singleton();
        $errors = array();

        //============================================
        //         Validate UserID and NA_UserID
        //============================================
        if ($this->isCreatingNewUser()) {
            // Clicked on "UID == email" and specified a UID
            if (!empty($values['UserID']) && $values['NA_UserID'] == 'on') {
                $errors['UserID_Group']
                    = 'You cannot enter a user name '
                    . 'if you want it to match the email address';
            } elseif (empty($values['UserID']) && $values['NA_UserID'] != 'on') {
                // Not clicked on "UID == email" and not specified a UID
                $errors['UserID_Group']
                    = 'You must enter a user name '
                    . 'or choose to make it match the email address';
            } elseif (!empty($values['UserID'])
                || ($values['NA_UserID'] == 'on' && $values['Email'])
            ) {
                // Either specified a UID or clicked on "UID = email"
                // with a non-empty email
                $effectiveUID = empty($values['UserID'])
                    ? $values['Email'] : $values['UserID'];

                $effectiveUID = trim($effectiveUID);

                // check username's uniqueness
                $result = $DB->pselectOne(
                    "SELECT COUNT(*) FROM users WHERE UserID = :UID",
                    array('UID' => $effectiveUID)
                );

                if ($result > 0) {
                    $errors['UserID_Group'] = 'The user name already exists';
                }

                if (strlen($effectiveUID) > 255) {
                    $errors['UserID_Group']
                        = 'The user name must not exsceed 255 characters';
                }
            }
        }

        //==================================
        //        Password validation
        //==================================
        if (!is_null($this->identifier)) {
            $pass = $DB->pselectOne(
                "SELECT COALESCE(Password_hash, Password_md5) "
                . "as Current_password FROM users WHERE UserID = :UID",
                array('UID' => $this->identifier)
            );

            //case of new user the password column will be null
            //so either password should be set or
            // password should be generated
            if (is_null($pass)
                && empty($values['Password_md5'])
                && $values['NA_Password'] != 'on'
            ) {
                $errors['Password_Group']
                    = 'Please specify password or click Generate new password';
            }
        }

        // if password is user-defined, and user wants to change password
        if (empty($values['NA_Password'])
            && (!empty($values['Password_md5']) || !empty($values['__Confirm']))
        ) {
            $isPasswordStrong = User::isPasswordStrong(
                $values['Password_md5'],
                array(
                 $values['__Confirm'],
                 isset($values['UserID']) ? $values['UserID'] : $this->identifier,
                 $values['Email'],
                ),
                array(
                 '==',
                 '!=',
                 '!=',
                )
            );

            // check password strength
            if (!$isPasswordStrong) {
                $errors['Password_Group']
                    = 'The password is weak, or the passwords do not match';
            } else {
                // New password must be different than current one
                if (!$this->_passwordChanged($DB, $values['Password_md5'])) {
                    $errors['Password_Group'] = 'New and old passwords '
                        . 'are identical: please choose another one';
                }
            }
        }

        // if password is generated then the email user button should be clicked
        if ($values['NA_Password'] == "on" && $values['SendEmail'] != "on") {
               $errors['Email_Group']
                   = 'When generating a new password, '
                   . 'please notify the user by checking Send email to user box';
        }

        if ($values['NA_Password'] == 'on' && $values['Password_md5'] != '') {
            $errors['Password_Group'] = 'You must leave the password field empty '
                . 'if you want the system to generate one for you';
        }

        if (is_null($this->identifier)
            && ($values['NA_Password'] != 'on')
            && empty($values['Password_md5'])
        ) {
               $errors['Password_Group'] = 'Password is required';
        }

        //======================================
        //           Validate Email
        //======================================

        // If an email was entered
        if (!empty($values['Email'])) {
            $emailError = $this->_getEmailError($DB, $values['Email']);
            if (!is_null($emailError)) {
                $errors['Email_Group'] = $emailError;
            } elseif ($this->isCreatingNewUser()) {
                if ($values['Email'] != $values['__ConfirmEmail']) {
                    $errors['__ConfirmEmail'] = 'Email and confirmed email '
                        . ' do not match';
                }
            }
        } else {
            // No email entered: error
            $errors['Email_Group'] = 'You must enter an email address';
        }

        return $errors;
    }

    /**
     * Determines if the new password that the user entered is different
     * than its current password (the one stored in the database).
     *
     * @param Database $db          database object.
     * @param string   $newPassword the new password the user entered.
     *
     * @return bool  true if the password changed, false otherwise.
     */
    function _passwordChanged($db, $newPassword)
    {
        //--- Get current password stored in database
        $passwordQuery
            = "SELECT Password_hash, Password_md5
               FROM users 
               WHERE UserID = :UID";

        $passwords = $db->pselectRow(
            $passwordQuery,
            array('UID' => $this->identifier)
        );

        // If we are using PHP5.5+ and entry Password_has in the DB is not null
        // use method password_verify to check if the password changed
        if (function_exists('password_verify')
            && !is_null($passwords['Password_hash'])
        ) {
            return !password_verify($newPassword, $passwords['Password_hash']);
        } elseif (!function_exists('password_verify')
            && !is_null($passwords['Password_md5'])
        ) {
            // If PHP version < 5.5, use old MD5Unsalt method to check for
            // password change
            return !User::MD5Unsalt($newPassword, $passwords['Password_md5']);
        }

        return true;
    }

    /**
     * Validates the data entered in the form when editing one's preferences.
     *
     * @param array $values values the user entered in the form.
     *
     * @return array $errors all the errors found.
     */
    function _validateMyPreferences($values)
    {
        // create DB object
        $DB     =& Database::singleton();
        $errors = array();

        // if password is user-defined, and user wants to change password
        if (!empty($values['Password_md5'])) {
            // check password strength
            $isPasswordStrong = User::isPasswordStrong(
                $values['Password_md5'],
                array(
                 $values['__Confirm'],
                 $this->identifier,
                 $values['Email'],
                ),
                array(
                 '==',
                 '!=',
                 '!=',
                )
            );
            if (!$isPasswordStrong) {
                $errors['Password_md5']
                    = 'The password is weak, or the passwords do not match';
            } else {
                // New password must be different than current one
                if (!$this->_passwordChanged($DB, $values['Password_md5'])) {
                    $errors['Password_Group'] = 'New and old passwords '
                        . 'are identical: please choose another one';
                }
            }
        }

        // Validate email
        $emailError = $this->_getEmailError($DB, $values['Email']);
        if (!is_null($emailError)) {
            $errors['Email'] = $emailError;
        }

        return $errors;
    }

    /**
     * Validates that en email address entered for a given user
     * (either new or existing) is valid and unique.
     *
     * @param Database $DB    database object.
     * @param string   $email user's email.
     *
     * @return string error message if email is invalid, null otherwise.
     */
    private function _getEmailError($DB, $email)
    {
        // remove illegal characters
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);

        // check email address' uniqueness
        $query  = "SELECT COUNT(*) FROM users WHERE Email = :VEmail ";
        $params = array('VEmail' => $email);
        if (!is_null($this->identifier)) {
            $query        .= " AND userID <> :UID";
            $params['UID'] = $this->identifier;
        }
        $result = $DB->pselectOne($query, $params);

        // Email already exists in database
        if ($result > 0) {
            return 'The email address already exists';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // If email not syntactically valid
            return "Invalid email address";
        }

        return null;
    }

    /**
     * Gets the complete description for a permission.
     *
     * @param int $permID permission ID.
     *
     * @return string the description.
     */
    function getDescriptionUsingPermID($permID)
    {
        $db_factory =& NDB_Factory::singleton();
        $db         = $db_factory->database();

        $permission = $db->pselectOne(
            "SELECT Description FROM permissions WHERE permID =:pID",
            array('pID' => $permID)
        );
        if (is_array($permission) && count($permission)) {
            list(,$description) = each($permission[0]);
        }
        return $permission;
    }
}
?>

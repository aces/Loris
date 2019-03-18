<?php
/**
 * The user account page
 *
 * PHP Version 5,7
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\user_accounts;

/**
 * Implements the user account page
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class My_Preferences extends \NDB_Form
{
    /**
     * Computes the initial values this page will be filled with.
     *
     * @return array the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = array();

        $user = \User::factory($this->identifier);
        // get the user defaults
        $defaults = $user->getData();
        // remove the password hash
        unset($defaults['Password_hash']);

        // An array of each field that requires front-end sanitization
        $fieldsThatAreStrings = array(
                                 'UserID',
                                 'First_name',
                                 'Last_name',
                                 'Real_name',
                                 'Email',
                                 'Degree',
                                 'Institution',
                                 'Address',
                                 'City',
                                 'State',
                                 'Zip_code',
                                 'Country',
                                 'Fax',
                                );
        // Prevent Javascript injection on all fields
        foreach ($fieldsThatAreStrings as $fieldName) {
            // this check prevents PHP Notices
            if (!empty($defaults[$fieldName])) {
                $defaults[$fieldName] = htmlspecialchars($defaults[$fieldName]);
            }
        }

        foreach ($defaults['examiner'] as $cid=>$vals) {
            //sets pending approval info
            if ($cid=='pending') {
                $defaults['examiner_pending'] = $vals;
                continue;
            }
            //gets radiologist Y/N from any of the active sites
            if ($vals[0]=='Y') {
                if ($vals[1]==='1') {
                    $defaults['examiner_radiologist'] = 'Y';
                } else {
                    $defaults['examiner_radiologist'] = 'N';
                }
            }
            if ($vals[0]=='Y') {
                $defaults['ex_'.$cid] ='on';
            }
        }

        // Notification defaults
        // "notif_".$module."_".$operation."_".$service
        $curr_sub = \NDB_Notifier::getUserNotificationModuleServices(
            $user->getData("ID")
        );
        foreach ($curr_sub as $module=>$operations) {
            foreach ($operations as $operation => $services) {
                unset($services['desc']);
                foreach ($services as $service => $subscribed) {
                    $var_name = "notif_".$module."_".$operation."_".$service;

                    if ($subscribed==='Y') {
                        $defaults[$var_name] = 'on';
                    }
                }
            }
        }
        return $defaults;
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
        $config = \NDB_Config::singleton();
        $DB     = \Database::singleton();

        //The arrays that contain the edited permissions
        $permissionsRemoved = array();
        $permissionsAdded   = array();

        // build the "real name"
        $values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];

        $user = \User::factory($this->identifier);

        // If editing a user and nothing was specified in the password text field
        // remove Password_md5 from the value set, otherwise Password_md5
        // will be set to '' by the system
        if ($values['Password_hash'] == '') {
            unset($values['Password_hash']);
        }

        // START NOTIFICATIONS UPDATE
        // get current notifications for user
        $curr_sub = \NDB_Notifier::getUserNotificationModuleServices(
            $user->getData("ID")
        );

        // get notification details
        foreach ($curr_sub as $module => $operations) {
            foreach ($operations as $operation => $services) {
                $module_id = \NDB_Notifier::getNotificationModuleID(
                    $module,
                    $operation
                );
                unset($services['desc']);
                foreach ($services as $service => $subscribed) {
                    $service_id = \NDB_Notifier::getNotificationServiceID(
                        $service
                    );
                    $var_name   = "notif_" . $module . "_"
                        . $operation . "_" . $service;

                    if (isset($values[$var_name]) && $values[$var_name] === 'on') {
                        if ($subscribed === 'N') {
                            $DB->insert(
                                'users_notifications_rel',
                                array(
                                 "module_id"  => $module_id,
                                 "service_id" => $service_id,
                                 "user_id"    => $user->getData("ID"),
                                )
                            );
                        }
                    } else {
                        if ($subscribed === 'Y') {
                            $DB->delete(
                                'users_notifications_rel',
                                array(
                                 "module_id"  => $module_id,
                                 "service_id" => $service_id,
                                 "user_id"    => $user->getData("ID"),
                                )
                            );
                        }
                    }
                    unset($values[$var_name]);
                }
            }
        }
        // END NOTIFICATIONS UPDATE

        // make the set
        foreach ($values as $key => $value) {
            if (!empty($value)) {
                $set[$key] = $value;
            } else {
                $set[$key] = null;
            }
        }

        // update the user
        $success = $user->update($set);

        // prepend two random characters
        if (isset($set['Password_hash'])) {
            // Update CouchDB. Must do before password is salted/hashed.
            $user->updatePassword(
                $set['Password_hash'],
                $values['Password_expiry'] ?? ''
            );
        }

        // send the user an email
        if (!empty($send)) {
            // create an instance of the config object
            $config = \NDB_Config::singleton();

            // send the user an email
            $msg_data['study']    = $config->getSetting('title');
            $msg_data['url']      = $config->getSetting('url');
            $msg_data['realname'] = $values['Real_name'];
            $msg_data['username'] = $user->getUsername();
            $msg_data['password'] = $values['Password_hash'];

            $template = (is_null($this->identifier))
                ? 'new_user.tpl' : 'edit_user.tpl';
            \Email::send($values['Email'], $template, $msg_data);
        }

        $this->tpl_data['success'] = true;
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

        $this->identifier = $_SESSION['State']->getUsername();

        $user =& \User::singleton($this->identifier);

        //get notification details
        $notifier_list     = \NDB_Notifier::getNotificationModuleServices();
        $notifier_services = \NDB_Notifier::getNotificationServices();
        //------------------------------------------------------------

        // user name
        $this->addScoreColumn('UserID', 'User name');

        // full name
        // The supplied pattern is:
        //   - must have at least one non-whitespace characters (i.e. required)
        //   - once leading and trailing spaces are stripped, the field should
        //       not exceed 120 chars
        $firstNameInvalidMsg = "First name is required and "
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
        $this->form->addElement('password', 'Password_hash', 'New Password');
        $this->form->addElement('password', '__Confirm', 'Confirm Password');

        // language preference
        $languages = \Utility::getLanguageList();
        $this->addSelect('language_preference', 'Language preference', $languages);

        // Notification headers
        $nGroup[] = $this->createLabel("Module");
        $nGroup[] = $this->createLabel("Operation");
        $nGroup[] = $this->createLabel("Description");

        foreach ($notifier_services as $id=>$serv) {
            $nGroup[] = $this->createLabel($serv);
        }
        $this->addGroup(
            $nGroup,
            "notification_headers",
            null,
            $this->_GUIDelimiter,
            false
        );
        unset($nGroup);

        // Notification rows
        $notification_rows =array();
        foreach ($notifier_list as $module=>$operation_services) {
            foreach ($operation_services as $operation=>$services) {
                $nGroup[] = $this->createLabel($module);
                $nGroup[] = $this->createLabel($operation);
                $nGroup[] = $this->createLabel($services['desc']);
                unset($services['desc']);

                // Check for permissions
                $display =true;
                foreach ($services['perm'] as $k=>$permission) {
                    if (!$user->hasPermission($permission)) {
                        $display =false;
                        break;
                    }
                }
                unset($services['perm']);

                foreach ($services as $service=>$avail) {
                    if ($avail==='Y' && $display) {
                        $nGroup[] = $this->createCheckbox(
                            "notif_".$module."_".$operation."_".$service,
                            ""
                        );
                    } else {
                        $nGroup[] = $this->createLabel(
                            "N/A"
                        );
                    }

                }

                $this->addGroup(
                    $nGroup,
                    "row_".$module."_".$operation,
                    null,
                    $this->_GUIDelimiter,
                    false
                );
                $notification_rows[] ="row_".$module."_".$operation;
                unset($nGroup);
            }
        }
        $this->tpl_data['notification_rows'] = $notification_rows;
        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validateMyPreferences'));
    }

    /**
     * Determines if the new password that the user entered is different
     * than its current password (the one stored in the database).
     *
     * @param \Database $db          database object.
     * @param string    $newPassword the new password the user entered.
     *
     * @return bool  true if the password changed, false otherwise.
     */
    function _passwordChanged(\Database $db, $newPassword): bool
    {
        //--- Get current password stored in database
        $passwordQuery
            = "SELECT Password_hash
               FROM users
               WHERE UserID = :UID";

        $passwords = $db->pselectRow(
            $passwordQuery,
            array('UID' => $this->identifier)
        );
        if (is_null($passwords)) {
            throw new \LorisException(
                'No existing password found for user!'
            );
        }

        if (!is_null($passwords['Password_hash'])) {
            return !password_verify($newPassword, $passwords['Password_hash']);
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
        $DB     = \Database::singleton();
        $errors = array();

        // if password is user-defined, and user wants to change password
        if (!empty($values['Password_hash'])) {
            // check password strength
            $isPasswordStrong = \User::isPasswordStrong(
                $values['Password_hash'],
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
                $errors['Password_hash']
                    = 'The password is weak, or the passwords do not match';
            } else {
                // New password must be different than current one
                if (!$this->_passwordChanged($DB, $values['Password_hash'])) {
                    $errors['Password_hash'] = 'New and old passwords '
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
     * @param \Database $DB    database object.
     * @param string    $email user's email.
     *
     * @return string error message if email is invalid, null otherwise.
     */
    private function _getEmailError(\Database $DB, $email)
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
}


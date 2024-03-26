<?php
namespace LORIS\my_preferences;

/**
 * Implements the my preferences page.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class My_Preferences extends \NDB_Form
{
    private const PASSWORD_ERROR_IS_EMAIL  = 'Your password cannot be your email.';
    private const PASSWORD_ERROR_IS_USER   = 'Your password cannot be ' .
                                        'your user name.';
    private const PASSWORD_ERROR_NO_MATCH  = 'The passwords do not match.';
    private const PASSWORD_ERROR_NO_CHANGE = 'New and old passwords are ' .
                                        'identical: please choose another one';
    /**
     * Computes the initial values this page will be filled with.
     *
     * @return array the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $user = \User::factory($this->identifier);
        // get the user defaults
        $defaults = $user->getData();
        // remove the password hash
        unset($defaults['Password_hash']);

        // An array of each field that requires front-end sanitization
        $fieldsThatAreStrings = [
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
        ];
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
            $user->getId()
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
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        $DB      = $factory->database();

        // build the "real name"
        $values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];

        $user = \User::factory($this->identifier);

        // START NOTIFICATIONS UPDATE
        // get current notifications for user
        $curr_sub = \NDB_Notifier::getUserNotificationModuleServices(
            $user->getId()
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
                                [
                                    "module_id"  => $module_id,
                                    "service_id" => $service_id,
                                    "user_id"    => $user->getId(),
                                ]
                            );
                        }
                    } else {
                        if ($subscribed === 'Y') {
                            $DB->delete(
                                'users_notifications_rel',
                                [
                                    "module_id"  => $module_id,
                                    "service_id" => $service_id,
                                    "user_id"    => $user->getId(),
                                ]
                            );
                        }
                    }
                    unset($values[$var_name]);
                }
            }
        }
        // END NOTIFICATIONS UPDATE
        $set = [];
        // If editing a user and nothing was specified in the password text field
        // remove the key from the value set, otherwise Password_hash
        // will be set to '' by the system
        if ($values['Password_hash'] == '') {
            unset($values['Password_hash']);
        }
        foreach ($values as $key => $value) {
            // Password updates are handled separately. Password_hash is removed
            // from the initial update as otherwise it will be recorded in the
            // history table unencrypted.
            if (!empty($value) && $key != 'Password_hash') {
                $set[$key] = $value;
            } else {
                $set[$key] = null;
            }
        }
        // update the user
        $user->update($set);

        // Now set the password. Note that this field is named incorrectly at this
        // point in the code and represents a plaintext password, not a hash.
        // Validation for the password is performed in _validateMyPreferences()
        if (isset($values['Password_hash'])) {
            $user->updatePassword(
                new \Password(
                    htmlspecialchars_decode($values['Password_hash'])
                )
            );
        }

        // send the user an email
        $msg_data          = [];
        $msg_data['study'] = $config->getSetting('title');
        $msg_data['realname'] = $values['Real_name'];

        \Email::send($values['Email'], 'account_details_changed.tpl', $msg_data);

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

        $user = \User::singleton($this->identifier);

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
            [],
            [
                'oninvalid' => "this.setCustomValidity('$firstNameInvalidMsg')",
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
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
            [],
            [
                'oninvalid' => "this.setCustomValidity('$lastNameInvalidMsg')",
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
        );

        // email address
        $this->addBasicText(
            'Email',
            'Email address',
            [],
            [
                'oninvalid' => "this.setCustomValidity('Email address is required')",
                'onchange'  => "this.setCustomValidity('')",
            ]
        );

        // email address rules
        $this->addRule('Email', 'Email address is required', 'required');
        $this->addRule(
            'Email',
            'Your email address must be less than 255 characters long',
            'maxlength',
            "255"
        );

        // password
        $this->form->addElement('password', 'Password_hash', 'New Password');
        $this->form->addElement('password', '__Confirm', 'Confirm Password');

        // language preference
        $languages = \Utility::getLanguageList();
        $this->addSelect('language_preference', 'Language preference', $languages);

        // Notification headers
        $nGroup   = [];
        $nGroup[] = $this->createLabel("Module");
        $nGroup[] = $this->createLabel("Operation");
        $nGroup[] = $this->createLabel("Description");

        foreach ($notifier_services as $serv) {
            $nGroup[] = $this->createLabel($serv);
        }
        $this->addGroup(
            $nGroup,
            "notification_headers",
            '',
            $this->_GUIDelimiter,
        );
        unset($nGroup);

        // Notification rows
        $notification_rows =[];
        foreach ($notifier_list as $module=>$operation_services) {
            foreach ($operation_services as $operation=>$services) {
                $nGroup   = [];
                $nGroup[] = $this->createLabel($module);
                $nGroup[] = $this->createLabel($operation);
                $nGroup[] = $this->createLabel($services['desc']);
                unset($services['desc']);

                // Check for permissions
                $display =true;
                foreach ($services['perm'] as $permission) {
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
                    '',
                    $this->_GUIDelimiter
                );
                $notification_rows[] ="row_".$module."_".$operation;
                unset($nGroup);
            }
        }
        $this->tpl_data['notification_rows'] = $notification_rows;
        //------------------------------------------------------------

        $widgets = [];
        $modules = $this->loris->getActiveModules();
        foreach ($modules as $module) {
            if ($module->hasAccess($user)) {
                $mwidgets = $module->getWidgets(
                    'userpreference',
                    $user,
                    [],
                );
                foreach ($mwidgets as $widget) {
                    if (!($widget instanceof UserPreferenceWidget)) {
                        continue;
                    }
                    $widgets[] = $widget;
                }
            }
        }
        $this->tpl_data['module_userpreference_widgets'] = $widgets;

        // unique key and password rules
        $this->form->addFormRule([&$this, '_validateMyPreferences']);
    }


    /**
     * Validates the data entered in the form when editing one's preferences.
     *
     * @param array $values values the user entered in the form.
     *
     * @return array $errors all the errors found.
     */
    function _validateMyPreferences(array $values): array
    {
        // create DB object
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $errors  = [];

        // NOTE The 'Password_hash' key actually represents a plaintext password
        $plaintext = $values['Password_hash'];

        if ($values['Email'] === $plaintext) {
            $errors['Password_Group'] = self::PASSWORD_ERROR_IS_EMAIL;
        }

        // Make sure the user is not using their username as their password.
        if ($this->identifier === $plaintext) {
            $errors['Password_Group'] = self::PASSWORD_ERROR_IS_USER;
        }

        // Ensure that the password and confirm password fields match.
        // TODO This validation should be done on the front-end instead.
        if ($values['Password_hash'] !== $values['__Confirm']) {
            $errors['Password_Group'] = self::PASSWORD_ERROR_NO_MATCH;
            return $errors;
        }

        // if password is user-defined, and user wants to change password
        if (!empty($values['Password_hash'])) {
            try {
                // The Password class is self-validating and will throw an
                // InvalidArgumentException if the value passed to it is
                // bad or the input is too weak to be a good password.
                $decoded = htmlspecialchars_decode($plaintext);
                new \Password($decoded);
                // New password must be different than current one
                if (! \User::factory($this->identifier)->isPasswordDifferent(
                    $decoded
                )
                ) {
                    $errors['Password_Group'] = self::PASSWORD_ERROR_NO_CHANGE;
                }
            } catch (\InvalidArgumentException $e) {
                $errors['Password_Group'] = $e->getMessage();
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
     * @return ?string error message if email is invalid, null otherwise.
     */
    private function _getEmailError(\Database $DB, $email): ?string
    {
        // remove illegal characters
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            // If email not syntactically valid
            return "Invalid email address";
        }

        // check email address' uniqueness
        $query  = "SELECT COUNT(*) FROM users WHERE Email = :VEmail ";
        $params = ['VEmail' => $email];
        if (!is_null($this->identifier)) {
            $query        .= " AND userID <> :UID";
            $params['UID'] = $this->identifier;
        }
        $result = $DB->pselectOne($query, $params);

        // Email already exists in database
        if ($result > 0) {
            return 'The email address already exists';
        }

        return null;
    }

    /**
     * Add dependency for password visibility
     *
     * @return array of javascript files to be sourced
     */
    function getJSDependencies()
    {
        $factory  = \NDB_Factory::singleton();
        $baseurl  = $factory->settings()->getBaseURL();
        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            [
                $baseurl . '/js/passwordVisibility.js',
                $baseurl . '/my_preferences/js/my_preferences_helper.js',
                $baseurl . '/js/components/CSSGrid.js',
            ]
        );
    }

    /**
     * Include additional CSS files:
     *  1. configuration
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/css/password.css",
            ]
        );
    }
}


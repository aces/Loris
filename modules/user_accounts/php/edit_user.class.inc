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
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the user account page
 *
 * @category Main
 * @package  User_Account
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Edit_User extends \NDB_Form
{
    /**
     * Determines whether this form is in edit or create mode.
     *
     * @return boolean true if in create mode, false otherwise.
     */
    function isCreatingNewUser()
    {
        return $this->identifier == '';
    }

    /**
     * Controls who's got access to this page, namely those who have the
     * 'user_accounts' and who either have permission
     * 'user_accounts_multisite' or whose site matches the site of the user they
     * are trying to edit.
     *
     * @param \User $editor The user who is accessing this page
     *
     * @return true if user has access, false otherwise.
     */
    function _hasAccess(\User $editor) : bool
    {
        if (!$this->isCreatingNewUser()) {
            $user = \User::factory($this->identifier);
        }

        if ($editor->hasPermission('user_accounts')) {
            if ($editor->hasPermission('user_accounts_multisite')) {
                return true;
            }

            if ($this->isCreatingNewUser()) {
                return true;
            }
            return array_intersect(
                $user->getData('CenterIDs'),
                $editor->getData('CenterIDs')
            ) == $user->getData(
                'CenterIDs'
            );
        }

        return false;
    }

    /**
     * Computes the initial values this page will be filled with.
     *
     * @return array the default values for the initial state of this page.
     */
    function _getDefaults()
    {
        $defaults = array();

        if (!$this->isCreatingNewUser()) {
            $user = \User::factory($this->identifier);
            // get the user defaults
            $defaults = $user->getData();
            // remove the password hash
            unset($defaults['Password_hash']);

            // get the user's permissions
            $perms = $user->getPermissionIDs();

            // set the user's permission defaults
            foreach ($perms as $value) {
                $defaults["permID[$value]"] = 'on';
            }

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
        $editor = \User::singleton();
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
        $config = \NDB_Config::singleton();
        $DB     = \Database::singleton();
        //The arrays that contain the edited permissions
        $permissionsRemoved = array();
        $permissionsAdded   = array();
        $editor = \User::singleton();
        // build the "real name"
        $values['Real_name'] = $values['First_name'] . ' ' . $values['Last_name'];
        //create the user
        if (!is_null($this->identifier)) {
            $user = \User::factory($this->identifier);
        } else {
            // Since the form has been validated there are two possibilities:
            //    - UID is set
            //    - UID is not set but the "Match UID to email" checkbox is checked
            $effectiveUID = $values['NA_UserID'] == 'on'
                ? $values['Email'] : $values['UserID'];
            $user         = \User::factory($effectiveUID);
        }
        ////Get the current permissions/////
        $current_permissionids = $user->getPermissionIDs();
        // All permissions are wiped on update.  $permIDs will contain ALL the
        // user's permissions after an update.  Therefore its structure can be
        // defined as:
        // 1) The new permissions granted by the editor, AND
        // 2) Certain old permissions that the editor is not permitted to alter
        // In addition, old permissions should be removed if the editor has
        // removed them and the editor has permissions to remove them.
        $newPermissions    = array_keys($values['permID']) ?? array();
        $editorPermissions = $editor->getPermissionIDs() ?? array();
        $permIDs           = array();
        // store the permission IDs
        if (!empty($values['permID'])) {
            // An editor can only grant permissions that they have already been
            // granted.
            $permIDs = array_intersect(
                $newPermissions,
                $editorPermissions
            );
        }

        // Keep old permissions if the editor is not allowed to edit them.
        foreach ($current_permissionids as $perm) {
            if (!in_array($perm, $newPermissions)
                && !in_array($perm, $editorPermissions)
            ) {
                $permIDs[] = $perm;
            }
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
            $values['Password_hash']   = \User::newPassword();
            $values['Password_expiry'] = '1990-04-01';
        }
        unset($values['NA_Password']);
        // If editing a user and nothing was specified in the password text field
        // remove Password_md5 from the value set, otherwise Password_md5
        // will be set to '' by the system
        if ($values['Password_hash'] == '' && !$this->isCreatingNewUser()) {
            unset($values['Password_hash']);
        }
        // multi-site UPDATE
        $uid           = $user->getData('ID');
        $us_curr_sites = $values['CenterIDs'];
        if (!$this->isCreatingNewUser()) {
            $DB->delete('user_psc_rel', array("UserID" => $uid));
            foreach ($us_curr_sites as $site) {
                $DB->insert(
                    'user_psc_rel',
                    array(
                     "UserID"   => $uid,
                     "CenterID" => $site,
                    )
                );
            }
        }
        unset($values['CenterIDs']);
        // END multi-site UPDATE

        // EXAMINER UPDATE
        if ($editor->hasPermission('examiner_multisite')) {
            // get all fields that are related to examiners
            $ex_curr_sites  = array();
            $ex_prev_sites  = array();
            $ex_radiologist = 'N';
            $ex_pending     = 'Y';

            foreach ($values as $k => $v) {
                //examiner fields
                if (preg_match("/^ex_[0-9]+$/", $k)) {
                    //get centerID
                    $parse_key = explode('_', $k);
                    $cid       = $parse_key[1];
                    $ex_curr_sites[$k] = $cid;
                }
                if ($k === 'examiner_radiologist') {
                    $ex_radiologist = $v;
                }
                if ($k === 'examiner_pending') {
                    $ex_pending = $v;
                }
            }

            $examinerID = $DB->pselect(
                "SELECT e.examinerID
             FROM examiners e
             WHERE e.full_name=:fn",
                array(
                 "fn" => $values['Real_name'],
                )
            );

            // START EXAMINER UPDATE
            if (!empty($ex_radiologist)
                && !empty($ex_pending)
                && !empty($ex_curr_sites)
                && empty($examinerID)
            ) {
                // If examiner not in table and radiologist, pending and current
                // sites fields set add the examiner to the examiner table
                $ex_radiologist = $ex_radiologist === 'Y' ? 1 : 0;
                $DB->insert(
                    'examiners',
                    array(
                     'full_name'   => $values['Real_name'],
                     'radiologist' => $ex_radiologist,
                     'userID'      => $uid,
                    )
                );
                $examinerID = $DB->pselectOne(
                    "SELECT examinerID
                            FROM examiners
                            WHERE full_name=:fullName",
                    array('fullName' => $values['Real_name'])
                );
            } elseif (!empty($examinerID)
                && ((!empty($ex_radiologist)
                && !empty($ex_pending)
                && !empty($ex_curr_sites))
                || empty($ex_curr_sites))
            ) {
                // If examiner already exists in the examiner table AND
                // radiologist, pending and current sites fields all set or
                // unset update the examiner table with new values
                $ex_radiologist = $ex_radiologist === 'Y' ? 1 : 0;
                $DB->update(
                    'examiners',
                    array(
                     'radiologist' => $ex_radiologist,
                     'userID'      => $uid,
                    ),
                    array(
                     "full_name" => $values['Real_name'],
                    )
                );
                $examinerID = $examinerID[0]['examinerID'];

                //get existing sites for examiner
                $prev_sites = $DB->pselect(
                    "SELECT centerID
                            FROM examiners_psc_rel epr
                            WHERE examinerID=:eid",
                    array("eid" => $examinerID)
                );

                //get sites where user is already an examiner at for compare
                foreach ($prev_sites as $row => $center) {
                    array_push($ex_prev_sites, $center['centerID']);
                }
            }
            foreach ($ex_curr_sites as $k => $v) {

                //Check if examiner already in db for site
                $result = $DB->pselectRow(
                    "SELECT epr.centerID
                           FROM examiners_psc_rel epr 
                           WHERE epr.examinerID=:eid AND epr.centerID=:cid",
                    array(
                     "eid" => $examinerID,
                     "cid" => $v,
                    )
                );

                // examiner was not previously added, add and set to active
                if (empty($result)) {
                    $DB->insert(
                        'examiners_psc_rel',
                        array(
                         'examinerID'       => $examinerID,
                         'centerID'         => $v,
                         'active'           => 'Y',
                         'pending_approval' => $ex_pending,
                        )
                    );
                } else {
                    $DB->update(
                        'examiners_psc_rel',
                        array(
                         'active'           => 'Y',
                         'pending_approval' => $ex_pending,
                        ),
                        array(
                         'examinerID' => $examinerID,
                         'centerID'   => $v,
                        )
                    );
                }
                unset($values[$k]);
            }

            //de-activate examiner if sites where no longer checked
            $ex_inactive = array_diff($ex_prev_sites, $ex_curr_sites);
            foreach ($ex_inactive as $cid) {
                $DB->update(
                    'examiners_psc_rel',
                    array("active" => 'N'),
                    array(
                     'examinerID' => $examinerID,
                     'centerID'   => $cid,
                    )
                );
            }
        }
        unset($values['examiner_radiologist']);
        unset($values['examiner_pending']);
        //END EXAMINER UPDATE

        // make the set
        foreach ($values as $key => $value) {
            if (!empty($value)) {
                $set[$key] = $value;
            } else {
                $set[$key] = null;
            }
        }
        // update the user
        if ($this->isCreatingNewUser()) {
            // insert a new user
            $success = \User::insert($set);
            $user    = \User::factory($set['UserID']);
            $uid     = $user->getData('ID');
            foreach ($us_curr_sites as $site) {
                $DB->insert(
                    'user_psc_rel',
                    array(
                     "UserID"   => $uid,
                     "CenterID" => $site,
                    )
                );
            }
        } else {
            // update the user
            $user    = \User::factory($this->identifier);
            $success = $user->update($set);
        }
        // prepend two random characters
        if (isset($set['Password_hash'])) {
            // Update CouchDB. Must do before password is salted/hashed.
            $user->updatePassword(
                $set['Password_hash'],
                $values['Password_expiry'] ?? ''
            );
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
                foreach ($permIDs as $permID) {
                    /* if the user didn't have the permission
                       and the permission is now assigned then insert
                       insert into the user_account_history as 'I'
                     */
                    if (!(in_array($permID, $current_permissionids))) {
                        $user->insertIntoUserAccountHistory($permID, 'I');
                        $permissionsAdded[]
                            = $this->getDescriptionUsingPermID($permID);
                    }
                }
            }
            if (!empty($current_permissionids)) {
                // Check for permissions that are to be deleted
                foreach ($current_permissionids as $currentPermID) {
                    //if the permission existed before and it's removed now///
                    ///Then insert into the user_account_history as 'D'
                    if (!in_array($currentPermID, $permIDs)) {
                        $user->insertIntoUserAccountHistory($currentPermID, 'D');
                        $permissionsRemoved[]
                            = $this->getDescriptionUsingPermID($currentPermID);
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
                            \Email::send(
                                $email,
                                'permissions_change_notify_supervisor.tpl',
                                $msg_data
                            );
                        }
                    }
                }
            }

            if (!empty($permIDs)) {
                $user->addPermissions($permIDs);
            }
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
        if ($this->isCreatingNewUser()) {
            $baseURL        = $config->getSetting('url');
            $this->redirect = $baseURL
                . "/user_accounts/edit_user/"
                . $values['UserID'];
        }
    }

    /**
     * The edit_user page overrides the default handler in order to handle URLs for
     * both editing users, and creating them. It extracts the identifier if
     * appropriate and handles the redirection if needed.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR15 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $matches = [];
        preg_match('#.*/edit_user/(.*)#', $request->getUri()->getPath(), $matches);
        if (!empty($matches[1])) {
            $this->identifier = $matches[1];
        }
        $response = parent::handle($request);
        if (!empty($this->redirect)) {
            return $response
                ->withStatus(303)
                ->withHeader("Location", $this->redirect);
        }
        return $response;
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

        ///get the value for additional_user_info flag
        $config = \NDB_Config::singleton();
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
        $group[] = $this->createPassword('Password_hash');
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
        $editor = \User::singleton();

        // center ID
        if ($editor->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $siteOptions = \Utility::getSiteList(false);
        } else {
            // allow only to add to their own site
            $site_arr = $editor->getData('CenterIDs');
            foreach ($site_arr as $key => $val) {
                $site[$key]        =& \Site::singleton($val);
                $siteOptions[$val] = $site[$key]->getCenterName();
            }
        }

        $this->addSelect(
            'CenterIDs',
            'Sites',
            $siteOptions,
            array('multiple' => 'multiple')
        );

        if ($editor->hasPermission('examiner_multisite')) {
            //get site aliases
            $DB      =& \Database::singleton();
            $aliases = $DB->pselect("SELECT CenterID, Alias FROM psc ", array());

            foreach ($aliases as $row) {
                $groupA[] = $this->createCheckbox(
                    'ex_'.$row['CenterID'],
                    $row['Alias'],
                    array()
                );
            }
            $groupB[] = $this->createLabel(
                "Radiologist: "
            );
            $groupB[] = $this->createSelect(
                "examiner_radiologist",
                "Radiologist: ",
                array(
                 null => "",
                 'Y'  => 'Yes',
                 'N'  => 'No',
                )
            );
            $groupB[] = $this->createLabel(
                "Pending Approval:"
            );
            $groupB[] = $this->createSelect(
                "examiner_pending",
                "Pending Approval: ",
                array(
                 null => "",
                 'Y'  => 'Yes',
                 'N'  => 'No',
                )
            );
            $this->addGroup(
                $groupA,
                'examiner_sites',
                'Examiner At:',
                $this->_GUIDelimiter,
                false
            );
            $this->addGroup(
                $groupB,
                'examiner_group',
                'Examiner Status',
                $this->_GUIDelimiter,
                false
            );
            unset($groupA);
            unset($groupB);
        }

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

        // active time windows

        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => 'YMd',
                        'addEmptyOption' => 'true',
                       );

        $dateAttributes = ['class' => 'form-control input-sm input-date'];

        $this->addBasicDate(
            'active_from',
            'Active from',
            $dateOptions,
            $dateAttributes
        );

        $this->addBasicDate(
            'active_to',
            'Active to',
            $dateOptions,
            $dateAttributes
        );

        // checking if the account can be rejected (no password hash
        // pending approval)

        // if new user
        if ($this->isCreatingNewUser()) {
            $this->tpl_data['can_reject'] = false;
        } else {
            $this->tpl_data['can_reject']
                = self::canRejectAccount(\User::factory($this->identifier));
        }
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
        $DB_factory = \NDB_Factory::singleton();
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
            $user = \User::factory($this->identifier);

            // add hidden permissions if editor has less permissions than user
            // being edited
            $permDiff = array_diff(
                $user->getPermissionIDs(),
                $editor->getPermissionIDs()
            );
            foreach ($permDiff as $permID) {
                $this->addHidden("permID[$permID]", 1);
            }
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validateEditUser'));
    }

    /**
     * This ensures that users with account activity cannot be rejected
     * if their approval status is, for some reason, set to pending.
     *
     * @param \User $user The User to verify
     *
     * @return boolean true if 'Pending_approval' is Yes and the user never
     *                      ever logged in.
     */
    static function canRejectAccount(\User $user)
    {
        return $user->getData('Pending_approval') == 'Y'
            && !$user->hasLoggedIn();
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
        $editor = \User::singleton();
        // create DB object
        $DB     = \Database::singleton();
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
                "SELECT COALESCE(Password_hash) "
                . "as Current_password FROM users WHERE UserID = :UID",
                array('UID' => $this->identifier)
            );

            //case of new user the password column will be null
            //so either password should be set or
            // password should be generated
            if (is_null($pass)
                && empty($values['Password_hash'])
                && $values['NA_Password'] != 'on'
            ) {
                $errors['Password_Group']
                    = 'Please specify password or click Generate new password';
            }
        }

        // if password is user-defined, and user wants to change password
        if (empty($values['NA_Password'])
            && (!empty($values['Password_hash']) || !empty($values['__Confirm']))
        ) {
            $isPasswordStrong = \User::isPasswordStrong(
                $values['Password_hash'],
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
                if (!$this->_passwordChanged($DB, $values['Password_hash'])) {
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

        if ($values['NA_Password'] == 'on' && $values['Password_hash'] != '') {
            $errors['Password_Group'] = 'You must leave the password field empty '
                . 'if you want the system to generate one for you';
        }

        if (is_null($this->identifier)
            && ($values['NA_Password'] != 'on')
            && empty($values['Password_hash'])
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

        //======================================
        //           Validate Site
        //======================================
        // Ensure that at least one site is selected
        if (empty($values['CenterIDs'])) {
            $errors['sites_group'] = "You must select at least one " .
                "site/affiliation";
        }

        //======================================
        //        Validate Examiner Status
        //======================================
        if ($editor->hasPermission('examiner_multisite')) {
            $matched = false;
            foreach ($values as $k => $v) {
                if (preg_match("/^ex_[0-9]+$/", $k)) {
                    $matched = true;
                    if ($values['examiner_radiologist'] == '') {
                        $errors['examiner_group'] = "Please specify if examiner " .
                            "is a radiologist";

                    }
                    if ($values['examiner_radiologist'] !== ''
                        && $values['examiner_pending'] == ''
                    ) {
                        $errors['examiner_group'] = "Please set pending " .
                            "approval Yes or No";
                    }
                }
            }
            if (!$matched
                && (($values['examiner_radiologist'] !== ''
                || $values['examiner_pending'] !== ''))
            ) {
                $errors['examiner_sites'] = "Please select at least one examiner
                site or clear the 'Examiner status' fields below (i.e.
                'Radiologist' and 'Pending Approval').";
            }
        }

        //======================================
        //    Validate Active time Windows (from - to)
        //
        //    Note: the only validation included for the moment
        //    is that the time form which the user is active
        //    should be less or equal to the time to it will be active.
        //======================================

        if (($values['active_to'] != null)
            && ($values['active_from'] > $values['active_to'])
        ) {
            $errors['active_timeWindows']
                = 'Please notice that the "Active from" 
                date should be lesser or equal to the "Active to" date.';
        }
        return $errors;
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
    function _passwordChanged(\Database $db, $newPassword)
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

        if (!is_null($passwords['Password_hash'] ?? null)) {
            return !password_verify($newPassword, $passwords['Password_hash']);
        }

        return true;
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

    /**
     * Gets the complete description for a permission.
     *
     * @param int $permID permission ID.
     *
     * @return string the description.
     */
    function getDescriptionUsingPermID($permID)
    {
        $db_factory = \NDB_Factory::singleton();
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

    /**
     * Gathers JS dependencies and merges them with the parent
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
            array($baseURL . "/user_accounts/js/rejectUser.js")
        );
    }
}


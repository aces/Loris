<?php
/**
 * The user account page
 *
 * PHP Version 7
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
    private const PASSWORD_ERROR_IS_EMAIL  = 'Your password cannot be your email.';
    private const PASSWORD_ERROR_IS_USER   = 'Your password cannot be ' .
                                        'your user name.';
    private const PASSWORD_ERROR_NO_MATCH  = 'The passwords do not match.';
    private const PASSWORD_ERROR_NO_CHANGE = 'New and old passwords are ' .
                                        'identical: please choose another one';
    private const EMAIL_NOT_UNIQUE         = 'This email address is already ' .
                                                'in use';

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
     * @return bool true if user has access, false otherwise.
     */
    function _hasAccess(\User $editor) : bool
    {
        if ($editor->hasPermission('user_accounts_multisite')) {
            return true;
        }

        if ($editor->hasPermission('user_accounts')) {
            if ($this->isCreatingNewUser()) {
                return true;
            }
            // Return true if the editor is allowed to edit the information
            // of the user.
            return \User::factory($this->identifier)->isAccessibleBy($editor);
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
        $defaults = [];

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

            $defaults['examiner'] = $defaults['examiner'] ?? [];
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
            $user_id  = $user->getId() ?? -1;
            $curr_sub = \NDB_Notifier::getUserNotificationModuleServices(
                $user_id
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
        $factory = \NDB_Factory::singleton();
        $editor  = $factory->user();
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
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $config  = $factory->config();

        //The arrays that contain the edited permissions
        $permissionsRemoved = [];
        $permissionsAdded   = [];
        $editor = $factory->user();

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
        $newPermissions    = isset($values['permID'])
            ? array_keys($values['permID']) : [];
        $editorPermissions = $editor->getPermissionIDs() ?? [];
        $permIDs           = [];
        $passwordExpired   = false;
        // store the permission IDs
        if (!empty($values['permID'])) {
            // An editor can only grant permissions that they have already been
            // granted unless they are a superuser
            if ($editor->hasPermission('superuser')) {
                $permIDs = $newPermissions;
            } else {
                $permIDs = array_intersect(
                    $newPermissions,
                    $editorPermissions
                );
            }
        }

        // Keep old permissions if the editor is not allowed to edit them,
        // unless editor is superuser
        foreach ($current_permissionids as $perm) {
            if (!in_array($perm, $newPermissions)
                && !in_array($perm, $editorPermissions)
                && !$editor->hasPermission('superuser')
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
            $values['UserID'] = trim($values['UserID'] ?? '');
        }
        unset($values['NA_UserID']);
        // generate new password
        if (!empty($values['NA_Password'])) {
            $values['Password_hash'] = \Utility::randomString();
            $passwordExpired         = true;
        }
        unset($values['NA_Password']);
        // If editing a user and nothing was specified in the password text field
        // remove the supplied password value. We don't want to change a user's
        // password when this value is blank.
        if ($values['Password_hash'] == '' && !$this->isCreatingNewUser()) {
            unset($values['Password_hash']);
        }
        // multi-site UPDATE
        $uid           = $user->getId();
        $us_curr_sites = $values['CenterIDs'];
        $userNewCenterIDs = array_map(
            function ($val) {
                return \CenterID::singleton($val);
            },
            $values['CenterIDs']
        );
        if (!$this->isCreatingNewUser()) {
            // Prevent deletion of rules/sites editor may not have access to edit.
            if (!$editor->hasPermission('user_accounts_multisite')) {
                // Collect CenterID(s) of user being modified.
                $userCenterIDs = $user->getCenterIDs();
                // Collect CenterID(s) of the editor modifying sites.
                $editorCenterIDs = $editor->getCenterIDs();
                // If the editor does not have access to all of the
                // user's sites the difference between the two arrays
                // will be the sites we additionally need to add to
                // the user being modified.
                $differenceOfCenterIDs = array_diff(
                    $userCenterIDs,
                    $editorCenterIDs
                );
                $userNewCenterIDs      = array_merge(
                    array_intersect($userNewCenterIDs, $editorCenterIDs),
                    $differenceOfCenterIDs
                );
            }

            $DB->delete('user_psc_rel', ["UserID" => $uid]);
            foreach ($userNewCenterIDs as $centerID) {
                $DB->insert(
                    'user_psc_rel',
                    [
                        "UserID"   => $uid,
                        "CenterID" => $centerID,
                    ]
                );
            }
        }
        unset($values['CenterIDs']);
        // END multi-site UPDATE

        // START PROJECT UPDATE
        $us_curr_projects = $values['ProjectIDs'];
        if (!$this->isCreatingNewUser()) {
            $DB->delete('user_project_rel', ["UserID" => $uid]);
            foreach ($us_curr_projects as $project) {
                $DB->insert(
                    'user_project_rel',
                    [
                        "UserID"    => $uid,
                        "ProjectID" => $project,
                    ]
                );
            }
        }
        unset($values['ProjectIDs']);
        // END PROJECT UPDATE

        // EXAMINER UPDATE
        if ($editor->hasPermission('examiner_multisite')) {
            // get all fields that are related to examiners
            $ex_curr_sites  = [];
            $ex_prev_sites  = [];
            $ex_radiologist = 'N';

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
            }
            foreach ($ex_curr_sites as $k => $v) {
                unset($values[$k]);
            }
        }
        unset($values['examiner_radiologist']);
        unset($values['examiner_pending']);
        // END SETUP EXAMINER VALUES

        // make the set
        $set = [];
        foreach ($values as $key => $value) {
            // Password updates are handled separately
            if (!empty($value) && $key != 'Password_hash') {
                $set[$key] = $value;
            } else {
                $set[$key] = null;
            }
        }
        // update the user
        if ($this->isCreatingNewUser()) {
            // insert a new user
            \User::insert($set);
            $user = \User::factory($set['UserID']);
            $uid  = $user->getData('ID');
            foreach ($us_curr_sites as $site) {
                $DB->insert(
                    'user_psc_rel',
                    [
                        "UserID"   => $uid,
                        "CenterID" => $site,
                    ]
                );
            }
            foreach ($us_curr_projects as $project) {
                $DB->insert(
                    'user_project_rel',
                    [
                        "UserID"    => $uid,
                        "ProjectID" => $project,
                    ]
                );
            }
        } else {
            // update the user
            $user = \User::factory($this->identifier);
            $user->update($set);
        }

        // START EXAMINER UPDATE
        if ($editor->hasPermission('examiner_multisite')) {
            $ex_pending = 'Y';

            $examinerID = $DB->pselect(
                "SELECT e.examinerID
             FROM examiners e
             WHERE e.userID=:uid",
                [
                    "uid" => $uid,
                ]
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
                    [
                        'full_name'   => $values['Real_name'],
                        'radiologist' => $ex_radiologist,
                        'userID'      => $uid,
                    ]
                );
                $examinerID = $DB->pselectOne(
                    "SELECT examinerID
                            FROM examiners
                            WHERE userID=:uid",
                    ['uid' => $uid]
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
                    [
                        'radiologist' => $ex_radiologist,
                        'full_name'   => $values['Real_name']
                    ],
                    [
                        'userID' => $uid
                    ]
                );

                $examinerID = iterator_to_array($examinerID);
                $examinerID = $examinerID[0]['examinerID'];

                //get existing sites for examiner
                $prev_sites = $DB->pselect(
                    "SELECT centerID
                            FROM examiners_psc_rel epr
                            WHERE examinerID=:eid",
                    ["eid" => $examinerID]
                );

                //get sites where user is already an examiner at for compare
                foreach ($prev_sites as $center) {
                    array_push($ex_prev_sites, $center['centerID']);
                }
            }
            if (!empty($ex_curr_sites)) {
                foreach ($ex_curr_sites as $v) {

                    //Check if examiner already in db for site
                    $result = $DB->pselectRow(
                        "SELECT epr.centerID
                               FROM examiners_psc_rel epr
                               WHERE epr.examinerID=:eid AND epr.centerID=:cid",
                        [
                            "eid" => $examinerID,
                            "cid" => $v,
                        ]
                    );

                    // examiner was not previously added, add and set to active
                    if (empty($result)) {
                        if (!empty($examinerID)) {
                            $DB->insert(
                                'examiners_psc_rel',
                                [
                                    'examinerID'       => $examinerID,
                                    'centerID'         => $v,
                                    'active'           => 'Y',
                                    'pending_approval' => $ex_pending,
                                ]
                            );
                        }
                    } else {
                        $DB->update(
                            'examiners_psc_rel',
                            [
                                'active'           => 'Y',
                                'pending_approval' => $ex_pending,
                            ],
                            [
                                'examinerID' => $examinerID,
                                'centerID'   => $v,
                            ]
                        );
                    }
                }
            }
            //de-activate examiner if sites where no longer checked
            if (!empty($ex_prev_sites)) {
                $ex_inactive = array_diff($ex_prev_sites, $ex_curr_sites);
            }
            if (!empty($ex_inactive)) {
                foreach ($ex_inactive as $cid) {
                    $DB->update(
                        'examiners_psc_rel',
                        ["active" => 'N'],
                        [
                            'examinerID' => $examinerID,
                            'centerID'   => $cid,
                        ]
                    );
                }
            }
        }

        // Now set the password. Note that this field is named incorrectly
        // and represents a plaintext password, not a hash.
        if (isset($values['Password_hash'])) {

            $user->updatePassword(
                new \Password(
                    htmlspecialchars_decode($values['Password_hash'])
                ),
                $passwordExpired
            );
        }

        // update the user permissions if applicable
        // If the user is editing his/her own account, skip the part where
        // changes to the permissions are handled (there should not be any
        // change to the user's permission set since all the checkboxes are
        // disabled)
        if (!$this->_isEditingOwnAccount()) {
            $user->removePermissions();
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
                            $msg_data = [];
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
                            unset($msg_data);
                        }
                    }
                }
            }

            if (!empty($permIDs)) {
                $user->addPermissions($permIDs);
            }
        }

        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        // send the user an email
        if (!empty($send)) {
            $config = $factory->config();

            // send the user an email
            $msg_data          = [];
            $msg_data['study'] = $config->getSetting('title');
            $msg_data['url']   = $baseURL;
            $msg_data['realname'] = $values['Real_name'];
            $msg_data['username'] = $user->getUsername();
            if (isset($values['Password_hash'])) {
                $msg_data['password'] = $values['Password_hash'];
            }
            $template = (is_null($this->identifier))
                ? 'new_user.tpl' : 'edit_user.tpl';
            \Email::send($values['Email'], $template, $msg_data);
            unset($msg_data);
        }
        $this->tpl_data['success'] = true;
        $username = $values['UserID'] ?? '';
        if ($this->isCreatingNewUser()) {
            $this->redirect = $baseURL
                . "/user_accounts/edit_user/"
                . $username;
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
     * @suppress PhanTypeInvalidArrayKeyLiteral
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        ///get the value for additional_user_info flag
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        $additional_user_info = $config->getSetting('additional_user_info');

        //------------------------------------------------------------

        // it is a new user
        if ($this->identifier == '') {
            // user name
            $this->addBasicText('UserID', 'User name', ['required' => true]);
            $this->addCheckbox(
                'NA_UserID',
                'Make user name match email address',
                []
            );

        } else {
            // It is an existing user:
            //     display user name and account request date
            $this->addScoreColumn('UserID', 'User name');
        }
        // Account Request Date - always displayed
        $this->addScoreColumn('account_request_date', 'Account Request Date');

        // password
        if ($this->isCreatingNewUser()) {
            $pwd_attribs = ['required' => true];
        } else {
            $pwd_attribs = [];
        }

        $this->addPassword('Password_hash', 'Password', $pwd_attribs);
        $this->addCheckbox('NA_Password', 'Generate new password', []);
        $this->addPassword('__Confirm', 'Confirm Password', $pwd_attribs);

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
            [],
            [
                'oninvalid' => $onInvalidMsg,
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
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
            [],
            [
                'oninvalid' => $onInvalidMsg,
                'onchange'  => "this.setCustomValidity('')",
                'pattern'   => '^\s*\S.{0,119}\s*$',
                'required'  => true,
            ]
        );

        // extra info

        // if the option is not set or if it's and it's true then display it

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
        $this->addBasicText('Email', 'Email address', ['required' => true]);
        $this->addCheckbox('SendEmail', 'Send email to user', []);

        // Add a confirm email text field only if creating a new user
        // (to make sure that account creation email goes through)
        if ($this->isCreatingNewUser()) {
            $this->addBasicText(
                '__ConfirmEmail',
                'Confirm Email',
                [],
                ['required' => true]
            );
        }

        //------------------------------------------------------------

        // get user permissions
        $factory     = \NDB_Factory::singleton();
        $editor      = $factory->user();
        $siteOptions = [];
        $site        = [];

        // center ID
        if ($editor->hasPermission('user_accounts_multisite')) {
            // get the list of study sites - to be replaced by the Site object
            $siteOptions = \Utility::getSiteList(false);
        } else {
            // allow only to add to their own site
            $site_arr = $editor->getCenterIDs();
            foreach ($site_arr as $key => $val) {
                $site["$key"]        =& \Site::singleton($val);
                $siteOptions["$val"] = $site["$key"]->getCenterName();
            }
        }

        $this->addSelect(
            'CenterIDs',
            'Sites',
            $siteOptions,
            [
                'multiple' => 'multiple',
                'required' => true,
            ]
        );

        // START PROJECT SECTION
        $editorProjects = $editor->getProjectIDs();
        $projects       = \Utility::getProjectList();
        $projectOptions = [];
        foreach (array_values($editorProjects) as $projectID) {
            $projectOptions[$projectID->__toString()]
                = $projects[$projectID->__toString()];
        }

        $this->addSelect(
            'ProjectIDs',
            'Projects',
            $projectOptions,
            [
                'multiple' => 'multiple',
                'required' => true,
            ]
        );
        // END PROJECT SECTION

        if ($editor->hasPermission('examiner_multisite')) {
            $groupA = [];
            $groupB = [];

            //get site aliases
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $aliases = $DB->pselect("SELECT CenterID, Alias FROM psc ", []);

            foreach ($aliases as $row) {
                $groupA[] = $this->createCheckbox(
                    'ex_'.$row['CenterID'],
                    $row['Alias'],
                    []
                );
            }
            $groupB[] = $this->createLabel(
                "Radiologist: "
            );
            $groupB[] = $this->createSelect(
                "examiner_radiologist",
                "Radiologist: ",
                [
                    ''  => "",
                    'Y' => 'Yes',
                    'N' => 'No',
                ]
            );

            $groupB[] = $this->createLabel(
                "Pending Approval:"
            );
            $groupB[] = $this->createSelect(
                "examiner_pending",
                "Pending Approval: ",
                [
                    ''  => "",
                    'Y' => 'Yes',
                    'N' => 'No',
                ]
            );
            $this->addGroup(
                $groupA,
                'examiner_sites',
                'Examiner At:',
                $this->_GUIDelimiter
            );
            $this->addGroup(
                $groupB,
                "examiner_group",
                "Examiner Status",
                $this->_GUIDelimiter
            );
            unset($groupA);
            unset($groupB);
        }

        // It doesn't make sense for a user to be editing their own
        // approval status or active status. In fact this could result in a
        // Darwinian self-lockout. Let us help those who cannot help themselves.
        if (!$this->_isEditingOwnAccount()) {
            $this->addSelect(
                "Pending_approval",
                "Pending approval",
                [
                    'Y' => 'Yes',
                    'N' => 'No',
                ]
            );

            $this->addSelect(
                'Active',
                'Active',
                [
                    'Y' => 'Yes',
                    'N' => 'No'
                ]
            );

            $dateOptions = [
                'language'       => 'en',
                'format'         => 'YMd',
                'addEmptyOption' => 'true',
            ];

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
        }

        // checking if the account can be rejected (no password hash
        // pending approval)

        // if new user
        if ($this->isCreatingNewUser()) {
            $this->tpl_data['can_reject'] = false;
        } else {
            $this->tpl_data['can_reject']
                = self::canRejectAccount(\User::factory($this->identifier));
        }

        $perms = $editor->getPermissionsVerbose($this->loris);

        $lastRole = '';
        $group    = [];
        foreach ($perms as $row) {
            if ($row['type'] != $lastRole) {
                $lastRole = $row['type'];
                $group[]  = $this->form->createElement(
                    'static',
                    '',
                    '',
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
            $attribs = ["class" => "perm_$lastRole"];
            if ($this->_isEditingOwnAccount()) {
                $attribs['disabled'] = true;
            }
            $group[] = $this->createCheckbox(
                'permID['.$row['permID'].']',
                htmlspecialchars($row['label']) . "<br>",
                $attribs
            );
        }
        $this->addGroup($group, 'PermID_Group', 'Permissions', "");
        unset($group);

        //getting users name and emails to create checkboxes
        // to email supervisors on permissions changes

        $query = "SELECT u.Real_Name, u.email FROM permissions p
                  JOIN user_perm_rel up ON (p.permID = up.PermID)
                  JOIN users u ON (u.ID = up.userID)
                  WHERE p.code = 'send_to_dcc'";

        $results = \NDB_Factory::singleton()->database()->pselect($query, []);

        $group   = [];
        $group[] = $this->form->createElement(
            'static',
            '',
            '',
            '</div>'
            . "<h3 id=\"header_supervisors\" class=\"perm_header button\" "
            . "style=\"text-align: center; margin-top: 5px;\"> "
            . "Data Supervisors to Email </h3> "
            . "<div id=\"perms_supervisors\" style=\"margin-top: 5px;\">"
        );

        $attribs = $this->_isEditingOwnAccount() ? ['disabled' => true] : null;
        foreach ($results as $row) {
            $group[] = $this->createCheckbox(
                'supervisorEmail[' . $row['email'] .']',
                htmlspecialchars($row['Real_Name']) . "<br>",
                $attribs
            );
        }

        $this->addGroup($group, 'Supervisors_Group', 'Supervisors', "");
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
                $this->addHidden("permID[$permID]", "1");
            }
        }

        //------------------------------------------------------------

        // unique key and password rules
        $this->form->addFormRule([&$this, '_validateEditUser']);
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
        return $user->isPendingApproval()
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
        $factory = \NDB_Factory::singleton();
        $editor  = $factory->user();
        // create DB object
        $DB = $factory->database();

        $errors = [];

        // NOTE The 'Password_hash' key actually represents a plaintext password
        $plaintext = $values['Password_hash'];

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
                    ['UID' => $effectiveUID]
                );

                if ($result > 0) {
                    $errors['UserID_Group'] = 'The user name already exists';
                }

                if (strlen($effectiveUID) > 255) {
                    $errors['UserID_Group']
                        = 'The user name must not exceed 255 characters';
                }
                // Check that user name does not contain a whitespace character
                if (preg_match('/\s/', $effectiveUID)) {
                    // Note: email addresses can contain comments which themselves
                    // can contain spaces
                    if ($values['NA_UserID'] == 'on') {
                        $errors['UserID_Group']
                            = 'You cannot have the user name match an email address'
                            . ' that contains a whitespace character';
                    } else {
                        $errors['UserID_Group']
                            = 'Whitespace characters are not allowed in user names';
                    }
                }
            }
        }

        //==================================
        //        Password validation
        //==================================

        // Make sure the user is not using their email address as their password.
        // Do not show this error if the password is an empty string: in this
        // case, that means the email is empty also. It's more appropriate to
        // display only the error 'You must enter an email'.
        if ($values['Email'] === $values['Password_hash']
            && $values['Password_hash'] !== ''
        ) {
            $errors['Password'] = self::PASSWORD_ERROR_IS_EMAIL;
        }

        // Make sure the user is not using their username as their password.
        // case 1 - New user and Make user name match email address not checked
        // case 2 - New user and Make user name match email address checked
        //          already handled in email/password check
        // case 3 - Edit user
        if ((isset($values['UserID']) && !isset($values['NA_UserID'])
            && $values['UserID'] === $values['Password_hash'])
            || (!empty($this->identifier)
            && $this->identifier === $values['Password_hash'])
        ) {
            $errors['Password'] = self::PASSWORD_ERROR_IS_USER;
        }

        if (!is_null($this->identifier)) {
            $pass = $DB->pselectOne(
                "SELECT COALESCE(Password_hash) "
                . "as Current_password FROM users WHERE UserID = :UID",
                ['UID' => $this->identifier]
            );

            // case of new user the password column will be null
            // so either password should be set or
            // password should be generated
            if (is_null($pass)
                && empty($values['Password_hash'])
                && $values['NA_Password'] != 'on'
            ) {
                $errors['Password']
                    = 'Please specify password or click Generate new password';
            }
        }
        // Ensure that the password and confirm password fields match.
        // TODO This validation should be done on the front-end instead.
        if ($plaintext !== $values['__Confirm']) {
            $errors['Password'] = self::PASSWORD_ERROR_NO_MATCH;
        }

        // if password is user-defined, and user wants to change password
        if (empty($values['NA_Password'])
            && (!empty($values['Password_hash']) || !empty($values['__Confirm']))
        ) {
            try {
                // The Password class is self-validating and will throw an
                // InvalidArgumentException if the value passed to it is
                // bad or the input is too weak to be a good password.
                $decoded = htmlspecialchars_decode($plaintext);
                new \Password($decoded);
                $isPasswordDifferent = \User::factory($this->identifier)
                    ->isPasswordDifferent($decoded);
                if (! $isPasswordDifferent) {
                    $errors['Password'] = self::PASSWORD_ERROR_NO_CHANGE;
                }
            } catch (\InvalidArgumentException $e) {
                $errors['Password'] = $e->getMessage();
            }
        }

        // if password is generated then the email user button should be clicked
        if (isset($values['NA_Password'])
            && $values['NA_Password'] == "on"
            && $values['SendEmail'] != "on"
        ) {
            $errors['Email']
                = 'When generating a new password, '
                . 'please notify the user by checking Send email to user box';
        }

        if (isset($values['NA_Password'])
            && $values['NA_Password'] == 'on'
            && $plaintext != ''
        ) {
            $errors['Password'] = 'You must leave the password field empty '
                . 'if you want the system to generate one for you';
        }

        if (is_null($this->identifier)
            && (!isset($values['NA_Password']) || $values['NA_Password'] != 'on')
            && empty($plaintext)
        ) {
            $errors['Password'] = 'Password is required';
        }

        //======================================
        //           Validate Email
        //======================================

        // If an email was entered
        if (!empty($values['Email'])) {
            $emailError = $this->_getEmailError($DB, $values['Email']);
            if (!is_null($emailError)) {
                $errors['Email'] = $emailError;
            } elseif ($this->isCreatingNewUser()) {
                if ($values['Email'] != $values['__ConfirmEmail']) {
                    $errors['__ConfirmEmail'] = 'Email and confirmed email '
                        . ' do not match';
                }
            }
        } else {
            // No email entered: error
            $errors['Email'] = 'You must enter an email address';
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
        //           Validate Project
        //======================================
        // Ensure that at least one site is selected
        if (empty($values['ProjectIDs'])) {
            $errors['projects_group'] = "You must select at least one " .
                "project/affiliation";
        }

        //======================================
        //        Validate Examiner Status
        //======================================
        if ($editor->hasPermission('examiner_multisite')) {
            $matched = false;
            foreach (array_keys($values) as $k) {
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
                && ($values['examiner_radiologist'] !== ''
                || $values['examiner_pending'] ?? '' !== '')
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
     * Validates that en email address entered for a given user
     * (either new or existing) is valid and unique.
     *
     * @param \Database $DB    database object.
     * @param string    $email user's email.
     *
     * @return ?string error message if email is invalid, null otherwise.
     */
    private function _getEmailError(\Database $DB, string $email): ?string
    {
        if (preg_match('/(<|>|"|&)/', $email)) {
            // Although some of these characters are legal in emails, due to the
            // current HTML escaping method, it is better to reject email
            // addresses containing them
            return 'Email address can not contain any the following '.
                'characters: <, >, & and "';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
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
            return self::EMAIL_NOT_UNIQUE;
        }

        return null;
    }

    /**
     * Gets the complete description for a permission.
     *
     * @param int $permID permission ID.
     *
     * @return ?string the description.
     */
    function getDescriptionUsingPermID($permID): ?string
    {
        $db_factory = \NDB_Factory::singleton();
        $db         = $db_factory->database();

        return $db->pselectOne(
            "SELECT Description FROM permissions WHERE permID =:pID",
            ['pID' => $permID]
        );
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
            [
                $baseURL . '/user_accounts/js/rejectUser.js',
                $baseURL . '/js/passwordVisibility.js',
                $baseURL . '/user_accounts/js/edit_user_helper.js',
                $baseURL . '/js/invalid_form_scroll.js',
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

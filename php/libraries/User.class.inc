<?php declare(strict_types=1);
/**
 * This file contains the Loris User class
 *
 * PHP Version 7.4+
 *
 * @category Main
 * @package  Main
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * User class. This deals with any User management except permissions,
 * which is contained in the UserPermissions base class.
 *
 * @category Main
 * @package  Main
 */
class User extends UserPermissions implements
    \LORIS\StudyEntities\AccessibleResource,
    \LORIS\StudyEntities\MultiSiteHaver
{
    /**
     * Stores user information
     *
     * @var array
     */
    protected $userInfo = [];

    /**
     * The date format used by MySQL.
     *
     * @var string
     * @access private
     */
    public const MYSQL_DATE_FORMAT = 'Y-m-d H:i:s';

    /**
     * Factory method to create a User instance based on the username.
     *
     * @param string|null $username Identifies the user
     *
     * @return \User A User object if the User specified by $username exists
     * @access public
     */
    public static function &factory(?string $username = null): \User
    {
        $obj = new self;

        // Set the username
        $obj->userInfo['UserID'] = $username;

        // Get the user's permissions
        if ($obj->select($username) === false) {
            // If user selection fails, return an AnonymousUser instance
            $obj = new \LORIS\AnonymousUser();
            return $obj;
        }

        // Create DB object
        $DB = \NDB_Factory::singleton()->database();

        // Fetch user data from the 'users' table
        $query = "SELECT * FROM users WHERE UserID = :UID";
        $row = $DB->pselectRow($query, ['UID' => $username]);

        if (is_null($row)) {
            // If no user is found, return an AnonymousUser instance
            $obj = new \LORIS\AnonymousUser();
            return $obj;
        }

        // Convert 'language_preference' from string to integer
        $row['language_preference'] = (int)$row['language_preference'];

        // ------------------- Extract User Sites -------------------
        // Fetch user's centers and their names from 'user_psc_rel' and 'psc' tables
        $user_centerID_query = $DB->pselect(
            "
             SELECT
               upr.CenterID,
               psc.Name
             FROM
               user_psc_rel upr
             LEFT JOIN
               psc
               ON (upr.CenterID = psc.CenterID)
             WHERE
               upr.UserID = :UID
            ",
            ['UID' => $row['ID']]
        );

        $user_cid  = [];     // Array to store CenterID objects
        $sitenames = [];     // Array to store site names

        foreach ($user_centerID_query as $key => $val) {
            // Convert CenterID to CenterID object
            $user_cid[$key] = new \CenterID($val['CenterID']);
            $sitenames[]    = $val['Name'];
        }

        // Concatenate site names into a semicolon-separated string
        $row['Sites'] = implode(';', $sitenames);

        // ------------------- Extract User Projects -------------------
        /**
         * Adjusted Section:
         * - Changed table name from 'projects' to 'Project'
         * - Updated SQL query accordingly
         */
        $user_projects_query = $DB->pselect(
            "
             SELECT upr.ProjectID, p.Name
             FROM user_project_rel upr
             LEFT JOIN Project p ON (upr.ProjectID = p.ProjectID)
             WHERE upr.UserID = :UID
            ",
            ['UID' => $row['ID']]
        );

        $user_pid = [];        // Array to store ProjectID objects
        $project_names = [];   // Array to store project names

        foreach ($user_projects_query as $key => $val) {
            // Convert ProjectID to ProjectID object
            $user_pid[$key] = new \ProjectID($val['ProjectID']);
            $project_names[] = $val['Name'];
        }

        // Assign ProjectIDs and concatenated project names to userInfo
        $row['ProjectIDs'] = $user_pid;
        $row['Projects'] = implode(';', $project_names);

        // ------------------- Extract Examiner Information -------------------
        // Fetch examiner details from 'examiners' and 'examiners_psc_rel' tables
        $examiner_check = $DB->pselect(
            "SELECT e.full_name,
                    epr.centerID,
                    e.radiologist,
                    epr.active,
                    epr.pending_approval
              FROM examiners e
              JOIN examiners_psc_rel epr ON (e.examinerID = epr.examinerID)
              WHERE e.userID = :uid
                AND (epr.active = 'Y'
                      OR (epr.active = 'N' AND epr.pending_approval = 'Y'))
            ",
            [
                "uid" => $row['ID'],
            ]
        );

        $examiner_info = [];

        if (!empty($examiner_check)) {
            foreach ($examiner_check as $val) {
                if ($val['active'] == 'Y') {
                    // Store pending approval status if examiner is active
                    $examiner_info['pending'] = $val['pending_approval'];
                }
                // Store examiner's centerID with active status and radiologist flag
                $examiner_info[$val['centerID']] = [
                    $val['active'],
                    $val['radiologist'],
                ];
            }
        }

        // Assign examiner information, CenterIDs, and ProjectIDs to userInfo
        $row['examiner']   = $examiner_info;
        $row['CenterIDs']  = $user_cid;
        $row['ProjectIDs'] = $user_pid;
        $obj->userInfo     = $row;

        return $obj;
    }

    /**
     * Singleton method. Retrieve the user passed as parameter, but only
     * one instance exists.
     *
     * @param string|null $username Identifies the user
     *
     * @return \User
     * @access public
     * @static
     */
    public static function &singleton(?string $username = null): \User
    {
        static $instance;
        if (is_null($instance)) {
            $instance = User::factory($username);
        }
        return $instance;
    }

    /**
     * Inserts data into the `users` table.
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     * @static
     */
    public static function insert(array $set): void
    {
        \NDB_Factory::singleton()->database()->insert('users', $set);
    }

    /**
     * Updates a user in the `users` table.
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     */
    public function update(array $set): void
    {
        \NDB_Factory::singleton()->database()->update(
            'users',
            $set,
            ['UserID' => $this->userInfo['UserID']]
        );
    }

    /**
     * Returns data from the userInfo array according to the key provided
     * as argument.
     *
     * @param string $var Name of variable to get
     *
     * @note   Call without any arguments to get the entire user data array
     * @return array<array|string>|string|null
     * @access public
     * @throws \LorisException
     */
    public function getData(string $var = '')
    {
        if ($var === '') {
            return $this->userInfo;
        } elseif ($var === 'CenterID') {
            throw new \LorisException(
                "The function getData('CenterID') is deprecated and is replaced with getData('CenterIDs')"
            );
        } elseif ($var === 'Site') {
            throw new \LorisException(
                "The function getData('Site') is deprecated and is replaced with getData('Sites')"
            );
        } else {
            return $this->userInfo[$var] ?? null;
        }
    }

    /**
     * Get user's real name.
     *
     * @return string
     */
    public function getFullName(): string
    {
        return $this->userInfo['Real_name'];
    }

    /**
     * Get the user's ID.
     *
     * @return int
     */
    public function getId(): int
    {
        return intval($this->userInfo['ID']);
    }

    /**
     * Get the user's username.
     *
     * @return string
     */
    public function getUsername(): string
    {
        return $this->userInfo['UserID'];
    }

    /**
     * Get the user's sites' names.
     *
     * @return array
     */
    public function getSiteNames(): array
    {
        /* The original query in the factory() function CONCATs the site names
         * together in a string using semi-colons. Therefore, this string must
         * be split and returned as an array.
         */
        return explode(';', $this->userInfo['Sites'] ?? '');
    }

    /**
     * Get the user's project names.
     *
     * @return array
     */
    public function getProjectNames(): array
    {
        $projects = $this->userInfo['Projects'] ?? '';
        if ($projects === '') {
            return [];
        }
        return explode(';', $projects);
    }

    /**
     * Get the user's sites' ID numbers.
     *
     * @return \CenterID[]
     */
    public function getCenterIDs(): array
    {
        return $this->userInfo['CenterIDs'] ?? [];
    }

    /**
     * Get the user's projects' ID numbers.
     *
     * @return \ProjectID[]
     */
    public function getProjectIDs(): array
    {
        return $this->userInfo['ProjectIDs'] ?? [];
    }

    /**
     * Get the user's projects.
     *
     * @return \Project[]
     */
    public function getProjects(): array
    {
        return array_map(
            fn($projectID) => \Project::getProjectFromID($projectID),
            $this->getProjectIDs()
        );
    }

    /**
     * Get the user's language preference.
     *
     * @return int|null
     */
    public function getLanguagePreference(): ?int
    {
        return $this->userInfo['language_preference'] ?? null;
    }

    /**
     * Returns all sites where Examiner is active.
     *
     * @return array
     */
    public function getExaminerSites(): array
    {
        $site_list = $this->userInfo['examiner'] ?? [];
        unset($site_list['pending']); // Remove 'pending' status if exists
        ksort($site_list);             // Sort sites by centerID
        return $site_list;
    }

    /**
     * Returns all user's sites as Site objects.
     *
     * @return \Site[]
     */
    public function getSites(): array
    {
        return array_map(
            function ($centerID) {
                return \Site::singleton($centerID);
            },
            $this->getCenterIDs()
        );
    }

    /**
     * Returns all user's sites in an associative array (CenterID => CenterName).
     *
     * @return array
     */
    public function getSiteNamesList(): array
    {
        $sites = [];
        foreach ($this->getSites() as $site) {
            $sites[$site->getCenterID()->__toString()] = $site->getCenterName();
        }
        return $sites;
    }

    /**
     * Returns all user's sites that are StudySites.
     *
     * @return array
     */
    public function getStudySites(): array
    {
        $site_arr         = $this->getCenterIDs();
        $user_study_sites = [];

        foreach ($site_arr as $val) {
            $site = \Site::singleton($val);
            if ($site->isStudySite()) {
                $user_study_sites[$val->__toString()] = $site->getCenterName();
            }
        }

        natcasesort($user_study_sites); // Sort sites case-insensitively
        return $user_study_sites;
    }

    /**
     * Checks if the user is in at least one study site.
     *
     * @return bool
     */
    public function hasStudySite(): bool
    {
        $site_arr = $this->getCenterIDs();
        foreach ($site_arr as $sitename) {
            $site = \Site::singleton($sitename);
            if ($site->isStudySite()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks that the user's email is valid.
     *
     * @return bool
     */
    public function isEmailValid(): bool
    {
        return filter_var($this->userInfo['Email'], FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Returns the user's email address.
     *
     * @return string
     */
    public function getEmail(): string
    {
        return $this->userInfo['Email'];
    }

    /**
     * Check if user belongs to DCC.
     *
     * @return bool
     */
    public function isUserDCC(): bool
    {
        // DCC site = 1 by LORIS convention
        return in_array(new \CenterID("1"), $this->getCenterIDs(), true);
    }

    /**
     * Determines if the user has a specific center.
     *
     * @param \CenterID $center_id The center ID
     *
     * @return bool
     */
    public function hasCenter(\CenterID $center_id): bool
    {
        return in_array($center_id, $this->getCenterIDs(), true);
    }

    /**
     * Determines if the user has a specific project.
     *
     * @param \ProjectID $projectID The project ID
     *
     * @return bool
     */
    public function hasProject(\ProjectID $projectID): bool
    {
        return in_array($projectID, $this->getProjectIDs(), true);
    }

    /**
     * Determines if the user has a specific permission for a center.
     *
     * @param string    $code      The permission code
     * @param \CenterID $center_id The center ID
     *
     * @return bool
     */
    public function hasCenterPermission(string $code, \CenterID $center_id): bool
    {
        if ($this->hasPermission("superuser")) {
            return true;
        }
        return $this->hasPermission($code) && $this->hasCenter($center_id);
    }

    /**
     * Determines if the user has ever logged in successfully.
     *
     * @return bool
     */
    public function hasLoggedIn(): bool
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $count = $DB->pselectOneInt(
            "SELECT COUNT(1)
             FROM user_login_history
             WHERE userID = :v_userid AND Success = 'Y'",
            ['v_userid' => $this->userInfo['UserID']]
        );
        return $count > 0;
    }

    /**
     * Updates the password for this user in the database.
     *
     * @param \Password $password The plain text password to be hashed and saved.
     * @param bool      $expired  Whether the password is expired. If so, a reset
     *                            will be triggered on the user's next login.
     *
     * @return void
     * @throws \InvalidArgumentException If password is set to email or username.
     */
    public function updatePassword(
        \Password $password,
        bool $expired = false
    ): void {
        // Prevent password from being set to email
        if (password_verify($this->userInfo['Email'], (string)$password)) {
            throw new \InvalidArgumentException(
                'Password cannot be set to email'
            );
        }

        // Prevent password from being set to username
        if (password_verify($this->userInfo['UserID'], (string)$password)) {
            throw new \InvalidArgumentException(
                'Password cannot be set to username'
            );
        }

        // Update password_hash and PasswordChangeRequired in the database
        $this->update(
            [
                'Password_hash'          => $password,
                'PasswordChangeRequired' => $expired ? 1 : 0
            ]
        );

        // Update local userInfo array
        $this->userInfo['Password_hash']          = (string)$password;
        $this->userInfo['PasswordChangeRequired'] = $expired;
    }

    /**
     * Determines if the supplied password is different from the current password.
     *
     * @param string $plaintextPassword The new desired password entered by the user.
     *
     * @return bool True if the password has changed, false otherwise.
     */
    public function isPasswordDifferent(string $plaintextPassword): bool
    {
        return !password_verify(
            $plaintextPassword,
            (string)$this->userInfo['Password_hash']
        );
    }

    /**
     * Returns the last login time of this user.
     *
     * @param \Database $DB The database connection to check.
     *
     * @return \DateTime|null The last login time or null if no login found.
     */
    public function getLastLogin(\Database $DB): ?\DateTime
    {
        $time = $DB->pselectOne(
            "SELECT MAX(Login_timestamp)
             FROM user_login_history
             WHERE Login_timestamp <
                 (SELECT MAX(Login_timestamp)
                  FROM user_login_history
                  WHERE userID = :UserID AND Success = 'Y')
               AND userID = :UserID AND Success = 'Y'",
            ['UserID' => $this->getUsername()]
        );

        if (empty($time)) {
            return null;
        }

        return new \DateTime($time);
    }

    /**
     * Implements the AccessibleResource interface. Determines if another user
     * can access this user based on common projects and centers.
     *
     * @param \User $user The "editing" user trying to access this user object.
     *
     * @return bool True if accessible, false otherwise.
     */
    public function isAccessibleBy(\User $user): bool
    {
        $projMatch   = !empty(
            array_intersect(
                $this->getProjectIDs(),
                $user->getProjectIDs()
            )
        );
        $centerMatch = !empty(
            array_intersect(
                $this->getCenterIDs(),
                $user->getCenterIDs()
            )
        );

        return $projMatch && $centerMatch;
    }

    /**
     * Determines if the user's account is pending approval by an admin.
     *
     * @return bool True if pending approval, false otherwise.
     */
    public function isPendingApproval(): bool
    {
        return isset($this->userInfo['Pending_approval']) && $this->userInfo['Pending_approval'] === 'Y';
    }
}

<?php declare(strict_types=1);
/**
 * This file contains the Loris user class
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * User class. This deals with any User management except permissions,
 * which is contained in the UserPermissions base class.
 *
 * @category Main
 * @package  Main
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
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
     * @var    string
     * @access private
     */
    public const MYSQL_DATE_FORMAT = 'Y-m-d H:i:s';

    /**
     * Constructor
     *
     * Selects a user and its permissions
     *
     * @param string|null $username Identifies the user
     *
     * @return \User A User object if the User specified by $username exists
     * @access public
     */
    public static function &factory(?string $username = null): \User
    {
        $obj = new User;

        // right off, set the username
        $obj->userInfo['UserID'] = $username;

        // get the user's permissions
        if ($obj->select($username) === false) {
            $obj = new \LORIS\AnonymousUser();
            return $obj;
        };

        // create DB object
        $DB = \NDB_Factory::singleton()->database();

        // get user data from database
        $query = "SELECT * FROM users WHERE UserID = :UID";

        $row = $DB->pselectRow($query, ['UID' => $username]);

        if (is_null($row)) {
            $obj = new \LORIS\AnonymousUser();
            return $obj;
        }

        //Change 'language_preference' to number rather than a string
        $row['language_preference'] = (int)$row['language_preference'];

        // get user sites
        $user_centerID_query =  $DB->pselect(
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
               upr.UserID= :UID
            ",
            ['UID' => $row['ID']]
        );

        $user_cid  = [];
        $sitenames = [];
        foreach ($user_centerID_query as $key=>$val) {
            // Convert string representation of ID to int
            $user_cid[$key] = \CenterID::singleton($val['CenterID']);
            $sitenames[]    = $val['Name'];
        }
        $row['Sites'] = implode(';', $sitenames);

        $user_pid = $DB->pselectCol(
            "SELECT ProjectID FROM user_project_rel upr WHERE upr.UserId=:uid",
            ['uid' => $row['ID']]
        );
        foreach ($user_pid as $k=>$pid) {
            $user_pid[$k] = ProjectID::singleton(intval($pid));
        }

        // Get examiner information
        $examiner_check = $DB->pselect(
            "SELECT e.full_name,
                    epr.centerID,
                    e.radiologist,
                    epr.active,
                    epr.pending_approval
                  FROM examiners e
                  JOIN examiners_psc_rel epr ON (e.examinerID=epr.examinerID)
                  WHERE e.userID=:uid
                    AND (epr.active='Y'
                          OR (epr.active='N' AND epr.pending_approval='Y')
                        )",
            [
                "uid" => $row['ID'],
            ]
        );

        $examiner_info =[];
        if (!empty($examiner_check) && !is_null($examiner_check)) {
            foreach ($examiner_check as $val) {
                if ($val['active'] == 'Y') {
                    $examiner_info['pending'] = $val['pending_approval'];
                }
                $examiner_info[$val['centerID']] =[
                    $val['active'],
                    $val['radiologist'],
                ];
            }
        }
        // store user data in object property
        $row['examiner']   = $examiner_info;
        $row['CenterIDs']  = $user_cid;
        $row['ProjectIDs'] = $user_pid;
        $obj->userInfo     = $row;
        return $obj;
    }


    /**
     * Singleton method. Retrieve the user passed as parameter, but only
     * 1 instance.
     *
     * @param string|null $username Identifies the user
     *
     * @return User
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
     * Updates a user
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
     * @return array<array|string>|string
     * @access public
     * @throws LorisException
     */
    public function getData(string $var = '')
    {
        if ($var === '') {
            return $this->userInfo;
        } elseif ($var === 'CenterID') {
            throw new \LorisException(
                "The function getData('CenterID')
                                        is deprecated and is replaced
                                        with getData('CenterIDs')"
            );
        } elseif ($var === 'Site') {
            throw new \LorisException(
                "The function getData('Site')
                                        is deprecated and is replaced
                                        with getData('Sites')"
            );
        } else {
            return $this->userInfo[$var];
        }
    }

    /**
     * Get users real name
     *
     * @return string
     */
    function getFullname(): string
    {
        return $this->userInfo['Real_name'];
    }

    /**
     * Get the user's id
     *
     * @return int
     */
    function getId(): int
    {
        return intval($this->userInfo['ID']);
    }

    /**
     * Get the user's username
     *
     * @return string
     */
    function getUsername(): string
    {
        return $this->userInfo['UserID'];
    }

    /**
     * Get the user's sites' name
     *
     * @return string
     */
    function getSiteName(): string
    {
        throw new \LorisException(
            "The function getSiteName
                                   is deprecated and is replaced
                                   with getSiteNames"
        );
    }

    /**
     * Returns an array of sites a user belongs to.
     *
     * @return array
     */
    function getSiteNames(): array
    {
        /* The original query to fetch userInfo in the factory() function CONCAT
         * CONCATs the site names together in a string using semi-colons.
         * Therefore this string must be split and returned as an array.
         */
        return explode(';', $this->userInfo['Sites']);
    }

    /**
     * Get the user's sites' ID numbers
     *
     * @return CenterID[]
     */
    function getCenterIDs(): array
    {
        return $this->userInfo['CenterIDs'];
    }

    /**
     * Get the user's projects' ID numbers
     *
     * @return ProjectID[]
     */
    function getProjectIDs(): array
    {
        return $this->userInfo['ProjectIDs'];
    }

    /**
     * Get the user's projects
     *
     * @return Project[]
     */
    function getProjects(): array
    {
        return array_map(
            fn($projectID) => \Project::getProjectFromID($projectID),
            $this->getProjectIDs()
        );
    }

    /**
     * Get the user's language preference
     *
     * @return ?int
     */
    function getLanguagePreference(): ?int
    {
        return $this->userInfo['language_preference'];
    }


    /**
     * Returns all sites where Examiner is active
     *
     * @return array
     */
    function getExaminerSites(): array
    {
        $site_list = $this->userInfo['examiner'];
        unset($site_list['pending']);
        ksort($site_list);
        return $site_list;
    }

    /**
     * Returns all user's sites
     *
     * @return array
     */
    function getSites(): array
    {
        return array_map(
            function ($centerID) {
                return \Site::singleton($centerID);
            },
            $this->getCenterIDs()
        );
    }

    /**
     * Returns all user's sites in associative
     * array (CenterID => CenterName)
     *
     * @return array
     */
    function getSiteNamesList(): array
    {
        $sites = [];
        foreach ($this->getSites() as $site) {
            $sites[$site->getCenterID()->__toString()] = $site->getCenterName();
        }
        return $sites;
    }


    /**
     * Returns all user's sites that are StudySites
     *
     * @return array
     */
    function getStudySites(): array
    {
        $site_arr         = $this->getCenterIDs();
        $user_study_sites = [];
        $site = [];
        foreach ($site_arr as $key => $val) {
            $site[$key] = &Site::singleton($val);
            if ($site[$key]->isStudySite()) {
                $user_study_sites[$val->__toString()]
                    = $site[$key]->getCenterName();
            }
        }
        natcasesort($user_study_sites);
        return $user_study_sites;
    }

    /**
     * Checks if the user is in at least one study site
     *
     * @return boolean
     */
    function hasStudySite(): bool
    {
        $site_arr = $this->getCenterIDs();
        foreach ($site_arr as $sitename) {
            $site = Site::singleton($sitename);
            if ($site->isStudySite()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks that the user's email is valid
     *
     * @return bool
     */
    public function isEmailValid(): bool
    {
        if (!filter_var($this->userInfo['Email'], FILTER_VALIDATE_EMAIL)) {
            return false;
        };
        return true;
    }

    /**
     * Returns the user's email address
     *
     * @return string
     */
    public function getEmail() : string
    {
        return $this->userInfo['Email'];
    }

    /**
     * Check if user belongs to DCC
     *
     * @return boolean
     */
    function isUserDCC(): bool
    {
        //DCC site = 1 by LORIS convention
        return (in_array(\CenterID::singleton(1), $this->getCenterIDs()));
    }

    /**
     * Determines if the user has a center
     *
     * @param CenterID $center_id The center id
     *
     * @return bool
     */
    public function hasCenter(CenterID $center_id) : bool
    {
        return in_array($center_id, $this->getCenterIDs());
    }

    /**
     * Determines if the user has a project
     *
     * @param ProjectID $projectID The project ID
     *
     * @return bool
     */
    public function hasProject(ProjectID $projectID) : bool
    {
        return in_array(
            $projectID,
            $this->getProjectIDs()
        );
    }

    /**
     * Determines if the user has a permission
     * for a center
     *
     * @param string   $code      The permission code
     * @param CenterID $center_id The center id
     *
     * @return bool
     */
    public function hasCenterPermission(string $code, CenterID $center_id): bool
    {
        if ($this->hasPermission("superuser")) {
            return true;
        }
        return $this->hasPermission($code)
            && $this->hasCenter($center_id);
    }

    /**
     * Determines if the user has ever logged in successfully
     *
     * @return bool
     */
    public function hasLoggedIn(): bool
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $count = $DB->pselectOneInt(
            "SELECT
               COUNT(1)
             FROM user_login_history
             WHERE
               userID = :v_userid AND
               Success = 'Y'
            ",
            ['v_userid' => $this->userInfo['UserID']]
        );
        return $count > 0;
    }

    /**
     * Updates the password for this user into the appropriate field in the
     * database.
     *
     * @param \Password $password The plain text password to be hashed and saved.
     * @param bool      $expired  Whether the password is expired. If so, a reset
     *                            will be triggered on the user's next login.
     *
     * @return void
     */
    function updatePassword(
        \Password $password,
        bool $expired = false
    ): void {
        if (password_verify($this->userInfo['Email'], (string) $password)) {
            throw new \InvalidArgumentException(
                'Password cannot be set to email'
            );
        } else if (password_verify($this->userInfo['UserID'], (string) $password)) {
            throw new \InvalidArgumentException(
                'Password cannot be set to username'
            );
        }

        $this->update(
            [
                'Password_hash'          => $password,
                'PasswordChangeRequired' => $expired ? 1 : 0
            ]
        );
        $this->userInfo['Password_hash']          = (string) $password;
        $this->userInfo['PasswordChangeRequired'] = $expired;
    }

    /**
     * Determines if the supplied password parameter is different than a User's
     * current password (the one stored in the database).
     *
     * @param string $plaintextPassword The new desired password string entered
     *                                  by the user.
     *
     * @return bool  true if the password has changed, false otherwise.
     */
    function isPasswordDifferent(
        string $plaintextPassword
    ): bool {
        return ! password_verify(
            $plaintextPassword,
            (string) $this->userInfo['Password_hash']
        );
    }

    /**
     * Return the last login of this user to the given database.
     *
     * @param \Database $DB The database connection to check
     *
     * @return ?\DateTime
     */
    function getLastLogin(\Database $DB) : ?\DateTime
    {
        $time = $DB->pselectOne(
            "SELECT MAX(Login_timestamp)
            FROM user_login_history
            WHERE Login_timestamp <
                (SELECT MAX(Login_timestamp)
                    FROM user_login_history
                    WHERE userID=:UserID AND Success='Y')
                AND userID=:UserID AND Success='Y'",
            ['UserID' => $this->getUsername()]
        );
        if (empty($time)) {
            return null;
        }
        return new \DateTime($time);
    }

    /**
     * Implements the AccessibleResource interface. A user can
     * be accessed by another user if they have a project and a site in common.
     *
     * @param \User $user The "editing" user trying to access this user object.
     *
     * @return bool
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
     * Returns whether the user's account is pending approval by
     * an admin.
     *
     * @return bool
     */
    public function isPendingApproval() : bool
    {
        return $this->userInfo['Pending_approval'] == 'Y';
    }
}

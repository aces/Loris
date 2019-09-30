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
class User extends UserPermissions
{
    /**
     * Stores user information
     *
     * @var    array
     * @access private
     */
    protected $userInfo = array();
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
     * @return User
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
        $DB =& Database::singleton();

        // get user data from database
        $query = "SELECT users.*,
            GROUP_CONCAT(psc.Name ORDER BY psc.Name SEPARATOR ';') AS Sites
            FROM users
            LEFT JOIN user_psc_rel ON (user_psc_rel.UserID=users.ID)
            LEFT JOIN psc ON (user_psc_rel.CenterID=psc.CenterID)
            WHERE users.UserID = :UID
            GROUP BY users.ID";

        $row = $DB->pselectRow($query, array('UID' => $username));

        //Change 'language_preference' to number rather than a string
        $row['language_preference'] = (int)$row['language_preference'];

        // get user sites
        $user_centerID_query =  $DB->pselect(
            "SELECT CenterID FROM user_psc_rel upr
                        WHERE upr.UserID= :UID",
            array('UID' => $row['ID'])
        );
        $user_cid            = array();
        foreach ($user_centerID_query as $key=>$val) {
            // Convert string representation of ID to int
            $user_cid[$key] = intval($val['CenterID']);
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
                  WHERE e.full_name=:fn
                    AND (epr.active='Y'
                          OR (epr.active='N' AND epr.pending_approval='Y')
                        )",
            array(
             "fn" => $row['Real_name'],
            )
        );

        $examiner_info =array();
        if (!empty($examiner_check) && !is_null($examiner_check)) {
            foreach ($examiner_check as $val) {
                if ($val['active'] == 'Y') {
                    $examiner_info['pending'] = $val['pending_approval'];
                }
                $examiner_info[$val['centerID']] =array(
                                                   $val['active'],
                                                   $val['radiologist'],
                                                  );
            }
        }
        // store user data in object property
        $row['examiner']  = $examiner_info;
        $row['CenterIDs'] = $user_cid;
        $obj->userInfo    = $row;
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
     * Inserts a user
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return bool True
     * @access public
     * @static
     */
    public static function insert(array $set): bool
    {
        // create DB object
        $DB =& Database::singleton();

        $DB->insert('users', $set);

        return true;
    }


    /**
     * Updates a user
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return bool True
     * @access public
     */
    public function update(array $set): bool
    {
        // create DB object
        $DB =& Database::singleton();

        $DB->update(
            'users',
            $set,
            array('UserID' => $this->userInfo['UserID'])
        );

        return true;
    }

    /**
     * Returns data from the userInfo array according to the key provided
     * as argument.
     *
     * @param string $var Name of variable to get
     *
     * @note   Call without any arguments to get the entire user data array
     * @return mixed
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
     * Get the user's site's ID number
     *
     * @return array
     */
    function getCenterID()
    {
        throw new \LorisException(
            "The function getCenterID
                                   is deprecated and is replaced
                                   with getCenterIDs"
        );
    }

    /**
     * Get the user's sites' ID numbers
     *
     * @return array
     */
    function getCenterIDs(): array
    {
        return $this->userInfo['CenterIDs'];
    }

    /**
     * Get the user's language preference
     *
     * @return int
     */
    function getLanguagePreference(): int
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
        natcasesort($site_list);
        return $site_list;
    }

    /**
     * Returns all user's sites that are StudySites
     *
     * @return array
     */
    function getStudySites(): array
    {
        $site_arr         = $this->getCenterIDs();
        $user_study_sites = array();
        $site = array();
        foreach ($site_arr as $key => $val) {
            $site[$key] = &Site::singleton($val);
            if ($site[$key]->isStudySite()) {
                $user_study_sites[$val] = $site[$key]->getCenterName();
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
     * @return boolean
     * @access public
     */
    public function isEmailValid(): bool
    {
        if (!filter_var($this->userInfo['Email'], FILTER_VALIDATE_EMAIL)) {
            return false;
        };
        return true;
    }

    /**
     * Check if user belongs to DCC
     *
     * @return boolean
     */
    function isUserDCC(): bool
    {
        //DCC site = 1 by LORIS convention
        return (in_array(1, $this->userInfo['CenterIDs']));
    }

    /**
     * Determines if the user has a center
     *
     * @param int $center_id The center id
     *
     * @return bool
     */
    public function hasCenter(int $center_id) : bool
    {
        return in_array(
            $center_id,
            $this->getCenterIDs(),
            true
        );
    }

    /**
     * Determines if the user has a permission
     * for a center
     *
     * @param string $code      The permission code
     * @param int    $center_id The center id
     *
     * @return bool
     */
    public function hasCenterPermission(string $code, int $center_id): bool
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

        $count = $DB->pselectOne(
            "SELECT
               COUNT(1)
             FROM user_login_history
             WHERE
               userID = :v_userid AND
               Success = 'Y'
            ",
            array('v_userid' => $this->userInfo['UserID'])
        );
        return $count > 0;
    }

    /**
     * Updates the password for this user into the appropriate field in the
     * database.
     *
     * @param \Password $password The plain text password to be hashed and saved.
     * @param ?DateTime $expiry   When the password will expire. Can be set to a
     *                            date in the past in order to create a one-time
     *                            password.
     *
     * @return void
     */
    function updatePassword(
        \Password $password,
        ?\DateTime $expiry = null
    ): void {
        // Set default expiry date value to 6 months in the future.

        $expiry = $expiry ?? new \DateTime(
            date('Y-m-d', strtotime('+6 months'))
        );

        $this->update(
            array(
             'Password_hash'   => $password,
             'Password_expiry' => $expiry->format(self::MYSQL_DATE_FORMAT),
            )
        );
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
    function passwordChanged(
        string $plaintextPassword
    ): bool {
        $passwordQuery = "SELECT Password_hash
            FROM users
            WHERE UserID = :UID";

        $current = \NDB_Factory::singleton()->database()->pselectOne(
            $passwordQuery,
            array('UID' => $this->getID())
        );

        if (!is_null($current)) {
            // The plaintext password must be used here rather than the
            // Password class.
            return !password_verify($plaintextPassword, $current);
        }

        return true;
    }
}


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

use ZxcvbnPhp\Zxcvbn;
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
    public function insert(array $set): bool
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
        return $this->userInfo['ID'];
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
     * Generates a random alphanumeric password
     *
     * @param int $length Length of password to generate (has to be >= 2)
     *
     * @return string
     * @access public
     * @static
     */
    public static function newPassword($length = 8): string
    {
        // start with a blank password
        $password = '';

        $numbers      = '0123456789';
        $specialChars = '!@#$%^*()';
        // & not part of $specialChars since it causes URL to break

        $possible = $numbers . $specialChars . 'abcdefghijklmnopqrstuvwxyz';

        // length of possible characters minus one
        $possible_cnt = strlen($possible) - 1;

        // add random characters to $password until $length is reached
        for ($i = 0; $i < $length-2; $i++) {
            $password .= substr($possible, random_int(0, $possible_cnt), 1);
        }

        if (strpbrk($password, $specialChars) === false) {
            $password .= substr(
                $specialChars,
                random_int(0, strlen($specialChars)-1),
                1
            );
        }

        if (strpbrk($password, $numbers) === false) {
            $password .= random_int(0, 9);
        }

        for ($i = strlen($password); $i < $length; $i++) {
            $password .= substr($possible, random_int(0, $possible_cnt), 1);
        }

        return $password;
    }


    /**
     * Check password strength using Zxcvbn.
     *
     * @param string $password Password to check
     *
     * @return array The results of Zxcvbn's analysis
     */
    function checkPasswordStrength(string $password): array
    {
        $user = \User::singleton();
        $data = $user->getData();
        /* This is an array of information related to the user. This is used by
         * Zxcvbn to check if a user is doing something foolish like making
         * their password 'johnnyloris'.
         * $lorisKeywords comes from a list generated by the tool 'CeWL'
         * https://tools.kali.org/password-attacks/cewl
         * It represents words scraped from the loris.ca and mcin.ca websites
         * and contains words that users are likely to include in their
         * passwords.
         */
        $lorisKeywords = \User::_getLorisKeywords();
        $userInputs    = array_merge(
            array(
             $user->getUsername(),
             $data['Email'],
             $data['Real_name'],
            ),
            $lorisKeywords
        );

        $zxcvbn = new Zxcvbn();
        return $zxcvbn->passwordStrength($password, $userInputs);
    }

    /**
     * Slurps contents of keyword file and returns a word list.
     *
     * @return array Keywords that shouldn't be used in passwords
     */
    private function _getLorisKeywords(): array
    {
        $keywords = array();
        // The file is located two directories up from this file.
        $keywordFile = __DIR__ . '/../../' . 'docs/LorisKeywords';
        if (is_readable($keywordFile)) {
            $fh = fopen($keywordFile, 'r');
            if ($fh !== false) {
                while (($line = fgets($fh)) !== false) {
                    if (strpos($line, '#') === 0) {
                        continue;
                    }
                    array_push($keywords, trim($line));
                }
            }
        } else {
            error_log("Could not open keyword file at $keywordFile");
        }
        return $keywords;
    }


    /**
     * Validate a potential password to check whether it meets our requirements,
     * including length as well as strength measured by Zxcvbn. Also makes sure
     * that the new password is different from the old one.
     *
     * @param string $newPassword The password to validate.
     *
     * @return array A bool and string array representing whether a password is
     *                          valid or not and why we have marked it as such.
     */
    function isUserDCC(): bool
    {
        //DCC site = 1 by LORIS convention
        return ($this->userInfo['CenterID'] == 1);
    }

    function validatePassword(string $newPassword): array
    {
        $result        = array(
                          'valid' => false,
                          'why'   => '',
                         );
        $minimumLength = 8;
        if (strlen($newPassword) < $minimumLength) {
            $result['why'] = 'Passphrase is too short.';
            return $result;
        }
        $data = \User::singleton()->getData();
        if (password_verify($newPassword, $data['Password_hash'])) {
            $result['why'] = 'You cannot keep the same password.';
            return $result;
        }
        /* Score comes from Zxcvbn library from Dropbox. The scale is 0-5 in
         * terms of password strength.
         * For now this is set to 3 but 2 is probably enough if 3 is too hard
         * to achieve.
         */
        $strength  = \User::checkPasswordStrength($newPassword);
        $threshold = 3;
        if (intval($strength['score']) < $threshold) {
            $result['why'] = 'This password is easily guessable. Try adding '
                . 'more words.';
            return $result;
        }
        // Return true if everything went well.
        $result['valid'] = true;
        return $result;
    }

    /**
     * Updates the password for this user into the appropriate field in the
     * database.
     *
     * @param string $password The plain text password to be hashed and saved.
     * @param string $expiry   The password expiry date. If not supplied, the
     *                         password expiry date will be set to now+6months.
     *
     * @return void
     */
    function updatePassword(string $password, string $expiry = ''): void
    {
        if ($expiry === '') {
            $expiry = date(
                'Y-m-d',
                strtotime('+6 months')
            );
        }

        $updateArray = array('Password_expiry' => $expiry);

        $updateArray['Password_hash'] = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $this->update($updateArray);
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
        $count = (\NDB_Factory::singleton()->database())->pselectOne(
            "SELECT
               COUNT(1)
             FROM user_login_history
             WHERE
               UserID = :v_userid AND
               Success = 'Y'
            ",
            array('v_userid' => $this->userInfo['UserID'])
        );
        return $count > 0;
    }
}


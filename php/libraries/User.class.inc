<?php
/**
 * This file contains the Loris user class
 *
 * PHP Version 5
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
    var $userInfo = array();

    /**
     * Constructor
     *
     * Selects a user and its permissions
     *
     * @param string $username Identifies the user
     *
     * @return User
     * @access public
     */
    static function &factory($username)
    {
        $obj = new User;

        // right off, set the username
        $obj->userInfo['UserID'] = $username;

        // get the user's permissions
        $success = $obj->select($username);

        // create DB object
        $DB =& Database::singleton();

        // get user data from database
        $query = "SELECT users.*,
            GROUP_CONCAT(psc.Name SEPARATOR ';') AS Sites
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

        foreach ($user_centerID_query as $key=>$val) {
            $user_cid[$key] =$val['CenterID'];
        }

        // Get examiner information
        $examiner_check = $DB->pselect(
            "SELECT full_name, centerID, radiologist, active, pending_approval 
                  FROM examiners 
                  WHERE full_name=:fn 
                    AND (active='Y' OR (active='N' AND pending_approval='Y'))",
            array(
             "fn" => $row['Real_name'],
            )
        );

        $examiner_info =array();
        if (!empty($examiner_check) && !is_null($examiner_check)) {
            foreach ($examiner_check as $rw=>$val) {
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
        $row['examiner']  =$examiner_info;
        $row['CenterIDs'] =$user_cid;
        $obj->userInfo    =$row;
        return $obj;
    }


    /**
     * Singleton method. Retrieve the user passed as parameter, but only
     * 1 instance.
     *
     * @param string $username Identifies the user
     *
     * @return User
     * @access public
     * @static
     */
    static function &singleton($username = null)
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
     * @return void
     * @access public
     * @static
     */
    function insert($set)
    {
        // create DB object
        $DB =& Database::singleton();

        $success = $DB->insert('users', $set);

        return true;
    }


    /**
     * Updates a user
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     */
    function update($set)
    {
        // create DB object
        $DB =& Database::singleton();

        $success = $DB->update(
            'users',
            $set,
            array('UserID' => $this->userInfo['UserID'])
        );

        return true;
    }

    /**
     * Gets user data
     *
     * @param string $var Name of variable to get
     *
     * @note   Call without any parameters to get the entire user data array
     * @return mixed
     * @access public
     */
    function getData($var = null)
    {
        if (is_null($var)) {
            return $this->userInfo;
        } else {
            return $this->userInfo[$var];
        }
    }

    /**
     * Get users real name
     *
     * @return string
     */
    function getFullname()
    {
        return $this->userInfo['Real_name'];
    }

    /**
     * Get the user's id
     *
     * @return int
     */
    function getId()
    {
        return $this->userInfo['ID'];
    }

    /**
     * Get the user's username
     *
     * @return string
     */
    function getUsername()
    {
        return $this->userInfo['UserID'];
    }

    /**
     * Get the user's sites' names, concatenated with
     * a semi-colon if the User is at more than one site
     *
     * @return string
     */
    function getSiteNames()
    {
        return $this->userInfo['Sites'];
    }

    /**
     * Get the user's sites' ID numbers
     *
     * @return array
     */
    function getCenterIDs()
    {
        return $this->userInfo['CenterIDs'];
    }


    /**
     * Returns all sites where Examiner is active
     *
     * @return array
     */
    function getExaminerSites()
    {
        $site_list = $this->userInfo['examiner'];
        unset($site_list['pending']);
        return $site_list;
    }

    /**
     * Checks that the user's email is valid
     *
     * @return boolean
     * @access public
     */
    function isEmailValid()
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
    function newPassword($length = 8)
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
            $password .= substr($possible, mt_rand(0, $possible_cnt), 1);
        }

        if (strpbrk($password, $specialChars) === false) {
            $password .= substr(
                $specialChars,
                mt_rand(0, strlen($specialChars)-1),
                1
            );
        }

        if (strpbrk($password, $numbers) === false) {
            $password .= substr(
                $numbers,
                mt_rand(0, strlen($numbers)-1),
                1
            );
        }

        for ($i = strlen($password); $i < $length; $i++) {
            $password .= substr($possible, mt_rand(0, $possible_cnt), 1);
        }

        return $password;
    }


    /**
     * Check password strength
     *
     * If the password fails a comparison, it is not strong
     *
     * @param string $password  Password to check
     * @param array  $values    Values that can not be in the password
     *                          should contain ie. the user's name
     * @param array  $operators Operators used in comparison of values
     *                          array
     *
     * @return boolean
     * @access public
     * @static
     */
    function isPasswordStrong($password, $values = array(), $operators = array())
    {
        $CharTypes = 0;
        // less than 6 characters
        if (strlen($password) < 8) {
            return false;
        }

        // nothing but letters
        if (!preg_match('/[^A-Za-z]/', $password)) {
            return false;
        }

        // nothing but numbers
        if (!preg_match('/[^0-9]/', $password)) {
            return false;
        }

        // preg_match returns 1 on match, 0 on non-match
        $CharTypes += preg_match('/[0-9]+/', $password);
        $CharTypes += preg_match('/[A-Za-z]+/', $password);
        $CharTypes += preg_match('/[!\\\$\^@#%&\*\(\)]+/', $password);
        if ($CharTypes < 3) {
            return false;
        }

        // compare password to values
        foreach ($values as $key => $value) {
            $function = create_function(
                '$a, $b',
                'return $a ' . $operators[$key] . ' $b;'
            );
            // if the comparison fails
            if (!$function($password, $value)) {
                return false;
            }
        }

        return true;
    }
    /**
     * Check if user belongs to DCC
     *
     * @return boolean
     */
    function isUserDCC()
    {
        //DCC site = 1 by LORIS convention
        return ($this->userInfo['CenterID']== 1);
    }

    /**
     * Updates the password for this user into the appropriate field in the
     * database.
     *
     * @param string $password The plain text password to be hashed and saved.
     * @param string $expiry   The password expiry date. If not supplied, the
     *                         password expiry date will be set to now+6months.
     *
     * @return none
     */
    function updatePassword($password, $expiry = null)
    {
        if (is_null($expiry)) {
            $expiry = date(
                'Y-m-d',
                mktime(0, 0, 0, date('n') + 6, date('j'), date('Y'))
            );
        }

        $updateArray = array('Password_expiry' => $expiry);

        $updateArray['Password_hash'] = password_hash(
            $password,
            PASSWORD_DEFAULT
        );

        $this->update($updateArray);
    }
}
?>

<?php
/**
 * This file contains the Loris user class
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once 'UserPermissions.class.inc';

/**
 * User class. This deals with any User management except permissions,
 * which is contained in the UserPermissions base class.
 *
 * @category Main
 * @package  Main
 * @author   Alex Zijdenbos <zijdenbos@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class User extends UserPermissions
{
    /**
     * Stores user information
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
     * @throws PEAR_Error
     * @access public
     */
    static function &factory($username)
    {
        $obj = new User;

        // right off, set the username
        $obj->userInfo['UserID'] = $username;

        // get the user's permissions
        $success = $obj->select($username);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("User::factory(): ".$success->getMessage());
        }

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        // get user data from database
        $query = "SELECT users.*, psc.Name AS Site FROM users 
            JOIN psc ON (users.centerID=psc.CenterID)
            WHERE users.UserID = :UID";

        $row = $DB->pselectRow($query, array('UID' => $username));
        if (Utility::isErrorX($row)) {
            return PEAR::raiseError("DB Error: ".$row->getMessage());
        }
        
        // store user data in object property
        $obj->userInfo = $row;

        return $obj;
    }


    /**
     * Singleton method. Retrieve the user passed as parameter, but only
     * 1 instance.
     *
     * @param string $username Identifies the user
     *
     * @return User
     * @throws PEAR_Error
     * @access public
     * @static
     */
    static function &singleton($username = null)
    {
        static $instance;
        if (is_null($instance)) {
            $instance = User::factory($username);
            if (Utility::isErrorX($instance)) {
                return PEAR::raiseError(
                    "User Error ($username): ".$instance->getMessage()
                );
            }
        }
        return $instance;
    }


    /**
     * Inserts a user
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     * @static
     */
    function insert($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        $success = $DB->insert('users', $set);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }


    /**
     * Updates a user
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function update($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        $success = $DB->update(
            'users',
            $set,
            array('UserID' => $this->userInfo['UserID'])
        );
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }

    /**
     * Gets user data
     *
     * @param string $var Name of variable to get
     *
     * @note          Call without any parameters to get the entire user data array
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
     * Get the user's username
     *
     * @return string
     */
    function getUsername()
    {
        return $this->userInfo['UserID'];
    }

    /**
     * Get the user's site's name
     *
     * @return string
     */
    function getSiteName()
    {
        return $this->userInfo['Site'];
    }

    /**
     * Get the user's site's ID number
     *
     * @return integer
     */
    function getCenterID()
    {
        return $this->userInfo['CenterID'];
    }

    /**
     * Unknown what this does. Maybe it should be removed?
     * - Dave
     *
     * @return boolean
     */
    function isMultiSiteEnabled()
    {
        // if $userID is not passed,then look-up current user
        // if CenterID = 0 then admin staff
        // like dcc ccc nih or similar
        // change 2002-10-23 Dario
        $config =& NDB_Config::singleton();
        return in_array(
            $this->userInfo['CenterID'],
            $config->getSetting('multiSiteEnabledCenters')
        );
    }

    /**
     * Checks that the user's email is valid
     *
     * @return boolean
     * @access public
     */
    function isEmailValid()
    {
        // stolen from PEAR::HTML_QuickForm
        $regex = "/^((\"[^\"\f\n\r\t\v\b]+\")|([\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+(\.[\w\!\#\$\%\&\'\*\+\-\~\/\^\`\|\{\}]+)*))@((\[(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))\])|(((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9]))\.((25[0-5])|(2[0-4][0-9])|([0-1]?[0-9]?[0-9])))|((([A-Za-z0-9\-])+\.)+[A-Za-z\-]+))$/";
    
        return preg_match($regex, $this->userInfo['Email']);
    }


    /**
     * Makes an md5 hash with a salt
     *
     * @param string $word The word to hash
     *
     * @return string
     * @access public
     * @static
     */
    static function md5_salt($word)
    {
        // get a two-character hexadecimal salt from 10 to ff
        $salt = dechex(rand(16, 255));

        // return the salted md5 hash
        return $salt . md5($salt . $word);
    }


    /**
     * Checks an md5 salt
     *
     * @param string $word The word to compare to the hash
     * @param string $hash The hash
     *
     * @return boolean
     * @access public
     * @static
     */
    static function md5_unsalt($word, $hash)
    {
        // get the first two characters of the hash
        $salt = substr($hash, 0, 2);

        // return whether the hash matches the word
        return ($salt . md5($salt . $word) == $hash);
    }


    /**
     * Generates a random alphanumeric password
     *
     * @param int $length Length of password to generate
     *
     * @return string
     * @access public
     * @static
     */
    function newPassword($length = 8)
    {
        // start with a blank password
        $password = '';

        // define possible characters
        $possible = '0123456789bcdfghjkmnpqrstvwxyz'; 

        // length of possible characters minus one
        $possible_cnt = 29; //strlen($possible) - 1;

        // add random characters to $password until $length is reached
        for ($i = 0; $i < $length; $i++) { 
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
                '$a, $b', 'return $a ' . $operators[$key] . ' $b;'
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
     *
     * @return boolean
     * @access public
     * @static
     */

     function isUserDCC() {
      //DCC site = 1 by LORIS convention
      return ($this->userInfo['CenterID']== 1);     
     }

}
?>

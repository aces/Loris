<?php
require_once 'NDB_Factory.class.inc';
require_once 'UserPermissions.class.inc';
require_once 'CouchDB.class.inc';

/**
 * User class
 *
 * @access public
 * @package main
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
     * @param  string       Identifies the user
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
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get user data from database
        $query = "SELECT users.*, psc.Name AS Site FROM users, psc WHERE users.CenterID = psc.CenterID AND users.UserID = :UID";

        $row = $DB->pselectRow($query, array('UID' => $username));
        if (Utility::isErrorX($row)) {
            return PEAR::raiseError("DB Error: ".$row->getMessage());
        }
        
        // store user data in object property
        $obj->userInfo = $row;

        return $obj;
    }


    /**
     * Singleton method
     *
     * @param  string      Identifies the user
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
                return PEAR::raiseError("User Error ($username): ".$instance->getMessage());
            }
        }
        return $instance;
    }


    /**
     * Inserts a user
     *
     * @param  array       The array formatted for use in a Database call
     * @param  string      Plain-text password for mantis to hash
     * @return void
     * @throws PEAR_Error
     * @access public
     * @static
     */
    function insert($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $success = $DB->insert('users', $set);
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }


    /**
     * Updates a user
     *
     * @param  array       The array formatted for use in a Database call
     * @param  string      Plain-text password for mantis to hash
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function update($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $success = $DB->update('users', $set, array('UserID' => $this->userInfo['UserID']));
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }

        return true;
    }

    /**
     * Gets user data
     *
     * @note          Call without any parameters to get the user data array
     * @param string  Name of variable to get
     * @return mixed
     * @access public
     */
    function getData($var = null)
    {
        if (is_null($var)) {
            return $this->userInfo;
        }
        else {
            return $this->userInfo[$var];
        }
    }

    function getUsername()
    {
        return $this->userInfo['UserID'];
    }
    function getSiteName()
    {
        return $this->userInfo['Site'];
    }
    function getCenterID()
    {
        return $this->userInfo['CenterID'];
    }

    function isMultiSiteEnabled()
    {
        // if $userID is not passed,then look-up current user
        // if CenterID = 0 then admin staff
        // like dcc ccc nih or similar
        // change 2002-10-23 Dario
        $config =& NDB_Config::singleton();
        return in_array($this->userInfo['CenterID'], $config->getSetting('multiSiteEnabledCenters'));
    }

    /**
     * Checks that the email is valid
     *
     * @param  string  Email address
     * @return bool
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
     * @param  string  The word to hash
     * @return string
     * @access public
     * @static
     */
    function md5_salt($word)
    {
        // get a two-character hexadecimal salt from 10 to ff
        $salt = dechex(rand(16, 255));

        // return the salted md5 hash
        return $salt . md5($salt . $word);
    }


    /**
     * Checks an md5 salt
     *
     * @param  string  The word to compare to the hash
     * @param  string  The hash
     * @return string
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
     * @note           Should use PEAR::Text_Password 
     * @param  int     Length of password
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
     * @param string  Password
     * @param array   Values to compare password to
     * @param array   Operators used in comparison
     * @return bool
     * @access public
     * @static
     */
    function isPasswordStrong($password, $values = array(), $operators = array())
    {
        // less than 6 characters
        if (strlen($password) < 6) {
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

        // compare password to values
        foreach ($values as $key => $value) {
            $function = create_function('$a, $b', 'return $a ' . $operators[$key] . ' $b;');
            // if the comparison fails
            if (!$function($password, $value)) {
                return false;
            }
        }

        return true;
    }

    function updateCouchUser($password) {
        $factory = NDB_Factory::singleton();
        $cdb = $factory->CouchDB();
        $config = $factory->Config();


        $c_config = $config->getSetting('CouchDB');
        if($c_config['SyncAccounts'] !== 'true') {
            return false;
        }
        $username = $this->getUsername();
        $auth = array('Authorization' => 'Basic ' 
            . base64_encode($c_config['admin'] . ':' . $c_config['adminpass'])
        );
        $userjson = $cdb->_getURL("/_users/org.couchdb.user:" . $username, 'GET', $auth);
        $userobj = json_decode($userjson, true);

        if(isset($userobj['error']) && $userobj['error'] == 'not_found') {
            $userobj = array('_id' => 'org.couchdb.user:' . $username,
                'type' => 'user',
                'name' => $username,
                'roles' => array('dqg')
            );
        }
        $userobj['password'] = $password;


        $response = $cdb->_postURL("PUT /_users/org.couchdb.user:" . $username,
            json_encode($userobj),
            $auth
        );
    }
}
?>

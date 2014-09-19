<?php
require_once 'PEAR.php';

/**
 * Manages user permissions
 *
 * @access  public
 * @package main
 */
class UserPermissions
{
    /**
     * User's ID
     * @var    int      
     * @access private
     */
    var $userID;

    /**
     * Stores the permissions
     * @var    array    
     * @access private
     */
    var $permissions = array();
  

    /**
     * Constructor
     *
     * Fills the permissions property based on username
     *
     * @param  string      Identifies the user
     * @return void
     * @throws PEAR_Error
     * @access private
     */
    function select($username)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return("Could not connect to database: ".$DB->getMessage());
        }

        // get the proper ID from the database
        $query = "SELECT ID FROM users WHERE UserID =:UName";
        $params = array('UName' => $username);
        $this->userID = $DB->pselectOne($query, $params);
        if (Utility::isErrorX($this->userID)) {
            return PEAR::raiseError("DB Error: ".$this->userID->getMessage());
        }

        // load the user's permissions
        $success = $this->setPermissions();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("UserPermissions::select(): ".$success->getMessage());
        }

        return true;
    }


    /**
     * Loads the users's permissions
     *
     * @return void
     * @throws PEAR_Error
     * @access private
     */
    function setPermissions()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get all the permissions for this user
        $query = "SELECT code FROM permissions, user_perm_rel WHERE permissions.permID = user_perm_rel.permID AND userID = :UID";
        $results = $DB->pselect($query, array('UID' => $this->userID));
        if (Utility::isErrorX($results)) {
            return PEAR::raiseError("DB Error: ".$results->getMessage());
        }

        // reset the array
        $this->permissions = array();

        // fill the array
        foreach ($results AS $row) {
            $this->permissions[$row['code']] = true;
        }

        return true;
    }


    /**
     * Determines if the user has a permission
     *
     * @param  string  The permission code
     * @return bool
     * @access 
     */
    function hasPermission($code)
    {
        if (isset($this->permissions[$code]) && $this->permissions[$code] === true) {
            return true;
        }

        if (isset($this->permissions['superuser'])
            && $this->permissions['superuser'] == true
        ) {
            return true;
        }
        return false;
    }


    /**
     * Returns the permissions array
     *
     * @return array
     * @access public
     */
    function getPermissions()
    {
        return $this->permissions;
    }


    /**
     * Add permissions to a user
     *
     * @note   If saving permissions, remove all permissions first
     * @param  array        Array of permission IDs to add
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function addPermissions($set)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // add the permissions
        foreach ($set as $value) {
            $success = $DB->insert('user_perm_rel', array('userID' => $this->userID, 'permID' => $value));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        // refresh the user permissions
        $success = $this->setPermissions();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("UserPermissions::addPermissions(): ".$success->getMessage());
        }

        return true;
    }


    /**
     * Removes permissions from a user
     *
     * @note   Passing no arguments deletes all permissions
     * @param  array        Array of permission IDs to remove
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function removePermissions($set = null)
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        if (is_null($set)) {
            // remove all permissions
            $success = $DB->delete('user_perm_rel', array('userID' => $this->userID));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }
        else {
            // remove the permissions
            foreach ($set as $value) {
                $success = $DB->delete('user_perm_rel', array('userID' => $this->userID, 'permID' => $value));
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("DB Error: ".$success->getMessage());
                }
            }
        }

        // refresh the user permissions
        $success = $this->setPermissions();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("UserPermissions::removePermissions(): ".$success->getMessage());
        }

        return true;
    }


    /**
     * Returns an array of the user's permission IDs
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function getPermissionIDs()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // get all the permissions for this user
        $query = "SELECT permissions.permID FROM permissions, user_perm_rel WHERE permissions.permID = user_perm_rel.permID AND userID = :UID";
        $results = $DB->pselect($query, array('UID' => $this->userID));
        if (Utility::isErrorX($results)) {
            return PEAR::raiseError("DB Error: ".$results->getMessage());
        }

        return Utility::reduce($results);
    }


    /**
     * Returns an array with all permissions information for the user
     *
     * @return array
     * @throws PEAR_Error
     * @access public
     */
    function getPermissionsVerbose()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $query = "SELECT p.permID, p.code, p.description, pc.Description as type FROM permissions p JOIN user_perm_rel up ON (p.permID=up.PermID) LEFT JOIN permissions_category pc ON (pc.ID=p.categoryID) WHERE up.userID = :UID ORDER BY p.categoryID, p.description";
        $results = $DB->pselect($query, array ('UID' => $this->userID));
        if (Utility::isErrorX($results)) {
            return PEAR::raiseError("DB Error: ".$results->getMessage());
        }

        return $results;
    }
    
    /**
     * Inserts the user modifications into the user_account_history
     *
     * @param Integer $PermID     The ID of the permission
     * @param String  $permAction The Type of user-modification ('D' or 'I')
     * 
     * @return null
     */
    function insertIntoUserAccountHistory(
        $PermID=null,$permAction=null
    ) {

        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }
        //insert into the login_history
        $sucess =  $DB->insert(
            'user_account_history',
            array(
                'userID'=>$this->userID,'PermID'=>$PermID,
                'PermAction'=>$permAction
            )
        );
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
    }

}
?>

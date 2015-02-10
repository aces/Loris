<?php
/**
 * The UserPermissions class manages checking of user permissions
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once 'PEAR.php';

/**
 * Manages user permissions
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
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
     * @param string $username Identifies the user
     *
     * @return void
     */
    function select($username)
    {
        // create DB object
        $DB =& Database::singleton();

        // get the proper ID from the database
        $query  = "SELECT ID FROM users WHERE UserID =:UName";
        $params = array('UName' => $username);

        $this->userID = $DB->pselectOne($query, $params);

        // load the user's permissions
        $success = $this->setPermissions();

        return true;
    }


    /**
     * Loads the users's permissions
     *
     * @return void
     * @access private
     */
    function setPermissions()
    {
        // create DB object
        $DB =& Database::singleton();

        // get all the permissions for this user
        $query = "SELECT p.code, pr.userID FROM permissions p
            LEFT JOIN user_perm_rel pr
            ON (p.permID=pr.permID AND pr.userID=:UID)";

        $results = $DB->pselect($query, array('UID' => $this->userID));

        // reset the array
        $this->permissions = array();

        // fill the array
        foreach ($results AS $row) {
            if (!empty($row['userID'])
                && $row['userID'] === $this->userID
            ) {
                $this->permissions[$row['code']] = true;
            } else {
                $this->permissions[$row['code']] = false;
            }
        }

        return true;
    }


    /**
     * Determines if the user has a permission
     *
     * @param string $code The permission code
     *
     * @return bool
     */
    function hasPermission($code)
    {
        if (!isset($this->permissions[$code])) {
            throw new ConfigurationException("Invalid permission code $code");
        }
        if ($this->permissions[$code] === true) {
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
     * @param array $set Array of permission IDs to add
     *
     * @return void
     * @note   If saving permissions, remove all permissions first
     */
    function addPermissions($set)
    {
        // create DB object
        $DB =& Database::singleton();

        // add the permissions
        foreach ($set as $value) {
            $success = $DB->insert(
                'user_perm_rel',
                array(
                 'userID' => $this->userID,
                 'permID' => $value,
                )
            );
        }

        // refresh the user permissions
        $success = $this->setPermissions();

        return true;
    }


    /**
     * Removes permissions from a user
     *
     * @param array $set Array of permission IDs to remove
     *
     * @return void
     * @note   Passing no arguments deletes all permissions
     */
    function removePermissions($set = null)
    {
        // create DB object
        $DB =& Database::singleton();
        if (is_null($set)) {
            // remove all permissions
            $success = $DB->delete(
                'user_perm_rel',
                array('userID' => $this->userID)
            );
        } else {
            // remove the permissions
            foreach ($set as $value) {
                $success = $DB->delete(
                    'user_perm_rel',
                    array(
                     'userID' => $this->userID,
                     'permID' => $value,
                    )
                );
            }
        }

        // refresh the user permissions
        $success = $this->setPermissions();

        return true;
    }


    /**
     * Returns an array of the user's permission IDs
     *
     * @return array
     * @access public
     */
    function getPermissionIDs()
    {
        // create DB object
        $DB =& Database::singleton();

        // get all the permissions for this user
        $query = "SELECT permissions.permID
            FROM permissions, user_perm_rel
            WHERE permissions.permID = user_perm_rel.permID AND userID = :UID";

        $results = $DB->pselect($query, array('UID' => $this->userID));

        return Utility::reduce($results);
    }


    /**
     * Returns an array with all permissions information for the user
     *
     * @return array
     * @access public
     */
    function getPermissionsVerbose()
    {
        // create DB object
        $DB =& Database::singleton();

        $query   = "SELECT p.permID, p.code, p.description, pc.Description as type
            FROM permissions p
                JOIN user_perm_rel up ON (p.permID=up.PermID)
                LEFT JOIN permissions_category pc ON (pc.ID=p.categoryID)
            WHERE up.userID = :UID
                ORDER BY p.categoryID, p.description";
        $results = $DB->pselect($query, array('UID' => $this->userID));

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

        //insert into the login_history
        $sucess =  $DB->insert(
            'user_account_history',
            array(
             'userID'     => $this->userID,
             'PermID'     => $PermID,
             'PermAction' => $permAction,
            )
        );
    }

}
?>

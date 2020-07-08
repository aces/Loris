<?php declare(strict_types=1);
/**
 * The UserPermissions class manages checking of user permissions
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

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
     *
     * @var    int
     * @access private
     */
    var $userID;

    /**
     * Stores the permissions
     *
     * @var    array
     * @access private
     */
    var $permissions = array();


    /**
     * Constructor
     *
     * Fills the permissions property based on username
     *
     * @param string|null $username Identifies the user
     *
     * @return bool true if the user exists, false otherwise
     */
    function select(?string $username): bool
    {
        // get the proper ID from the database
        $query  = "SELECT ID FROM users WHERE UserID =:UName";
        $params = array('UName' => $username);

        $this->userID = \Database::singleton()->pselectOne($query, $params);
        if (empty($this->userID)) {
            return false;
        }

        // load the user's permissions
        $this->setPermissions();

        return true;
    }


    /**
     * Loads the users's permissions
     *
     * @return void
     * @access private
     */
    function setPermissions(): void
    {
        // create DB object
        $DB = \Database::singleton();

        // get all the permissions for this user
        $query = "SELECT p.code, pr.userID FROM permissions p
            LEFT JOIN user_perm_rel pr
            ON (p.permID=pr.permID AND pr.userID=:UID)";

        $results = $DB->pselect($query, array('UID' => $this->userID));

        // reset the array
        $this->permissions = array();

        // Fill the permissions array of this UserPermissions object with the
        // values extracted for this user from the database.
        if (is_array($results) and !empty($results)) {
            foreach ($results AS $row) {
                if (empty($row['userID'])) {
                    $this->permissions[$row['code']] = false;
                    continue;
                }
                $userMatch = $row['userID'] === $this->userID;
                $this->permissions[$row['code']] = $userMatch;
            }
        }
    }


    /**
     * Determines if the user has the permission to access a specific module
     * or page.
     *
     * @param string $code The permission code
     *
     * @return bool If the user has a permission.
     */
    public function hasPermission(string $code): bool
    {
        return $this->_permissionTrueAndValid('superuser')
            || $this->_permissionTrueAndValid($code);
    }

    /**
     * Check if a given permission code is present in a user's list of
     * permissions. Also validates that the permission code is real.
     *
     * @param string $code Permission code to test.
     *
     * @return bool The setting of permission code $permission
     */
    private function _permissionTrueAndValid(string $code): bool
    {
        if (!isset($this->permissions[$code])) {
            throw new ConfigurationException("Invalid permission code $code");
        }
        return intval($this->permissions[$code]) === 1;
    }

    /**
     * Used to test whether a user has ALL of an array of specified permissions.
     * Returns false on the first permission that the user doesn't have.
     *
     * @param string[] $permissions Array of permissions codes.
     *
     * @return bool Whether the user has all the permissions in $permissions.
     */
    public function hasAllPermissions(array $permissions): bool
    {
        if (count($permissions) === 0) {
            throw new LorisException(
                "Cannot call hasAllPermissions with an empty array!"
            );
        }
        foreach ($permissions as $p) {
            if (!$this->_permissionTrueAndValid($p)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Used to test whether a user has ANY of an array of specified permissions.
     *
     * @param string[] $permissions Array of permissions codes.
     *
     * @return bool Whether the user has any of the permissions in $permissions.
     */
    public function hasAnyPermission(array $permissions): bool
    {
        if (count($permissions) === 0) {
            throw new LorisException(
                "Cannot call hasAnyPermission with an empty array!"
            );
        }
        foreach ($permissions as $p) {
            if ($this->hasPermission($p)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns the permissions array
     *
     * @return array
     * @access public
     */
    function getPermissions(): array
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
    function addPermissions(array $set): void
    {
        // create DB object
        $DB = \Database::singleton();

        // add the permissions
        foreach ($set as $value) {
            $DB->insert(
                'user_perm_rel',
                array(
                    'userID' => $this->userID,
                    'permID' => $value,
                )
            );
        }

        // refresh the user permissions
        $this->setPermissions();
    }


    /**
     * Removes permissions from a user
     *
     * @param array|null $set Array of permission IDs to remove
     *
     * @return void
     * @note   Passing no arguments deletes all permissions
     */
    function removePermissions(?array $set = null): void
    {
        // create DB object
        $DB =& Database::singleton();
        if (is_null($set)) {
            // remove all permissions
            $DB->delete(
                'user_perm_rel',
                array('userID' => $this->userID)
            );
        } else {
            // remove the permissions
            foreach ($set as $value) {
                $DB->delete(
                    'user_perm_rel',
                    array(
                        'userID' => $this->userID,
                        'permID' => $value,
                    )
                );
            }
        }

        // refresh the user permissions
        $this->setPermissions();
    }


    /**
     * Returns an array of the user's permission IDs
     *
     * @return array
     * @access public
     */
    function getPermissionIDs(): array
    {
        // create DB object
        $DB =& Database::singleton();

        // get all the permissions for this user
        $query = "SELECT permissions.permID
            FROM permissions, user_perm_rel
            WHERE permissions.permID = user_perm_rel.permID AND userID = :UID";

        $results = $DB->pselect($query, array('UID' => $this->userID));

        // isolate and return numeric permission values
        $permIDs = array();
        foreach ($results as $row) {
            foreach ($row as $v) {
                $permIDs[] = $v;
            }
        }
        return $permIDs;
    }


    /**
     * Returns an array with all permissions information for the user
     *
     * @return array
     * @access public
     */
    function getPermissionsVerbose(): array
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
     * @param Integer|null $PermID     The ID of the permission
     * @param String|null  $permAction The Type of user-modification ('D' or 'I')
     *
     * @return void
     */
    function insertIntoUserAccountHistory(
        ?int $PermID = null,
        ?string $permAction = null
    ): void {

        // create DB object
        $DB =& Database::singleton();

        //insert into the login_history
        $DB->insert(
            'user_account_history',
            array(
                'userID'     => $this->userID,
                'PermID'     => $PermID,
                'PermAction' => $permAction,
            )
        );
    }
}


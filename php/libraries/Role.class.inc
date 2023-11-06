<?php
/**
 * This file contains the Role class.
 *
 * PHP Version 5-7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Loris Role class
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Role implements \LORIS\StudyEntities\AccessibleResource
{
    /**
     * Stores role information
     *
     * @var array
     */
    protected $roleInfo = [];

    /**
     * Stores the role permissions
     *
     * @var array<string,bool>
     */
    private $permissions = [];

    /**
     * Loads the role's permissions
     *
     * @return void
     * @access private
     */
    public function setPermissions(): void
    {
        // create DB object
        $db = \NDB_Factory::singleton()->database();

        // get all the permissions for this role
        $results = $db->pselect(
            "SELECT p.code, rp.RoleID
            FROM permissions p
                LEFT JOIN role_permission_rel rp ON (p.permID=rp.RoleID)
            WHERE rp.RoleID = :rid",
            ['rid' => $this->getId()]
        );

        // reset the array
        $this->permissions = [];

        // Fill the permissions array of this UserPermissions object with the
        // values extracted for this user from the database.
        if (is_array($results) and !empty($results)) {
            foreach ($results as $row) {
                $roleMatch = $row['RoleID'] === $this->getId();
                $this->permissions[$row['code']] = $roleMatch;
            }
        }
    }

    /**
     * Create/get the blocked role archetype from DB.
     *
     * @return Role
     * @access private
     * @static
     */
    private static function _getBlockedRole(): \Role
    {
        $db      = \NDB_Factory::singleton()->database();
        $blocked = new \Role;
        $row     = $db->pselectRow(
            "SELECT * FROM roles WHERE Code = 'blocked'",
            []
        );
        $blocked->roleInfo = $row;
        return $blocked;
    }

    /**
     * Constructor
     * 
     * Selects a role and its permissions.
     *
     * @param ?string $roleCode Identifies the role
     *
     * @return \Role A Role object if the Role specified by $roleCode exists
     * @access public
     */
    public function select(?string $roleCode = null): \Role
    {
        // get the proper data
        $db = \NDB_Factory::singleton()->database();
        $row = $db->pselectRow(
            "SELECT * FROM roles WHERE Code = :co",
            ['co' => $roleCode]
        );

        // if null, consider it as the "blocked" role.
        if (is_null($row)) {
            return self::_getBlockedRole();
        }

        // New role obj
        $obj = new Role;

        // attribute DB info
        $obj->roleInfo = $row;

        // load the role permissions
        $this->setPermissions();

        //
        return $obj;
    }

    /**
     * Inserts data into the `roles` table.
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     * @static
     */
    public static function insert(array $set): void
    {
        \NDB_Factory::singleton()->database()->insert('roles', $set);
    }


    /**
     * Updates a role.
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     */
    public function update(array $set): void
    {
        $values = $set;
        error_log("unset");

        // permissions modified?
        $permissions = [];
        if (array_key_exists('Permissions', $values) && !empty($values['Permissions'])) {
            $permissions = $values['Permissions'];
            unset($values['Permissions']);
            error_log("unset");
        }

        error_log(print_r($values, true));

        // insert in role table
        \NDB_Factory::singleton()->database()->update(
            'roles',
            $values,
            ['RoleID' => $this->roleInfo['RoleID']]
        );

        // update permissions
        if (!empty($permissions)) {
            // remove all permissions
            $this->removePermissions();

            // add new permissions
            $this->addPermissions($permissions);
        }
    }


    /**
     * Returns the reole information as array.
     *
     * @return array
     */
    public function asArray() : array
    {
        return $this->roleInfo;
    }

    /**
     * Returns data from the roleInfo array according to the key provided
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
        return ($var === '') ? $this->roleInfo : $this->roleInfo[$var];
    }

    /**
     * Get the role's id
     *
     * @return int
     */
    function getId(): int
    {
        return intval($this->roleInfo['RoleID']);
    }

    /**
     * Get role code
     *
     * @return string
     */
    function getCode(): string
    {
        return $this->roleInfo['Code'];
    }

    /**
     * Get the role's description
     *
     * @return string
     */
    function getDescription(): string
    {
        return $this->roleInfo['Description'];
    }

    /**
     * Return true if the entity is accessible by the
     * user.
     *
     * @param \User $user The user whose access should be
     *                    validated
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasPermission('role_view')
                || $user->hasPermission('role_edit')
                || $user->hasPermission('role_assign');
    }

    /**
     * Get the list of permissions code attached to the current role, indexed 
     * by permission ID.
     * 
     * @return array a list of permissions.
     */
    public function getPermissions(\LORIS\LorisInstance $loris, $verbose = false) : array
    {
        $db = $loris->getDatabaseConnection();

        // only basic info if not verbose
        if (!$verbose) {
            return $db->pselectColWithIndexKey(
                "SELECT p.permID, p.code
                FROM roles r
                    JOIN role_permission_rel rp ON (rp.RoleID = r.RoleID)
                    JOIN permissions p ON (p.permID = rp.permID)
                WHERE r.RoleID = :rid",
                ['rid' => $this->getId()],
                'permID'
            );
        }

        // else return more info
        $results = $db->pselectWithIndexKey(
            "SELECT DISTINCT
                p.permID,
                p.code,
                p.description,
                p.action,
                p.moduleID,
                m.Name
            FROM roles r
                LEFT JOIN role_permission_rel rp ON (rp.RoleID = r.RoleID)
                LEFT JOIN permissions p ON (p.permID = rp.permID)
                LEFT JOIN modules m ON p.moduleID=m.ID
            WHERE m.Active='Y'
            ORDER BY m.Name, p.description",
            [],
            'permID'
        );

        $modules = \Module::getActiveModulesIndexed($loris);
        // Build new meaningful description from combination of columns
        // Module Long Name: action description
        foreach ($results as $key=>$perm) {
            $newDesc = '';
            if (!empty($perm['moduleID'])) {
                $newDesc = $modules[$perm['moduleID']]->getLongName() . ": ";
            }
            $newDesc .= empty($perm['action']) ? "" : $perm['action'] . " ";
            $newDesc .= $perm['description'];

            $results[$key]['label'] = $newDesc;
        }
        return $results;
    }

    /**
     * Determines if the role has the permission.
     *
     * @param string $code The permission code
     *
     * @return bool true if the current role has the permission, else false.
     */
    public function hasPermission(string $code) : bool
    {
        return array_key_exists($code, $this->permissions);
    }

    /**
     * Add permissions to a role
     *
     * @param array $set Array of permission IDs to add
     *
     * @return void
     * @note   If saving permissions, remove all permissions first
     */
    public function addPermissions(array $set) : void
    {
        $db = \NDB_Factory::singleton()->database();
        foreach ($set as $value) {
            $db->insert(
                'role_permission_rel',
                [
                    'RoleID' => $this->getId(),
                    'permID' => $value,
                ]
            );
        }

        // refresh the role permissions
        $this->setPermissions();
    }

    /**
     * Removes permissions from a role
     *
     * @param array|null $set Array of permission IDs to remove
     *
     * @return void
     * @note   Passing no arguments deletes all permissions
     */
    public function removePermissions(?array $set = null) : void
    {
        // create DB object
        $db = \NDB_Factory::singleton()->database();
        if (is_null($set)) {
            // remove all permissions
            $db->delete(
                'role_permission_rel',
                ['RoleID' => $this->getId()]
            );
        } else {
            // remove the permissions
            foreach ($set as $value) {
                $db->delete(
                    'role_permission_rel',
                    [
                        'RoleID' => $this->getId(),
                        'permID' => $value,
                    ]
                );
            }
        }

        // refresh the user permissions
        $this->setPermissions();
    }

    // --------------------------------------------------------------------- PERMISSIONS

    /**
     * Count the number of permissions attached to the current role.
     * 
     * @return int the number of permission
     */
    public function countPermissions() : int
    {
        $n = \NDB_Factory::singleton()->database()->pselectOne(
            "SELECT COUNT(p.code)
            FROM roles r
                JOIN role_permission_rel rp ON (rp.RoleID = r.RoleID)
                JOIN permissions p ON (p.permID = rp.permID)
            WHERE r.RoleID = :rid",
            ['rid' => $this->getId()]
        );
        return $n ?? 0;
    }

    /**
     * Get the list of users having the current role, indexed by user ID.
     * 
     * @return array a list of users.
     */
    public function getUsers() : array
    {
        return \NDB_Factory::singleton()->database()->pselectColWithIndexKey(
            "SELECT u.ID, u.userID
            FROM roles r
                JOIN role_user_rel ru ON (ru.RoleID = r.RoleID)
                JOIN users u ON (u.ID = ru.userID)
            WHERE r.RoleID = :rid",
            ['rid' => $this->getId()],
            'ID'
        );
    }

    // --------------------------------------------------------------------- USERS

    /**
     * Count the number of users having the current role.
     * 
     * @return int the number of users.
     */
    public function countUsers() : int
    {
        $n = \NDB_Factory::singleton()->database()->pselectOne(
            "SELECT count(u.userID)
            FROM roles r
                JOIN role_user_rel ru ON (ru.RoleID = r.RoleID)
                JOIN users u ON (u.ID = ru.userID)
            WHERE r.RoleID = :rid",
            ['rid' => $this->getId()]
        );
        return $n ?? 0;
    }

    /**
     * Useful during new Role creation or for code comparison.
     * Generate the corresponding role code from a given role name.
     *
     * @param string $name a role name
     *
     * @return string a code version of the name
     */
    public static function generateCodeFromName(string $name)
    {
        $code = strtolower(trim($name));
        $code = str_replace("  ", " ", $code);
        $code = str_replace(" ", "_", $code);
        return $code;
    }

    // --------------------------------------------------------------------- UTILS

    /**
     * Checks if the string is a role within the database
     *
     * @param string $roleCode the role code to be checked
     *
     * @return boolean
     */
    public static function exists($roleCode)
    {
        $roleFound = \NDB_Factory::singleton()->database()->pselectOne(
            "SELECT RoleID FROM roles WHERE Code = :rcode",
            ['rcode' => $roleCode]
        );
        return !is_null($roleFound);
    }




    // ---------------------------------------------------------------------
    // TODO: MOVE THIS?
    // ---------------------------------------------------------------------




    // --------------------------------------------------------------------- UTILITY

    /**
     * Get all roles exisiting in the database, indexed by RoleID.
     * 
     * @return array list of roles.
     */
    public static function getAllRoles()
    {
        return \NDB_Factory::singleton()->database()->pselectWithIndexKey(
            "SELECT * FROM roles",
            [],
            'RoleID'
        );
    }


    // -------------------- ROLES / PERMISSIONS REL

    /**
     * Get all roles exisiting in the database and their associated permissions.
     * 
     * @return array list of roles/permissions.
     */
    public static function getAllRolePermissions()
    {
        return \NDB_Factory::singleton()->database()->pselect(
            "SELECT r.RoleID, r.Code, p.permID, p.code
            FROM roles r
                JOIN role_permission_rel rp ON (rp.RoleID = r.RoleID)
                JOIN permissions p ON (rp.permID = p.permID)",
            []
        );
    }
    

    // -------------------- ROLES / USERS REL

}
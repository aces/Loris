<?php declare(strict_types=1);
/**
 * This file contains the Loris Role class
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */

/**
 * Role class. This deals with any Role management.
 *
 * @category Main
 * @package  Main
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
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
     * Role ID
     *
     * @var ?string
     */
    var $roleID;

    /**
     * Stores the permissions
     *
     * @var array
     */
    private $permissions = [];


    /**
     * Constructor
     *
     * Selects a role and its permissions
     *
     * @param string|null $roleCode Identifies the role
     *
     * @return \Role A Role object if the Role specified by $roleCode exists
     * @access public
     */
    public static function &factory(?string $roleCode = null): \Role
    {
        $obj = new Role;

        // right off, set the roleCode
        $obj->roleInfo['Code'] = $roleCode;

        // get the role ID
        $db        = \NDB_Factory::singleton()->database();
        $roleID    = $db->pselectOne(
            "SELECT RoleID FROM roles WHERE Code = :rcode",
            ['rcode' => $roleCode]
        );
        $hasRoleID = ($roleID !== null);

        // in db
        if ($hasRoleID) {
            // fix ID
            $obj->roleID = $roleID;

            // get user data from database
            $row = $db->pselectRow(
                "SELECT Code, Name, Description FROM roles WHERE RoleID = :rid",
                ['rid' => $obj->roleID]
            );

            // store user data in object property
            if (!is_null($row)) {
                $obj->roleInfo = $row;
            }

            // load the role's permissions
            $obj->setPermissions();
        }

        return $obj;
    }

    /**
     * Loads the role's permissions
     *
     * @return void
     * @access private
     */
    function setPermissions(): void
    {
        // get all the permissions for this role
        $db    = \NDB_Factory::singleton()->database();
        $query = "SELECT
            p.permID AS permissionID,
            p.code AS permissionCode,
            p.Description AS permissionDescription,
            p.action AS permissionAction,
            m.Name AS moduleName
        FROM permissions p
            LEFT JOIN role_permission_rel rpr ON (p.permID = rpr.permID)
            LEFT JOIN roles r ON (r.RoleID = rpr.RoleID)
            LEFT JOIN modules m ON (p.moduleID = m.ID)
        WHERE r.RoleID = :rid
            AND p.code <> 'superuser'";

        $results = $db->pselect(
            $query,
            ['rid' => $this->roleID]
        );

        // reset the array
        $this->permissions = Role::getAllPermissions();

        // Fill the permissions array
        $pCodes = array_map(fn($v) => $v['permissionCode'], $results);

        if (empty($pCodes)) {
            foreach ($this->permissions as $code => $permission) {
                $this->permissions[$code]['roleHasPermission'] = false;
            }
        } else {
            foreach ($this->permissions as $code => $permission) {
                $this->permissions[$code]['roleHasPermission'] = in_array(
                    $code,
                    $pCodes,
                    true
                );
            }
        }
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
        $db = \NDB_Factory::singleton()->database();
        $db->insert('users', $set);
    }

    /**
     * Updates a role
     *
     * @param array $set The array formatted for use in a Database call
     *
     * @return void
     * @access public
     */
    public function update(array $set): void
    {
        $db = \NDB_Factory::singleton()->database();
        $db->update(
            'roles',
            $set,
            ['RoleID' => $this->roleInfo['RoleID']]
        );
    }

    /**
     * Returns whether the role exists in db or not.
     *
     * @param string $roleCode a role Code
     *
     * @return bool
     * @access public
     */
    public static function exists(string $roleCode): bool
    {
        return !is_null(Role::factory($roleCode)->getId());
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
            return $this->roleInfo;
        } else {
            return $this->roleInfo[$var];
        }
    }

    /**
     * Get the role's id
     *
     * @return int
     */
    function getId(): int
    {
        return intval($this->roleID);
    }

    /**
     * Get the role's code
     *
     * @return string
     */
    function getCode(): string
    {
        return $this->roleInfo['Code'];
    }

    /**
     * Get the role's name
     *
     * @return string
     */
    function getName(): string
    {
        return $this->roleInfo['Name'];
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
     * Determines if the role has the permission based on permission code.
     * If the permission code does not exists, returns false.
     *
     * @param string $code The permission code
     *
     * @return bool true if the role has a permission, else false.
     */
    public function hasPermission(string $code): bool
    {
        if (!array_key_exists($code, $this->permissions)) {
            return false;
        }
        $p = $this->permissions[$code];
        if (!array_key_exists('roleHasPermission', $p)) {
            return false;
        }
        return $p['roleHasPermission'];
    }

    /**
     * Add permissions to a role
     *
     * @param array $set Array of permission IDs to add
     *
     * @return void
     * @note   If saving permissions, remove all permissions first
     */
    function addPermissions(array $set): void
    {
        // add the permissions
        $db = \NDB_Factory::singleton()->database();
        foreach ($set as $value) {
            $db->insert(
                'role_permission_rel',
                [
                    'RoleID' => $this->roleID,
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
    function removePermissions(?array $set = null): void
    {
        $db = \NDB_Factory::singleton()->database();
        // remove all permissions
        if (is_null($set)) {
            $db->delete(
                'role_permission_rel',
                ['RoleID' => $this->roleID]
            );
        } else {
            // remove the permissions
            foreach ($set as $value) {
                $db->delete(
                    'role_permission_rel',
                    [
                        'userID' => $this->roleID,
                        'permID' => $value,
                    ]
                );
            }
        }

        // refresh the role permissions
        $this->setPermissions();
    }

    // ---------------------------------------
    // Utils world passed this line.
    // ---------------------------------------

    /**
     * Implements the AccessibleResource interface. A role can be accessed by
     * a user if the user has the roles_edit permission.
     *
     * @param \User $user The "editing" user trying to access this user object.
     *
     * @return bool
     */
    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasPermission('roles_edit');
    }

    // ---------------------------------------
    // Utils world passed this line.
    // ---------------------------------------

    /**
     * Singleton method. Retrieve the role passed as parameter, but only
     * 1 instance.
     *
     * @param string|null $roleCode Identifies the role
     *
     * @return Role
     * @access public
     * @static
     */
    public static function &singleton(?string $roleCode = null): \Role
    {
        static $instance;
        if (is_null($instance)) {
            $instance = Role::factory($roleCode);
        }
        return $instance;
    }

    /**
     * Get all permissions values from DB.
     *
     * Values are formatted as follow:
     * - permissionID: permission id,
     * - permissionCode: permission code,
     * - permissionDescription: permission description,
     * - permissionAction: linked actions,
     * - moduleName: module name.
     *
     * @return array an array of permissions values.
     */
    public static function getAllPermissions(): array
    {
        $db = \NDB_Factory::singleton()->database();
        return $db->pselectWithIndexKey(
            "SELECT
                p.permID AS permissionID,
                p.code AS permissionCode,
                p.Description AS permissionDescription,
                p.action AS permissionAction,
                m.Name AS moduleName
            FROM permissions p
                LEFT JOIN modules m ON (p.moduleID = m.ID)
            WHERE p.code <> 'superuser'
            ORDER BY m.Name",
            [],
            'permissionCode'
        );
    }

    /**
     * Get all roles from DB.
     *
     * Values are formatted as follow:
     * - permissionID: permission id,
     * - permissionCode: permission code,
     * - permissionDescription: permission description,
     * - permissionAction: linked actions,
     * - moduleName: module name.
     *
     * @return array an array of permissions values.
     */
    public static function getAllRoles(): array
    {
        $db = \NDB_Factory::singleton()->database();
        return $db->pselect(
            "SELECT RoleID, Code, Name, Description FROM roles",
            []
        );
    }
}
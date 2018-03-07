<?php
/**
 * This file contains the Permission class.
 *
 * PHP Version 5-7
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Loris Permission class
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Permission
{
    /**
     * Stores Database being used
     *
     * @var    $DB Database
     * @access private
     */
    var $DB;

    /**
     * Permission constructor.
     *
     * @param Database $Database database
     */
    function __construct($Database)
    {
        $this->DB = $Database;
    }


    /**
     * Gets the list of permissions in the database.
     *
     * @return array Associative array in the form $permissionID=>$permissionName
     */
    function getPermissions()
    {
        $permissions = $this->DB->pselectColWithIndexKey(
            "SELECT permID, code
         FROM permissions",
            array(),
            "permID"
        );

        return $permissions;
    }

    /**
     * Gets the list of permission labels in the database.
     *
     * @return array Associative array in the form $permissionID=>$permissionLabel
     */
    function getPermissionLabels()
    {
        $permissions = $this->DB->pselectColWithIndexKey(
            "SELECT permID, description
         FROM permissions",
            array(),
            "permID"
        );

        return $permissions;
    }

    /**
     * Checks if the string is a permission within the database
     *
     * @param string $permissionName the permission to be checked
     *
     * @return boolean
     */
    function isPermission($permissionName)
    {
        $permissions = $this->getPermissions();
        if (in_array($permissionName, $permissions, true)) {
            return true;
        }
        return false;
    }

    /**
     * Gets the ID of a permission given its name
     *
     * @param string $permissionName the permission name for which the ID is needed
     *
     * @throws LorisException if permission does not exist
     *
     * @return int
     */
    function getPermissionIDFromName($permissionName)
    {
        if (!$this->isPermission($permissionName)) {
            throw new LorisException(
                "Could not retrieve the permission ID for 
                permission '$permissionName'"
            );
        }

        $permissionID = $this->DB->pselectOne(
            "SELECT permID
         FROM permissions
         WHERE code=:PN",
            array("PN" => $permissionName)
        );
        return $permissionID;
    }

    /**
     * Gets the NAME of a permission given its ID
     *
     * @param int $permissionID the permission ID for which the name is needed
     *
     * @throws LorisException if permission ID does not exist
     *
     * @return string
     */
    function getPermissionNameFromID($permissionID)
    {
        $permissionName = $this->DB->pselectOne(
            "SELECT code
         FROM permissions
         WHERE permID=:PID",
            array("PID" => $permissionID)
        );

        if (empty($permissionName)) {
            throw new LorisException(
                "Could not retrieve the permission name for 
                permission ID '$permissionID'"
            );
        }
        return $permissionName;
    }

    /**
     * Gets the roles associated to a permission
     *
     * @param int $permissionID the permission
     *
     * @return array non-associative with values being the permission IDs
     */
    function getPermissionRoleIDs($permissionID)
    {
        $roles = $this->DB->pselectCol(
            "SELECT RoleID
         FROM role_permission_rel
         WHERE PermissionID=:PID",
            array("PID" => $permissionID)
        );

        return $roles;
    }

    /**
     * Returns all the users with the permission
     *
     * @param int $permissionID the permission
     *
     * @return array Associative array ($userID=>$RealName) that have the permission
     */
    function getPermissionUsers($permissionID)
    {
        $usersWithPermission = $this->DB->pselectColWithIndexKey(
            "SELECT upr.userID, u.Real_name
            FROM user_perm_rel upr 
              JOIN users u ON u.ID=upr.userID
              WHERE upr.permId=:PID",
            array("PID" => $permissionID),
            "userID"
        );
        return $usersWithPermission;
    }

    /**
     * Gets all the users' permissions based on their roles
     *
     * @param array $roleIDs role set associated with a user
     *
     * @return array associative array ($permissionID=>$permissionName) of
     *               permissions associated with the given permission set
     */
    function getPermissionsFromRoles($roleIDs)
    {
        $roleObject  = new \Role($this->DB);
        $permissions = $this->getPermissions();

        $userPermissions = array();

        foreach ($roleIDs as $roleID) {
            $rolePermissions = $roleObject->getRolePermissionIDs($roleID);
            foreach ($rolePermissions as $permissionID) {
                //if permissions overlap between roles, this will
                //just overwrite data with the same data
                $userPermissions[$permissionID] = $permissions[$permissionID];
            }
        }

        return $userPermissions;
    }


}
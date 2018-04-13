<?php
/**
 * This file contains the Role class.
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
 * The Loris Role class
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Role
{
    /**
     * Stores Database being used
     *
     * @var    $DB Database
     * @access private
     */
    var $DB;

    /**
     * Role constructor.
     *
     * @param Database $Database database
     */
    function __construct($Database)
    {
        $this->DB = $Database;
    }

    /**
     * Gets the list of roles in the database.
     *
     * @return array Associative array in the form $roleID=>$roleName
     */
    function getRoles()
    {

        $roles = $this->DB->pselectColWithIndexKey(
            "SELECT RoleID, Name
         FROM role",
            array(),
            "RoleID"
        );

        return $roles;
    }

    /**
     * Gets the list of role labelss in the database.
     *
     * @return array Associative array in the form $roleID=>$roleLabel
     */
    function getRoleLabels()
    {

        $roles = $this->DB->pselectColWithIndexKey(
            "SELECT RoleID, Label
         FROM role",
            array(),
            "RoleID"
        );

        return $roles;
    }

    /**
     * Checks if the string is a role within the database
     *
     * @param string $roleName the role name to be checked
     *
     * @return boolean
     */
    function isRole($roleName)
    {
        $roles = $this->getRoles();

        if (in_array($roleName, $roles, true)) {
            return true;
        }
        return false;
    }

    /**
     * Gets the ID of a role given its name
     *
     * @param string $roleName the role name for which the ID is needed
     *
     * @throws LorisException if role does not exist
     *
     * @return int
     */
    function getRoleIDFromName($roleName)
    {
        if (!$this->isRole($roleName)) {
            throw new LorisException(
                "Could not retrieve the role ID for role '$roleName'"
            );
        }

        $roleID = $this->DB->pselectOne(
            "SELECT RoleID
         FROM role
         WHERE Name=:RN",
            array("RN" => $roleName)
        );

        return $roleID;
    }

    /**
     * Gets the permissions associated to a role
     *
     * @param int $roleID the role
     *
     * @return array non-associative with values being the permission IDs
     */
    function getRolePermissionIDs($roleID)
    {
        $permissions = $this->DB->pselectCol(
            "SELECT PermissionID
         FROM role_permission_rel
         WHERE RoleID=:RID",
            array("RID" => $roleID)
        );

        return $permissions;
    }

    /**
     * Returns all the users with the role
     *
     * @param int $roleID the role
     *
     * @return array Associative array ($userID=>$RealName) that have the role
     */
    function getRoleUsers($roleID)
    {
        $usersWithRole = $this->DB->pselectColWithIndexKey(
            "SELECT urr.UserID, u.Real_name
            FROM user_role_rel urr 
              JOIN users u ON u.ID=urr.UserID
              WHERE urr.RoleID=:RID",
            array("RID" => $roleID),
            "UserID"
        );
        return $usersWithRole;
    }

    /**
     * Checks if a given role contains a given permission
     *
     * @param int $roleID       the ID of the role
     * @param int $permissionID the ID of the permission
     *
     * @return boolean
     */
    function hasPermission($roleID, $permissionID)
    {
        $rolePermissionIDs = $this->getRolePermissionIDs($roleID);

        if (in_array($permissionID, $rolePermissionIDs, true)) {
            return true;
        }
        return false;
    }

    /**
     * Gets all the users' roles based on their permissions
     *
     * @param array $permissionIDs Permission set
     *
     * @return array associative array ($roleID=>$roleName) of roles associated
     *               with the given permission set
     */
    function getRolesFromPermissions($permissionIDs)
    {
        $roles     = $this->getRoles();
        $userRoles = array();

        foreach ($roles as $roleID=>$roleName) {
            $rolePermissionIDs = $this->getRolePermissionIDs($roleID);
            if (!array_diff($rolePermissionIDs, $permissionIDs)) {
                $userRoles[$roleID] = $roleName;
            }
        }

        return $userRoles;
    }

}
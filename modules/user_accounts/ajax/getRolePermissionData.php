<?php
/**
 * Fetch data to populate the roles & permissions
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  User_Accounts
 * @author   Tara Campbell <tara.campbell@mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

// Check that the user has permission to access user_accounts
$user = User::singleton();
if (!$user->hasPermission('user_accounts')) {
    header("HTTP/1.1 403 Forbidden");
    exit();
}

$data = array(
         'roles'       => getRoles(),
         'permissions' => getPermissions(),
        );

echo json_encode($data);
exit();

/**
 * Fetches the roles from the database
 * Each role is set to checked is the user being edited has the role,
 * and enabled if the editing user has the permissions required to grant the role.
 *
 * @return array
 */
function getRoles()
{
    $db          = (\NDB_Factory::singleton())->database();
    $userEditing = \User::singleton();
    $roleObject  = new \Role($db);
    $permissionObject = new \Permission($db);

    $RoleLabels = $roleObject->getRoleLabels();
    $roles      = array();

    if (!empty($RoleLabels)) {
        foreach ($RoleLabels as $RoleID=>$RoleLabel) {
            $role['id']   = (string)$RoleID;
            $role['name'] = $RoleLabel;

            if (!creatingNewUser()) {
                // Determine if checked
                $role['checked'] = userHasRole($role['id']);
            }

            $rolePermissions = $roleObject->getRolePermissionIDs(
                $RoleID
            );
            foreach ($rolePermissions as $permissionID) {
                $info['code']          = $permissionObject->getPermissionNameFromID(
                    $permissionID
                );
                $info['permissionID']  = $permissionID;
                $role['permissions'][] = $info;
            }

            // Determine if the role should be enabled based on editing user
            // permissions
            if (editingSelf()) {
                $role['disabled'] = true;
            } else {
                foreach ($role['permissions'] as $permission) {
                    $enabled = $userEditing->hasPermission(
                        $permission['code']
                    );

                    if (!$enabled) {
                        $role['disabled'] = true;
                        break;
                    }
                }
            }
            $roles[] = $role;
        }
    }

    return $roles;
}

/**
 * Fetches the permissions from the database
 * Each permission is set to checked if the user being edited has that permission,
 * and set to enabled if the editing user has the permission
 *
 * @return array
 */
function getPermissions()
{
    $db = (\NDB_Factory::singleton())->database();
    $permissionObject = new \Permission($db);
    $permissionLabels = $permissionObject->getPermissionLabels();

    $permissions = array();

    if (!creatingNewUser()) {
        $userEditing = \User::singleton();
        $userToEdit  = \User::factory($_REQUEST['identifier']);

        foreach ($permissionLabels as $permissionID=>$permissionLabel) {
            $permission['id']   = (string)$permissionID;
            $permission['name'] = $permissionLabel;
            $permission['code'] = $permissionObject->getPermissionNameFromID(
                $permissionID
            );

            $permission['checked'] = $userToEdit->hasPermission(
                $permission['code'],
                true
            );
            if (editingSelf()) {
                $permission['disabled'] = true;
            } else {
                $permission['disabled']
                    = !$userEditing->hasPermission(
                        $permission['code']
                    );
            }
            $permissions[] = $permission;
        }
    }
    return $permissions;
}

/**
 * Checks if the user being edited has a given role
 *
 * @param int $roleID The role to be checked
 *
 * @note should be moved to user class once user model if improved
 *
 * @return boolean
 */
function userHasRole($roleID)
{
    $DB = \Database::singleton();

    $role = $DB->pselectOne(
        "SELECT urr.RoleID
         FROM user_role_rel urr
         LEFT JOIN users u ON u.ID=urr.UserID
         WHERE u.userID=:UID AND urr.RoleID=:RID",
        array(
         'UID' => $_REQUEST['identifier'],
         'RID' => $roleID,
        )
    );

    if ($role) {
        return true;
    }
    return false;
}

/**
 * Gets all the permissions associated with a role
 *
 * @param int $roleID The role to be checked
 *
 * @return array
 */
function getRolePermissions($roleID)
{
    $DB = \Database::singleton();

    $permissions = $DB->pselect(
        "SELECT rpr.PermissionID, p.code
         FROM role_permission_rel rpr
         LEFT JOIN permissions p ON p.permID=rpr.PermissionID
         WHERE rpr.RoleID=:RID",
        array('RID' => $roleID)
    );

    return $permissions;
}

/**
 * Checks if the user is editing their own permissions
 *
 * @return boolean
 */
function editingSelf()
{
    $userEditingID = \User::singleton()->getUsername();
    $userToEditID  = $_REQUEST['identifier'];

    if ($userEditingID == $userToEditID) {
        return true;
    } else {
        return false;
    }
}

/**
 * Checks is a new user is being created
 *
 * @return boolean
 */
function creatingNewUser()
{
    if ($_REQUEST['identifier'] == '') {
        return true;
    } else {
        return false;
    }
}
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
    $DB          = Database::singleton();
    $userEditing = User::singleton();

    $roles = $DB->pselect(
        "SELECT id, label as name
         FROM permission_categories",
        array()
    );

    if (!empty($roles)) {
        foreach ($roles as &$role) {

            if (!creatingNewUser()) {
                // Determine if checked
                $role['checked'] = userHasRole($role['id']);
            }

            // Get permissions associated with role
            $role['permissions'] = getRolePermissions($role['id']);

            // Determine if the role should be enabled based on editing user
            // permissions
            if (editingSelf()) {
                $role['disabled'] = true;
            } else {
                foreach ($role['permissions'] as &$permission) {
                    $enabled = $userEditing->hasPermission($permission['code']);

                    if (!$enabled) {
                        $role['disabled'] = true;
                        break;
                    }
                }
            }
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
    $DB = Database::singleton();

    $permissions = $DB->pselect(
        "SELECT permID as id, code, description as name
         FROM permissions",
        array()
    );

    if (!creatingNewUser()) {
        $userEditing = User::singleton();
        $userToEdit  = User::factory($_REQUEST['identifier']);

        foreach ($permissions as &$permission) {
            $permission['checked'] = $userToEdit->hasPermission(
                $permission['code'],
                true
            );
            if (editingSelf()) {
                $permission['disabled'] = true;
            } else {
                $permission['disabled']
                    = !$userEditing->hasPermission($permission['code']);
            }
        }
    }

    return $permissions;
}

/**
 * Checks if the user being edited has a given role
 *
 * @param int $roleID The role to be checked
 *
 * @return boolean
 */
function userHasRole($roleID)
{
    $DB = Database::singleton();

    $role = $DB->pselectOne(
        "SELECT upc.permission_category_id
         FROM users_permission_categories_rel upc
         LEFT JOIN users u ON u.ID=upc.user_id
         WHERE u.UserID=:UID AND upc.permission_category_id=:RID",
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
    $DB = Database::singleton();

    $permissions = $DB->pselect(
        "SELECT pc.permission_id as permissionID, p.code
         FROM permission_categories_permissions_rel pc
         LEFT JOIN permissions p ON p.permID=pc.permission_id
         WHERE pc.permission_category_id=:RID",
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
    $userEditingID = User::singleton()->getUsername();
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
?>
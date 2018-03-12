<?php
/**
 * Script to add or remove permissions from a role
 *
 * PHP Version 5-7
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";

$roleObject       = new \Role($DB);
$permissionObject = new \Permission($DB);
$userObject       = new \User();

$roles       = $roleObject->getRoles();
$permissions = $permissionObject->getPermissions();

//##################################################################################
//
// PARSING ARGUMENTS
//
//##################################################################################
// User did not provide any args
if (count($argv) === 1) {
    syntaxIncorrect();
    exit(1);
}

if (count($argv) === 2 && isset($argv[1])) {
    switch ($argv[1]) {
        case "roles":
            // User asking for the list of roles
            if (!empty($roles)) {
                echo "The roles in the database are:\n\n";
                prettyPrint($roles);
            }
            else {
                echo "There are currently no roles in the database.\n";
            }
            exit(2);
        case "permissions":
            // User asking for the list of permissions

            echo "The permissions in the database are:\n\n";
            prettyPrint($permissions);
            exit(3);
        case "rebuildRoles":
            // User asking to reassign roles based on the user permissions
            rebuildRoles();
            exit(4);
        case "rebuildPermissions":
            // User asking to reassign permissions based on the user roles
            rebuildPermissions();
            exit(5);

        default:
            if (!$roleObject->isRole($argv[1])) {
                // Arg syntax not correct
                echo "\nThis option is unavailable !\n\n";
                syntaxIncorrect();
                exit(1);
            } else {
                $role = $argv[1];
                // User asking for the permissions associated with a role
                echo "The permissions for the $role role are:\n\n";
                prettyPrint(
                    $permissionObject->getPermissionsFromRoles(
                        array($roleObject->getRoleIDFromName($role))
                    )
                );
                exit(7);
            }
    }
}

if ((count($argv) === 4 || (count($argv) === 5) && $argv[4] === 'updateExisting')) {
    $role       = $argv[1];
    $permission = $argv[3];
    $update     = (isset($argv[4]) && $argv[4] === 'updateExisting') ? true : false;
    switch ($argv[2]) {
        case "add":
            // User looking to add a permission to a role
            if ($permissionObject->isPermission($permission)
                && $roleObject->isRole($role)
            ) {
                addPermission($role, $permission, $update);
                exit(8);
            }
            else {
                echo "$permission or $role is not a valid option.\n";
                exit(9);
            }
        case "remove":
            // User looking to remove a permission from a role
            if ($permissionObject->isPermission($permission)
                && $roleObject->isRole($role)
            ) {
                removePermission($role, $permission, $update);
                exit(11);
            } else {
                echo "$permission or $role is not a valid option.\n";
                exit(12);
            }
        default:
            // Arg syntax not correct
            echo "\nThis option is unavailable !\n\n";
            syntaxIncorrect();
            exit(1);
    }
}

syntaxIncorrect();
exit(1);

//##################################################################################
//
// MAIN FUNCTIONS
//
//##################################################################################

/**
 * Prints a message to users with the argument instructions
 *
 * @return void
 */
function syntaxIncorrect()
{
    echo "You have not used the correct argument syntax for this script.

To see the roles in the database:                               php role_permission_configurator.php roles
To see the permissions in the database:                         php role_permission_configurator.php permissions
To see the permissions for a role:                              php role_permission_configurator.php \$role
To add a permission to the role:                                php role_permission_configurator.php \$role add \$perm [updateExisting]
-> The updateExisting option adds the permission to 
   users currently in the specified role
To remove a permission from the role:                           php role_permission_configurator.php \$role remove \$perm [updateExisting]
-> The updateExisting option removes the permission 
   from users currently in the specified role
To rebuild the roles for every user based on their permissions: php role_permission_configurator.php rebuildRoles
To rebuild permissions for every user based on their role:      php role_permission_configurator.php rebuildPermissions\n";
}

/**
 * Rebuilds roles based on user permissions. Deletes all roles then checks
 * every user's permissions to give them the appropriate roles.
 *
 * @return void
 */
function rebuildRoles()
{
    global $roleObject;
    $DB = \Database::singleton();

    echo "Rebuilding roles based on user permissions\n";
    echo "Note: This command removes all roles associated with users and\t
    rebuilds them depending on their permissions\n\n";
    // Iterate over each user, update their roles based on their permissions
    foreach (getUsers() as $userID=>$userName) {

        // delete existing roles
        $DB->delete(
            'user_role_rel',
            array('UserID' => $userID)
        );
        // get their permission set
        $userPermissionIDs = getUserPermissionIDs($userID);

        // recalculate their roles
        $newRoles = $roleObject->getRolesFromPermissions($userPermissionIDs);

        if (!empty($newRoles)) {
            echo "Updating roles for $userName\n";
            // update their roles in the database
            foreach ($newRoles as $roleID => $roleName) {
                echo "\tAdding $roleName\n";
                $DB->insert(
                    'user_role_rel',
                    array(
                        'UserID' => $userID,
                        'RoleID' => $roleID,
                    )
                );
            }
            echo "\n";
        }
    }
}

/**
 * Rebuilds permissions based on user roles. Tops up permissions associated with
 * each user by looking at which roles the user is associated with. This function
 * does NOT delete any permissions as some permissions are given
 * independently from roles
 *
 * @return void
 */
function rebuildPermissions()
{
    global $permissionObject;
    $DB = \Database::singleton();

    echo "Updating permissions based on user roles\n";
    echo "Note: This command does not remove any existing user permissions,\t
        it simply adds to them.\n\n";
    // Iterate over each user, update their roles based on their permissions
    foreach (getUsers() as $userID=>$userName) {
        //Avoid deleting current permissions since
        //some permissions might not be associated with roles

        // get user roles
        $roleIDs = getUserRoleIDs($userID);

        // recalculate their roles
        $newPermissions = $permissionObject->getPermissionsFromRoles($roleIDs);

        //unset existing permissions to avoid insert query
        foreach ($newPermissions as $permissionID=>$permissionName) {
            if (userHasPermission($userID, $permissionID)) {
                unset($newPermissions[$permissionID]);
            }
        }

        if (!empty($newPermissions)) {
            echo "Updating permissions for $userName\n";
            foreach ($newPermissions as $permissionID=>$permissionName) {
                if (!userHasPermission($userID, $permissionID)) {
                    echo "\tAdding $permissionName\n";
                    $DB->insert(
                        'user_perm_rel',
                        array(
                            'userID' => $userID,
                            'permID' => $permissionID,
                        )
                    );
                }
            }
            echo "\n";
        }
    }
}

/**
 * Adds a permission to a role. Updates users with that role to either obtain
 * the new permission or loose the role depending on the $update parameter
 *
 * @param string $role       the name of the role
 * @param string $permission the name of the permission
 * @param bool   $update     if true, adds permission to users with current role.
 *                           if false, removes the role from the user
 *
 * @return void
 */
function addPermission($role, $permission, $update)
{
    global $permissionObject;
    global $roleObject;
    $DB = \Database::singleton();

    echo "Adding the $permission permission to the $role role...\n\n";

    $roleID       = $roleObject->getRoleIDFromName($role);
    $permissionID = $permissionObject->getPermissionID($permission);

    // Check is it has that permission already
    if ($roleObject->hasPermission($roleID, $permissionID)) {
        echo "The $role role already has the $permission permission." .
            "No changes to be made.\n";
        exit();
    }

    // Insert the permission into permission role rel table
    $DB->insert(
        'role_permission_rel',
        array(
            'RoleID'       => $roleID,
            'PermissionID' => $permissionID,
        )
    );

    echo "\n$permission was added to the $role category.\n\n";

    // Update the permissions for the user with the role
    echo "Updating the users with the $role role...\n\n";

    //Check if users who already have this role need to be given that permission
    if ($update) {
        //If YES, rebuild the permissions to add the
        //new permission to all users currently with this role
        rebuildPermissions();
    } else {
        //If NO, rebuild the roles to remove the role from users who
        //do not already have the permission
        rebuildRoles();
    }
}

/**
 * Removes a permission from a role. Updates users with that role to either lose
 * the permission that was removed or keep it. In either case, some users might
 * gain the affected role given that the minimum required permissions
 * have been reduced
 *
 * @param string $role       the name of the role
 * @param string $permission the name of the permission
 * @param bool   $update     if true, removes permission from users with this role.
 *                           if false, leaves permission for users with this role
 *
 * @return void
 */
function removePermission($role, $permission, $update)
{
    global $permissionObject;
    global $roleObject;
    $DB = \Database::singleton();

    echo "Removing the $permission permission from the $role role...\n\n";

    $roleID       = $roleObject->getRoleIDFromName($role);
    $permissionID = $permissionObject->getPermissionID($permission);

    // Check is it has that permission already
    if (!$roleObject->hasPermission($roleID, $permissionID)) {
        echo "The $role role does not contain the $permission permission." .
            " No changes to be made.\n";
        exit();
    }

    // Delete the role from the role permission rel table
    $DB->delete(
        'role_permission_rel',
        array(
            'RoleID'       => $roleID,
            'PermissionID' => $permissionID,
        )
    );

    echo "\n$permission was removed from the $role category.\n";

    // Update the users with that role
    echo "Updating the users with the $role role...\n\n";

    // Check if users who already have this role need to be
    // stripped from that permission
    if ($update) {
        //If YES, manually remove permission from users in the database
        $userIDsWithRole = $roleObject->getRoleUsers($roleID);
        foreach ($userIDsWithRole as $userID=>$userName) {
            //redundant check to avoid database exception
            if (userHasPermission($userID, $permissionID)) {
                $DB->delete(
                    'user_perm_rel',
                    array(
                        'userID' => $userID,
                        'permID' => $permissionID,
                    )
                );
                echo "User $userName lost the $permission permission.\n";
            }
        }

    } else {
        // If NO, nothing to do here because we will need to
        // rebuild the rows in either case below
    }

    // rebuild the roles in case users now meet all the
    // remaining necessary permissions with which the role is associated
    rebuildRoles();
}

//##################################################################################
//
// HELPER FUNCTIONS
//
//##################################################################################

//TODO: Most of these functions should be moved into a
//Model class for user

/**
 * PrettyPrint
 *
 * Prints an array without the array keys
 *
 * @param array $array the array to be printed
 *
 * @return void
 */
function prettyPrint($array)
{
    foreach ($array as $child) {
        echo "$child\n";
    }
}
/**
 * Gets all the users in the database
 *
 * @return array Associative array ($userID=>$Real_name)
 */
function getUsers()
{
    $DB = \Database::singleton();

    $users = $DB->pselectColWithIndexKey(
        "SELECT ID, Real_name
         FROM users",
        array(),
        "ID"
    );

    return $users;
}

/**
 * Gets the permission IDs associated to a user
 *
 * @param int $userID the user ID
 *
 * @return array non-associative array of IDs
 */
function getUserPermissionIDs($userID)
{
    $DB = \Database::singleton();

    $userPermissions = $DB->pselectCol(
        "SELECT permID
         FROM user_perm_rel
         WHERE userID=:UID",
        array('UID' => $userID)
    );

    return $userPermissions;
}

/**
 * Gets the role IDs associated to a user
 *
 * @param int $userID the UserID
 *
 * @return array non-associative array of IDs
 */
function getUserRoleIDs($userID)
{
    $DB = \Database::singleton();

    $userRoles = $DB->pselectCol(
        "SELECT RoleID
         FROM user_role_rel
         WHERE UserID=:UID",
        array('UID' => $userID)
    );

    return $userRoles;
}

/**
 * Checks if a given user has a given role
 *
 * @param int $userID the user ID
 * @param int $roleID the role ID
 *
 * @return boolean
 */
function userHasRole($userID, $roleID)
{
    $DB = \Database::singleton();

    $result = $DB->pselectOne(
        "SELECT RoleID
         FROM user_role_rel 
         WHERE UserID=:UID AND RoleID=:RID",
        array(
            'UID' => $userID,
            'RID' => $roleID,
        )
    );

    if (empty($result)) {
        return false;
    }
    return true;
}

/**
 * Checks if a given user has a given permission
 *
 * @param int $userID       the user ID
 * @param int $permissionID the permission ID
 *
 * @return boolean
 */
function userhasPermission($userID, $permissionID)
{
    $DB = \Database::singleton();

    $result = $DB->pselectOne(
        "SELECT userID
         FROM user_perm_rel upr
         WHERE userID=:UID AND permID=:PID",
        array(
            'UID' => $userID,
            'PID' => $permissionID,
        )
    );

    if (empty($result)) {
        return false;
    }
    return true;
}
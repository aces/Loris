#!/usr/bin/php
<?php declare(strict_types=1);
/**
 * This script gets anomalies (i.e. missing user-permission entries) for each
 * role. It compares the expected permissions a user should have with a given
 * role (in 'role-permission-rel' table), and sees if it is actually the case
 * for each user (in 'user-perm-rel' table).
 * Then, if confirmed, the script insert missing permissions in 'user-perm-rel'
 * table.
 *
 * NOTE: the user should have AT LEAST the permissions listed by each role.
 *
 * TODO: add floating permissions (granted outside the scope of any role) and
 * repeated permissions (applied by multiple roles) checkings. For now, we only
 * check if each user has all permissions granted by their roles.
 *
 * PHP Version 8
 *
 * @category Tools
 * @package  Loris
 * @author   Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "generic_includes.php";

// confirm arg
$confirm = (isset($argv[1]) && $argv[1] === "confirm");

// test if module is accessible
$hasRolesManagerModule = $lorisInstance->hasModule('roles_manager');
if (!$hasRolesManagerModule) {
    error_log("Module 'roles_manager' does not exist or is not active.");
    exit(-1);
}

// this script checks if tuples user-role-permissions are wrong.
// It checks all permission (to be added/removed) for each role-users.

$anomalies = [];

/**
 * Add a list of command to print then execute if confirmed.
 */
function addCommands(&$anomalies_table, $table, $type, $cmds = []) {
    // checks
    $valid_tables = [
        'user_role_rel',
        'user_perm_rel',
        'role_permission_rel'
    ];
    $valid_types = [
        'insert',
        'delete'
    ];
    if (!in_array($table, $valid_tables, true)) {
        throw new LorisException('Not a valid table: ' . $table);
    }
    if (!in_array($type, $valid_types, true)) {
        throw new LorisException('Not a valid type: ' . $type);
    }
    if (empty($cmds)) {
        return;
    }

    // add sub tables
    if (!isset($anomalies_table[$table])) {
        $anomalies_table[$table] = [];
    }
    if (!isset($anomalies_table[$table][$type])) {
        $anomalies_table[$table][$type] = [];
    }

    //
    $aCmds = $anomalies_table[$table][$type];
    if (!empty($aCmds)) {
        // not already in list
        $cmdsToAdd = [];
        $keys = array_keys($aCmds[0]);
        foreach ($cmds as $cmd) {
            $add = true;
            foreach ($aCmds as $aCmd) {
                if ($cmd[$keys[0]] === $aCmd[$keys[0]]
                    && $cmd[$keys[1]] === $aCmd[$keys[1]]
                ) {
                    $add = false;
                    break;
                }
            }
            if ($add) {
                $cmdsToAdd[] = $cmd;
            }
        }
    } else {
        $cmdsToAdd = $cmds;
    }

    // add selected cmds
    $anomalies_table[$table][$type] = array_merge(
        $anomalies_table[$table][$type],
        $cmdsToAdd
    );
}

/**
 * Prints anomalies commands.
 *
 * @param array $anomalies_table a structure of anomalies commands.
 */
function printCommands(&$anomalies_table) {
    echo "\n - List of SQL to be executed:\n";
    if (empty($anomalies_table)) {
        echo "    -> nothing.\n";
    }
    foreach ($anomalies_table as $table => $type_val) {
        foreach ($type_val as $type => $cmds) {
            echo "\n";
            foreach ($cmds as $cmd) {
                $keys = array_keys($cmd);
                echo "   " . $type . ($type === 'insert' ? " into ":" from ")
                    . $table . " where "
                    . $keys[0] . " = " . $cmd[$keys[0]]
                    . " and "
                    . $keys[1] . " = " . $cmd[$keys[1]]
                    . "\n";
            }
        }
    }
    echo "\n";
}

/**
 * Prints anomalies commands.
 *
 * @param array     $anomalies_table a structure of anomalies commands.
 * @param bool      $confirm         true to confirm changes, else false.
 * @param \Database $name            a db object.
 */
function executeCommands(&$anomalies_table, $confirm, $db) {
    if (!$confirm) {
        return;
    }
    echo "\n";
    foreach ($anomalies_table as $table => $type_val) {
        foreach ($type_val as $type => $cmds) {
            foreach ($cmds as $cmd) {
                $keys = array_keys($cmd);
                echo "   " . $type . ($type === 'insert' ? " into ":" from ")
                    . $table . " where "
                    . $keys[0] . " = " . $cmd[$keys[0]]
                    . " and "
                    . $keys[1] . " = " . $cmd[$keys[1]]
                    . "... ";

                // delete
                if ($type === 'delete') {
                    $db->delete($table, $cmd);
                } else {
                    // insert
                    $db->insert($table, $cmd);
                }
                echo "done.\n";
            }
        }
    }
    echo "\n";
}

/**
 * Check if the user has that permission by excluding a role from its roles.
 * Basically, checking if the permission is coming from another role.
 * Always returns true when 'superuser' permission is searched to ignore it.
 *
 * @param \User  $user     the user to check.
 * @param string $permCode the permission code to check.
 * @param string $roleCode the role code to exclude from check.
 */
function userHasOtherRolePerm($user, $perm, $roleCode): bool
{
    if ($perm == 'superuser') {
        // do not remove superuser from this script.
        return true;
    }
    $hasPermissionFromOtherRole = false;
    $userRoles = $user->getRoles();
    $roleClean = array_filter($userRoles, fn($r) => $r['Code'] !== $roleCode);
    foreach ($roleClean as $otherRoleValues) {
        $otherRole = Role::factory($otherRoleValues['Code']);
        $otherPermissions = $otherRole->getPermissions();
        if (isset($otherPermissions[$perm]) && $otherPermissions[$perm]['roleHasPermission']) {
            // found one, can leave
            $hasPermissionFromOtherRole = true;
            break;
        }
    }
    return $hasPermissionFromOtherRole;
}

// mappings
echo "\n - Loading mappings...\n";

$rolesMap = $DB->pselectColWithIndexKey(
    "SELECT RoleID, Code FROM roles",
    [],
    'RoleID'
);
$permissionsMap = $DB->pselectColWithIndexKey(
    "SELECT permID, code FROM permissions",
    [],
    'permID'
);
$usersMap = $DB->pselectColWithIndexKey(
    "SELECT ID, userID FROM users",
    [],
    'ID'
);

// --------------------------
// Starting with Roles

echo "\n - Checking roles...\n";

// get all roles
$allRoles = Role::getAllRoles();

foreach ($allRoles as $roleValues) {
    // init role
    $role = Role::factory($roleValues['Code']);
    echo "    -> Role: " . $role->getCode() . ",";

    // get all permissions from that role
    $rolePermissions = array_keys(array_filter(
        $role->getPermissions(),
        fn($p) => $p['roleHasPermission']
    ));

    // skip role if no permissions in it
    if (empty($rolePermissions)) {
        echo " no permissions in this role, skip to next role.\n";
        continue;
    }

    // get all active users having that role
    $userIDs = $DB->pselectCol(
        "SELECT u.UserID
        FROM users u
            JOIN user_role_rel urr ON (u.ID = urr.userID)
        WHERE Active = 'Y'
            AND RoleID = :rid",
        [
            'rid' => $role->getId()
        ]
    );

    if (empty($userIDs)) {
        echo " no user with this role, skip to next role.\n";
        continue;
    }

    echo " " . count($userIDs) . " user(s) with this role.\n";

    // iterate on users to check all their permissions
    foreach ($userIDs as $userID) {
        if (is_null($userID)) {
            continue;
        }

        // user object
        $user = User::factory($userID);
        echo "      -> User: [" . $user->getId() . "] "
            . $user->getUsername() . "\n";

        // permissions the user have access to
        $userPermissions = array_keys(array_filter(
            $user->getPermissions(),
            fn($has) => ($has === true)
        ));

        // user has these permissions but they are not in the role.
        // must check if they are covered by another role.
        $notInRolePermissions = array_values(
            array_diff(
                $userPermissions,
                $rolePermissions
            )
        );

        $cmds = array_map(
            fn($p) => [
                'permID' => array_search($p, $permissionsMap, true),
                'userID' => array_search($userID, $usersMap, true)
            ],
            array_filter(
                $notInRolePermissions,
                fn($p) => !userHasOtherRolePerm($user, $p, $role->getCode())
            )
        );
        if (!empty($cmds)) {
            // remove commands
            echo "        -> " . count($cmds)
                . " user-permissions attached to no role.\n";
            addCommands($anomalies, 'user_perm_rel', 'delete', $cmds);
        }

        // user should AT LEAST have all permissions from role
        // else some are missing.
        // role describes permissions but user does not have them.
        // must add these.
        $missingPermissions = array_values(array_diff($rolePermissions, $userPermissions));

        // create commands
        $cmds = array_map(
            fn($p) => [
                'permID' => array_search($p, $permissionsMap, true),
                'userID' => array_search($userID, $usersMap, true)
            ],
            $missingPermissions
        );

        if (!empty($cmds)) {
            // add commands
            echo "        -> " . count($cmds) . " missing user-permissions.\n";
            addCommands($anomalies, 'user_perm_rel', 'insert', $cmds);
        }
    }

}

// print commands
printCommands($anomalies);
if (empty($anomalies)) {
    exit(0);
}

// confirm check
if ($confirm === false) {
    echo " - [dry mode: on] Run this tool again with the argument 'confirm'".
    " to perform the changes\n\n";
    exit(0);
}

// trigger command run
echo " - [dry mode: off] Change will be applied in 3 seconds.\n";
sleep(3);
executeCommands($anomalies, $confirm, $DB);
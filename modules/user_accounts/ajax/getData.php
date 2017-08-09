<?php

$data = array(
         'roles' => getRoles(),
         'permissions' => getPermissions(),
        );

echo json_encode($data);
exit();

function getRoles() {
    $DB          = Database::singleton();
    $userEditing = User::singleton();

    $roles = $DB->pselect(
        "SELECT ID as id, label as name
         FROM permission_categories",
        array()
    );

    if (!empty($roles)) {
        foreach ($roles as &$role) {
            // Determine if checked
            $role['checked'] = userHasRole($role['id']);

            // Get permissions associated with role
            $role['permissions'] = getRolePermissions($role['id']);

            // Determine if the role should be enabled based on editing user permissions
            foreach ($role['permissions'] as &$permission) {
                $enabled = $userEditing->hasPermission($permission['code']);

                if (!$enabled) {
                    $role['disabled'] = true;
                    break;
                }
            }
        }
    }

    return $roles;
}

function getPermissions() {
    $DB = Database::singleton();

    $userToEdit  = User::factory($_REQUEST['identifier']);
    $userEditing = User::singleton();

    $permissions = $DB->pselect(
        "SELECT permID as id, code, description as name
         FROM permissions",
        array()
    );

    foreach ($permissions as &$permission) {
        $permission['checked']  = $userToEdit->hasPermission($permission['code']);
        $permission['disabled'] = !$userEditing->hasPermission($permission['code']);
    }

    return $permissions;
}

function userHasRole($roleID) {
    $DB = Database::singleton();

    $role = $DB->pselectOne(
        "SELECT upc.permission_category_id
         FROM users_permission_categories_rel upc
         LEFT JOIN users u ON u.ID=upc.user_id
         WHERE u.UserID=:UID AND upc.permission_category_id=:RID",
        array('UID' => $_REQUEST['identifier'], 'RID' => $roleID)
    );

    if ($role) {
        return true;
    }
    return false;
}

function getRolePermissions($roleID) {
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
?>
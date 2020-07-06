#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * This script should be run during the upgrade process from LORIS versions
 * 23.x and 24.0.
 *
 * LORIS 24.0 introduced 3 new permissions:
 *      - survey_accounts_view
 *      - imaging_quality_control_view
 *      - behavioural_quality_control_view
 *
 * These permissions are used in place of less precise permission codes that
 * were used to grant access to LORIS modules.
 * Applying this patch will allow users who had access to specific modules using
 * the old permission codes to maintian their access after the upgrade process.
 */
require_once __DIR__ . "/../../vendor/autoload.php";
require_once '../generic_includes.php';

$userQuery = "SELECT u.UserID 
FROM users u 
JOIN user_perm_rel upr 
ON u.ID = upr.UserID 
JOIN permissions p 
ON upr.permID = p.permID 
WHERE p.code=:code";

$newPermissions = [
    'survey_accounts_view',
    'imaging_quality_control_view',
    'behavioural_quality_control_view'
];

foreach ($newPermissions as $permission) {
    $users         = [];
    $oldPermission = '';
    switch ($permission) {
    case 'survey_accounts_view':
        $oldPermission = 'user_accounts';
        break;
    case 'imaging_quality_control_view':
    case 'behavioural_quality_control_view':
        $oldPermission = 'quality_control';
        break;
    }
    $users = $DB->pselectCol($userQuery, ['code' => $oldPermission]);
    grantNewCodeToUsers($permission, $users);
}

/**
 * Give the supplied permission code to a list of users.
 *
 * @param string   $code  The new permission code
 * @param string[] $users A list of users (UserID column from users table)
 *
 * @return void
 */
function grantNewCodeToUsers(string $code, array $users): void
{
    foreach ($users as $user) {
        global $DB;
        $permID = $DB->pselectOne(
            'SELECT permID FROM permissions WHERE code=":code"',
            ['code' => $code]
        );
        $uid    = $DB->pselectOne(
            'SELECT ID FROM users WHERE UserID=":user"',
            ['user' => $user]
        );
        echo "Granting permission `$code` to user `$user`\n";
        $DB->insert('user_perm_rel', ['userID' => $uid, 'permID' => $permID]);
    }
}

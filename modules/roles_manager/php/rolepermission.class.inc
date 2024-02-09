<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * role in the role manager menu table.
 *
 * PHP Version 8
 *
 * @package    Main
 * @subpackage Roles_Manager
 * @author     Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\roles_manager;
use LORIS\LorisInstance;

/**
 * A Role represents a row in the Roles Manager menu table.
 *
 * @package    Main
 * @subpackage Roles_Manager
 * @author     Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class RolePermission implements \LORIS\Data\DataInstance
{
    public $row;
    private \LORIS\LorisInstance $loris;

    /**
     * Create a new Test Instance.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     * @param array                $row   The row (in the same format as
                                          \Database::pselectRow returns)
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        array $row
    ) {
        $this->row   = $row;
        $this->loris = $loris;

        // list of permissions
        if (!isset($this->row['permissions'])) {
            $this->row['permissions'] = $this->getPermissions();
        }

        // number of users assigned to that role
        if (!isset($this->row['nbUsers'])) {
            $this->row['nbUsers'] = $this->getNbUsers();
        }
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return $this->row;
    }

    /**
     * Convert data from Role Instance to a format suitable for SQL.
     * Useful when writing data during Role update or create.
     *
     * @return array
     */
    public function toSQL() : array
    {
        error_log('Before Role DB update: ' . print_r($this->row, true));
        error_log('Extracting SQL: role.');
        return [
            'RoleID'      => $this->row['RoleID']      ?? null,
            'Code'        => $this->row['Code']        ?? null,
            'Name'        => $this->row['Name']        ?? null,
            'Description' => $this->row['Description'] ?? null,
            // Permissions are managed separately
            // see: toSQLPermissions() function.
        ];
    }

    /**
     * Convert data from permissions in the Role Instance to SQL format.
     * Useful when writing data during Role update or create.
     *
     * @return array
     */
    public function toSQLPermissions() : array
    {
        error_log('Extracting SQL: permissions.');
        // only select if role has permission
        $filteredPermissions = array_filter(
            $this->row['permissions'],
            fn($v) => $v['hasPermission']
        );
        // get only required elements
        $permissions = array_map(
            fn($v) => [
                'permID' => $v['permissionID'],
                'RoleID' => $this->row['RoleID']
            ],
            $filteredPermissions
        );
        return $permissions;
    }

    /**
     * Useful during new Role creation.
     * Generate the corresponding role code from a given role name.
     *
     * @param string $name a role name
     *
     * @return string a code version of the name
     */
    public static function generateCodeFromName(string $name)
    {
        // trim and lower
        $code = strtolower(trim($name));
        // remove html tags
        $code = strip_tags($code);
        // replace /r/n and all 2+spaces (double negation) by single space
        $code = preg_replace('/[^\S\r\n]+/', ' ', $code);
        // replace spaces by underscores
        $code = str_replace(" ", "_", $code);
        // only strict alphanumeric and underscore
        $code = preg_replace("/[^a-zA-Z0-9_$]+/", "", $code);
        return $code;
    }

    // ---------------------------------------------------

    /**
     * Returns if the current role has the permission code.
     *
     * @param string $permissionCode a permission code.
     *
     * @return bool true if it has, else false.
     */
    public function hasPermission(string $permissionCode): bool
    {
        $permissions = $this->getPermissions();
        if (empty($permissionCode) || empty($permissions)) {
            return false;
        }
        //
        $permissionCodes = array_map(
            fn($v) => $v['permissionCode'],
            array_filter(
                $permissions,
                fn($v) => $v['hasPermission']
            )
        );
        return in_array($permissionCode, $permissionCodes, true);
    }

    /**
     * Get this role permissions values from DB.
     *
     * Values are formatted as follow:
     * - permissionCode: permission code,
     * - permissionDescription: permission description,
     * - permissionAction: linked actions,
     * - moduleName: module name,
     * - hasPermission: true if the current role has the permission, else false.
     *
     * @return array an array of permissions values.
     */
    public function getPermissions(): array
    {
        $db = $this->loris->getDatabaseConnection();

        // all permission
        $allPermissions = RolePermission::getAllPermissions($this->loris);

        // all of this role permissions
        $query = "SELECT
                p.code AS permissionCode,
                p.Description AS permissionDescription,
                p.action AS permissionAction,
                m.Name AS moduleName
            FROM permissions p
                LEFT JOIN role_permission_rel rpr ON (p.permID = rpr.permID)
                LEFT JOIN roles r ON (r.RoleID = rpr.RoleID)
                JOIN modules m ON (p.moduleID = m.ID)
            WHERE r.RoleID = :rid
                AND p.code <> 'superuser'";

        // query
        $res = $db->pselect(
            $query,
            ['rid' => $this->row['RoleID']]
        );

        // add a new indication if the role has the permission or not.
        $permissions = [];
        $pCodes      = array_map(fn($v) => $v['permissionCode'], $res);
        foreach ($allPermissions as $p) {
            $newPermission = $p;
            $newPermission['hasPermission'] = (
                array_search($p['permissionCode'], $pCodes, true) !== false
            );
            $permissions[] = $newPermission;
        }

        return $permissions;
    }

    /**
     * Update this role permissions in DB.
     * Change the DB values based on those in $this->row['permissions'].
     *
     * @return void
     */
    public function updateRolePermissions(): void
    {
        $db = $this->loris->getDatabaseConnection();
        error_log(" ====== UPDATEING PERMISSIONS FOR ROLE: " . $this->row['RoleID']);
        // remove existing permissions
        $db->delete(
            'role_permission_rel',
            ['RoleID' => $this->row['RoleID']]
        );
        // add selected ones
        foreach ($this->toSQLPermissions() as $rolePermissionSLQInsert) {
            $db->insertOnDuplicateUpdate(
                'role_permission_rel',
                $rolePermissionSLQInsert
            );
        }
    }

    /**
     * Get all users taht have access to the current role.
     *
     * @return array<\User> an array of User objects.
     */
    public function getRoleUsers(): array
    {
        $db      = $this->loris->getDatabaseConnection();
        $userIDs = $db->pselectCol(
            "SELECT u.UserID
            FROM users u
                JOIN user_role_rel rur ON (u.ID = rur.userID)
            WHERE rur.RoleID = :rid",
            ['rid' => $this->row['RoleID']]
        );
        // array of User objects
        $users = [];
        foreach ($userIDs as $userID) {
            $users[] = \User::factory($userID);
        }
        return $users;
    }

    /**
     * Get a permission ID (permID) based on a permission code.
     *
     * @param string $code a permission code.
     *
     * @return ?string a permission ID (permID) if found, else null
     */
    private function _getPermissionIDFromCode(string $code): ?string
    {
        if (empty($code)) {
            return null;
        }
        $db = $this->loris->getDatabaseConnection();
        return $db->pselectOne(
            "SELECT permID
            FROM permissions
            WHERE code = :pcode",
            ['pcode' => $code]
        );
    }

    /**
     * Revoke a permission from a user.
     *
     * @param \User  $user a LORIS user.
     * @param string $code a permission code to revoke.
     *
     * @return void
     */
    private function _revokeUserPermission(\User $user, string $code): void
    {

        // all other user roles
        $otherRoles = array_filter(
            $user->getRoles(),
            fn($v) => $v['Code'] != $this->row['Code']
        );

        error_log('   - considering permission: ' . $code);

        $hasPermission = $user->hasPermission($code);
        error_log(
            '    - has permission "' . $code . '": '
            . (($hasPermission) ? 'yes' : 'no')
        );

        // not permission to revoke
        if (!$hasPermission) {
            error_log('    - skipping');
            return;
        }

        // does this user has other roles with that same permission?
        if (empty($otherRoles)) {
            // no other role, can be revoked
            error_log('    - no other role, can revoke');
            error_log('   - REVOKE: ' . $code);
            $permID = $this->_getPermissionIDFromCode($code);
            if (!is_null($permID)) {
                $user->removePermissions([$permID]);
            }

        } else {
            // other role, need to check the roles
            // if at least one role has the same permission, leave it.
            // if no other role has that permission, revoke it.
            error_log('    - other roles, checking...');
            $found = false;
            foreach ($otherRoles as $otherRoleValues) {
                $otherRole = new RolePermission($this->loris, $otherRoleValues);
                if ($otherRole->hasPermission($code)) {
                    $found = true;
                    break;
                }
            }
            // no found = revoke
            if (!$found) {
                error_log('    - not found, revoke');
                error_log('   - REVOKE: ' . $code);
                $permID = $this->_getPermissionIDFromCode($code);
                if (!is_null($permID)) {
                    $user->removePermissions([$permID]);
                }
            } else {
                error_log('    - found, leave it');
            }
        }
    }

    /**
     * Grant a permission to a user.
     *
     * @param \User  $user a LORIS user.
     * @param string $code a permission code to grant.
     *
     * @return void
     */
    private function _grantUserPermission(\User $user, string $code): void
    {
        error_log('   - considering permission: ' . $code);
        $hasPermission = $user->hasPermission($code);
        error_log(
            '    - already has permission "' . $code . '": '
            . (($hasPermission) ? 'yes' : 'no')
        );

        // Already has permission, then skip.
        // If the user already has that permission, it could be from another
        // role or a floating permission (permission not attached to a role).
        // Anyway, we do not need to add it again.
        if ($hasPermission) {
            error_log('    - skipping');
            return;
        }

        // else grant it
        $permID = $this->_getPermissionIDFromCode($code);
        if (!is_null($permID)) {
            $user->addPermissions([$permID]);
        }
    }

    /**
     * Update all permissions for users that have access to this role.
     * This method will try to revoke first, then grant permissions.
     *
     * @param array<string> $toGrant  an array of permission codes to grant.
     * @param array<string> $toRevoke an array of permission codes to revoke.
     *
     * @return void
     */
    public function updateUserPermissions(array $toGrant, array $toRevoke): void
    {
        error_log(" ======================= Updating user permissions...");

        // if no user for this role, skip.
        if (!isset($this->row['nbUsers']) || $this->row['nbUsers'] == 0) {
            error_log('No user in this role. Skipping.');
            return;
        }

        // if no change to register, skip.
        if (empty($toGrant) && empty($toRevoke)) {
            error_log('No change to apply. Skipping.');
            return;
        }

        //
        $users = $this->getRoleUsers();
        foreach ($users as $user) {
            error_log(' -> ' . $user->getId() . ' : ' . $user->getUsername());

            // try revoking
            if (!empty($toRevoke)) {
                error_log('  -> trying to revoke permissions...');
                foreach ($toRevoke as $pCodeToRevoke) {
                    $this->_revokeUserPermission($user, $pCodeToRevoke);
                }
            }

            // try granting
            if (!empty($toGrant)) {
                error_log('  -> trying to grant permissions...');
                foreach ($toGrant as $pCodeToGrant) {
                    $this->_grantUserPermission($user, $pCodeToGrant);
                }
            }
        }
    }


    /**
     * Get the number of users with that role.
     *
     * @return int the number of users with that role.
     */
    public function getNbUsers(): int
    {
        $db      = $this->loris->getDatabaseConnection();
        $nbUsers = $db->pselectOne(
            "SELECT COUNT(*) FROM user_role_rel WHERE RoleID = :rid",
            ['rid' => $this->row['RoleID']]
        );
        return intval($nbUsers);
    }

    /**
     * Returns if the current role object has an ID.
     * New roles just inserted in DB do not have ID yet.
     *
     * @return bool
     */
    public function hasId(): bool
    {
        return array_key_exists('RoleID', $this->row)
            && !is_null($this->row['RoleID']);
    }

    /**
     * For the current role, check if any missing relations exists.
     * This could happen e.g. if a role is added to a user, but permissions are
     * not updated.
     * Mainly useful when checking role-permission-user relations.
     *
     * @return array an array of anomalies, meaning missing relations to insert.
     */
    public function evaluate(): array
    {
        $db = $this->loris->getDatabaseConnection();

        // anmalies to process
        $anomalies = [];

        // ---- build data dict

        // users that were granted this role
        $userIDs = $db->pselectCol(
            "SELECT u.ID
            FROM users u
                JOIN user_role_rel rur ON (u.ID = rur.userID)
            WHERE rur.RoleID = :rid",
            [':rid' => $this->row['RoleID']]
        );

        // expected permissions (i.e. what this role grants)
        $expectedPermIDs = $db->pselectCol(
            "SELECT p.permID
            FROM permissions p
                JOIN role_permission_rel rpr ON (p.permID = rpr.permID)
            WHERE rpr.RoleID = :rid
            ORDER by p.permID",
            [':rid' => $this->row['RoleID']]
        );

        // for each given user, check that it has AT LEAST those listed in the
        // permIDs list. Some can be added as floating permissions outside the
        // scope of a role (in user_account module).

        foreach ($userIDs as $userID) {
            // actual user permissions
            $currentUserPermissions = $db->pselectCol(
                "SELECT permID
                FROM user_perm_rel
                WHERE userID = :uid
                ORDER BY permID",
                [":uid" => $userID]
            );

            // missing permissions that should be added
            $missingPermissions = array_diff(
                $expectedPermIDs,
                $currentUserPermissions
            );

            // add
            foreach ($missingPermissions as $missingPermID) {
                $anomalies[] = [
                    'userID' => $userID,
                    'permID' => $missingPermID
                ];
            }
        }

        return $anomalies;
    }

    /**
     * For all roles, check if any missing relations exists.
     * This could happen e.g. if a role is added to a user, but permissions are
     * not updated.
     * Mainly useful when checking role-permission-user relations.
     *
     * @param LorisInstance $loris a loris instance object
     *
     * @return array an array of anomalies, meaning missing relations to insert.
     */
    public static function evaluateRoles(LorisInstance $loris): array
    {
        $db        = $loris->getDatabaseConnection();
        $anomalies = [];
        $roles     = $db->pselect(
            "SELECT RoleID, Code, Name, Description FROM roles",
            []
        );
        foreach ($roles as $roleRow) {
            $role          = new RolePermission($loris, $roleRow);
            $roleAnomalies = $role->evaluate();
            if (!empty($roleAnomalies)) {
                $anomalies[$role->row['RoleID']] = $roleAnomalies;
            }
        }
        return $anomalies;
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
     * @param LorisInstance $loris as loris instance object.
     *
     * @return array an array of permissions values.
     */
    public static function getAllPermissions(LorisInstance $loris): array
    {
        $db = $loris->getDatabaseConnection();
        return $db->pselect(
            "SELECT
                p.permID AS permissionID,
                p.code AS permissionCode,
                p.Description AS permissionDescription,
                p.action AS permissionAction,
                m.Name AS moduleName
            FROM permissions p
                JOIN modules m ON (p.moduleID = m.ID)
            WHERE p.code <> 'superuser'
            ORDER BY m.Name",
            []
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
     * @param LorisInstance $loris as loris instance object.
     *
     * @return array an array of permissions values.
     */
    public static function getAllRoles(LorisInstance $loris): array
    {
        $db = $loris->getDatabaseConnection();
        return $db->pselect(
            "SELECT RoleID, Code, Name, Description FROM roles",
            []
        );
    }
}

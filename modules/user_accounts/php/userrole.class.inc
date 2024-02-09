<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * role in user accounts.
 *
 * PHP Version 8
 *
 * @package User_Account
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */

namespace LORIS\user_accounts;
use LORIS\LorisInstance;

/**
 * A Role represents a user role.
 *
 * @package User_Account
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */
class UserRole implements \LORIS\Data\DataInstance
{
    private \LORIS\LorisInstance $loris;

    /**
     * A row reprensenting this data.
     *
     * @var array
     */
    public $row;

    /**
     * A user reference.
     *
     * @var \User
     */
    private \User $user;

    /**
     * Create a new Test Instance.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     * @param \User                $user  The user
     * @param array                $row   The row (in the same format as
                                          \Database::pselectRow returns)
     */
    public function __construct(
        \LORIS\LorisInstance $loris,
        \User $user,
        array $row
    ) {
        $this->row   = $row;
        $this->loris = $loris;
        $this->user  = $user;

        if (!isset($this->row['hasRole'])) {
            $this->row['hasRole'] = $user->hasRole($this->row['Code']);
        }

        // list of permissions
        if (!isset($this->row['permissions'])) {
            $this->row['permissions'] = $this->getPermissions();
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
        $allPermissions = UserRole::getAllPermissions($this->loris);

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
}

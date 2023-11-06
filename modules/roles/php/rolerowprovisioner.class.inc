<?php declare(strict_types=1);
 namespace LORIS\roles;

 /**
  * This class implements a data provisioner to get all modules
  * for the Roles menu page.
  *
  * PHP Version 8
  *
  * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  */
class RoleRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a RoleRowProvisioner, which gets modules for the
     * module manager menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT r.Code as code,
                    r.Name as name,
                    r.Description as description,
                    COUNT(p.code) as permissionCount
            FROM roles r
                LEFT JOIN role_permission_rel rp ON (rp.RoleID = r.RoleID)
                LEFT JOIN permissions p ON (p.permID = rp.permID)
            GROUP BY code, name, description
            ORDER BY r.roleID",
            []
        );
    }

    /**
     * Returns an instance of a Role object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new RoleRow($row);
    }
}
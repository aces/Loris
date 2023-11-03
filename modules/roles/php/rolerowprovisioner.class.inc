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
                    r.Description as description
            FROM role r
            ORDER BY r.roleID",
            // "SELECT GROUP_CONCAT(DISTINCT upsr.CenterID) as centerIds,
            //         GROUP_CONCAT(DISTINCT uprr.ProjectID) as projectIds,
            //         u.UserID as username,
            //         u.Real_name as real_name,
            //         u.Email as email,
            //         u.Active as active,
            //         u.Pending_approval as pending,
            //         u.account_request_date as account_request_date
            //  FROM roles r
            //     LEFT JOIN role_perm_rel rpr ON (upsr.UserID=u.ID)
            //     LEFT JOIN users u ON (r.RoleID = u.RoleID)
            //  ORDER BY r.RoleID",
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
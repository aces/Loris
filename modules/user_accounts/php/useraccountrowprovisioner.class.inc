<?php declare(strict_types=1);
 namespace LORIS\user_accounts;

 /**
  * This class implements a data provisioner to get all modules
  * for the User Accounts menu page.
  *
  * PHP Version 7
  *
  * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  */
class UserAccountRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a UserAccountsProvisioner, which gets modules for the
     * module manager menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT GROUP_CONCAT(upr.CenterID) as centerIds,
                    u.UserID as username,
                    u.Real_name as real_name,
                    u.Email as email,
                    u.Active as active,
                    u.Pending_approval as pending
             FROM users u
             LEFT JOIN user_psc_rel upr ON (upr.UserID=u.ID)
             GROUP BY u.ID
             ORDER BY u.UserID",
            array()
        );
    }

     /**
      * Returns an instance of a User object.
      *
      * @param array $row The database row from the LORIS Database class.
      *
      * @return \LORIS\Data\DataInstance An instance representing this row.
      */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new UserAccount($row);
    }
}

<?php
/**
 * This file implements a data provisioner to get all possible roles
 * for the roles menu page.
 *
 * PHP Version 8
 *
 * @package User_Account
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */

namespace LORIS\user_accounts;
use \LORIS\user_accounts\UserRole;

/**
 * This file implements a data provisioner to get all possible roles
 * for the roles menu page.
 *
 * PHP Version 8
 *
 * @package User_Account
 * @author  Regis Ongaro-Carcy <regis.ongaro-carcy@mcin.ca>
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://www.github.com/aces/Loris/
 */
class UserRoleProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    private \LORIS\LorisInstance $loris;

    /**
     * A user reference.
     *
     * @var \User
     */
    private \User $user;

    /**
     * Create a Role instance.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance
     * @param \User                $user  The user
     */
    public function __construct(\LORIS\LorisInstance $loris, \User $user)
    {
        $this->loris = $loris;
        $this->user  = $user;
        parent::__construct(
            "SELECT RoleID, Code, Name, Description FROM roles",
            []
        );
    }

    /**
     * Returns an instance of a Role object for a given table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing a role.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new UserRole($this->loris, $this->user, $row);
    }
}

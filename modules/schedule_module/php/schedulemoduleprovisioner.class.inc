<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all modules
 * for the Module Manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\schedule_module;

/**
 * This class implements a data provisioner to get all modules
 * for the module manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ScheduleModuleProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ModuleManagerProvisioner, which gets modules for the
     * module manager menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT AppointmentID,SessionID,AppointmentTypeID,StartsAt FROM appointment",
            array()
        );
    }

    /**
     * Returns an instance of a ModuleRow object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ModuleRow($row);
    }
}

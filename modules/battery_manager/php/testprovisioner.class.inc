<?php
/**
 * This file implements a data provisioner to get all possible tests
 * for the battery_manager menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\battery_manager;

/**
 * This class implements a data provisioner to get all possible tests
 * for the battery_manager menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class TestProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a Test Instance, which get rows fro mthe test_battery table.
     */
    public function __construct()
    {
        parent::__construct(
            "SELECT b.id,
               t.Test_name as testName,
               b.AgeMinDays as ageMinDays,
               b.AgeMaxDays as ageMaxDays,
               b.Stage as stage,
               s.SubprojectID as subproject,
               b.Visit_label as visitLabel,
               p.CenterID as centerId,
               b.firstVisit,
               b.instr_order as instrumentOrder,
               b.Active as active
        FROM test_battery b
          JOIN test_names t USING (Test_name)
          LEFT JOIN subproject s USING (SubprojectID)
          LEFT JOIN psc p USING (CenterID)
        ORDER BY t.Test_name",
            []
        );
    }

    /**
     * Returns an instance of a Test object for a given table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \JsonSerializable An instance representing a test.
     */
    public function getInstance($row) : \JsonSerializable
    {
        return new Test($row);
    }
}

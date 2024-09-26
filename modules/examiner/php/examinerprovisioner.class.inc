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

namespace LORIS\examiner;

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
class ExaminerProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ModuleManagerProvisioner, which gets modules for the
     * module manager menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT 
                e.full_name as Examiner,
                u.Email,
                GROUP_CONCAT(DISTINCT epr.CenterID) as centerIds,
                e.examinerID as ID,
                e.radiologist as Radiologist,
                GROUP_CONCAT(DISTINCT tn.full_name SEPARATOR ', ') as
                    Certification
                FROM examiners e
                    LEFT JOIN examiners_psc_rel epr ON
                        (epr.examinerID=e.examinerID)
                    LEFT JOIN certification c ON
                        (c.examinerID=e.examinerID and c.pass = 'certified')
                    LEFT JOIN test_names tn ON (tn.ID = c.testID)
                    LEFT JOIN users u ON u.ID=e.userID
                WHERE epr.active='Y'
                GROUP BY e.examinerID
",
            [],
        );
    }

    /**
     * Returns an instance of a HelpRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $cids = [];
        $pids = [];
        if (isset($row['centerIds'])) {
            $cids = array_map(
                function (string $cid) : \CenterID {
                    return \CenterID::singleton(intval($cid));
                },
                explode(',', $row['centerIds'])
            );
        }

        $row['centerIds'] = $cids;
        return new ExaminerRow($row, $cids, $pids);
    }

}

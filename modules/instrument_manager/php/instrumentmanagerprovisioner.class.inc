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
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\instrument_manager;

/**
 * This class implements a data provisioner to get all modules
 * for the module manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class InstrumentManagerProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
     /**
      * Create a ModuleManagerProvisioner, which gets modules for the
      * module manager menu table.
      */
    function __construct()
    {
        parent::__construct(
            "SELECT
            tn.test_name AS Instrument,
            'type' AS Instrument_Type,
            'table' AS Table_Installed,
            'tablevalid' AS Table_Valid,
            'pagevalid' AS Pages_Valid,
            GROUP_CONCAT(DISTINCT p.code) AS Permissions_Required,
            GROUP_CONCAT(
                DISTINCT CASE WHEN tb.DoubleDataEntryEnabled = 1
                THEN tb.Visit_label END
            ) AS DDE_Visits
            FROM 
                test_names tn
            LEFT JOIN 
                testnames_permissions_rel rel ON (rel.TestID = tn.ID)
            LEFT JOIN 
                permissions p ON (rel.permID = p.permID)
            LEFT JOIN 
                test_battery tb ON tn.test_name = tb.test_name
            GROUP BY 
                tn.test_name;
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
            return new InstrumentRow($row);
    }
}

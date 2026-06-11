<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all modules
 * for the Module Manager menu page.
 *
 * PHP Version 8
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
 * PHP Version 8
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
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     */
    function __construct(protected \LORIS\LorisInstance $loris)
    {
        parent::__construct(
            $loris,
            "SELECT
	    tn.test_name as Instrument,
            'type' as Instrument_Type,
            'table' as Table_Installed,
            'tablevalid' as Table_Valid,
            'pagevalid' as Pages_Valid,
            GROUP_CONCAT(p.code) as Permissions_Required
            FROM test_names tn
            LEFT JOIN testnames_permissions_rel rel ON (rel.TestID=tn.ID)
	    LEFT JOIN permissions p ON (rel.permID=p.permID)
            group by Instrument
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

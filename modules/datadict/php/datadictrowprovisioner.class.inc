<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the datadict menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\datadict;

/**
 * This class implements a data provisioner to get all possible rows
 * for the datadict menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class DataDictRowProvisioner extends \LORIS\Data\ProvisionerInstance
{
    /**
     * Create a DataDictRowProvisioner, which gets rows for
     * the datadict menu table.
     */
    function __construct(\LORIS\LorisInstance $loris)
    {
        $this->loris = $loris;
    }

    public function getAllInstances() : \Traversable {
        $modules = $this->loris->getActiveModules();
        $DB = $this->loris->getDatabaseConnection();

        $dict = [];

        $overrides = $DB->pselectWithIndexKey(
            "SELECT Name, Description FROM parameter_type_override",
            [],
            "Name"
        );

        foreach ($modules as $module) {
            $mdict = $module->getDataDictionary($this->loris);
            $dict = array_merge($dict, array_map(function($item) use ($overrides) {
                $name = $item->getCategory()->getName() . '_' . $item->getName();
                $desc = '';
                $status = 'Unchanged';
                if(isset($overrides[$name])) {
                    $desc = $overrides[$name]['Description'];
                    $status = 'Modified';
                } else {
                    $desc = $item->getDescription();
                }

                if ($desc == '') {
                    $status = 'Empty';
                }
                return $this->getInstance(
                    [
                        'source_from' => $item->getCategory()->getName(),
                        'name' => $name,
                        'source_field' => $item->getName(),
                        'description' => $desc,
                        'description_status' => $status,
                    ]
                );
            }, $mdict));
        }
        return new \ArrayIterator($dict);
    }
    /**
     * Returns an instance of a DataDict object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new DataDictRow($row);
    }
}

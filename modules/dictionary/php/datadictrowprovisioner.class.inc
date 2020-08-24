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

namespace LORIS\dictionary;

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
     *
     * @param \LORIS\LorisInstance $loris The Loris instance whose
     *                                    dictionary should be retrieved
     */
    function __construct(\LORIS\LorisInstance $loris, array $items)
    {
        $this->loris = $loris;
        $this->items = $items;
    }

    /**
     * Get all dictionary instances, honouring parameter_type_override
     * if applicable
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $modules = $this->loris->getActiveModules();
        $DB      = $this->loris->getDatabaseConnection();

        $dict = [];

        $overrides = $DB->pselectWithIndexKey(
            "SELECT Name, Description FROM parameter_type_override",
            [],
            "Name"
        );

        foreach ($this->items as $row) {
           $module = $row['Module'];
           $cat = $row['Category'];

           error_log("Hello!!!");
           foreach ($cat->getItems() as $item) {
               $name   = $item->getName();
               $desc   = '';
               $status = 'Unchanged';
               if (isset($overrides[$name])) {
                   $desc   = $overrides[$name]['Description'];
                   $status = 'Modified';
               } else {
                   $desc = $item->getDescription();
               }

               if ($desc == '') {
                   $status = 'Empty';
               }

               $dict[] = $this->getInstance(
                   $module,
                   $cat,
                   $item,
                   $desc,
                   $status,
               );
           }
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
    public function getInstance(
        \Module $module,
        \LORIS\Data\Dictionary\Category $cat,
        \LORIS\Data\Dictionary\DictionaryItem $item,
        string $desc,
        string $descstatus) : \LORIS\Data\DataInstance
    {
        return new DataDictRow($module, $cat, $item, $desc, $descstatus);
    }
}

<?php declare(strict_types=1);

namespace LORIS\dictionary;
use \LORIS\Data\Dictionary\DictionaryItem;
use \LORIS\Data\Dictionary\Category;

/**
 * This class implements a data provisioner to get all possible rows
 * for the datadict menu page.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DataDictRowProvisioner extends \LORIS\Data\ProvisionerInstance
{
    protected \LORIS\LorisInstance $loris;
    protected array $items;

    /**
     * Create a DataDictRowProvisioner, which gets rows for
     * the datadict menu table.
     *
     * @param \LORIS\LorisInstance $loris The Loris instance whose
     *                                    dictionary should be retrieved
     * @param array                $items The list of dictionary items
     *                                    from all modules that this provisioner
     *                                    should iterate over.
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
        $DB = $this->loris->getDatabaseConnection();

        $dict = [];

        $overrides = $DB->pselectWithIndexKey(
            "SELECT Name, Description FROM parameter_type_override",
            [],
            "Name"
        );

        foreach ($this->items as $row) {
            $module = $row['Module'];
            $cat    = $row['Category'];

            $qe = $module->getQueryEngine();

            foreach ($cat->getItems() as $item) {
                $name   = $item->getName();
                $status = dgettext('dictionary', 'Unchanged');
                if (isset($overrides[$name])) {
                    $desc   = $overrides[$name]['Description'];
                    $status = dgettext('dictionary', 'Modified');
                } else {
                    $desc = $item->getDescription();
                }

                if ($desc == '') {
                    $status = dgettext('dictionary', 'Empty');
                }

                $cohorts = $DB->pselectCol(
                    "SELECT DISTINCT c.title FROM test_names tn
                        JOIN test_battery tb ON tn.Test_name=tb.Test_name
                        JOIN cohort c ON tb.CohortID=c.CohortID
                        WHERE tn.Test_name=:tn
                    ORDER BY c.title",
                    ['tn' => $cat->getName()]
                );

                $visits = $qe->getVisitList($cat, $item);
                $dict[] = $this->getInstance(
                    $module,
                    $cat,
                    $item,
                    $desc,
                    $status,
                    $visits,
                    $cohorts,
                );
            }
        }
        return new \ArrayIterator($dict);
    }

    /**
     * Returns an instance of a DataDict object for a given
     * table row, adding the category and description override
     *
     * @param \Module        $module     The module that this DictionaryItem came
     *                                   from.
     * @param Category       $cat        The category within the module of the
     *                                   DictionaryItem.
     * @param DictionaryItem $item       The DictionaryItem for this row of the
     *                                   table
     * @param string         $desc       The overridden description of the item
     * @param string         $descstatus The status of the description override
     * @param ?[]string      $visits     The visits for session scoped variables
     * @param ?[]string      $cohorts    The cohorts for session scoped variables
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance(
        \Module $module,
        Category $cat,
        DictionaryItem $item,
        string $desc,
        string $descstatus,
        array $visits,
        array $cohorts,
    ) : \LORIS\Data\DataInstance {
        return new DataDictRow(
            $module,
            $cat,
            $item,
            $desc,
            $descstatus,
            $visits,
            $cohorts,
        );
    }
}

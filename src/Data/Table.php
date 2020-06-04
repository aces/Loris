<?php
/**
 * This file implements the Table class.
 *
 * A Table Represents a table displayed on the frontend to a user. It's
 * a thin wrapper around a Provisioner to ease creation of frontend
 * data tables.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\Data;

/**
 * A Table Represents a table displayed on the frontend to a user. It's
 * a thin wrapper around a Provisioner to ease creation of frontend
 * data tables.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Table
{
    /**
     * The data Provisioner used for this table.
     *
     * @var \LORIS\Data\Provisioner
     */
    protected $dataProvider;

    /**
     * Returns a new Table which is identical to this one, except gets its
     * data from the DataProvisioner provided.
     *
     * @param Provisioner $provisioner The provisioner which acquires data for this
     *  table.
     *
     *  @return Table identical to this one with the data coming from $provisioner.
     */
    public function withDataFrom(Provisioner $provisioner) : Table
    {
        $t = clone $this;
        $t->dataProvider = &$provisioner;
        return $t;
    }

    /**
     * Get rows returns all rows that the data provider provides, filtering them
     * for $user.
     *
     * @param \User $user The user who is attempting to load the table.
     *
     * @return \Traversable of DataInstance values of all the filtered data.
     */
    public function getRows(\User $user) : \Traversable
    {
        return $this->dataProvider->execute($user);
    }

    /**
     * Returns a PHP array which mirror's the format of toJSON (rather than
     * an array of data Instances, as getRows returns.)
     *
     * @param \User $user The user who is attempting to load the table.
     *
     * @return array an associative array representation of the table data.
     */
    public function toArray(\User $user) : array
    {
        $allRows = $this->getRows($user);

        $results = [];
        foreach ($allRows as $row) {
            $results[] = json_decode($row->toJSON($user), true);
        }
        return $results;
    }

    /**
     * Serializes this table to JSON for $user.
     *
     * @param \User $user The user who is attempting to load the table.
     *
     * @return string of valid JSON representing this data.
     */
    public function toJSON(\User $user) : string
    {
        return json_encode($this->toArray($user));
    }

    /**
     * Filter returns a new table with Filter added as a filter.
     *
     * @param Filter $filter The filter to add to the data
     *
     * @return Table that is identical to this table with $filter applied.
     */
    public function filter(Filter $filter) : Table
    {
        $t = clone $this;
        $t->dataProvider = $this->dataProvider->Filter($filter);
        return $t;
    }
}

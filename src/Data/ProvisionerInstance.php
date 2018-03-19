<?php
/**
 * This file defines a helper for implementing the \LORIS\Data\Provisioner
 * interface.
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
 * A ProvisionerInstance is an abstract base class which can be used to
 * provide most details for an implementation of the Provisioner interface.
 *
 * In order to use this class, the getAllInstances function must be
 * implemented.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class ProvisionerInstance implements Provisioner
{
    /**
     * The parent which this provisioner is derived from to apply
     * $this->modifier to.
     */
    private $_parent = null;

    /**
     * Filters (and Mappers) to apply to the data from this Provisioner
     * before returning it to the user.
     *
     * Filters and Maps are lazily evaluated, and applied in the order that
     * they were added to the Provisioner.
     *
     * (Since filters can only be created by calling filter or map on
     * an existing provisioner, we only need to store the new filter and
     * a reference to the parent.)
     *
     * A Modifier which implements both Filter and Mapper first gets Filtered,
     * and then Mapped.
     *
     * @var Filter | Mapper
     */
    protected $modifier;

    /**
     * Implements the filter method for the Provisioner interface.
     *
     * @param Filter $filter The filter to apply
     *
     * @return Provisioner a new data provisioner with $filter applied
     */
    public function filter(Filter $filter) : Provisioner
    {
        $d           = clone $this;
        $d->_parent  = &$this;
        $d->modifier = $filter;
        return $d;
    }

    /**
     * Implements the map method for the Provisioner interface.
     *
     * @param Mapper $map The map to apply
     *
     * @return Provisioner a new data provisioner with $map applied
     */
    public function map(Mapper $map) : Provisioner
    {
        $d           = clone $this;
        $d->_parent  = &$this;
        $d->modifier = $map;
        return $d;
    }

    /**
     * GetAllInstances must be implemented by concrete implementations of this
     * class. It must return all rows known about for this Provisioner (without
     * respect to the User accessing the data), which then gets mapped and
     * filtered by execute.
     *
     * @return \Traversable of all resources provided by this data source.
     */
    abstract protected function getAllInstances() : \Traversable;

    /**
     * Implements the execute function for the Provisioner interface.
     *
     * @param \User $user The user who data is being provisioned on behalf of.
     *
     * @return \Traversable of DataInstance objects
     */
    public function execute(\User $user) : \Traversable
    {
        $rows = new \EmptyIterator();
        if ($this->_parent != null) {
            $rows = $this->_parent->execute($user);
        } else {
            $rows = $this->getAllInstances();
        }

        if ($this->modifier !== null
            && !($this->modifier instanceof Filter)
            && !($this->modifier instanceof Mapper)
        ) {
            throw new \Exception("Invalid modifier on provisioner");
        }

        // If it implements both Filter and Mapper, run the filter first so
        // that the mapping is less expensive.
        if ($this->modifier instanceof Filter) {
            $callback = function ($current, $key, $iterator) use ($user) {
                return $this->modifier->filter($user, $current);
            };

            if ($rows instanceof \Iterator) {
                $rows = new \CallbackFilterIterator($rows, $callback);
            } else {
                // Convert non-iterator traversables to iterators.
                $rows = new \CallbackFilterIterator(
                    new \IteratorIterator($rows),
                    $callback
                );
            }

        }

        if ($this->modifier instanceof Mapper) {
            // Convert rows to an iterator where current() returns the map,
            // not the existing value.
            $rows = new MapIterator($rows, $this->modifier, $user);
        }

        return $rows;
    }
};

<?php
/**
 * This file defines a MapIterator implementation.
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
 * A MapIterator is a type of iterator which extends another
 * iterator in order to apply a map to the data before returning
 * it to the caller.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class MapIterator extends \IteratorIterator
{
    protected $mapper;
    protected $user;

    /**
     * Create a MapIterator
     *
     * @param \Traversable  $rows   The Iterator being mapped from
     * @param Mapper $mapper The mapper to apply
     * @param \User  $user   The user to use when calling the Mapper
     */
    public function __construct($rows, Mapper $mapper, \User $user)
    {
        parent::__construct($rows);
        $this->mapper = $mapper;
        $this->user   = $user;
    }

    /**
     * Overrides the \IteratorIterator \Iterator interface to apply
     * the map passed in the constructor.
     *
     * @return DataInstance
     */
    public function current()
    {
        $row = parent::current();
        return $this->mapper->Map($this->user, $row);
    }
}

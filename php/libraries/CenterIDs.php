<?php declare(strict_types=1);
/**
 * A Collection of CenterIDs.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CenterIDs extends IteratorIterator
{
    /**
     * Constructor
     *
     * @param CenterID ...$centerIDs Elements in collection.
     *
     * @return CenterIDs A collection of CenterIDs.
     * @access public
     */
    public function __construct(CenterID ...$centerIDs)
    {
        parent::__construct(new ArrayIterator($centerIDs));
    }

    /**
     * The current CenterID pointed in the collection.
     *
     * @return CenterID Current CenterID.
     * @access public
     */
    public function current() : CenterID
    {
        return parent::current();
    }

    /**
     * Adds a CenterID to the collection.
     *
     * @param CenterID $centerID Element to add.
     *
     * @return void.
     * @access public
     */
    public function add(CenterID $centerID)
    {
        $this->getInnerIterator()->append($centerID);
    }
}


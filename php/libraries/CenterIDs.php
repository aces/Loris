<?php declare(strict_types=1);
/**
 * A Collection of CenterIDs.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CenterIDs extends IteratorIterator
{
    public function __construct(CenterID ...$centerIDs)
    {
        parent::__construct(new ArrayIterator($centerIDs));
    }
    public function current() : CenterID
    {
        return parent::current();
    }
    public function add(CenterID $centerIDs)
    {
        $this->getInnerIterator()->append($centerIDs);
    }
}


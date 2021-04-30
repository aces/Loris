<?php declare(strict_types=1);

namespace LORIS\dqt\Views;

class Categories
{
    // FIXME :: This should be able to take an Traversable instead
    public function __construct(array $x)
    {
        $this->_categories = $x;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return ['Categories' => $this->_categories];    
    }
}

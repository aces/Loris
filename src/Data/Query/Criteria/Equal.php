<?php
namespace LORIS\Data\Query\Criteria;

use LORIS\Data\Query\Criteria;

/**
 * An Equal criteria matches data which equals a given
 * value.
 */
class Equal implements Criteria
{
    /**
     * Construct an Equal criteria.
     *
     * @param mixed $value The value that must be equal
     */
    public function __construct(private $value)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getValue()
    {
        return $this->value;
    }
}

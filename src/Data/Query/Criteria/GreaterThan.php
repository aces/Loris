<?php
namespace LORIS\Data\Query\Criteria;

use LORIS\Data\Query\Criteria;

/**
 * A GreaterThan Criteria specifies that an item must be strictly
 * > a given value.
 */
class GreaterThan implements Criteria
{
    /**
     * Construct a GreaterThan comparison
     */
    public function __construct(protected $value)
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

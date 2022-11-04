<?php

namespace LORIS\Data\Query\Criteria;

use LORIS\Data\Query\Criteria;

/**
 * A NotEqual Criteria specifies that the value should be compared
 * against not being a given value.
 */
class NotEqual implements Criteria
{
    /**
     * Construct a NotEqual criteria
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

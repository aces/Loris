<?php

namespace LORIS\Data\Query\Criteria;

/**
 * Criteria to specify that a given item must be strictly <
 * a comparison value.
 */
class LessThan implements \LORIS\Data\Query\Criteria
{
    /**
     * Constructor
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

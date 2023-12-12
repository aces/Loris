<?php

namespace LORIS\Data\Query\Criteria;

/**
 * A Criteria to determine that a DictionaryItem must be <= a
 * given value
 */
class LessThanOrEqual implements \LORIS\Data\Query\Criteria
{
    /**
     * Constructor
     *
     * @param mixed $value The comparison value
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

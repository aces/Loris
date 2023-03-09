<?php

namespace LORIS\Data\Query\Criteria;

/**
 * A Criteria to specify that the string serialization must
 * start with a given prefix.
 */
class StartsWith implements \LORIS\Data\Query\Criteria
{
    /**
     * Construct a StartsWith
     */
    public function __construct(protected $prefix)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getValue()
    {
        return $this->prefix;
    }
}

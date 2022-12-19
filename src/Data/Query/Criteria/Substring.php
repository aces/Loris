<?php

namespace LORIS\Data\Query\Criteria;

/**
 * Criteria to specify that the string serialization of a
 * value must contain a substring.
 */
class Substring implements \LORIS\Data\Query\Criteria
{
    /**
     * Construct a Substring criteria
     *
     * @param string $substr The substring that must be contained in
     *                       the value
     */
    public function __construct(protected $substr)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getValue()
    {
        return $this->substr;
    }
}

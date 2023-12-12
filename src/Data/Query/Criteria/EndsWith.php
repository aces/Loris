<?php

namespace LORIS\Data\Query\Criteria;

/**
 * An EndsWith criteria represents a search for values that
 * the string representation of ends with a certain value.
 */
class EndsWith implements \LORIS\Data\Query\Criteria
{
    /**
     * Construct an EndsWith criteria
     *
     * @param mixed $suffix The suffix that values must end with
     */
    public function __construct(private $suffix)
    {
    }

    public function getValue()
    {
        return $this->suffix;
    }
}

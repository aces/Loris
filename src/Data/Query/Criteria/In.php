<?php

namespace LORIS\Data\Query\Criteria;

/**
 * In represents a criteria specifying that the value must be
 * in a given set of choices.
 */
class In implements \LORIS\Data\Query\Criteria
{
    protected array $val;

    /**
     * Construct an In criteria.
     *
     * @param $val The set that the value must be in.
     */
    public function __construct(...$val)
    {
        $this->val = $val;
    }

    /**
     * {@inheritDoc}
     */
    public function getValue()
    {
        return $this->val;
    }
}

<?php
namespace LORIS\Data\Query\Criteria;

use LORIS\Data\Query\Criteria;

/**
 * A GreaterThanOrEqual criteria denotes a criteria that must
 * be >= a given value.
 */
class GreaterThanOrEqual implements Criteria
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

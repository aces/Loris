<?php
namespace LORIS\Data\Query;

/**
 * A Criteria represents a comparison to compare a data dictionary
 * against for the purposes of querying.
 *
 * Generally, the operator is defined by the class type and the
 * the value by getValue().
 */
interface Criteria
{
    /**
     * Get the value of the comparison.
     */
    public function getValue();
}

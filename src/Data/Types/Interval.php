<?php
namespace LORIS\Data\Types;

/**
 * An Interval data type represents a time interval or duration.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Interval implements \LORIS\Data\Type
{
    /**
     * Convert the type to a human readable string
     */
    public function __toString()
    {
        return "interval";
    }

    /**
     * Convert to JSON by converting to a string
     */
    public function jsonSerialize()
    {
        return $this->__toString();
    }

    /**
     * Intervals are represented as varchar(255) descriptions,
     * since MySQL does not support an interval type.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "varchar(255)";
    }
}

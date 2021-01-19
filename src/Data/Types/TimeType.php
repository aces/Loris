<?php
namespace LORIS\Data\Types;

/**
 * A TimeType represents a time of the day. (ie. 12pm.)
 *
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class TimeType implements \LORIS\Data\Type
{
    /**
     * Represent the type as a human readable string
     *
     * @return string
     */
    public function __toString()
    {
        return "time";
    }

    /**
     * Convert the type to JSON by converting to a string
     *
     * @return string
     */
    public function jsonSerialize()
    {
        return $this->__toString();
    }

    /**
     * Times are represented as varchars in the database,
     * because they do not have a date attached to them to
     * represent them as datetime column types.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "varchar(255)";
    }
}

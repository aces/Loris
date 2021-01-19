<?php
namespace LORIS\Data\Types;

/**
 * A Date type represents a date of the year.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DateType implements \LORIS\Data\Type
{
    /**
     * Convert the type to a string
     *
     * @return string
     */
    public function __toString()
    {
        return "date";
    }

    /**
     * Serialize to JSON by converting to a string
     *
     * @return string
     */
    public function jsonSerialize()
    {
        return $this->__toString();
    }

    /**
     * Dates are represented by the MySQL date type
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "date";
    }
}

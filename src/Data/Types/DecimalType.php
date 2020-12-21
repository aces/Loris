<?php
namespace LORIS\Data\Types;

/**
 * A DecimalType represents a data type which may have a fractional
 * part to its representation.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class DecimalType implements \LORIS\Data\Type
{
    /**
     * Convert the type to a human readable string
     *
     * @return string
     */
    public function __toString()
    {
        return "decimal";
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
     * A DecimalType is represented by the SQL decimal column
     * type
     */
    public function asSQLType() : string
    {
        return "decimal";
    }
}

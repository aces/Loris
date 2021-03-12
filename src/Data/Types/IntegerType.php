<?php
namespace LORIS\Data\Types;

/**
 * An IntegerType represents a piece of data which is represented
 * by a whole number.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class IntegerType implements \LORIS\Data\Type
{
    /**
     * Convert the type to a human readable string
     *
     * @return string
     */
    public function __toString()
    {
        return "integer";
    }

    /**
     * Serialize the type by converting to JSON
     *
     * @return string
     */
    public function jsonSerialize()
    {
        return $this->__toString();
    }

    /**
     * Represent the IntegerType as an integer SQL column.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "integer";
    }
}

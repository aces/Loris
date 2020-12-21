<?php
namespace LORIS\Data\Types;

/**
 * An Duration data type represents an amount of time
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Duration implements \LORIS\Data\Type
{
    /**
     * Convert the type to a human readable string
     */
    public function __toString()
    {
        return "duration";
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
     * Duration are represented as varchar(255) descriptions,
     * since MySQL does not support an interval or duration type.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "varchar(255)";
    }
}

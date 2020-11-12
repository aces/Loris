<?php
namespace LORIS\Data\Types;

/**
 * A BooleanType represents a boolean variable in LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class BooleanType implements \LORIS\Data\Type
{
    /**
     * Construct a BooleanType object
     */
    public function __construct()
    {
    }

    /**
     * Convert this data type to a string.
     *
     * @return string
     */
    public function __toString()
    {
        return "boolean";
    }

    /**
     * Serialize to JSON by converting to a string.
     *
     * @return string
     */
    public function jsonSerialize()
    {
        return $this->__toString();
    }

    /**
     * Convert the BooleanType to an SQL value. Booleans
     * in LORIS are generally stored as a enum with yes/no
     * options. MySQL converts the keyword `boolean` to
     * `integer(1)`, which the PDO then interprets as strings
     * '0' and '1' when selecting from the database. Explicitly
     * using an enum avoids sometimes obscure type issues.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "enum('no', 'yes')";
    }
}

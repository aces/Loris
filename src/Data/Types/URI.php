<?php
namespace LORIS\Data\Types;

/**
 * A URI represents a data type that represents a resource by
 * storing a pointer to where the resource is located.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class URI implements \LORIS\Data\Type
{
    /**
     * Convert data type to a string
     *
     * @return string
     */
    public function __toString()
    {
        return "URI";
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
     * URIs are stored in the SQL database as varchar columns.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "varchar(255)";
    }
}

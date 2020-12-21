<?php
namespace LORIS\Data\Types;

/**
 * A Enumeration represents a data type where the value must be one of
 * a specific list of option.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Enumeration implements \LORIS\Data\Type
{
    protected $options = [];

    /**
     * Construct an Enumeration type
     *
     * @param string ...$values The options for this enumeration
     */
    public function __construct(string ...$values)
    {
        $this->options = $values;
    }

    /**
     * Return an array of the options which are valid for this
     * enumeration
     *
     * @return string[]
     */
    public function getOptions() : array
    {
        return $this->options;
    }

    /**
     * Represent the type as a string
     *
     * @return string
     */
    public function __toString()
    {
        return "enumeration";
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
     * Represent the enumeration as an enum SQL type with
     * the valid options.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        return "enum(" . join(",", $this->options) . ")";
    }
}

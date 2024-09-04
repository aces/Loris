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
    /**
     * Valid options for this Enumeration
     */
    protected $options = [];

    /**
     * Optional labels for the Enumeration value. This must either be
     * null or an array of equal length to options.
     */
    protected $labels = null;

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
    public function jsonSerialize() : string
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

    /**
     * Returns a new Enumeration which is identical to this one
     * except with the options being accompanied by a label.
     */
    public function withLabels(string ...$labels)
    {
        if (count($labels) != count($this->options)) {
            throw new \LengthException("Number of labels does not match number of options");
        }
        $new         = clone $this;
        $new->labels = $labels;
        return $new;
    }

    /**
     * Return the labels for the values of this enum, or null
     * if no labels have been provided.
     *
     * @return ?string[]
     */
    public function getLabels() : ?array
    {
        return $this->labels;
    }
}

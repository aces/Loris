<?php
namespace LORIS\Data\Types;

/**
 * A StringType represents a string variable in LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class StringType implements \LORIS\Data\Type
{
    private $size;

    /**
     * Construct a StringType object
     *
     * @param ?int $maxsize The maximum size of the string. If null,
     *                      the string size is unbounded.
     */
    public function __construct(?int $maxsize = null)
    {
        $this->size = $maxsize;
    }

    /**
     * Convert this data type to a string.
     *
     * @return string
     */
    public function __toString()
    {
        return "string";
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
     * Convert the StringType to either a text or varchar depending
     * on whether the size is bounded.
     *
     * @return string
     */
    public function asSQLType() : string
    {
        if ($this->size === null) {
            return "text";
        }
        return "varchar($this->size)";
    }
}

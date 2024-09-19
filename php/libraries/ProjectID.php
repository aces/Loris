<?php declare(strict_types=1);
/**
 * A representation of a ProjectID object. A ProjectID is always an integer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ProjectID extends ValidatableIdentifier implements \JsonSerializable
{
    /**
     * Acts as a constructor for a ProjectID , using a cached instantiation
     * if available
     *
     * @param int $id The ProjectID to get a singleton for.
     *
     * @return ProjectID
     */
    static public function singleton(int $id)
    {
        static $cache = [];
        if (!isset($cache[$id])) {
            $cache[$id] = new \ProjectID(strval($id));
        }
        return $cache[$id];
    }

    /**
     * Returns this identifier type
     *
     * @return string
     */
    public function getType(): string
    {
        return 'ProjectID';
    }

    /**
     * Validate that the value of the ProjectID is a positive integer.
     *
     * This does not check for uniqueness in the database or any other
     * state-related facts.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    protected function validate(string $value): bool
    {
        return \Utility::valueIsPositiveInteger($value);
    }

    /**
     * Generates a string representation of this ProjectID.
     *
     * @return string The ProjectID value.
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Specify how the data should be serialized to JSON.
     *
     * @return string
     */
    public function jsonSerialize() : string
    {
        return $this->value;
    }

}


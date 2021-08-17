<?php declare(strict_types=1);
/**
 * A representation of a CenterID object. A CenterID is always an integer
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class CenterID extends ValidatableIdentifier implements \JsonSerializable
{
    /**
     * Returns this identifier type
     *
     * @return string
     */
    public function getType(): string
    {
        return 'CenterID';
    }

    /**
     * Validate that the value of the CenterID is a positive integer.
     *
     * This does not check for uniqueness in the database or any other
     * state-related facts.
     *
     * @param string $value The value to be validated
     *
     * @return bool
     */
    protected function validate(string $value): bool
    {
        return \Utility::valueIsPositiveInteger($value);
    }

    /**
     * Generates a string representation of this CenterID.
     *
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Specify how the data should be serialized to JSON.
     *
     * @return mixed
     */
    public function jsonSerialize()
    {
        return $this->value;
    }

}


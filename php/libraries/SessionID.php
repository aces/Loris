<?php declare(strict_types=1);
/**
 * This defines what a SessionID should be so it can be passed as a typed
 * parameter in functions.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * A representation of a SessionID object. A SessionID is always an integer with a
 * maximum of 10 digits (as defined in the database `session` table).
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class SessionID extends ValidatableIdentifier
{
    protected const SESSIONID_MAX_LENGTH = 10;
    /**
     * Returns this identifier type
     *
     * @return string Always 'SessionID'
     */
    public function getType(): string
    {
        return 'SessionID';
    }

    /**
     * Validate that the value of the SessionID is a positive integer that does
     * not exceed a length defined by SESSIONID_MAX_LENGTH.
     * This does not check for uniqueness in the database or any other
     * state-related facts.
     *
     * This function is called by the contructor of ValidatableIdentifier
     * to ensure that no SessionID exists if its value is not valid.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    protected function validate(string $value): bool
    {
        return (intval($value) > 0)
            && (strlen($value) <= self::SESSIONID_MAX_LENGTH)
            && (is_integer($value));
    }

    /**
     * Generates a string representation of this SessionID.
     *
     * @return string The SessionID value.
     */
    public function __toString(): string
    {
        return $this->value;
    }
}


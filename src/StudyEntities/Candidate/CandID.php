<?php declare(strict_types=1);
/**
 * This defines what a CandID should be so it can be passed as a typed
 * parameter in functions.
 *
 * PHP Version 7
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntities\Candidate;

/**
 * A representation of a CandID object. A CandID is always a string of length 6.
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandID extends ValidatableIdentifier
{
    /**
     * Returns this identifier type
     *
     * @return string Always 'CandID'
     */
    public function getType(): string
    {
        return 'CandID';
    }

    /**
     * Validate that the value of the CandID is a string of length 6.
     * This does not check for uniqueness in the database or any other
     * state related facts.
     *
     * This function is called by the contructor of ValidatableIdentifier
     * to ensure that no CandID exists if its value is not valid.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    protected function validate(string $value): bool
    {
        return preg_match('/[0-9]{6}/', $value) === 1;
    }

    /**
     * Generates a string representation of this CandID.
     *
     * @return string That CandID's value
     */
    public function __toString(): string
    {
        return $this->value;
    }
}


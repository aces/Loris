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
    /* 
     * The minimum allowed value for valid CandIDs. Origin unclear but
     * assists in avoiding issues with leading 0s in string repreentations of
     * integers.
     *
     * @var int
     */
    protected const MIN_VALUE = 100000;

    /*
     * A valid CandID must have exactly this number of characters.
     *
     * @var int
     */
    protected const LENGTH = 6;
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
     * Validate that the value of the CandID is a string of LENGTH numeric characters
     * with integer value greater than 100000. This does not check for uniqueness
     * in the database or any other state-related facts.
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
        $pattern = sprintf("/[0-9]{%s}/", self::LENGTH);

        return preg_match($pattern, $value) === 1 &&
            intval($value) >= self::MIN_VALUE;
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


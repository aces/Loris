<?php declare(strict_types=1);
/**
 * This defines valid values for the Sex data point for a Candidate.
 * It is a Value Object used to assist with validation.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntities\Candidate;

/**
 * This defines valid values for the Sex data point for a Candidate.
 * It is a Value Object used to assist with validation.
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Sex implements \JsonSerializable
{
    /* @var string */
    public $value;

    private const VALID_VALUES = array(
                                  'male',
                                  'female',
                                  'other',
                                 );

    /**
     * Calls validate() immediately.
     *
     * @param string $value The value of this EntityType.
     *
     * @throws \DomainException When the value is not valid
     */
    public function __construct(string $value)
    {
        if (!self::validate($value)) {
            throw new \DomainException(
                'The value is not valid. Must be one of: '
                . implode(', ', self::VALID_VALUES)
            );
        }
        $this->value = $value;
    }

    /**
     * Ensures that the value is well-formed.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    public static function validate(string $value): bool
    {
        return in_array(strtolower($value), self::VALID_VALUES, true);
    }

    /**
     * Generates a string representation of the Sex data point.
     *
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }

    /**
     * Implements the JSONSerializeable interface by converting
     * the value to a string.
     *
     * @return string
     */
    public function jsonSerialize() : string
    {
        return $this->value;
    }
}

<?php declare(strict_types=1);
/**
 * Implementation of an Alias value object that is used as a shorthand to
 * refer to a Project or Site in LORIS.
 *
 * PHP Version 7
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\StudyEntities\Candidate;

/**
 * ValidatableIdentifier with the default constructor that call validate
 *
 * @category StudyEntities
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
abstract class Alias extends ValidatableIdentifier
{
    /*
     * The maxiumum length of the identifier.
     *
     * @var int
     */
    protected const MAX_LENGTH = 3;

    /*
     * The minimum length of the identifier.
     *
     * @var int
     */
    protected const MIN_LENGTH = 3;

    /**
     * Validate that the alias is alphabetical and between MAX_LENGTH and
     * MIN_LENGTH.
     *
     * This function is called by the contructor of ValidatableIdentifier
     * to ensure that no Alias can be created if its value is not valid.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    protected function validate(string $value): bool
    {
        return ctype_alpha($value)
            && mb_strlen($value) >= self::MIN_LENGTH
            && mb_strlen($value) <= self::MAX_LENGTH;
    }

    /**
     * Generates a string representation of this Alias.
     *
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }
}

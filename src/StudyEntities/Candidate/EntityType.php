<?php declare(strict_types=1);
/**
 * This defines the entity type for a Candidate. It is a Value Object used
 * to assist with validation.
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
 * This defines the entity type for a Candidate. It is a Value Object used
 * to assist with validation.
 *
 * @category Main
 * @package  LORIS
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class EntityType
{
    /* @var string */
    private $value;

    private const VALID_VALUES = array(
                                  'Human',
                                  'Scanner',
                                 );

    /**
     * Creates a new EntityType. Calls validate() immediately.
     *
     * @param string $value The value of this EntityType.
     *
     * @throws \DomainException When the value is not valid
     */
    final public function __construct(string $value)
    {
        if (!$this->validate($value)) {
            throw new \DomainException(
                'The value is not valid. Must be one of: '
                . implode(', ', self::VALID_VALUES)
            );
        }
        $this->value = $value;
    }

    /**
     * Ensures that EntityType is well-formed.
     *
     * @param string $value The value to be validated
     *
     * @return bool True if the value format is valid
     */
    private function validate(string $value): bool
    {
        return in_array($value, self::VALID_VALUES, true);
    }

    /**
     * Generates a string representation the EntityType.
     *
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }
}

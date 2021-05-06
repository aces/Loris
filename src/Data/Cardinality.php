<?php
namespace LORIS\Data;

/**
 * Cardinality represents the number of data points which
 * apply to the scope of a data type.
 *
 * Since the Cardinality class represents an enumeration, the
 * class is final.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
final class Cardinality implements \JsonSerializable
{
    // Valid cardinality types for data to apply to.

    /**
     * A Unique Cardinality signifies that the data is unique
     * across the scope. Examples of unique data are CandID
     * for the candidate scope or VisitLabel for the Session
     * scope.
     */
    const UNIQUE = 1;

    /**
     * A Single Cardinality signifies that each data point in
     * the scope should have exactly one value. For instance,
     * date of birth for a candidate in the candidate scope.
     */
    const SINGLE = 2;

    /**
     * An Optional Cardinality signifies that each data point
     * in the scope may have zero or one value. For instance,
     * the date of death for a candidate in the candidate scope.
     */
    const OPTIONAL = 3;

    /**
     * A Many Cardinality signifies that each data point will
     * have zero or more values associated. For instance,
     * the T1 scans acquired at a session.
     */
    const MANY = 4;

    protected $cardinality;

    /**
     * Constructs a Scope object. $scope should be a class constant
     * to construct the scope for, not an int literal.
     *
     * @param int $scope The scope
     */
    public function __construct(int $card)
    {
        switch ($card) {
            case self::UNIQUE: // fallthrough
            case self::SINGLE: // fallthrough
            case self::OPTIONAL: // fallthrough
            case self::MANY: // fallthrough
                $this->cardinality = $card;
                break;
            default:
                throw new \DomainException("Invalid cardinality");
        }
    }

    /**
     * Convert the enumeration from a memory-friendly integer to a
     * human-readable string when used in a string context.
     *
     * @return string
     */
    public function __toString() : string
    {
        switch ($this->cardinality) {
            case self::UNIQUE: // fallthrough
                return "unique";
            case self::SINGLE: // fallthrough
                return "single";
            case self::OPTIONAL: // fallthrough
                return "optional";
            case self::MANY: // fallthrough
                return "many";
            default:
                return "invalid cardinality";
        }
    }

    /**
     * Implement the JsonSerializable interface by
     * converting to a string
     *
     * @return string
     */
    public function jsonSerialize() : string
    {
        return $this->__toString();
    }
}

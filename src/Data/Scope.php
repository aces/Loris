<?php
namespace LORIS\Data;

/**
 * A Scope is an enumeration class which represents the scope
 * that a piece of data may apply to in LORIS.
 *
 * The Scope class is final because the list of enumeration types
 * can not be dynamically extended without modifying all places
 * that must deal with the enumeration options.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
final class Scope implements \JsonSerializable
{
    // Valid scopes for data to apply to.
    const CANDIDATE = 1;
    const SESSION   = 2;

    /**
     * The value of the current scope instance
     */
    protected $scope;

    /**
     * Constructs a Scope object. $scope should be a class constant
     * to construct the scope for, not an int literal.
     *
     * @param int $scope The scope
     */
    public function __construct(int $scope)
    {
        switch ($scope) {
            case self::CANDIDATE: // fallthrough
            case self::SESSION:
                $this->scope = $scope;
                break;
            default:
                throw new \DomainException("Invalid scope");
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
        switch ($this->scope) {
            case self::CANDIDATE:
                return "candidate";
            case self::SESSION:
                return "session";
            default:
                // This shouldn't happen since the constructor threw an
                // exception for an invalid value.
                return "invalid scope";
        }
    }

    public function jsonSerialize()
    {
        return $this->__toString();
    }
}

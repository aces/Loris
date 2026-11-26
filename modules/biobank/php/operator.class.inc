<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * Enum Operator
 *
 * Defines the allowed Operators for accessing resources.
 *
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
enum Operator: string
{
    case EQUALS       = 'eq';                    // Equals
    case NOT_EQUALS   = 'neq';               // Not equals
    case GREATER_THAN = 'gt';              // Greater than
    case LESS_THAN    = 'lt';                 // Less than
    case GREATER_THAN_OR_EQUALS = 'gte';   // Greater than or equals
    case LESS_THAN_OR_EQUALS    = 'lte';      // Less than or equals
    case LIKE = 'like';                    // Like (pattern match)
    case IN   = 'in';                        // In (value in set)

    /**
     * Converts the Operator enum value to its corresponding SQL representation.
     *
     * @return string The SQL operator corresponding to the enum value.
     */
    public function toSql(): string
    {
        return match ($this) {
            self::EQUALS => '=',
            self::NOT_EQUALS => '!=',
            self::GREATER_THAN => '>',
            self::LESS_THAN => '<',
            self::GREATER_THAN_OR_EQUALS => '>=',
            self::LESS_THAN_OR_EQUALS => '<=',
            self::LIKE => 'LIKE',
            self::IN => 'IN',
        };
    }
}

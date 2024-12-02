<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * Condition Class
 *
 * Defines a Condition object for modifying resource access.
 * A Condition represents a filter or restriction applied to resource access
 * in a query. It specifies the field to filter, the value to match, the
 * comparison operator, and the logical operator for combining multiple conditions.
 *
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
class Condition
{
    /**
     * Constructs a Condition instance.
     *
     * @param string           $field           The field to filter by
     * @param ?string          $value           The value to compare against
     * @param ?Operator        $operator        The comparison operator
     * @param ?LogicalOperator $logicalOperator The logical operator for combining
     *                                          with other conditions
     */
    public function __construct(
        public string $field,
        public ?string $value,
        public ?Operator $operator = Operator::EQUALS,
        public ?LogicalOperator $logicalOperator = LogicalOperator::AND,
    ) {
    }
}

<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * Enum LogicalOperator
 *
 * Defines the allowed LogicalOperators for chaining query conditions.
 *
 * @license https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
enum LogicalOperator: string
{
    case AND = 'AND';
    case OR  = 'OR';
}

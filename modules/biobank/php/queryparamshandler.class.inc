<?php declare(strict_types=1);

namespace LORIS\biobank;

/**
 * Class QueryParamsHandler
 *
 * Handles the parsing of query parameters into a `QueryParams` object.
 * This includes parsing fields, conditions, limits, offsets, and
 * count-only queries from the provided array of query parameters.
 *
 * @package    LORIS
 * @subpackage Biobank
 * @final
 * @author     Henri Rabalais <henri.j.rabalais@gmail.com>
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU General Public License
 */
final class QueryParamsHandler
{
    /**
     * Stores the raw query parameters array to be processed.
     *
     * @var array
     */
    protected $queryParams;

    /**
     * Constructs the QueryParamsHandler.
     *
     * @param array $queryParams The array of query parameters to parse.
     */
    public function __construct(array $queryParams)
    {
        $this->queryParams = $queryParams;
    }

    /**
     * Parses the raw query parameters into a QueryParams object.
     *
     * @return QueryParams The parsed QueryParams object.
     */
    public function parse(): QueryParams
    {
        $queryParams = new QueryParams();
        $queryParams->select(...$this->parseFields())
            ->where(...$this->parseConditions())
            ->limit($this->parseLimit())
            ->offset($this->parseOffset())
            ->count($this->parseCount());  // Handle count

        return $queryParams;
        // return new QueryParams(
        //     fields: $this->parseFields(),
        //     conditions: $this->parseConditions(),
        //     excludeConditions: $this->parseExcludeConditions(),
        //     limit: $this->parseLimit(),
        //     offset: $this->parseOffset(),
        //     orderBy: $this->parseOrderBy(),
        // );
    }

    /**
     * Parses the 'fields' query parameter.
     *
     * @return array The parsed fields.
     */
    protected function parseFields(): array
    {
        return !empty($this->queryParams['fields']) ?
            explode(',', $this->queryParams['fields']) :
            [];
    }

    /**
     * Parses the 'conditions' query parameter.
     *
     * @return array The parsed conditions.
     */
    protected function parseConditions(): array
    {
        return $this->parseComplexConditions('conditions');
    }

    /**
     * Parses the 'exclude_conditions' query parameter.
     *
     * @return array The parsed exclude conditions.
     */
    protected function parseExcludeConditions(): array
    {
        return $this->parseComplexConditions('exclude_conditions');
    }

    /**
     * Parses complex conditions from the query parameters.
     *
     * @param string $key The key of the query parameter to parse.
     *
     * @return array The parsed conditions.
     */
    protected function parseComplexConditions(string $key): array
    {
        $conditions = [];

        foreach ($this->queryParams[$key] ?? [] as $field => $value) {
            [
                $operatorStr,
                $logicalOperatorStr,
                $field
            ] = $this->parseFieldWithOperators($field);

            $operator        = Operator::from($operatorStr);
            $logicalOperator = LogicalOperator::from($logicalOperatorStr);

            $conditions[] = new Condition(
                $field,
                $value,
                $operator,
                $logicalOperator
            );
        }

        return $conditions;
    }

    /**
     * Parses a field with operator information.
     *
     * @param string $field The field string containing operators.
     *                      :w
     *
     * @return array An array containing the operator, logical operator, and field.
     */
    protected function parseFieldWithOperators(string $field): array
    {
        $parts       = explode('_', $field, 3);
        $operatorStr = $parts[0];
        $logicalOperatorStr = $parts[1];
        $field = $parts[2] ?? '';

        return [$operatorStr, $logicalOperatorStr, $field];
    }

    /**
     * Parses the 'limit' query parameter.
     *
     * @return ?int The parsed limit or null.
     */
    protected function parseLimit(): ?int
    {
        return isset($this->queryParams['limit'])
            && is_numeric($this->queryParams['limit'])
            ? (int) $this->queryParams['limit']
            : null;
    }

    /**
     * Parses the 'offset' query parameter.
     *
     * @return ?int The parsed offset or null.
     */
    protected function parseOffset(): ?int
    {
        return isset($this->queryParams['offset'])
            && is_numeric($this->queryParams['offset'])
            ? (int) $this->queryParams['offset']
            : null;
    }

    /**
     * Parses the 'order_by' query parameter.
     *
     * @return array The parsed order by fields.
     */
    protected function parseOrderBy(): array
    {
        $orderBy = [];

        foreach (explode(',', $this->queryParams['order_by'] ?? '') as $field) {
            if (isset($field[0]) && $field[0] === '-') {
                $orderBy[substr($field, 1)] = 'DESC';
            } else {
                $orderBy[$field] = 'ASC';
            }
        }

        return $orderBy;
    }

    /**
     * Parses the 'count' query parameter.
     *
     * @return bool True if only count should be returned, false otherwise.
     */
    protected function parseCount(): bool
    {
        return isset($this->queryParams['count'])
            && $this->queryParams['count'] === 'true';
    }
}

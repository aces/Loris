<?php declare(strict_types=1);
namespace LORIS\schedule_module;
    /**
     *  This class will create a data entry select clause
     *
     * @license Loris license
        Usage:
        $selectClause = new DataEntrySelectClause();
        $selectClause->register("Xxx", new XxxDataEntryExpression());
        $selectClause->register("Yyy", new YyyDataEntryExpression());
        $selectClause->register("Zzz", new ZzzDataEntryExpression());
        $columns = $selectClause->getColumns();
        $columns should be something like,
        (SomeQuery) AS hasDataEntryComplete,
        (SomeQuery) AS hasDataEntryInProgress,
        (SomeQuery) AS hasDataEntryNotStarted
     */
class DataEntrySelectClause
{
    private $_expressions = [];
    /**
     * This function will the boolean value whether is valid date or not
     *
     * @param string              $type The expression tpye
     * @param DataEntryExpression $expr The data entry expression
     *
     * @return self return this function
     */
    public function register(string $type, DataEntryExpression $expr) : self
    {
        $this->_expressions[$type] = $expr;
        return $this;
    }
    /**
     * This function will the boolean value whether is valid date or not
     *
     * @param string   $columnName    The column name
     * @param callable $getExpression callable entry expression
     *
     * @return string  return column query string
     */
    private function _getColumn(string $columnName, callable $getExpression) : string
    {
        $factory    = \NDB_Factory::singleton();
        $DB         = $factory->database();
        $columnName = $DB->escape($columnName);

        $parts = [];

        $parts[] = "(CASE appointment_type.Name";
        foreach ($this->_expressions as $type=>$expr) {
            $quotedType = $DB->quote($type);
            $expression = $getExpression($expr);
            $parts[]    = "WHEN {$quotedType} THEN ({$expression})";
        }
        $parts[] = "ELSE FALSE";
        $parts[] = "END) AS {$columnName}";
        return implode("\n", $parts);
    }
    /**
     * This function will get complete column
     *
     * @return string the complete column
     */
    public function getCompleteColumn(): string
    {
        return $this->_getColumn(
            "hasDataEntryComplete",
            function (DataEntryExpression $expr) : string {
                return $expr->getCompleteExpression();
            }
        );
    }
    /**
     * This function will get in progress column
     *
     * @return string InProgress Column
     */
    public function getInProgressColumn(): string
    {
        return $this->_getColumn(
            "hasDataEntryInProgress",
            function (DataEntryExpression $expr) : string {
                return $expr->getInProgressExpression();
            }
        );
    }
    /**
     * This function will get not started column
     *
     * @return string NotStartedColumn
     */
    public function getNotStartedColumn(): string
    {
        return $this->_getColumn(
            "hasDataEntryNotStarted",
            function (DataEntryExpression $expr) : string {
                return $expr->getNotStartedExpression();
            }
        );
    }
    /**
     * This function will get all columns
     *
     * @return string all the columns
     */
    public function getColumns() : string
    {
        return implode(
            ",\n",
            [
                $this->getCompleteColumn(),
                $this->getInProgressColumn(),
                $this->getNotStartedColumn()
            ]
        );
    }
}

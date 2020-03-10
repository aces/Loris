<?php
namespace LORIS\schedule_module;
/**
 * Implement this interface for each Appointment Type
 *
 * @license Loris license
 */
interface DataEntryExpression
{
    /**
     * This function will return complete expression
     *
     * @return string get the complete expression
     */
    public function getCompleteExpression() : string;
    /**
     * This function will return inprogress expression
     *
     * @return string get the inprogress expression
     */
    public function getInProgressExpression() : string;
    /**
     * This function will return Not Started expression
     *
     * @return string get the NotStarted expression
     */
    public function getNotStartedExpression() : string;
}
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
        $columnName = \Database::singleton()->escape($columnName);

        $parts = [];

        $parts[] = "(CASE appointment_type.Name";
        foreach ($this->_expressions as $type=>$expr) {
            $quotedType = \Database::singleton()->quote($type);
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
    /**
     * For Behavioral, all instruments except MRI are checked.
     *
     * @license Loris license
     */
class BehavioralDataEntryExpression implements DataEntryExpression
{
    /**
     * This function will return complete expression
     *
     * @return string get the complete expression
     */
    public function getCompleteExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    JOIN
                        test_names
                    ON
                        test_names.Test_name = flag.Test_name
                    JOIN
                        test_subgroups
                    ON
                        test_subgroups.ID = test_names.Sub_group
                    WHERE
                        flag.SessionID = session.ID AND
                        test_subgroups.Subgroup_name != 'MRI' AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'Complete'
                        )
                )
            ";
    }
    /**
     * This function will return inprogress expression
     *
     * @return string get the inprogress expression
     */
    public function getInProgressExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    JOIN
                        test_names
                    ON
                        test_names.Test_name = flag.Test_name
                    JOIN
                        test_subgroups
                    ON
                        test_subgroups.ID = test_names.Sub_group
                    WHERE
                        flag.SessionID = session.ID AND
                        test_subgroups.Subgroup_name != 'MRI' AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'In Progress'
                        )
                )
            ";
    }
    /**
     * This function will return not started expression
     *
     * @return string get the not started expression
     */
    public function getNotStartedExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    JOIN
                        test_names
                    ON
                        test_names.Test_name = flag.Test_name
                    JOIN
                        test_subgroups
                    ON
                        test_subgroups.ID = test_names.Sub_group
                    WHERE
                        flag.SessionID = session.ID AND
                        test_subgroups.Subgroup_name != 'MRI' AND
                        flag.Data_entry IS NULL
                )
            ";
    }
}
 /**
  *      For MRI,
  *
  *      At least one of the two instruments must be complete,
  *
  *      + MRI Parameter Form
  *          + Test_name : mri_parameter_form
  *      + MRI Parameter Form (School Age)
  *          + Test_name : mri_parameter_form_sa
  *
  *      For now, requires at least one imaging browser upload.
  *      We don't know the exact requirement for now.
  *
  * @license Loris license
  */
class MriDataEntryExpression implements DataEntryExpression
{
    /**
     * This function will return complete expression
     *
     * @return string get the complete expression
     */
    public function getCompleteExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name IN (
                            'mri_parameter_form',
                            'mri_parameter_form_sa'
                        ) AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'Complete'
                        )
                ) OR
                EXISTS (
                	SELECT
                		*
            		FROM
            			files
            		WHERE
            			files.SessionID = session.ID AND
            			files.FileType = 'mnc'
                )
            ";
    }
    /**
     * This function will return inprogress expression
     *
     * @return string get the inprogress expression
     */
    public function getInProgressExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name IN (
                            'mri_parameter_form',
                            'mri_parameter_form_sa'
                        ) AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'In Progress'
                        )
                )
            ";
    }
    /**
     * This function will return not started expression
     *
     * @return string get the not started expression
     */
    public function getNotStartedExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name IN (
                            'mri_parameter_form',
                            'mri_parameter_form_sa'
                        ) AND
                        flag.Data_entry IS NULL
                ) OR
                NOT EXISTS (
                    SELECT
                        *
                    FROM
                        files
                    WHERE
                        files.SessionID = session.ID AND
                        files.FileType = 'mnc'
                )
            ";
    }
}
  /**
   *     //TODO Figure out what the appointment type is really called
   *     //DNA? Blood Collection?
   *     For Blood Collection,
   *
   *     Only the DNA Paramter Form (Test_name : DNA_parameter_form)
   *     must be complete.
   *
   * @license Loris license
   */
class BloodCollectionDataEntryExpression implements DataEntryExpression
{
    /**
     * This function will return complete expression
     *
     * @return string get the complete expression
     */
    public function getCompleteExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name = 'DNA_parameter_form' AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'Complete'
                        )
                )
            ";
    }
    /**
     * This function will return inprogress expression
     *
     * @return string get the inprogress expression
     */
    public function getInProgressExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name = 'DNA_parameter_form' AND
                        (
                            flag.Data_entry IS NOT NULL AND
                            flag.Data_entry = 'In Progress'
                        )
                )
            ";
    }
    /**
     * This function will return not started expression
     *
     * @return string get the not started expression
     */
    public function getNotStartedExpression() : string
    {
        return "
                EXISTS (
                    SELECT
                        *
                    FROM
                        flag
                    WHERE
                        flag.SessionID = session.ID AND
                        flag.Test_name = 'DNA_parameter_form' AND
                        flag.Data_entry IS NULL
                )
            ";
    }
}



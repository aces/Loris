<?php
/**
 * Data_entry.php
 *
 * PHP Version 7
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */
/**
 * Implement this interface for each Appointment Type
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */
interface DataEntryExpression
{
    /**
     * Determines in a list a process ids those that are ids of processes currently
     *  running.
     *
     * @return array list of process IDs (in $pids) that refer to running processes.
     */
    public function getCompleteExpression() : string;
    /**
     * Determines in a list a process ids those that are ids of processes currently
     *  running.
     *
     * @return array list of process IDs (in $pids) that refer to running processes.
     */
    public function getInProgressExpression() : string;
    /**
     * Determines in a list a process ids those that are ids of processes currently
     *  running.
     *
     * @return array list of process IDs (in $pids) that refer to running processes.
     */
    public function getNotStartedExpression() : string;
}
    /*
        Usage:

        $selectClause = new DataEntrySelectClause();
        $selectClause->register("Xxx", new XxxDataEntryExpression());
        $selectClause->register("Yyy", new YyyDataEntryExpression());
        $selectClause->register("Zzz", new ZzzDataEntryExpression());
        $columns = $selectClause->getColumns();

        -----

        $columns should be something like,

        (SomeQuery) AS hasDataEntryComplete,
        (SomeQuery) AS hasDataEntryInProgress,
        (SomeQuery) AS hasDataEntryNotStarted
    */
/**
 * DataEntrySelectClause
 *
 * @category Schedule
 * @package  Loris
 * @author   Suzanne Lee <suzannelee.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */
class DataEntrySelectClause
{
    private $expressions = [];
    public function register(string $type, DataEntryExpression $expr) : self
    {
        $this->expressions[$type] = $expr;
        return $this;
    }
    private function getColumn(string $columnName, callable $getExpression) : string
    {
        $columnName = Database::singleton()->escape($columnName);

        $parts = [];

        $parts[] = "(CASE appointment_type.Name";
        foreach ($this->expressions as $type=>$expr) {
            $quotedType = Database::singleton()->quote($type);
            $expression = $getExpression($expr);
            $parts[]    = "WHEN {$quotedType} THEN ({$expression})";
        }
        $parts[] = "ELSE FALSE";
        $parts[] = "END) AS {$columnName}";
        return implode("\n", $parts);
    }
    public function getCompleteColumn()
    {
        return $this->getColumn(
            "hasDataEntryComplete",
            function (DataEntryExpression $expr) : string {
                    return $expr->getCompleteExpression();
            }
        );
    }
    public function getInProgressColumn()
    {
        return $this->getColumn(
            "hasDataEntryInProgress",
            function (DataEntryExpression $expr) : string {
                    return $expr->getInProgressExpression();
            }
        );
    }
    public function getNotStartedColumn()
    {
        return $this->getColumn(
            "hasDataEntryNotStarted",
            function (DataEntryExpression $expr) : string {
                    return $expr->getNotStartedExpression();
            }
        );
    }
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
    /*
        For Behavioral, all instruments except MRI are checked.
    */
class BehavioralDataEntryExpression implements DataEntryExpression
{
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
    /*
        For MRI,

        At least one of the two instruments must be complete,

        + MRI Parameter Form
            + Test_name : mri_parameter_form
        + MRI Parameter Form (School Age)
            + Test_name : mri_parameter_form_sa

        For now, requires at least one imaging browser upload.
        We don't know the exact requirement for now.
    */
class MriDataEntryExpression implements DataEntryExpression
{
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

    /*
        //TODO Figure out what the appointment type is really called
        //DNA? Blood Collection?
        For Blood Collection,

        Only the DNA Paramter Form (Test_name : DNA_parameter_form)
        must be complete.
    */
class BloodCollectionDataEntryExpression implements DataEntryExpression
{
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

    $dataEntryColumns = (new DataEntrySelectClause())
        ->register("Behavioral", new BehavioralDataEntryExpression())
        ->register("MRI", new MriDataEntryExpression())
        ->register("Blood Collection", new BloodCollectionDataEntryExpression())
        ->getColumns();

    $dataEntryStatusExpression = "
    (
        CASE
            WHEN NOT (NOW() > StartsAt) THEN
                'Upcoming'
            WHEN hasDataEntryComplete THEN
                IF(
                    (hasDataEntryInProgress OR hasDataEntryNotStarted),
                    'In Progress',
                    'Complete'
                )
            WHEN hasDataEntryInProgress THEN
                'In Progress'
            WHEN hasDataEntryNotStarted THEN
                'Not Started'
            ELSE
                'No Data Found'
        END
    )
    ";


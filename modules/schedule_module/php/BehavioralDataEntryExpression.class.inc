<?php declare(strict_types=1);
namespace LORIS\schedule_module;
    /**
     * Behavioral Data Entry Expression
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


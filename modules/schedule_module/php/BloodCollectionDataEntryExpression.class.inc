<?php declare(strict_types=1);
namespace LORIS\schedule_module;
    /**
     * Blood Collection Data Entry Expression
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

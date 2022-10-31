<?php
namespace LORIS\schedule_module;
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

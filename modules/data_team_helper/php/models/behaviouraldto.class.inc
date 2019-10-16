<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Data_Team_Helper
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\data_team_helper\Models;

/**
 * A ProfileDTO represents an profile in the data team helper module.
 * It is doing the mapping between the profile table columns
 * and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface so it can be used by
 * a Database Provisioner.
 *
 * @category Data_Team_Helper
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class BehaviouralDTO implements \LORIS\Data\DataInstance
{
    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string
     */
    public function toJSON(): string
    {
        return json_encode(
            array(
             'FeedbackID'     => $this->FeedbackID,
             'CandID'         => $this->CandID,
             'SessionID'      => $this->SessionID,
             'CommentID'      => $this->CommentID,
             'Feedback_level' => $this->Feedback_level,
             'Test_name'      => $this->Test_name,
             'FieldName'      => $this->FieldName,
             'Full_name'      => $this->Full_name,
             'Visit_label'    => $this->Visit_label,
             'PSCID'          => $this->PSCID,
             'ProjectID'      => $this->ProjectID,
            )
        );
    }
    /**
     * Returns the FeedbackID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return string
     */
    public function getFeedbackID(): string
    {
        return (string) $this->FeedbackID;
    }
}

<?php declare(strict_types=1);

namespace LORIS\behavioural_qc\Provisioners;

/**
 * TThis class implements a data provisioner to get all feedback level
 * of visits.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class BehaviouralProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            "
            SELECT
                tn.Full_name AS _instrument,
                fb.CandID AS _candID,
                ca.PSCID AS _pscID,
                s.Visit_label AS _visit,
                COALESCE(s.ProjectID, ca.RegistrationProjectID) AS _project,
                s.CohortID AS _cohort,
                COALESCE(psc.CenterID, psc2.CenterID) AS _site,
	            fb.FeedbackID AS _feedbackID,
	            fb.SessionID AS _sessionID,
	            fb.CommentID AS _commentID,
                fb.Feedback_level AS _feedback_level,
                f.Test_name AS _test_name,
                fb.FieldName AS _field_name,
                fb.Status as _feedback_status
            FROM
                feedback_bvl_thread AS fb
                JOIN candidate ca ON (ca.CandID = fb.CandID)
                LEFT JOIN session s ON (s.ID = fb.SessionID)
                LEFT JOIN psc ON (s.CenterID = psc.CenterID)
                LEFT JOIN psc psc2 ON (ca.RegistrationCenterID=psc2.CenterID)
                LEFT JOIN flag f ON (fb.CommentID = f.CommentID)
                LEFT JOIN test_names tn ON (tn.Test_name = f.Test_name)
            WHERE
                fb.Public = 'Y'
                AND fb.Status = 'opened'
                AND fb.active = 'Y'
            ",
            [],
            '\LORIS\behavioural_qc\Models\BehaviouralDTO'
        );
    }

}

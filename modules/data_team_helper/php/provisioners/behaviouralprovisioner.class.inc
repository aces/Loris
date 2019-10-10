<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category DataTeamHelper
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\data_team_helper\Provisioners;

/**
 * Data Team Helper module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
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
            '
            SELECT
	            fb.FeedbackID,
	            fb.CandID,
	            fb.SessionID,
                fb.CommentID,
                fb.Feedback_level,
                f.Test_name,
                fb.FieldName,
                tn.Full_name,
                s.Visit_label,
                ca.PSCID
            FROM
                feedback_bvl_thread AS fb
                JOIN candidate ca ON (ca.CandID = fb.CandID)
                JOIN session s ON (s.ID = fb.SessionID)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN project_subproject_rel psr ON (s.SubprojectID = psr.SubprojectID)
                LEFT JOIN flag f ON (fb.CommentID = f.CommentID)
                LEFT JOIN test_names tn ON (tn.Test_name = f.Test_name)
            WHERE
                fb.Public = \'Y\'
                AND fb.Status = \'opened\'
                AND fb.active = \'Y\'
            ',
            array(),
            '\LORIS\data_team_helper\Models\BehaviouralDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return BehaviouralProvisioner
     */
    public function forUser(\User $user): BehaviouralProvisioner
    {
        $new = clone($this);
        if (!$user->hasPermission('access_all_profiles')) {
            $new = $new->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $new;
    }
}

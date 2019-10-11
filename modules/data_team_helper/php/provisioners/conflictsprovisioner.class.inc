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
class ConflictsProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            "
            SELECT DISTINCT
	          s.CandID,
	          ca.PSCID,
	          c.FieldName,
	          c.TableName,
	          t.full_name AS test_name_display,
	          s.visit_label
            FROM
	          conflicts_unresolved c
	          LEFT JOIN flag f ON (c.CommentId1 = f.CommentID)
	          LEFT JOIN session s ON (f.SessionID = s.ID)
	          LEFT JOIN candidate ca ON (ca.CandID = s.CandID)
	          JOIN test_names t ON (t.test_name = f.test_name)
	          JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE
	          ca.Active = 'Y'
	          AND s.Active = 'Y'
	          AND psc.Centerid != '1'
	          AND ca.Entity_type != 'Scanner'
            ",
            array(),
            '\LORIS\data_team_helper\Models\ConflictsDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return ConflictsProvisioner
     */
    public function forUser(\User $user): ConflictsProvisioner
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

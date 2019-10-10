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
class IncompleteProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            '
            SELECT DISTINCT
                s.ID,
                s.visit_label,
                c.PSCID,
                s.candid,
                f.SessionID,
                f.test_name,
                f.data_entry,
                f.commentid,
                t.Full_name
            FROM
	            session s
                JOIN flag f ON (f.sessionid = s.id)
                JOIN candidate c ON (c.candid = s.candid)
                JOIN test_names t ON (t.Test_name = f.Test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE
                s.Active = \'Y\'
                AND c.Active = \'Y\'
                AND coalesce(f.data_entry, \'In Progress\') = \'In Progress\'
                AND psc.Centerid != \'1\'
                AND c.Entity_type != \'Scanner\'
                AND(f.test_name IN(\'aosi\', \'bmi\', \'medical_history\', \'mri_parameter_form\', \'radiology_review\')
                    OR f.commentid NOT LIKE \'DDE_%\')
            ORDER BY
	            f.commentid
            ',
            array(),
            '\LORIS\data_team_helper\Models\IncompleteDTO'
        );
    }
    /**
     * Creates a new provisioner with user-specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return IncompleteProvisioner
     */
    public function forUser(\User $user): IncompleteProvisioner
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

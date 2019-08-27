<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\conflict_resolver;

/**
 * Conflict Resolver module
 *
 * PHP version 7
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class ResolvedProvisioner extends \LORIS\Data\Provisioners\DBObjectProvisioner
{
    /**
     * Create a RowProvisioner
     */
    function __construct()
    {
        parent::__construct(
            '
             SELECT
              conflicts_resolved.ResolvedID as resolvedid,
              conflicts_resolved.TableName as instrument,
              session.CandID as candid,
              candidate.PSCID as pscid,
              session.Visit_label as visitlabel,
              Project.Name as project,
              conflicts_resolved.FieldName as question,
              conflicts_resolved.OldValue1 as value1,
              conflicts_resolved.OldValue2 as value2,
              conflicts_resolved.NewValue  as correctanswer,
              conflicts_resolved.ResolutionTimestamp as resolutiontimestamp,
              psc.name as site,
              session.CenterID as centerid
             FROM
              conflicts_resolved
             LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID)
             LEFT JOIN session ON (flag.SessionID=session.ID)
             LEFT JOIN candidate ON (candidate.CandID=session.CandID)
             LEFT JOIN Project ON (candidate.ProjectID=Project.ProjectID )
             LEFT JOIN psc ON (session.CenterID = psc.CenterID)
             WHERE session.Active="Y" AND candidate.Active ="Y"
            ',
            array(),
            '\LORIS\conflict_resolver\ResolvedDTO'
        );
    }
    /**
     * Creates a new providionner with user specific filter.
     *
     * @param \User $user The requesting user
     *
     * @return ResolvedProvisioner
     */
    public function forUser(\User $user): ResolvedProvisioner
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

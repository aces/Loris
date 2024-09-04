<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category ConflictResolver
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\conflict_resolver\Provisioners;

/**
 * Conflict Resolver module
 *
 * PHP version 7
 *
 * @category ConflictResolver
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
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
              conflicts_resolved.TestName as instrument,
              session.CandID as candid,
              candidate.PSCID as pscid,
              session.Visit_label as visitlabel,
              Project.Name as project,
              conflicts_resolved.FieldName as question,
              conflicts_resolved.OldValue1 as value1,
              conflicts_resolved.OldValue2 as value2,
              CASE
                WHEN conflicts_resolved.NewValue = 1
                    THEN conflicts_resolved.OldValue1
                    ELSE conflicts_resolved.OldValue2
                END AS correctanswer,
              conflicts_resolved.ResolutionTimestamp as resolutiontimestamp,
              conflicts_resolved.User1 as user1,
              conflicts_resolved.User2 as user2,
              conflicts_resolved.UserID as resolver,
              psc.name as site,
              session.CenterID as centerid,
              Project.ProjectID as projectid
             FROM
              conflicts_resolved
             LEFT JOIN flag ON (conflicts_resolved.CommentId1=flag.CommentID)
             LEFT JOIN session ON (flag.SessionID=session.ID)
             LEFT JOIN candidate ON (candidate.CandID=session.CandID)
             LEFT JOIN Project ON (session.ProjectID=Project.ProjectID )
             LEFT JOIN psc ON (session.CenterID = psc.CenterID)
             WHERE session.Active="Y" AND candidate.Active ="Y"
            ',
            [],
            '\LORIS\conflict_resolver\Models\ResolvedDTO'
        );
    }
}

<?php declare(strict_types=1);
/**
 * PHP version 7
 *
 * @category Behavioral
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\conflict_resolver\Models;

/**
 * A ResolvedDTO represents a resolved conflict in the conflict
 * resolver module. It is doing the mapping between the resolved_conflicts
 * table columns and the JSON object properties returned to the frontend.
 *
 * Additionally, it implements the DataInstance interface so it can be used by
 * a Database Provisioner.
 *
 * @category Behavioral
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class ResolvedDTO implements \LORIS\Data\DataInstance
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
             'ResolvedID'          => $this->resolvedid,
             'Project'             => $this->project,
             'Site'                => $this->site,
             'CandID'              => $this->candid,
             'PSCID'               => $this->pscid,
             'Visit Label'         => $this->visitlabel,
             'Instrument'          => $this->instrument,
             'Question'            => $this->question,
             'Value 1'             => $this->value1,
             'Value 2'             => $this->value2,
             'Correct Answer'      => $this->correctanswer,
             'User 1'              => $this->user1,
             'User 2'              => $this->user2,
             'Resolver'            => $this->resolver,
             'ResolutionTimestamp' => $this->resolutiontimestamp,
            )
        );
    }
    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return integer
     */
    public function getCenterID(): int
    {
        return (int) $this->centerid;
    }
}

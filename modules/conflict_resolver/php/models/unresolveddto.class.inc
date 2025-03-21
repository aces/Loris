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

use \LORIS\Data\DataInstance;
use \LORIS\StudyEntities\SiteHaver;

/**
 * A UnresolvedDTO represents an unresolved conflict in the conflict
 * resolver module. It is doing the mapping between the unresolved_conflicts
 * table columns and the JSON object properties returned to the frontend.
 *
 * Additionnaly, it implements the DataInstance interface so it can be used by
 * a Dababase Provisioner.
 *
 * @category Behavioral
 * @package  Main
 * @author   Xavier Lecours <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
class UnresolvedDTO implements DataInstance, SiteHaver
{
    /**
     * Instance variables set by the DBObjectProvisioner
     */
    protected $conflictid;
    protected $projectid;
    protected $project;
    protected $cohort;
    protected $centerid;
    protected $site;
    protected $candid;
    protected $pscid;
    protected $visitlabel;
    protected $instrument;
    protected $question;
    protected $description;
    protected $value1;
    protected $value2;

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return [
            'ConflictID'  => $this->conflictid,
            'Project'     => $this->project,
            'Cohort'      => $this->cohort,
            'Site'        => $this->site,
            'CandID'      => $this->candid,
            'PSCID'       => $this->pscid,
            'Visit Label' => $this->visitlabel,
            'Instrument'  => $this->instrument,
            'Question'    => $this->question,
            'Description' => "",
            'Value 1'     => $this->value1,
            'Value 2'     => $this->value2,
        ];
    }

    /**
     * Returns the CenterID for this row, for filters such as
     * \LORIS\Data\Filters\UserSiteMatch to match again.
     *
     * @return \CenterID
     */
    public function getCenterID(): \CenterID
    {
        return \CenterID::singleton($this->centerid);
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return \ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return \ProjectID::singleton($this->projectid);
    }
}

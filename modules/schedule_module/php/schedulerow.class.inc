<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * row in the candidate list menu table.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\schedule_module;

/**
 * A CandidateListRow represents a row in the Candidate List menu table.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ScheduleRow implements \LORIS\Data\DataInstance,
    \LORIS\StudyEntities\SiteHaver
{
    protected $DBRow;
    protected $AppointmentID;
    protected $SessionID;
    protected $AppointmentTypeID;
    protected $StartsAt;
    protected $Day;
    protected $Time;
    protected $PSCID;
    protected $DCCID;
    protected $Visit_label;
    protected $CenterID;
    protected $SubprojectID;
    protected $Project;
    protected $Subproject;
    protected $started;
    protected $AppointmentTypeName;
    protected $site;
    protected $ProjectID;
    /**
     * Create a new CandidateListRow
     *
     * @param array      $row The row (in the same format as
     *                        \Database::pselectRow
     *                        returns.)
     * @param \CenterID  $cid The centerID affiliated with this row.
     * @param \ProjectID $pid The projectID affiliated with this row.
     */
    public function __construct(array $row, \CenterID $cid, \ProjectID $pid)
    {
        $this->AppointmentID     = $row['AppointmentID'];
        $this->SessionID         = $row['SessionID'];
        $this->AppointmentTypeID = $row['AppointmentTypeID'];
        $this->Day          = $row['day'];
        $this->Time         = substr($row['time'], 0, -3);
        $this->PSCID        = $row["PSCID"];
        $this->DCCID        = $row['DCCID'];
        $this->Visit_label  = $row['Visit_label'];
        $this->CenterID     = $row['CenterID'];
        $this->SubprojectID = $row['CohortID'];
        $this->Project      = $row['Project'];
        $this->Subproject   = $row['title'];
        $this->StartsAt     = $row['StartsAt'];
        $this->AppointmentTypeName = $row['AppointmentTypeName'];
        $this->site      = $row['Name'];
        $this->CenterID  = $cid;
        $this->ProjectID = $pid;
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        return
            [
                'DCCID'               => $this->DCCID,
                'PSCID'               => $this->PSCID,
                'site'                => $this->site,
                'VisitLabel'          => $this->Visit_label,
                'Project'             => $this->Project,
                'Subproject'          => $this->Subproject,
                'AppointmentTypeID'   =>$this->AppointmentTypeID,
                'Day'                 => $this->Day,
                'Time'                => $this->Time,
                'StartsAt'            =>$this->StartsAt,
                'SessionID'           =>$this->SessionID,
                'AppointmentID'       =>$this->AppointmentID,
                'AppointmentTypeName' => $this->AppointmentTypeName,
                'CenterID'            => $this->CenterID,
                'SubprojectID'        => $this->SubprojectID,
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
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return \ProjectID The ProjectID
     */
    public function getProjectID(): \ProjectID
    {
        return $this->ProjectID;
    }
}

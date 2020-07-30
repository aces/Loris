<?php declare(strict_types=1);
/**
 * Schedule Module
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\schedule_module;

/**
 * A ModuleRow represents a row in the schedule_module menu table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ModuleRow implements \LORIS\Data\DataInstance
{
    protected $AppointmentID;
    protected $SessionID;
    protected $AppointmentTypeID;
    protected $StartsAt;
    protected $CandID;
    protected $Visit_label;
    protected $CenterID;
    protected $SubprojectID;
    protected $Project;
    protected $Subproject;
    protected $started;
    protected $AppointmentTypeName;
    protected $site;
    protected $dataEntryStatus;
    /**
     * Create a new ModuleRow Instance.
     *
     * @param array $row The ModuleRow Instance
     */
    public function __construct(array $row)
    {
        $this->AppointmentID     = $row['AppointmentID'];
        $this->SessionID         = $row['SessionID'];
        $this->AppointmentTypeID = $row['AppointmentTypeID'];
        $this->Day          = $row['day'];
        $this->Time         = substr($row['time'], 0, -3);
        $this->PSCID        = $row["PSCID"];
        $this->CandID       = $row['CandID'];
        $this->Visit_label  = $row['Visit_label'];
        $this->CenterID     = $row['CenterID'];
        $this->SubprojectID = $row['SubprojectID'];
        $this->Project      = $row['Project'];
        $this->Subproject   = $row['title'];
        $this->StartsAt     = $row['StartsAt'];
        $this->AppointmentTypeName = $row['AppointmentTypeName'];
        $this->site            = $row['Name'];
        $this->dataEntryStatus = $row['dataEntryStatus'];
    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return array the instance data.
     */
    public function jsonSerialize() : array
    {
        return
            [
                'CandID'              => $this->CandID,
                'PSCID'               => $this->PSCID,
                'site'                => $this->site,
                'VisitLabel'          => $this->Visit_label,
                'Project'             => $this->Project,
                'Subproject'          => $this->Subproject,
                'AppointmentTypeID'   =>$this->AppointmentTypeID,
                'Day'                 => $this->Day,
                'Time'                => $this->Time,
                'earlyDate'           => $this->Day,
                'lateDate'            => $this->Day,
                'StartsAt'            =>$this->StartsAt,
                'dataEntryStatus'     => $this->dataEntryStatus,
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
     * @return integer The CenterID
     */
    public function getCenterID(): int
    {
        return $this->CenterID;
    }

    /**
     * Returns the ProjectID for this row, for filters such as
     * \LORIS\Data\Filters\UserProjectMatch to match again.
     *
     * @return integer The ProjectID
     */
    public function getProjectID(): int
    {
        return $this->ProjectID;
    }
}

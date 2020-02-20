<?php declare(strict_types=1);
/**
 * This class implements a data Instance which represents a single
 * module in the module_manager menu table.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\schedule_module;

/**
 * A ModuleRow represents a row in the module_manager menu table.
 *
 * The module_manager requires a specific "row" concept because
 * the \Module class does not have any concept of the Active flag
 * for the module in order to serialize it as JSON for the data
 * table.
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
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
        $this->AppointmentID = $row['AppointmentID'];
        $this->SessionID = $row['SessionID'];
        $this->AppointmentTypeID = $row['AppointmentTypeID'];
        $this->Day  = $row['day'];
        $this->Time = substr($row['time'], 0, -3);
        $this->PSCID    = $row["PSCID"];
        $this->CandID = $row['CandID'];
        $this->Visit_label = $row['Visit_label'];
        $this->CenterID = $row['CenterID'];
        $this->SubprojectID = $row['SubprojectID'];
        $this->Project = $row['Project'];
        $this->Subproject = $row['title'];
        $this->StartsAt = $row['StartsAt'];
        $this->AppointmentTypeName = $row['AppointmentTypeName'];
        $this->site = $row['Name'];
        $this->dataEntryStatus = $row['dataEntryStatus'];

    }

    /**
     * Implements \LORIS\Data\DataInstance interface for this row.
     *
     * @return string the instance data.
     */
    public function toJSON(): string
    {
        return json_encode(
            [
                'CandID'  => $this->CandID,
                'PSCID' => $this->PSCID,
                'site'  => $this->site,
                'Visit_label'  => $this->Visit_label,
                'Project'  => $this->Project,
                'Subproject'  => $this->Subproject,
                'AppointmentTypeName'  => $this->AppointmentTypeName,
                'Day'  => $this->Day,
                'Time'  => $this->Time,
                'earlyDate'  => $this->Day,
                'lateDate'  => $this->Day,
                'StartsAt'=>$this->StartsAt,
                'dataEntryStatus'  => $this->dataEntryStatus,
                'AppointmentID'=>$this->AppointmentID,
                'SessionID'=>$this->SessionID,
	        'AppointmentTypeID'=>$this->AppointmentTypeID,
	        'StartsAt'=>$this->StartsAt,
                'CenterID'  => $this->CenterID,
                'SubprojectID'  => $this->SubprojectID,
            ]
        );
    }

}

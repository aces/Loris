<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all modules
 * for the Module Manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\schedule_module;
include 'data_entry.class.inc';
/**
 * This class implements a data provisioner to get all modules
 * for the module manager menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Dave MacFarlane <dave.macfarlane@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ScheduleModuleProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ModuleManagerProvisioner, which gets modules for the
     * module manager menu table.
     */
    function __construct()
    {
  $dataEntryColumns = (new DataEntrySelectClause())
        ->register("Behavioral", new BehavioralDataEntryExpression())
        ->register("MRI", new MriDataEntryExpression())
        ->register("Blood Collection", new BloodCollectionDataEntryExpression())
        ->getColumns();
  $dataEntryStatusExpression = "
    (
        CASE
            WHEN NOT (NOW() > StartsAt) THEN
                'Upcoming'
            WHEN hasDataEntryComplete THEN
                IF(
                    (hasDataEntryInProgress OR hasDataEntryNotStarted),
                    'In Progress',
                    'Complete'
                )
            WHEN hasDataEntryInProgress THEN
                'In Progress'
            WHEN hasDataEntryNotStarted THEN
                'Not Started'
            ELSE
                'No Data Found'
        END
    )
    ";
  $subquery = "SELECT
    appointment.AppointmentID, 
    appointment.SessionID,
    appointment.AppointmentTypeID, 
    appointment.StartsAt,
    candidate.PSCID, 
    session.CandID,
    session.Visit_label,
    session.CenterID,
    session.SubprojectID,
    candidate.RegistrationProjectID,
    subproject.title,
    appointment.StartsAt AS started,
    appointment_type.Name AS AppointmentTypeName,
    psc.Name,".$dataEntryColumns." FROM
    appointment
JOIN
    appointment_type
ON
    appointment_type.AppointmentTypeID = appointment.AppointmentTypeID
JOIN
    session
ON
    appointment.SessionID = session.ID
JOIN
    candidate
ON
    session.CandID = candidate.CandID
JOIN
    subproject
ON
    session.SubprojectID = subproject.SubprojectID
JOIN
    psc
ON
    session.CenterID = psc.CenterID";
  
  $subquery=str_replace("\n"," ",$subquery);
  $query =  "select *, {$dataEntryStatusExpression} AS dataEntryStatus  FROM
            ({$subquery}) AS subQuery";
print_r($query);
        parent::__construct(
            $query,
            array()
        );

    }

    /**
     * Returns an instance of a ModuleRow object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ModuleRow($row);
    }
}

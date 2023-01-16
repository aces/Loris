<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to the schedule_module menu page.
 *
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
require 'data_entry.class.inc';
require 'DataEntrySelectClause.class.inc';
require 'MriDataEntryExpression.class.inc';
require 'BloodCollectionDataEntryExpression.class.inc';
require 'BehavioralDataEntryExpression.class.inc';
// require 'MriDataEntryExpression.class.inc';
/**
 * This class implements a data provisioner to get all modules
 * for the schedule_module menu page.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage Core
 * @author     Shen Wang <wangshen.mcin@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ScheduleModuleProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ScheduleModuleProvisioner, which gets modules for the
     * Schedule Module menu table.
     */
    function __construct()
    {
        parent::__construct(
            $this->getQuery(),
            []
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
    /**
     * Returns a SQL query string.
     *
     * @return string A SQL query string.
     */
    public function getQuery() : string
    {
        $dataEntryColumns          = (new DataEntrySelectClause())
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
    date(appointment.StartsAt) as day,
    time(appointment.StartsAt) as time,
    candidate.PSCID, 
    session.CandID,
    session.Visit_label,
    session.CenterID,
    session.CohortID,
    Project.Name AS Project,
    subproject.title,
    appointment.StartsAt AS StartsAt,
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
    Project
ON
    candidate.RegistrationProjectID = Project.ProjectID
JOIN
    cohort
ON
    session.CohortID = cohort.CohortID
JOIN
    psc
ON
    session.CenterID = psc.CenterID";

        $subquery =str_replace("\n", " ", $subquery);
        $query    =  "select *, {$dataEntryStatusExpression} AS dataEntryStatus  FROM
            ({$subquery}) AS subQuery";
            return $query;
    }
}

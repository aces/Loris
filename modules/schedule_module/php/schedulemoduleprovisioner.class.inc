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
    /**
     * Returns a SQL query string.
     *
     * @return string A SQL query string.
     */
    public function getQuery() : string
    {
        $subquery = "SELECT
    appointment.AppointmentID, 
    appointment.SessionID,
    appointment.AppointmentTypeID, 
    date(appointment.StartsAt) as day,
    time(appointment.StartsAt) as time,
    candidate.PSCID, 
    session.CandID AS DCCID,
    session.Visit_label,
    session.CenterID,
    session.CohortID,
    Project.Name AS Project,
    cohort.title,
    appointment.StartsAt AS StartsAt,
    appointment_type.Name AS AppointmentTypeName,
    psc.Name,
                candidate.RegistrationCenterID,
                candidate.RegistrationProjectID
  FROM
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

        $query =str_replace("\n", " ", $subquery);
            return $query;

    }
        /**
         * Returns an instance of a CandidateListRow object for a given
         * table row.
         *
         * @param array $row The database row from the LORIS Database class.
         *
         * @return \LORIS\Data\DataInstance An instance representing this row.
         */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        // XXX This should probably be updated to allow users
        // to access candidates who have any session at one of the
        // user's sites, but for now this maintains the previous
        // behaviour of requiring the registration site to match
        // one of the user's sites.
        $cid = \CenterID::singleton(intval($row['RegistrationCenterID']));
        $pid = \ProjectID::singleton(intval($row['RegistrationProjectID']));
        unset($row['RegistrationCenterID']);
        unset($row['RegistrationProjectID']);
        return new ScheduleRow($row, $cid, $pid);
    }
}


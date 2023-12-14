<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the candidate list menu page.
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

namespace LORIS\candidate_list;

/**
 * This class implements a data provisioner to get all possible rows
 * for the candidate list menu page.
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
class CandidateListRowProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a CandidateListRowProvisioner, which gets rows for
     * the candidate_list menu table.
     */
    function __construct()
    {
        $factory  = \NDB_Factory::singleton();
        $config   = $factory->config();
        $maybeEDC = '';
        $maybeDoB = '';
        if ($config->getSetting("useEDC") === "true") {
            $maybeEDC = ", DATE_FORMAT((c.EDC),'%Y-%m-%d') AS EDC";
        }
        if ($config->getSetting("useDoB") === "true") {
            $maybeDoB = ", DATE_FORMAT((c.DoB),'%Y-%m-%d') AS DoB2";
        }
        parent::__construct(
            "SELECT
                c.PSCID,
                c.CandID AS DCCID,
                GROUP_CONCAT(DISTINCT s.Visit_label) AS VisitLabel,
                psc.Name AS RegistrationSite,
                GROUP_CONCAT(DISTINCT sp.title) AS Cohort,
                c.Entity_type AS EntityType,
                MAX(s.Scan_done) AS scanDone,
                COALESCE(pso.Description,'Active') AS ParticipantStatus,
                CONCAT(
                       (CASE
			    WHEN YEAR(CURDATE()) < YEAR(c.DoB) THEN 0#or some such validation
			    ELSE  YEAR(CURDATE()) - YEAR(c.DoB) 
			    END),' y / ',
                        (CASE
			    WHEN MONTH(CURDATE()) < MONTH(c.DoB) THEN MONTH(c.DoB) - MONTH(CURDATE())
			    ELSE MONTH(CURDATE()) - MONTH(c.DoB)
			    END),' m') as DoB,
                DATE_FORMAT(c.Date_registered,'%Y-%m-%d') AS Date_registered,
                c.Sex,
                COUNT(DISTINCT s.Visit_label) AS VisitCount,
                IFNULL(MIN(feedback_bvl_thread.Status+0),0) AS Feedback,
                p.Name AS RegistrationProject,
                c.RegistrationCenterID,
                c.RegistrationProjectID
                $maybeEDC
                $maybeDoB
                FROM candidate c
                    LEFT JOIN psc ON (c.RegistrationCenterID=psc.CenterID)
                    LEFT JOIN session s ON (c.CandID = s.CandID AND s.Active = 'Y')
                    LEFT JOIN feedback_bvl_thread
                        ON (c.CandID=feedback_bvl_thread.CandID)
                    LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                    LEFT JOIN participant_status_options pso
                        ON (ps.participant_status=pso.ID)
                    LEFT JOIN Project p ON (c.RegistrationProjectID=p.ProjectID)
                    LEFT JOIN cohort sp ON (s.CohortID=sp.CohortID)
                WHERE c.Active = 'Y'
                AND c.RegistrationProjectID IS NOT NULL
                GROUP BY c.CandID, psc.Name, c.PSCID, c.Sex
                ORDER BY c.PSCID ASC
            ",
            []
        );
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
        $cid = new \CenterID($row['RegistrationCenterID']);
        $pid = new \ProjectID($row['RegistrationProjectID']);
        unset($row['RegistrationCenterID']);
        unset($row['RegistrationProjectID']);
        return new CandidateListRow($row, $cid, $pid);
    }
}
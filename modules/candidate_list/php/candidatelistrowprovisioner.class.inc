<?php
/**
 * This file implements a data provisioner to get all possible rows
 * for the dicom archive menu page.
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
 * for the dicom archive menu page.
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
     * Create a CandidateListRowProvisioner, which gets rows for the candidate_list
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT psc.Name AS Site,
                 c.CandID AS DCCID,
                 c.PSCID,
                 c.Gender,
                 c.Entity_type,
                 COALESCE(pso.Description,'Active') AS Participant_Status,
                 p.Name as Project,
                 GROUP_CONCAT(DISTINCT sp.title) as Subproject,
                 DATE_FORMAT(c.DoB,'%Y-%m-%d') AS DoB,
                 MAX(s.Scan_done) as scan_Done,
                 COUNT(DISTINCT s.Visit_label),
                 max(s.Current_stage) as Latest_visit_status,
                 IFNULL(MIN(feedback_bvl_thread.Status+0),0),
                 c.CenterID
            FROM candidate c
                LEFT JOIN psc ON (c.CenterID=psc.CenterID)
                LEFT JOIN session s ON (c.CandID = s.CandID AND s.Active = 'Y')
                LEFT JOIN feedback_bvl_thread
                    ON (c.CandID=feedback_bvl_thread.CandID)
                LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
                LEFT JOIN participant_status_options pso
                    ON (ps.participant_status=pso.ID)
                LEFT JOIN Project p ON (c.ProjectID=p.ProjectID)
                LEFT JOIN subproject sp ON (s.SubprojectID=sp.SubprojectID)
                WHERE c.Active = 'Y'
            GROUP BY c.CandID, psc.Name, c.PSCID, c.Gender
            ORDER BY c.PSCID ASC",
            array()
    );
    }

    /**
     * Returns an instance of a DICOMArchiveRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            $cid = $row['CenterID'];
            unset($row['CenterID']);
            return new CandidateListRow($row, $cid);
    }
}

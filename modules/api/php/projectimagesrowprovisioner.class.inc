<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible rows
 * for the projects/$projectname/images endpoint
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api;

use \LORIS\Data\Provisioners\DBRowProvisioner;
/**
 * This class implements a data provisioner to get all possible rows
 * for the projects/$projectname/images endpoint
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectImagesRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner, which gets rows for projects/$projectname/images
     * endpoint.
     *
     * @param \Project  $project The project from which images are requested
     * @param \DateTime $since   The project from which images are requested
     */
    function __construct(\Project $project, \DateTime $since)
    {
        parent::__construct(
            '
             SELECT
               s.CandID as Candidate,
               c.PSCID as PSCID,
               c.Entity_type as Entity_type, 
               s.Visit_label as Visit,
               s.Date_visit as Visit_date,
               s.CenterID as CenterID,
               p.Name as Site,
               f.File as File,
               f.InsertTime as InsertTime,
               mst.Scan_type as ScanType,
               qc.QCStatus as QC_status,
               qc.Selected as Selected
             FROM
               files f
             LEFT JOIN mri_scan_type mst
               ON (mst.ID = f.AcquisitionProtocolID)
             LEFT JOIN session s
               ON (f.SessionID = s.ID)
             LEFT JOIN candidate c
               ON (s.CandID = c.CandID)
             LEFT JOIN psc p
               ON (s.CenterID = p.CenterID)
             LEFT JOIN files_qcstatus qc
               ON (f.FileID = qc.FileID)
             LEFT JOIN Project project
               ON (s.ProjectID = project.ProjectID)
             WHERE
               c.Active = "Y" AND
               s.Active = "Y" AND
               project.Name = :v_projectname AND
               f.InsertTime > :v_time
             ORDER BY f.InsertTime ASC
            ',
            array(
                'v_projectname' => $project->getName(),
                'v_time'        => $since->getTimestamp(),
            )
        );
    }

    /**
     * Returns an instance of a ProjectImagesRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new ProjectImagesRow($row);
    }
}


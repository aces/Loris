<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all images of a project
 * created since a given date.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Provisioners;

use \LORIS\Data\Provisioners\DBRowProvisioner;
use \LORIS\api\Models\ProjectImagesRow;
/**
 * This file implements a data provisioner to get all images of a project
 * created since a given date.
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
     * Create a RowProvisioner
     *
     * @param \LORIS\LorisInstance $loris   The LORIS instance to retrieve data
     *                                      from.
     * @param \Project             $project The project from which images are
     *                                      requested.
     * @param \DateTime            $since   The project from which images are
     *                                      requested.
     */
    function __construct(
        protected \LORIS\LorisInstance $loris,
        \Project $project,
        \DateTime $since
    ) {
        parent::__construct(
            $this->loris,
            '
             SELECT
               c.CandID as Candidate,
               c.PSCID as PSCID,
               c.Entity_type as Entity_type,
               s.Visit_label as Visit,
               s.Date_visit as Visit_date,
               s.CenterID as CenterID,
               p.Name as Site,
               f.InsertTime as InsertTime,
               f.File as File,
               mst.MriScanTypeName AS ScanType,
               qc.QCStatus as QC_status,
               qc.Selected as Selected
             FROM
               files f
             LEFT JOIN mri_scan_type mst
               ON (mst.MriScanTypeID = f.MriScanTypeID)
             LEFT JOIN session s
               ON (f.SessionID = s.ID)
             LEFT JOIN candidate c
               ON (s.CandidateID = c.ID)
             LEFT JOIN psc p
               ON (s.CenterID = p.CenterID)
             LEFT JOIN files_qcstatus qc
               ON (f.FileID = qc.FileID)
             LEFT JOIN Project project
               ON (c.RegistrationProjectID = project.ProjectID)
             WHERE
               c.Active = \'Y\' AND
               s.Active = \'Y\' AND
               project.Name = :v_projectname AND
               f.InsertTime > :v_time
             ORDER BY f.InsertTime ASC
            ',
            [
                'v_projectname' => $project->getName(),
                'v_time'        => $since->getTimestamp(),
            ]
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


<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all electrophysiology recordings
 * of a project created since a given date.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\api\Provisioners;

use LORIS\Data\Provisioners\DBRowProvisioner;
use \LORIS\api\Models\ProjectRecordingsRow;

/**
 * This file implements a data provisioner to get all electrophysiology recordings
 * of a project created since a given date.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectRecordingsRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner.
     *
     * @param \Project  $project The project from which recordings are requested
     * @param \DateTime $since   The project from which recordings are requested
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
               f.FilePath as File,
               pm.PhysiologicalModality as Modality,
               f.InsertTime as InsertTime
             FROM
               physiological_file f
             LEFT JOIN session s
               ON (f.SessionID = s.ID)
             LEFT JOIN candidate c
               ON (s.CandID = c.CandID)
             LEFT JOIN psc p
               ON (s.CenterID = p.CenterID)
             LEFT JOIN Project project
               ON (s.ProjectID = project.ProjectID)
             LEFT JOIN physiological_modality pm
               ON (pm.PhysiologicalModalityID = f.PhysiologicalModalityID)
             WHERE
               c.Active = \'Y\' AND
               s.Active = \'Y\' AND
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
     * Returns an instance of a ProjectElectrophysiologyRow object for a given
     * table row.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        return new ProjectRecordingsRow($row);
    }
}
<?php declare(strict_types=1);

/**
 * This file implements a data provisioner to get all electrophysiology recordings
 * of a project created since a given date.
 *
 * PHP Version 8
 *
 * @category API
 * @package  LORIS
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
 * PHP Version 8
 *
 * @category API
 * @package  LORIS
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectRecordingsRowProvisioner extends DBRowProvisioner
{
    /**
     * Create a RowProvisioner.
     *
     * @param \LORIS\LorisInstance $loris   The LORIS instance to retrieve data
     *                                      from.
     * @param \Project             $project The project from which recordings are
     *                                      requested.
     * @param \DateTime            $since   The project from which recordings are
     *                                      requested.
     */
    function __construct(
        protected \LORIS\LorisInstance $loris,
        \Project $project,
        \DateTime $since
    ) {
        // NOTE: we use string concatenation instead of a bind parameter for
        // the $since parameter. PDOStatement->bindValues converts the parameter to
        // a string. Timestamp > '0' is either a warning or exception depending
        // on SQL configuration, (Timestamp > 0 is correct). The string concatenation
        // ensures that it remains an int.
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
               f.FilePath as File,
               pm.PhysiologicalModality as Modality,
               f.InsertTime as InsertTime
             FROM
               physiological_file f
             LEFT JOIN session s
               ON (f.SessionID = s.ID)
             LEFT JOIN candidate c
               ON (s.CandidateID = c.ID)
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
               f.InsertTime > ' . intval($since->getTimestamp()) . '
             ORDER BY f.InsertTime ASC
            ',
            [
                'v_projectname' => $project->getName(),
            ]
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

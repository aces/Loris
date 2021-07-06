<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all dicoms of a project
 * created since a given date.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Simon Pelletier <simon.pelletier@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Provisioners;

use \LORIS\Data\Provisioners\DBObjectProvisioner;
/**
 * This file implements a data provisioner to get all dicoms of a project
 * created since a given date.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Simon Pelletier <simon.pelletier@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectDicomsObjectProvisioner extends DBObjectProvisioner
{
    /**
     * Create a ObjectProvisioner
     *
     * @param \Project  $project   The project from which dicoms are requested
     * @param \DateTime $since     The date from which dicoms are requested
     * @param string    $classname The class name of the returned objects
     */
    function __construct(
        \Project $project,
        \DateTime $since,
        string $classname='LORIS\api\Models\ProjectDicoms'
    ) {
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
               t.DateAcquired as date_acquired,
               t.DateFirstArchived as date_first_archived,
               t.DateLastArchived as date_last_archived,
               t.TarchiveID as tarchiveid,
               t.DicomArchiveID as DicomArchiveID,
               t.ArchiveLocation as Archive,
	           t.SourceLocation as Source
             FROM
               tarchive t
             LEFT JOIN  session s
               ON (t.SessionID = s.ID)
             LEFT JOIN candidate c
               ON (s.CandID = c.CandID)
             LEFT JOIN psc p
               ON (s.CenterID = p.CenterID)
             LEFT JOIN Project project
               ON (c.RegistrationProjectID = project.ProjectID)
             WHERE
               c.Active = \'Y\' AND
               s.Active = \'Y\' AND
               project.Name = :v_projectname AND
               t.DateLastArchived > :v_time
             ORDER BY t.DateLastArchived ASC;	    ',
            [
                'v_projectname' => $project->getName(),
                'v_time'        => $since->getTimestamp(),
            ],
            $classname
        );
    }
}


<?php declare(strict_types=1);
namespace LORIS\mri_violations;

/**
 * A Provisioner to return all resolved violations for the
 * resolved tab in the module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ResolvedViolationsProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ResolvedViolationsProvisioner.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT 
                v.Resolved as Resolution_status,
                v.Project,
                v.Subproject,
                v.PatientName as PatientName,
                v.Site,
                v.TimeRun as TimeRun,
                v.MincFile as MincFile,
                v.Series_Description as Series_Description_Or_Scan_Type,
                v.Problem as Problem,
                v.SeriesUID as SeriesUID,
                v.hash as Hash,
                v.join_id as JoinID
            FROM (
                SELECT PatientName as PatientName,
                    time_run as TimeRun,
                    s.ProjectID as Project,
                    s.SubprojectID as Subproject,
                    minc_location as MincFile,
                    series_description as Series_Description,
                    'Could not identify scan type' as Problem, 
                    SeriesUID,
                    md5(concat_WS(':',
                                  minc_location,
                                  PatientName,
                                  SeriesUID,
                                  time_run
                       )
                    ) as hash,
                    mpvs.ID as join_id,                
                    p.CenterID as Site,
                    violations_resolved.Resolved as Resolved
                FROM mri_protocol_violated_scans AS mpvs
                    LEFT JOIN violations_resolved
                    ON (violations_resolved.ExtID=mpvs.ID 
                    AND violations_resolved.TypeTable='mri_protocol_violated_scans')
                    LEFT JOIN candidate c
                    ON (mpvs.CandID = c.CandID)
                    LEFT JOIN session s
                    ON (SUBSTRING_INDEX(mpvs.PatientName,'_',-1) = s.Visit_label 
                        AND mpvs.CandID = s.CandID
                    )
                    LEFT JOIN psc p
                    ON (p.CenterID = s.CenterID)
                    WHERE Resolved <> '0'
             UNION
                SELECT PatientName,
                    TimeRun,
                    s.ProjectID as Project,
                    s.SubprojectID as Subproject,
                    MincFile,
                    mri_scan_type.Scan_type,
                    'Protocol Violation',
                    SeriesUID,
                    md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun))
                       as hash,
                    mrl.LogID as join_id,
                    p.CenterID as Site,
                    violations_resolved.Resolved as Resolved
                FROM mri_violations_log AS mrl
                    LEFT JOIN mri_scan_type 
                    ON (mri_scan_type.ID=mrl.Scan_type)
                    LEFT JOIN violations_resolved
                    ON (violations_resolved.ExtID=mrl.LogID 
                    AND violations_resolved.TypeTable='mri_violations_log')
                    LEFT JOIN candidate c
                    ON (mrl.CandID=c.CandID)
                    LEFT JOIN session s
                    ON (mrl.Visit_label = s.Visit_label AND mrl.CandID = s.CandID)
                    LEFT JOIN psc p
                    ON (p.CenterID = s.CenterID)
                    WHERE Resolved <> '0'
             UNION
                SELECT PatientName,
                    TimeRun,
                    null,
                    null,
                    MincFile,
                    null,
                    Reason, 
                    SeriesUID,
                    md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun))
                       as hash,
                    MRICandidateErrors.ID as join_id,
                    null,
                    violations_resolved.Resolved as Resolved
                FROM MRICandidateErrors
                    LEFT JOIN violations_resolved
                        ON (violations_resolved.ExtID=MRICandidateErrors.ID 
                        AND violations_resolved.TypeTable='MRICandidateErrors')
                WHERE Resolved <> '0'
             ) as v",
            []
        );
    }

    /**
     * Returns an instance of a ResolvedViolation object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ResolvedViolation($row);
    }
}

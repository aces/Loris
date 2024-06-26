<?php declare(strict_types=1);
namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all violations.
 * It is the base provisioner for the main page of the mri_violations
 * module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Provisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a Provisioner for the module.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT v.PatientName,
                    v.Project,
                    v.Cohort,
                    v.Site,
                    v.TimeRun,
                    v.MincFile,
                    v.Series_Description as Series_Description_Or_Scan_Type,
                    v.Problem,
                    v.Resolved as Resolution_status,
                    v.SeriesUID,
                    v.hash,
                    v.join_id,
                    v.TarchiveID,
                    v.CandID,
                    v.PSCID
              FROM " . self::getViolationsQueryTable(),
            []
        );
    }

    /**
     * Get the "FROM" clause of the query for the MRI violations table, this
     * is reused by both the dashboard widget and the provisioner to ensure
     * the same results are returned.
     *
     * @return string
     */
    static public function getViolationsQueryTable()
    {
        return "(SELECT PatientName    AS PatientName,
                       time_run       AS TimeRun,
                       s.ProjectID    AS Project,
                       s.CohortID AS Cohort,
                       minc_location  AS MincFile,
                       series_description AS Series_Description,
                       'Could not identify scan type' AS Problem,
                       SeriesUID,
                       md5(
                         concat_WS(
                           ':',minc_location,PatientName,SeriesUID,time_run,
                           PhaseEncodingDirection,TE_range,EchoNumber
                         )
                       ) AS hash,
                       mpvs.ID AS join_id,
                       p.CenterID AS Site,
                       COALESCE(
                         violations_resolved.Resolved, 'unresolved'
                       ) AS Resolved,
                       mpvs.TarchiveID AS TarchiveID,
                       mpvs.CandID AS CandID,
                       c.PSCID AS PSCID
                FROM mri_protocol_violated_scans AS mpvs
                LEFT JOIN violations_resolved ON (
                      violations_resolved.ExtID=mpvs.ID
                  AND violations_resolved.TypeTable='mri_protocol_violated_scans'
                )
                LEFT JOIN candidate c ON (mpvs.CandID = c.CandID)
                LEFT JOIN session s ON (
                      SUBSTRING_INDEX(mpvs.PatientName,'_',-1) = s.Visit_label
                  AND mpvs.CandID = s.CandID
                )
                LEFT JOIN psc p ON (p.CenterID = s.CenterID)
              UNION
                SELECT PatientName,
                       TimeRun,
                       s.ProjectID AS Project,
                       s.CohortID AS Cohort,
                       MincFile,
                       mri_scan_type.Scan_type,
                       'Protocol Violation',
                       SeriesUID,
                       md5(
                         concat_WS(
                           ':', MincFile, PatientName, SeriesUID, TimeRun,
                           PhaseEncodingDirection,EchoTime,EchoNumber
                         )
                       ) AS hash,
                       MIN(mrl.LogID) AS join_id,
                       p.CenterID AS Site,
                       COALESCE(
                         violations_resolved.Resolved, 'unresolved'
                       ) AS Resolved,
                       mrl.TarchiveID AS TarchiveID,
                       mrl.CandID AS CandID,
                       c.PSCID AS PSCID
                FROM mri_violations_log AS mrl
                LEFT JOIN mri_scan_type ON (mri_scan_type.ID=mrl.MriScanTypeID)
                LEFT JOIN violations_resolved ON (
                      violations_resolved.ExtID=mrl.LogID
                  AND violations_resolved.TypeTable='mri_violations_log'
                )
                LEFT JOIN candidate c ON (mrl.CandID=c.CandID)
                LEFT JOIN session s ON (
                  mrl.Visit_label = s.Visit_label AND mrl.CandID=s.CandID
                )
                LEFT JOIN psc p ON (p.CenterID = s.CenterID)
                GROUP BY PatientName, TimeRun, Project, Cohort, MincFile,
                  Scan_type, SeriesUID, Site, hash, Resolved, TarchiveID,
                  CandID, PSCID, PhaseEncodingDirection, EchoTime, EchoNumber
              UNION
                  SELECT PatientName,
                         TimeRun,
                         null,
                         null,
                         MincFile,
                         null,
                         Reason,
                         SeriesUID,
                         md5(
                           concat_WS(
                             ':', MincFile, PatientName, SeriesUID, TimeRun,
                             PhaseEncodingDirection,EchoTime,EchoNumber
                           )
                         ) AS hash,
                         MRICandidateErrors.ID AS join_id,
                         null,
                         COALESCE(
                            violations_resolved.Resolved, 'unresolved'
                         ) AS Resolved,
                         MRICandidateErrors.TarchiveID AS TarchiveID,
                         NULL AS CandID,
                         NULL AS PSCID
                  FROM MRICandidateErrors
                  LEFT JOIN violations_resolved ON (
                        violations_resolved.ExtID=MRICandidateErrors.ID
                    AND violations_resolved.TypeTable='MRICandidateErrors'
                  )
            ) AS v";
    }

    /**
     * Returns an instance of a MRIViolation object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new MRIViolation($row);
    }
}

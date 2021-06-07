<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Provisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     */
    function __construct()
    {
        parent::__construct(
            "SELECT v.PatientName,
                    v.Project,
                    v.Subproject,
                    v.Site,
                    v.TimeRun,
                    v.MincFile,
                    v.Series_Description as Series_Description_Or_Scan_Type,
                    v.Problem,
                    v.SeriesUID,
                    v.hash,
                    v.join_id,
                    v.Resolved,
                    v.TarchiveID,
                    v.CandID,
                    v.PSCID
              FROM " . self::getViolationsQueryTable(),
            []
        );
    }

    /**
     * Get the "FROM" clause of the query for the MRI violations table, this
     * is reused by both the dashboard widget and the provisioner.
     *
     * @return string
     */
    static public function getViolationsQueryTable() {
        return "(SELECT PatientName    AS PatientName,
                       time_run       AS TimeRun,
                       s.ProjectID    AS Project,
                       s.SubprojectID AS Subproject,
                       minc_location  AS MincFile,
                       series_description AS Series_Description,
                       'Could not identify scan type' AS Problem,
                       SeriesUID,
                       md5(
                         concat_WS(
                           ':',minc_location,PatientName,SeriesUID,time_run
                         )
                       ) AS hash,
                       mpvs.ID AS join_id,
                       p.CenterID AS Site,
                       violations_resolved.Resolved AS Resolved,
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
                WHERE Resolved is NULL
              UNION
                SELECT PatientName,
                       TimeRun,
                       s.ProjectID AS Project,
                       s.SubprojectID AS Subproject,
                       MincFile,
                       mri_scan_type.Scan_type,
                       'Protocol Violation',
                       SeriesUID,
                       md5(
                         concat_WS(':', MincFile, PatientName, SeriesUID, TimeRun)
                       ) AS hash,
                       mrl.LogID AS join_id,
                       p.CenterID AS Site,
                       violations_resolved.Resolved AS Resolved,
                       mrl.TarchiveID AS TarchiveID,
                       mrl.CandID AS CandID,
                       c.PSCID AS PSCID
                FROM mri_violations_log AS mrl
                LEFT JOIN mri_scan_type ON (mri_scan_type.ID=mrl.Scan_type)
                LEFT JOIN violations_resolved ON (
                      violations_resolved.ExtID=mrl.LogID
                  AND violations_resolved.TypeTable='mri_violations_log'
                )
                LEFT JOIN candidate c ON (mrl.CandID=c.CandID)
                LEFT JOIN session s ON (
                  mrl.Visit_label = s.Visit_label AND mrl.CandID=s.CandID
                )
                LEFT JOIN psc p ON (p.CenterID = s.CenterID)
                WHERE Resolved is NULL
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
                           concat_WS(':', MincFile, PatientName, SeriesUID, TimeRun)
                         ) AS hash,
                         MRICandidateErrors.ID AS join_id,
                         null,
                         violations_resolved.Resolved AS Resolved,
                         MRICandidateErrors.TarchiveID AS TarchiveID,
                         NULL AS CandID,
                         NULL AS PSCID
                  FROM MRICandidateErrors
                  LEFT JOIN violations_resolved ON (
                        violations_resolved.ExtID=MRICandidateErrors.ID
                    AND violations_resolved.TypeTable='MRICandidateErrors'
                  )
                  WHERE Resolved is NULL
            ) AS v";
    }

    /**
     * Returns an instance of a MediaFile object.
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

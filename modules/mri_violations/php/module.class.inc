<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{

    /* The below class constant is created to fetch the mri violations log
    from database.
    Recreating the path (MincFileViolated field) to the minc file
    for the table mri_violations_log is more complicated
    because of the 3 cases that can occur as we pull the data from the db.
         1. if the Mincfile starts with "assembly" then we need to
            add the directory path in front of it.
         2. if the word "assembly" is there but not at the beginning,
           then uses it as is, the path is correct.
         3. if it is not in the assembly dir, then it is in the trashbin,
            so we fix the path with that in mind.
      */

    const MRI_VIOLATED_SCAN_QUERY_CONST = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem,
                SeriesUID,
                md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run))
                  as hash,
                mpvs.ID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved,
                mpvs.TarchiveID as TarchiveID,
                mpvs.CandID as CandID,
                c.PSCID as PSCID
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
            WHERE Resolved is NULL"
    . " UNION " .
    "SELECT PatientName,
                TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',
                              MincFile,
                              PatientName,
                              SeriesUID,
                              TimeRun
                   )
                ) as hash,
                mrl.LogID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved,
                mrl.TarchiveID as TarchiveID,
                mrl.CandID as CandID,
                c.PSCID as PSCID
            FROM mri_violations_log AS mrl
            LEFT JOIN mri_scan_type
            ON (mri_scan_type.ID=mrl.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mrl.LogID 
            AND violations_resolved.TypeTable='mri_violations_log')
            LEFT JOIN candidate c
            ON (mrl.CandID=c.CandID)
            LEFT JOIN session s
            ON (mrl.Visit_label = s.Visit_label AND mrl.CandID=s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved is NULL"
    . " UNION " .
    "SELECT PatientName,
                TimeRun,
                null,
                null,
                MincFile,
                null,
                Reason,
                SeriesUID,
                md5(concat_WS(':',
                              MincFile,
                              PatientName,
                              SeriesUID,
                              TimeRun
                   )
                ) as hash,
                MRICandidateErrors.ID as join_id,
                null,
                violations_resolved.Resolved as Resolved,
                MRICandidateErrors.TarchiveID as TarchiveID,
                NULL as CandID,
                NULL as PSCID
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')
            WHERE Resolved is NULL)
            as v LEFT JOIN psc site ON (site.CenterID = v.Site) 
            LEFT JOIN Project as pjct ON (v.Project = pjct.ProjectID)
            LEFT JOIN subproject as subpjct
                ON (v.Subproject = subpjct.SubprojectID)
            WHERE 1=1";
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user whose access is being checked.
     *
     * @return bool whether access is granted
     */
    public function hasAccess(\User $user) : bool
    {
        return parent::hasAccess($user) &&
            $user->hasAnyPermission(
                [
                    'violated_scans_view_allsites',
                    'violated_scans_edit'
                ]
            );
    }

    /**
     * {@inheritDoc}
     *
     * @return string The menu category for this module
     */
    public function getMenuCategory() : string
    {
        return "Imaging";
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return "MRI Violated Scans";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type    The type of widgets to get.
     * @param \User  $user    The user widgets are being retrieved for.
     * @param array  $options A type dependent list of options to provide
     *                        to the widget.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch($type) {
        case "usertasks":
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $baseURL = $factory->settings()->getBaseURL();

            return [
                new \LORIS\dashboard\TaskQueryWidget(
                    $user,
                    "Violated scan",
                    $DB,
                    "SELECT
               count(*)".self::MRI_VIOLATED_SCAN_QUERY_CONST,
                    "violated_scans_view_allsites",
                    "c.RegistrationCenterID",
                    $baseURL . "/" . $this->getName(),
                    ""
                )
            ];

        }
        return [];
    }
}

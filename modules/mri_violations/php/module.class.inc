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
    /**
     * Gets the base query (FROM and WHERE clause) used to retrieve
     * all the MRI violations for a given user.
     *
     * @return string the computed query.
     */
    public static function getMriViolatedScanQuery()
    {
        // Find which sites the user has access to
        $user            = \User::singleton();
        $accessibleSites = $user->hasPermission('violated_scans_view_allsites')
            ? \Utility::getSiteList() : \User::singleton()->getStudySites();

        // Build the component of the WHERE clause (for the query below)
        // that will be used to restrict the search to the data associated
        // to sites the user has access to
        $siteClauseElements = [];
        foreach (array_keys($accessibleSites) as $siteID) {
            $siteClauseElements[] = \Database::singleton()->quote($siteID);
        }
        $siteClause = sprintf(
            "(v.Site IS NULL OR v.Site IN (%s))",
            implode(',', $siteClauseElements)
        );

        // Subquery to retrieve tghe violations in table mri_protocol_violated_scans
        $mriProtocolViolatedScansSubquery = "
            SELECT PatientName    AS PatientName,
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
        ";

        // Subquery to retrieve the violations in table mri_violations_log
        $mriViolationsLogSubquery = "
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
        ";

        $mriCandidateErrorsSubquery = "
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
        ";

        $query = "
            FROM (
              $mriProtocolViolatedScansSubquery
              UNION
              $mriViolationsLogSubquery
              UNION
              $mriCandidateErrorsSubquery
            ) AS v 
            LEFT JOIN psc site ON (site.CenterID = v.Site) 
            LEFT JOIN Project AS pjct ON (v.Project = pjct.ProjectID)
            LEFT JOIN subproject AS subpjct ON (v.Subproject = subpjct.SubprojectID)
            WHERE $siteClause
        ";

        return $query;
    }

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
                    'violated_scans_view_ownsite'
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
            $link    = $factory->settings()->getBaseURL() . '/' . $this->getName();
            $number  = (int) $DB->pselectOne(
                "SELECT count(*) " . $this->getMriViolatedScanQuery(),
                []
            );
            $label   = $number >  1 ? 'Violated scans' : 'Violated scan';

            $widget    = new \LORIS\dashboard\TaskWidget(
                $label,
                $number,
                $link,
                'mri_violations'
            );
            $siteLabel = $user->hasPermission('violated_scans_view_allsites')
                ? 'Site: All' : 'Site: All User Sites';

            $widget->setSiteLabel($siteLabel);
            return [ $widget ];
        }

        return [];
    }
}

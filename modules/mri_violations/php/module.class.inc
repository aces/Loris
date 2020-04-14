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
               count(*) 
            FROM
               (
                  SELECT
                     PatientName AS PatientName,
                     s.ProjectID AS Project,
                     s.SubprojectID AS Subproject,
                     mpvs.ID AS join_id,
                     p.CenterID AS Site,
                     violations_resolved.Resolved AS Resolved 
                  FROM
                     mri_protocol_violated_scans AS mpvs 
                     LEFT JOIN
                        violations_resolved 
                        ON (violations_resolved.ExtID = mpvs.ID 
                        AND violations_resolved.TypeTable = 'mri_protocol_violated_scans') 
                     LEFT JOIN
                        candidate c 
                        ON (mpvs.CandID = c.CandID) 
                     LEFT JOIN
                        session s 
                        ON (SUBSTRING_INDEX(mpvs.PatientName, '_', - 1) = s.Visit_label 
                        AND mpvs.CandID = s.CandID) 
                     LEFT JOIN
                        psc p 
                        ON (p.CenterID = s.CenterID) 
                  WHERE
                     Resolved IS NULL 
                  UNION
                  SELECT
                     PatientName,
                     s.ProjectID AS Project,
                     s.SubprojectID AS Subproject,
                     mrl.LogID AS join_id,
                     p.CenterID AS Site,
                     violations_resolved.Resolved AS Resolved 
                  FROM
                     mri_violations_log AS mrl 
                     LEFT JOIN
                        mri_scan_type 
                        ON (mri_scan_type.ID = mrl.Scan_type) 
                     LEFT JOIN
                        violations_resolved 
                        ON (violations_resolved.ExtID = mrl.LogID 
                        AND violations_resolved.TypeTable = 'mri_violations_log') 
                     LEFT JOIN
                        candidate c 
                        ON (mrl.CandID = c.CandID) 
                     LEFT JOIN
                        session s 
                        ON (mrl.Visit_label = s.Visit_label 
                        AND mrl.CandID = s.CandID) 
                     LEFT JOIN
                        psc p 
                        ON (p.CenterID = s.CenterID) 
                  WHERE
                     Resolved IS NULL 
                  UNION
                  SELECT
                     PatientName,
                     NULL,
                     NULL,
                     MRICandidateErrors.ID AS join_id,
                     NULL,
                     violations_resolved.Resolved AS Resolved 
                  FROM
                     MRICandidateErrors 
                     LEFT JOIN
                        violations_resolved 
                        ON (violations_resolved.ExtID = MRICandidateErrors.ID 
                        AND violations_resolved.TypeTable = 'MRICandidateErrors') 
                  WHERE
                     Resolved IS NULL
               )
               AS v 
               LEFT JOIN
                  psc site 
                  ON (site.CenterID = v.Site) 
               LEFT JOIN
                  Project AS pjct 
                  ON (v.Project = pjct.ProjectID) 
               LEFT JOIN
                  subproject AS subpjct 
                  ON (v.Subproject = subpjct.SubprojectID) 
            WHERE
               1 = 1",
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

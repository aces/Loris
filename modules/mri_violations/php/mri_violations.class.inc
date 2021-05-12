<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
 *
 * PHP Version 7
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;
/**
 * Implement the menu filter for searching through all violated scans
 *
 * @category MRI
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Mri_Violations extends \DataFrameworkMenu
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

    /**
     * Tells the base class that this page's provisioner can support the
     * HasAnyPermissionOrUserSiteMatch filter.
     *
     * @return ?array of site permissions or null
     */
    public function allSitePermissionNames() : ?array
    {
        return ['violated_scans_view_allsites'];
    }

    /**
     * We do not use the base project filter because since it's a violated
     * scan, it's possible that the project will be null. Instead we add
     * our own UserProjectMatchOrNull filter.
     *
     * @return bool false
     */
    public function useProjectFilter() : bool
    {
        return false;
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    protected function getFieldOptions() : array
    {
        // Build a list of existing problem types based on data in db
        $db = $this->lorisinstance->getDatabaseConnection();
        $problemTypes = array_column(
                $db->pselect(
                    "SELECT DISTINCT MRICandidateErrors.Reason FROM MRICandidateErrors
                    UNION 
                    SELECT DISTINCT 'Could not identify scan type' 
                    FROM mri_protocol_violated_scans
                    UNION
                    SELECT DISTINCT 'Protocol Violation' FROM mri_violations_log",
                    []
                    ),
                'Reason'
                );
        return [
            'projects'    => \Utility::getProjectList(),
            'subprojects' => \Utility::getSubprojectList(),
            'sites' => [
                ''         => 'All (including unknown)',
            'AllKnown' => 'All (excluding unknown)',
            'Unknown'  => 'Unknown'
            ] + \Utility::getSiteList(),
            'problemtypes' => $problemTypes,
        ];
    }

    public function getBaseDataProvisioner(): \LORIS\Data\Provisioner
    {
        return (new MRIViolationsProvisioner())
            ->filter(new UserProjectMatchOrNull);
    }

   /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() : array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/mri_violations/js/mriViolationsIndex.js",
            ]
        );
    }

}


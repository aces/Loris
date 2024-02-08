<?php
/**
 * The candidate list menu
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_list;
/**
 * Implements the candidate_list menu
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidate_List extends \DataFrameworkMenu
{
    /**
     * Overloading this method to allow access to site users (their own site only)
     * and users w/ multisite privs
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has access, false otherwise
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('access_all_profiles')
            || ($user->hasStudySite() && $user->hasPermission('data_entry'))

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
        return ['access_all_profiles'];
    }

    /**
     * Tells the base class that this page's provisioner can support
     * the UserProjectMatch filter.
     *
     * @return bool always true
     */
    public function useProjectFilter() : bool
    {
        return true;
    }

    /**
     * Return the list of field options required to be serialized to JSON
     * in order to render the frontend.
     *
     * @return array
     */
    function getFieldOptions() : array
    {
        $this->loris->getModule('candidate_parameters')->registerAutoloader();

        // create user object
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $config  = $factory->config();

        // get the list of visit labels
        $visit_label_options = \Utility::getVisitList();

        // get the list of sites available for the user
        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }
        $site_options = [];
        foreach (array_values($list_of_sites) as $name) {
            $site_options[$name] = $name;
        }

        // get the list of projects
        $list_of_projects = \Utility::getProjectList();
        $project_options  = [];
        foreach (array_values($list_of_projects) as $name) {
            $project_options[$name] = $name;
        }

        // get the list of cohorts
        $list_of_cohorts = \Utility::getCohortList();
        $cohort_options  = [];
        foreach (array_values($list_of_cohorts) as $name) {
            $cohort_options[$name] = $name;
        }

        // get the list participant status options
        $list_of_participant_status
            = \Candidate::getParticipantStatusOptions();
        $participant_status_options = [];
        foreach (array_values($list_of_participant_status) as $name) {
            $participant_status_options[$name] = $name;
        }

        return [
            'visitlabel'        => $visit_label_options,
            'site'              => $site_options,
            'project'           => $project_options,
            'cohort'            => $cohort_options,
            'participantstatus' => $participant_status_options,
            'useedc'            => $config->getSetting("useEDC"),
            'usedob'            => $config->getSetting("useDoB")
        ];
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/candidate_list/js/candidateListIndex.js",
            ]
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Access Profile', "/$this->name")
        );
    }

    /**
     * Gets the data source for this menu filter.
     *
     * @return \LORIS\Data\Provisioner
     */
    public function getBaseDataProvisioner() : \LORIS\Data\Provisioner
    {
        return new CandidateListRowProvisioner();
    }
}
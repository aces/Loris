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
class Candidate_List extends \NDB_Menu_Filter
{
    var $AjaxModule = true;

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
     * Sets up all the class variables needed for the candidate_list menu
     * filter
     *
     * @return void
     */
    function _setupVariables()
    {
        $user   = \User::singleton();
        $config = \NDB_Config::singleton();

        $this->skipTemplate = true;

        // set the class variables
        $this->columns = array(
                          'c.PSCID',
                          'c.CandID AS DCCID',
                          'GROUP_CONCAT(DISTINCT s.Visit_label) AS VisitLabel',
                          'psc.Name AS RegistrationSite',
                          'GROUP_CONCAT(DISTINCT sp.title) as Subproject',
                          'c.Entity_type AS EntityType',
                          'MAX(s.Scan_done) as scanDone',
                          'COALESCE(pso.Description,"Active") AS ParticipantStatus',
                          'DATE_FORMAT(c.DoB,\'%Y-%m-%d\') AS DoB',
                          'c.Sex',
                          'COUNT(DISTINCT s.Visit_label) AS VisitCount',
                          "IFNULL(MIN(feedback_bvl_thread.Status+0),0) AS Feedback",
                          'max(s.Current_stage) AS LatestVisitStatus',
                          'p.Name as Project',
                         );

        if ($config->getSetting("useEDC") === "true") {
            $this->columns[] = 'DATE_FORMAT((c.EDC),\'%Y-%m-%d\') AS EDC';
        }

        $this->query = " FROM candidate c
            LEFT JOIN psc ON (c.RegistrationCenterID=psc.CenterID)
            LEFT JOIN session s ON (c.CandID = s.CandID AND s.Active = 'Y')
            LEFT JOIN feedback_bvl_thread
                ON (c.CandID=feedback_bvl_thread.CandID)
            LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
            LEFT JOIN participant_status_options pso
                ON (ps.participant_status=pso.ID)
            LEFT JOIN Project p ON (c.ProjectID=p.ProjectID)
            LEFT JOIN subproject sp ON (s.SubprojectID=sp.SubprojectID)
            WHERE c.Active = 'Y'";

        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND c.RegistrationCenterID IN (" . $site_arr . ")";
        }

        //'COALESCE(pso.ID,1) AS Participant_Status',
        $this->group_by = 'c.CandID, psc.Name, c.PSCID, c.Sex';
        $this->order_by = 'c.PSCID ASC';
    }


    /**
     * Create the form for the candidate_list menu page
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        // Relying on a side-effect of the the server process module to autoload
        // its namespace.
        \Module::factory('candidate_parameters');

        // create user object
        $user   = \User::singleton();
        $config = \NDB_Config::singleton();

        // get the list of visit labels
        $visit_label_options = \Utility::getVisitList();

        // get the list of sites available for the user
        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }
        foreach ($list_of_sites as $id => $name) {
            $site_options[$name] = $name;
        }

        // get the list of projects
        $list_of_projects = \Utility::getProjectList();
        $project_options  = array();
        foreach ($list_of_projects as $id => $name) {
            $project_options[$name] = $name;
        }

        // get the list of subprojects
        $list_of_subprojects = \Utility::getSubprojectList();
        foreach ($list_of_subprojects as $id => $name) {
            $subproject_options[$name] = $name;
        }

        // get the list participant status options
        $list_of_participant_status
            = \Candidate::getParticipantStatusOptions();
        foreach ($list_of_participant_status as $id => $name) {
            $participant_status_options[$name] = $name;
        }

        $this->fieldOptions = [
                               'visitlabel'       => $visit_label_options,
                               'site'              => $site_options,
                               'project'           => $project_options,
                               'subproject'        => $subproject_options,
                               'participantstatus' => $participant_status_options,
                               'useedc'            => $config->getSetting("useEDC"),
                              ];

        return true;
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
            array(
             $baseURL . "/candidate_list/js/candidateListIndex.js",
            )
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
}


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
     * @return true if user has access, false otherwise
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();
        $aap  = $user->hasPermission('access_all_profiles');
        $this->tpl_data['access_all_profiles'] = $aap;
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
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();

        $this->columns = [];
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
         $user    =& \User::singleton();
          $config =& \NDB_Config::singleton();
        // PSC
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = \Utility::getSiteList();
            if (is_array($list_of_sites)) {
                $list_of_sites = array('' => 'All') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        // SubprojectID
        $list_of_subprojects = \Utility::getSubprojectList();

        // list of feedback statuses
        $feedback_status_options = array(
                                    null => 'All',
                                    '0'  => 'None',
                                    '1'  => 'opened',
                                    '2'  => 'answered',
                                    '3'  => 'closed',
                                    '4'  => 'comment',
                                   );

        $latest_visit_status_options = array(
                                        null            => 'All',
                                        'Not Started'   => 'Not Started',
                                        'Screening'     => 'Screening',
                                        'Visit'         => 'Visit',
                                        'Approval'      => 'Approval',
                                        'Recycling Bin' => 'Recycling Bin',
                                       );

        $participant_status_options = array(null => 'All')
             + \Candidate::getParticipantStatusOptions();
        $scan_options = array(
                         null => 'All',
                         'Y'  => 'Yes',
                         'N'  => 'No',
                        );
        // Get visits
        $visits = \Utility::getVisitList();
        $visits = array_merge(array('' => 'All'), $visits);

        // add form elements
        $this->addSelect('centerID', 'Site', $list_of_sites);
        $this->addBasicText('PSCID', 'PSCID');
        $this->addBasicText('DCCID', 'DCCID');
        $this->addBasicText('candID', 'DCCID');
        $this->addSelect(
            'Visit_label',
            'Visit Label',
            $visits
        );

        $this->addSelect(
            'gender',
            'Gender',
            array(
             ''       => 'All',
             'Male'   => 'Male',
             'Female' => 'Female',
            )
        );
        $this->addSelect(
            'Entity_type',
            'Entity Type',
            array(
             ''        => '',
             'Human'   => 'Human',
             'Scanner' => 'Scanner',
            )
        );
        $this->addSelect(
            'SubprojectID',
            'Subproject',
            array('' => 'All') + $list_of_subprojects
        );
        $this->addBasicText('dob', 'Date of Birth', array('maxlength' => 10));
        $this->addBasicText('Visit_Count', 'Number of Visits');
        $this->addSelect(
            'Latest_Visit_Status',
            'Latest Visit Status',
            $latest_visit_status_options
        );
        $this->addSelect('Feedback', 'Feedback', $feedback_status_options);
        $this->addSelect(
            'Participant_Status',
            'Participant Status',
            $participant_status_options
        );
        $this->addSelect('scan_done', 'Scan Done', $scan_options);

        // Project list, if applicable
        if ($config->getSetting("useProjects")==="true") {
            $list_of_projects = array(null => 'All');
            $projectList      = \Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] =$value;
            }
            $this->addSelect('ProjectID', 'Project', $list_of_projects);
        }
        if ($config->getSetting("useEDC")=="true") {
            $this->addBasicText(
                'edc',
                'EDC',
                array('maxlength' => 10)
            );
            $this->tpl_data['useEDC'] = "true";
        }
        $this->addSelect(
            'feedback',
            'Feedback Status',
            array_merge(array('' => 'All'), $feedback_status_options)
        );

        return true;
    }

    function getDataProvisioner() : \LORIS\Data\Provisioner {
        $provisioner = new CandidateListRowProvisioner();

        $user = \User::singleton();

        if ($user->hasPermission("access_all_profiles") == false) {
            $provisioner = $provisioner->filter(
                new \LORIS\Data\Filters\UserSiteMatch()
            );
        }
        return $provisioner;
    }

    function toJSON() {
        $table = (new \LORIS\Data\Table())
            ->withDataFrom($this->getDataProvisioner());
        $arr   = array_map(
            function ($row) {
                return array_values($row);
            },
            json_decode($table->toJSON(\User::singleton()), true)
        );
        return json_encode(
            [
             'Headers'       => [
                          'Site',
                          'DCCID',
                          'PSCID',
                          'Gender',
                          'Entity Type',
                          'Participant Status',
                          'Project',
                          'Subproject',
                          'DoB',
                          'Scan Done',
                          'Visit Count',
                          'Latest Visit Status',
                          'Feedback',
                                ],
             'Data'          => $arr,
            ]
        );
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
             $baseURL . "/js/advancedMenu.js",
             $baseURL . "/candidate_list/js/columnFormatter.js",
             $baseURL . "/candidate_list/js/candidate_list_helper.js",
             $baseURL . "/js/components/Form.js",
             $baseURL . "/candidate_list/js/onLoad.js",
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


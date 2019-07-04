<?php
/**
 * This file contains the NDB_Form_create_timepoint class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

namespace LORIS\create_timepoint;

/**
 * The forms for the new profile menu
 *
 * @category Loris
 * @package  Create_Timepoint
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Create_Timepoint extends \NDB_Form
{
    /**
     * This timepoint's candidate
     *
     * @var \Candidate
     */
    protected $candidate;

    /**
     * The subprojectID being created
     */
    var $subprojectID;

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $candidate =& \Candidate::singleton($this->identifier);

        // check user permissions
        return (
            $user->hasPermission('data_entry') &&
            (in_array(
                $candidate->getData('RegistrationCenterID'),
                $user->getData('CenterIDs')
            )
            )
        );
    }

    /**
     * Processes the values and saves to database. Usually overridden
     * by form instance.
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        // convert site entered to a \Site object
        $user = \User::singleton();

        $user_list_of_sites = $user->getCenterIDs();
        $num_sites          = count($user_list_of_sites);
        if ($num_sites == 1) {
            $site = \Site::singleton($user_list_of_sites[0]);
        } else if ($num_sites > 1) {
            $site = \Site::singleton(intval($values['psc']));
        }

        //Project
        $projects = \Utility::getProjectList();
        if (count($projects) == 1) {
            //if there is only one project, autoselect first project from array of 1
            //TODO: change this to array_key_first() when support is only PHP 7.3+
            $project = \Project::singleton(array_pop($projects));
        } else if (count($projects) > 1) {
            $project_id = intval($values['project']);
            $project    = \Project::singleton($projects[$project_id]);
        }

        assert(isset($site) && $site !== null);
        \TimePoint::createNew(
            \Candidate::singleton($this->identifier),
            $values['subprojectID'],
            $values['visitLabel'] ?? null,
            $site,
            $project
        );

        $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }

    /**
     * Does the setup required for this page.
     * Particularly creates all the form elements.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();

        $this->candidate = \Candidate::singleton($this->identifier);

        $config =& \NDB_Config::singleton();
        if (!empty($_GET['subprojectID']) && is_numeric($_GET['subprojectID'])) {
            $this->subprojectID =$_GET['subprojectID'];
        }

        // cand ID
        $sanitizedIdentifier      = htmlentities(
            $this->identifier,
            ENT_QUOTES,
            'UTF-8'
        );
        $this->tpl_data['candID'] = $sanitizedIdentifier;

        $this->addHidden('candID', $sanitizedIdentifier);

        $candidate =& \Candidate::singleton($this->identifier);
        // List of all subprojects from config file
        $allSubprojects = \Utility::getSubprojectList();
        if (empty($allSubprojects)) {
            $this->form->errors['subprojectID'] = "No subprojects have been defined 
            for this study. If you are an administrator, please use the 
            Configuration module to add new subprojects.";
        }
        $sp_labelOptions = array(null => '');
        $subprojList     = null;
        //List of valid subprojects for a given project
        $subprojList = $candidate->getValidSubprojects();
        if (empty($subprojList)) {
            $this->form->errors['subprojectID'] = "No subprojects have been 
            defined for the project this candidate is affiliated with. 
            If you are an administrator, please use the Configuration module to 
            add new subprojects and associate them with projects.";
        }
        foreach ($allSubprojects as $subprojectID => $title) {
            if (in_array($subprojectID, $subprojList)) {
                $sp_labelOptions[$subprojectID] = $title;
            }
        }

        $attributes = array(
                       "onchange" => "location.href='?test_name=create_timepoint" .
                "&candID=" . $this->identifier .
                "&identifier=" . $this->identifier .
                "&subprojectID='+this[this.selectedIndex].value;",
                      );
        $this->addSelect(
            'subprojectID',
            'Subproject',
            $sp_labelOptions,
            $attributes
        );
        $this->addRule('subprojectID', 'A Subproject ID is required', 'required');
        $this->_setDefaults(array("subprojectID" => $this->subprojectID));

        // visit label
        $visitLabelSettings = $config->getSetting('visitLabel');
        $visitLabelAdded    = false;

        foreach (
            \Utility::associativeToNumericArray($visitLabelSettings)
            as $visitLabel
        ) {
            $visitLabel = \Utility::asArray($visitLabel);
            if ($visitLabel['@']['subprojectID'] == $this->subprojectID) {
                if (isset($visitLabel['generation'])
                    && $visitLabel['generation'] !== 'sequence'
                ) {
                    throw new \DeprecatedException(
                        "User generated Visit Labels are no ".
                        "longer supported in Loris."
                    );
                }
                $labelOptions[''] = null;
                $items            = \Utility::associativeToNumericArray(
                    $visitLabel['labelSet']['item']
                );
                foreach ($items as $item) {
                    $labelOptions[$item['@']['value']] = $item['#'];
                }
                $this->addSelect('visitLabel', 'Visit label', $labelOptions);
                $visitLabelAdded = true;
            }
        }

        // label rules
        if ($visitLabelAdded) {
            $this->addRule('visitLabel', 'Visit label is required', 'required');
            // List of sites for the user
            $user = \User::singleton();
            $DB   = \Database::singleton();
            $user_list_of_sites = $user->getData('CenterIDs');
            $num_sites          = count($user_list_of_sites);
            $psc_labelOptions   = array();
            if ($num_sites >1) {
                $this->tpl_data['pscLabelAdded'] = true;
                $psc_labelOptions = array(null => '');
                foreach ($user_list_of_sites as $key => $siteID) {
                    $center = $DB->pselectRow(
                        "SELECT CenterID as ID, Name FROM psc 
                        WHERE CenterID =:cid",
                        array('cid' => $siteID)
                    );
                    $psc_labelOptions[$siteID] = $center['Name'];
                }
            }
            $this->addSelect('psc', 'Site', $psc_labelOptions);
            // List projects
            $projects = \Utility::getProjectList();
            if (count($projects) >1) {
                $this->tpl_data['projectAdded'] = true;
                $projectOptions = [null => ''] + $projects;

                $this->addSelect('project', 'Project', $projectOptions);
            }
        }
        $this->form->addFormRule(array(&$this, '_validate'));

    }


    /**
     * Validates user form selection
     *
     * @param array $val array of form values
     *
     * @return array
     */
    function _validate(array $val)
    {
        $user = \User::singleton();

        $errors = array();

        // validate site entered
        $site = $val['psc'] ?? '';
        $user_list_of_sites = $user->getStudySites();
        $num_sites          = count($user_list_of_sites);
        if ($num_sites == 0) {
            $errors['psc']
                = "You must be affiliated with a site to create a timepoint.";
        } else if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            $errors['psc'] = "Site must be selected from the available dropdown.";
        }

        //Project
        $projects = \Utility::getProjectList();
        if (count($projects) == 0) {
            $errors['project'] = "No projects are defined in the database, please add
            projects in order to continue";
        } else if (count($projects) > 1 && is_null($val['project'])) {
            $errors['project'] = "A project must be selected from the available 
            dropdown.";
        }

        $candid       = $this->identifier;
        $subprojectID = $val['subprojectID'];
        $visitLabel   = $val['visitLabel'] ?? '';

        try {
            \TimePoint::isValidVisitLabel($candid, $subprojectID, $visitLabel);
        } catch ( \LorisException $e) {
            $errors['visitLabel'] = $e->getMessage();
        }

        return $errors;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $candid = $this->candidate->getCandID();
        $pscid  = $this->candidate->getPSCID();

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Access Profile',
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                "Candidate Profile $candid / $pscid",
                "/$candid"
            ),
            new \LORIS\Breadcrumb(
                'Create Time Point',
                "/create_timepoint/?candID=$candid&identifier=$candid"
            )
        );
    }
}


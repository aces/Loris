<?php
/**
 * New_profile
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\new_profile;

/**
 * New_profile
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class New_Profile extends \NDB_Form
{
    /**
     * Tie the access to a data_entry permission
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

        $site_arr      = $user->getData('CenterIDs');
        $userInDCCSite = in_array("1", $site_arr);
        if ($user->hasStudySite() or $userInDCCSite) {
            return $user->hasPermission('data_entry');
        }

        return false;
    }
    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        // set up the arguments to Candidate::createNew
        $user   =& \User::singleton();
        $config =& \NDB_Config::singleton();
        $dob    = empty($values['dob1']) ? null : $values['dob1'];

        $edc = null;
        if ($config->getSetting('useEDC') == "true") {
            $edc = empty($values['edc1']) ? null : $values['edc1'];
        }

        // create the candidate
        $DB        = \Database::singleton();
        $site_arr  = $user->getData('CenterIDs');
        $num_sites = count($site_arr);

        if ($num_sites >1) {
            $candID = \Candidate::createNew(
                $values['psc'],
                $dob,
                $edc,
                $values['gender'],
                $values['PSCID'] ?? null
            );
        } else {
            $centerIDs = $user->getData('CenterIDs');
            $centerID  = $centerIDs[0];
            $candID    = \Candidate::createNew(
                $centerID,
                $dob,
                $edc,
                $values['gender'],
                $values['PSCID'] ?? null
            );
        }

        // get the candidate
        $candidate =& \Candidate::singleton($candID);

        if ($config->getSetting('useProjects') == "true") {
            $candidate->setData('ProjectID', $values['ProjectID']);

        }

        //------------------------------------------------------------

        $this->tpl_data['success'] = true;
        $this->tpl_data['candID']  = $candID;
        $this->tpl_data['PSCID']   = $candidate->getPSCID();

        // freeze it, just in case
        $this->form->freeze();
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $config    =& \NDB_Config::singleton();
        $startYear = $config->getSetting('startYear');
        $endYear   = $config->getSetting('endYear');
        $ageMax    = $config->getSetting('ageMax');
        $ageMin    = $config->getSetting('ageMin');
        $dobFormat = $config->getSetting('dobFormat');

        $dateOptions = array(
                        'language'       => 'en',
                        'format'         => $dobFormat,
                        'addEmptyOption' => true,
                        'minYear'        => $startYear - $ageMax,
                        'maxYear'        => $endYear - $ageMin,
                       );

        $dateAttributes = ['class' => 'form-control input-sm input-date'];

        // add date of birth
        $this->addBasicDate(
            'dob1',
            'Date of Birth',
            $dateOptions,
            $dateAttributes
        );
        $this->addBasicDate(
            'dob2',
            'Confirm Date of Birth',
            $dateOptions,
            $dateAttributes
        );
        $this->addRule(
            array(
             'dob1',
             'dob2',
            ),
            'Date of birth fields must match',
            'compare'
        );

        // date of birth rules
        $this->addRule('dob1', 'Date of Birth is required', 'required');
        $this->addRule(
            'dob2',
            'Date of Birth confirmation is required',
            'required'
        );

        if ($config->getSetting('useEDC') == "true") {
            // add expected date of confinement
            $this->addBasicDate(
                'edc1',
                'Expected Date of Confinement',
                $dateOptions,
                $dateAttributes
            );
            $this->addBasicDate(
                'edc2',
                'Confirm EDC',
                $dateOptions,
                $dateAttributes
            );

            // expected date of confinement rules
            $this->addRule(
                array(
                 'edc1',
                 'edc2',
                ),
                'EDC fields must match',
                'compare'
            );
        }

        if ($config->getSetting("useProjects") == "true") {
            $projects = \Utility::getProjectList();
            $projList = array('' => '');
            foreach ($projects as $projectID => $projectName) {
                $projList[$projectID] = $projectName;
            }
            $this->addSelect('ProjectID', 'Project', $projList);
        }

        // add gender
        $genderOptions = array(
                          ''       => '',
                          'Male'   => 'Male',
                          'Female' => 'Female',
                         );
        $this->addSelect('gender', 'Gender', $genderOptions);

        // gender rules
        $this->addRule('gender', 'Gender is required', 'required');

        // add sites for users with more than one site affiliation
        $user =& \User::singleton();
        $DB   = \Database::singleton();
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);

        if ($num_sites >1) {
            $psc_labelOptions = array(null => '');
            foreach ($user_list_of_sites as $key => $siteID) {
                $center = $DB->pselectRow(
                    "SELECT CenterID as ID, Name FROM psc WHERE CenterID =:cid",
                    array('cid' => $siteID)
                );
                $psc_labelOptions[$siteID] = $center['Name'];
            }
            $this->addSelect('psc', 'Site', $psc_labelOptions);

            // site rules
            $this->addRule('psc', 'Site is required', 'required');
        }

        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $this->addBasicText('PSCID', 'PSCID');
        }

        $this->form->addFormRule(array(&$this, '_validate'));
    }
    /**
     * Validate function
     *
     * @param string $values the value
     *
     * @return string
     */
    function _validate($values)
    {
        $errors = array();
        $config =& \NDB_Config::singleton();
        $user   = \User::singleton();
        if ($values['dob1'] != $values['dob2']) {
            $errors['dob1'] = 'Date of Birth fields must match.';
        }
        if ($config->getSetting('useEDC') == "true" && is_array($values['edc1'])) {
            if (strlen(implode($values['edc1'])) > 2
                && !\Utility::_checkDate($values['edc1'])
            ) {
                $errors['edc1'] = 'EDC is not a valid date';
            }
            if ($values['edc1'] != $values['edc2']) {
                $errors['edc1'] = 'Estimated Due date fields must match.';
            }
        }

        if (empty($values['gender'])) {
            $errors['gender'] = 'Gender is required.';
        }

        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $db =& \Database::singleton();
            if (empty($values['psc'])) { // user is in only one site
                $user      =& \User::singleton();
                $centerIDs = $user->getData('CenterIDs');
                $centerID  = $centerIDs[0];
                $site      =& \Site::singleton($centerID);
            } else {
                // user has multiple sites,
                // so validate PSCID against the Site selected
                $site =& \Site::singleton($values['psc']);
            }

            if (empty($values['PSCID'])) {
                $errors['PSCID'] = 'PSCID must be specified';
            } elseif (!\Candidate::validatePSCID(
                $values['PSCID'],
                $site->getSiteAlias()
            )
            ) {
                $errors['PSCID'] = 'PSCID does not match the required structure';
            } elseif ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:V_PSCID",
                array('V_PSCID' => $values[PSCID])
            ) > 0
            ) {
                    $errors['PSCID'] = 'PSCID has already been registered';
            }
        }

        // validate site entered
        $site = $values['psc'];
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            $errors['psc'] = "Site must be selected from the available dropdown.";
        }

        $useProjects = $config->getSetting('useProjects');
        if ($useProjects === "true" && empty($values['ProjectID'])) {
            $errors['ProjectID'] = "Project is required";
        }

        return $errors;
    }

}
?>

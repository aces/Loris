<?php declare(strict_types=1);
namespace LORIS\new_profile;

use LORIS\StudyEntities\Candidate\Sex;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * New_profile module. This class handles the creation of new candidates from
 * the front-end of LORIS.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class New_Profile extends \NDB_Form
{
    public $skipTemplate = true;
    private $_candID;
    private $_pscid;
    private $_error;

    /**
     * Determines whether a user can access the page. The access to tied to
     * the data_entry permission.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        if ($user->hasStudySite() || $user->hasCenter(1)) {
            return $user->hasPermission('data_entry');
        }

        return false;
    }
    /**
     * Creates a new candidate using values supplied from the front-end. This
     * data is validated in validateNewCandidate().
     *
     * @param array $values An array of form values POSTed to new_profile.
     *
     * @return void
     */
    function _process($values): void
    {
        // Change empty strings to null before passing as arguments.
        foreach ($values as $key => $value) {
            if (empty($value)) {
                $values[$key] = null;
            }
        }
        /* When a user has only one site and centerID has not been
         * passed, choose the first one in the User's centerID list.
         */
        $centerIDs = \User::singleton()->getData('CenterIDs');
        if (count($centerIDs) <= 1 && !isset($values['site'])) {
            $values['site'] = $centerIDs[0];
        }
        //TODO: add similar logic to projects when user-projects association is
        //incorporated.

        /* Create the candidate and retrieve its ID.
         * Use form values when present, otherwise default to null.
         */
         $dob = null;
         if (isset($values['dobDate'])) {
             $dob = (new \DateTime($values['dobDate']))->format('Y-m-d')
         }
        $edc = $values['edcDate'] ?? null;
        if (!is_null($edc)) {
            $edc = (new \DateTime($edc))->format('Y-m-d');
        }
        $candID = \Candidate::createNew(
            (int)$values['site'],
            $dob,
            $edc,
            new Sex($values['sex']),
            $values['pscid'] ?? null,
            intval($values['project'])
        );

        /* Update front-end data. Use passed PSCID when present, otherwise
         * retrieve it from the newly-created candidate.
         */
        $this->_candID = (string)$candID;
        $this->_pscid  = $values['pscid']
            ?? \Candidate::singleton($candID)->getPSCID();

        // freeze it, just in case
        $this->form->freeze();
    }

    /**
     * This function will return a json file with DCCID and PSCID
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->setup();
        if ($request->getMethod() === "POST") {
            $this->save();
            if (!empty($this->_error)) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    json_encode($this->_error)
                );
            }
            $result = [
                'candID' => $this->_candID,
                'pscid'  => $this->_pscid
            ];
            return (new \LORIS\Http\Response\JSON\Created($result))
                ->withHeader("Allow", "POST");
        }

        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup(): void
    {
        $factory   = \NDB_Factory::singleton();
        $config    = $factory->config();
        $user      = $factory->user();
        $startYear = $config->getSetting('startYear');
        $endYear   = $config->getSetting('endYear');
        $ageMax    = $config->getSetting('ageMax');
        $ageMin    = $config->getSetting('ageMin');
        $dobFormat = $config->getSetting('dobFormat');
        $edc       = $config->getSetting('useEDC');
        $sex       = [
            'male'   => 'Male',
            'female' => 'Female',
            'other'  => 'Other',
        ];
        $pscidSet  = "false";
        $minYear   = (isset($startYear, $ageMax)) ? $startYear - $ageMax : null;
        $maxYear   = (isset($endYear, $ageMin)) ? $endYear - $ageMin : null;

        // Get sites for the select dropdown
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        $psc_labelOptions   = [];
        if ($num_sites > 1) {
            $psc_labelOptions = \Utility::getSiteNameListByIDs($user_list_of_sites);
        }
        $site = $psc_labelOptions;

        // Get projects for the select dropdown
        $projList = [];
        $projects = \Utility::getProjectList();
        foreach ($projects as $projectID => $projectName) {
            $projList[$projectID] = $projectName;
        }
        $project = $projList ?? null;

        // Get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $pscidSet = "true";
        }

        $this->fieldOptions = [
            'minYear'   => $minYear,
            'maxYear'   => $maxYear,
            'dobFormat' => $dobFormat,
            'edc'       => $edc,
            'sex'       => $sex,
            'pscidSet'  => $pscidSet,
            'site'      => $site,
            'project'   => $project,
        ];

        $this->form->addFormRule([&$this, '_validateNewCandidate']);
    }

    /**
     * Validate function
     *
     * @param array $values the value
     *
     * @return array $errors
     */
    function _validateNewCandidate($values): array
    {
        $this->_error = null;
        $errors       = [];
        $factory      = \NDB_Factory::singleton();
        $config       = $factory->config();
        $user         = $factory->user();
        $db           = $factory->database();

        // Validate DOB fields
        if (isset($values['dobDate'], $values['dobDateConfirm'])
            && $values['dobDate'] != $values['dobDateConfirm']
        ) {
            $errors['dobDate'] = 'Date of Birth fields must match.';
        }
        // Validate DOB fields
        try {
            if (isset($values['dobDate'])
                && (new \DateTime($values['dobDate'])) > new \DateTime('now')
            ) {
                $errors['dobDate'] = 'Date of Birth cannot be set in the future.';
            }
        } catch (\Exception $e) {
            $errors['dobDate'] = 'Date of Birth is not a valid date.';
        }

        // Validate EDC fields
        if ($config->getSetting('useEDC') == "true") {
            if (empty($values['edcDate'])) {
                $errors['edcDate'] = 'Expected Date of Confinement field is
                                      required.';
            }

            if (empty($values['edcDateConfirm'])) {
                $errors['edcDateConfirm'] = 'Confirm EDC field is required.';
            }

            if ($values['edcDate'] != $values['edcDateConfirm']) {
                $errors['edcDate'] = 'Expected Date of Confinement fields must
                                     match.';
            }
            // Validate DOB fields
            try {
                new \DateTime($values['edcDate']);
            } catch (\Exception $e) {
                $errors['edcDate'] = 'Expected Date of Confinement is not a '
                    . 'valid date.';
            }
        } else if (empty($values['dobDate'])) {
            $errors['dobDate'] = "Date of Birth cannot be empty.";
        }

        // Validate sex fields
        if (empty($values['sex'])) {
            $errors['sex'] = 'Sex is required.';
        }

        // Validate pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            if (empty($values['site'])) { // user is in only one site
                $centerIDs = $user->getData('CenterIDs');
                $centerID  = $centerIDs[0];
                $site      = \Site::singleton($centerID);
            } else {
                // user has multiple sites,
                // so validate PSCID against the Site selected
                $site = \Site::singleton((int) $values['site']);
            }

            $project = \Project::getProjectFromID(intval($values['project']));

            if (empty($values['pscid'])) {
                $errors['pscid'] = 'PSCID must be specified';
            } elseif (!\Candidate::validatePSCID(
                $values['pscid'],
                $site->getSiteAlias(),
                $project->getAlias()
            )
            ) {
                $errors['pscid'] = 'PSCID does not match the required structure';
            } elseif ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:V_PSCID",
                ['V_PSCID' => $values['pscid']]
            ) > 0
            ) {
                $errors['pscid'] = 'PSCID has already been registered';
            }
        }

        // Validate site entered
        $psc = isset($values['site']) ? (int)$values['site'] : '';
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites > 1 && (empty($psc) || !$user->hasCenter($psc))) {
            $errors['site'] = "Site must be selected from the available dropdown.";
        }

        // Validate project
        if (empty($values['project'])) {
            $errors['project'] = "Project is required";
        }

        if (!empty($errors)) {
            $this->_error = reset($errors);
        }

        return $errors;
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/new_profile/js/NewProfileIndex.js']
        );
    }
}

<?php
declare(strict_types=1);
/**
 * New_profile
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\new_profile;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * New_profile
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 *           Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class New_Profile extends \NDB_Form
{
    public  $skipTemplate = true;
    private $_candID;
    private $_pscid;
    private $_error;

    /**
     * Tie the access to a data_entry permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
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

        /* Create the candidate and retrieve its ID.
         * Use form values when present, otherwise default to null.
         */
        $candID = \Candidate::createNew(
            (int)$values['site'],
            $values['dobDate'],
            $values['edcDate'] ?? null,
            $values['sex'],
            $values['pscid'] ?? null,
            isset($values['project']) ? intval($values['project']) : null
        );

        /* Update front-end data. Use passed PSCID when present, otherwise
         * retrieve it from the newly-created candidate.
         */
        $this->_candID = \Candidate::singleton($candID)->getCandID();
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
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "application/json")
                    ->withStatus(400)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode($this->_error)
                        )
                    );
            }
            $result = array(
                       'candID' => $this->_candID,
                       'pscid'  => $this->_pscid,
                      );
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(201)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($result)
                    )
                );
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
        $DB        = \Database::singleton();
        $config    = \NDB_Config::singleton();
        $user      = \User::singleton();
        $startYear = $config->getSetting('startYear');
        $endYear   = $config->getSetting('endYear');
        $ageMax    = $config->getSetting('ageMax');
        $ageMin    = $config->getSetting('ageMin');
        $dobFormat = $config->getSetting('dobFormat');
        $edc       = $config->getSetting('useEDC');
        $sex       = array(
                      'male'   => 'Male',
                      'female' => 'Female',
                     );
        $pscidSet  = "false";
        $minYear   = (isset($startYear, $ageMax)) ? $startYear - $ageMax : null;
        $maxYear   = (isset($endYear, $ageMin)) ? $endYear - $ageMin : null;

        // Get sites for the select dropdown
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        $psc_labelOptions   = array();
        if ($num_sites > 1) {
            foreach ($user_list_of_sites as $key => $siteID) {
                $center = $DB->pselectRow(
                    "SELECT CenterID as ID, Name FROM psc WHERE CenterID =:cid",
                    array('cid' => $siteID)
                );
                if (!is_null($center)) {
                    $psc_labelOptions[$siteID] = $center['Name'];
                }
            }
        }
        $site = $psc_labelOptions;

        // Get projects for the select dropdown
        $projList = array();
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

        $this->fieldOptions = array(
                               'minYear'   => $minYear,
                               'maxYear'   => $maxYear,
                               'dobFormat' => $dobFormat,
                               'edc'       => $edc,
                               'sex'       => $sex,
                               'pscidSet'  => $pscidSet,
                               'site'      => $site,
                               'project'   => $project,
                              );

        $this->form->addFormRule(array(&$this, '_validateNewCandidate'));
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
        $errors       = array();
        $config       = \NDB_Config::singleton();
        $user         = \User::singleton();
        $db           = \Database::singleton();

        // Validate DOB fields
        if (empty($values['dobDate'])) {
            $errors['dobDate'] = 'Date of Birth field is required.';
        }
        if (empty($values['dobDateConfirm'])) {
            $errors['dobDateConfirm'] = 'Confirm Date of Birth field is required.';
        }
        if ($values['dobDate'] != $values['dobDateConfirm']) {
            $errors['dobDate'] = 'Date of Birth fields must match.';
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
                $errors['edDate'] = 'Expected Date of Confinement fields must
                                     match.';
            }
        }

        // Validate date format
        $dobFormat = $config->getSetting('dobFormat');
        if (strtolower($dobFormat) == 'ym' || strtolower($dobFormat) == 'my') {
            // Dates still need to be submitted into the database in format
            // YYYY-DD-MM. This is a last check before _process is called.
            if ($config->getSetting('useEDC') == "true"
                && strlen($values['edcDate']) < 10
            ) {
                $errors['edcFormat'] = 'EDC is not in valid date format.';
            }
            if (strlen($values['dobDate'] ?? '') < 10) {
                $errors['dobFormat'] = 'DOB is not in valid date format.';
            }
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
                $site      =& \Site::singleton($centerID);
            } else {
                // user has multiple sites,
                // so validate PSCID against the Site selected
                $site =& \Site::singleton($values['site']);
            }

            if (empty($values['pscid'])) {
                $errors['pscid'] = 'PSCID must be specified';
            } elseif (!\Candidate::validatePSCID(
                $values['pscid'],
                $site->getSiteAlias()
            )
            ) {
                $errors['pscid'] = 'PSCID does not match the required structure';
            } elseif ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:V_PSCID",
                array('V_PSCID' => $values['pscid'])
            ) > 0
            ) {
                $errors['pscid'] = 'PSCID has already been registered';
            }
        }

        // Validate site entered
        $psc = (int)$values['site'] ?? '';
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

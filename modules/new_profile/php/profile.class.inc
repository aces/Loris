<?php
declare(strict_types=1);
/**
 * Handle profile file
 * Post method handles creating both PSCID and DCCID for a candidate
 * Get method handles displaying the json data for initializing react form
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\new_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Create PSCID and DCCID for a candidate
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Profile extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('access_all_profiles')
            || ($user->hasStudySite() && $user->hasPermission('data_entry'))

        );
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
        // Ensure it's a POST request.
        switch ($request->getMethod()) {
        case "POST":
            $values = $request->getParsedBody();
            $DB     = \Database::singleton();
            $user   = \User::singleton();
            $config = \NDB_Config::singleton();

            // Validation of user input.
            $values = $this->processValidity($values);
            if (isset($values['error'])) {
                return (new \LORIS\Http\Response())
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(201)
                    ->withHeader('Allow', 'POST')
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode($values)
                        )
                    );
            }

            $site_arr  = $user->getData('CenterIDs');
            $num_sites = count($site_arr);
            if ($num_sites >=1) {
                $candID = \Candidate::createNew(
                    (int)$values['site'],
                    $values['dateTaken'],
                    $values['edcDateTaken'] ?? null,
                    $values['sex'],
                    $values['pscid'] ?? null
                );
            } else {
                $centerIDs = $user->getData('CenterIDs');
                $centerID  = $centerIDs[0];
                $candID    = \Candidate::createNew(
                    (int)$centerID,
                    $values['dateTaken'],
                    $values['edcDateTaken'] ?? null,
                    $values['sex'],
                    $values['pscid'] ?? null
                );
            }
            // get the candidate
            $candidate = \Candidate::singleton($candID);
            // setup the project for candidate
            if (isset($values['project'])) {
                $candidate->setData(array('ProjectID' => $values['project']));
            }
            $result           = array();
            $result['candID'] = $candID;
            $result['pscid']  = $candidate->getPSCID();

            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(201)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($result)
                    )
                );
        break;
        case "GET":
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(201)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($this->getDefaultFields())
                    )
                );
            break;
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET,POST");
        }
    }

    /**
     * Processes the values and saves to database
     *
     * @param array $values the user data received..
     *
     * @return array
     */
    function processValidity($values)
    {
        // Validate (dateTaken, dateTakenConfirm, sex) not set.
        if (!isset($values['dateTaken'])
            || !isset($values['dateTakenConfirm'])
            || !isset($values['sex'])
        ) {
            return array('error' => 'Incomplete candidate fields.');
        }
        // Validate dob.
        if (strlen($values['dateTaken']) > 2
            && !$this->_checkDate($values['dateTakenConfirm'])
        ) {
            return array('error' => 'Birth date is not a valid date.');
        } else if ($values['dateTaken'] != $values['dateTakenConfirm']) {
            // Validate (dob1 & dob2) are not equal.
            return array('error' => 'Birth date confirmation mismatch.');
        }
        $config =& \NDB_Config::singleton();
        // Validate edc.
        if ($config->getSetting('useEDC') == 'true'
            && is_array($values['edcDateTaken'])
            && is_array($values['edcDateTakenConfirm'])
        ) {
            if (strlen(implode($values['edcDateTaken'])) > 2
                && !$this->_checkDate($values['edcDateTaken'])
            ) {
                return array('error' => 'EDC is not a valid date.');
            } else if ($values['edcDateTaken'] != $values['edcDateTakenConfirm']) {
                return array('error' => 'Estimated Due date fields must match.');
            }
        } else {
            $values['edcDateTaken']        = null;
            $values['edcDateTakenConfirm'] = null;
        }
        // Validate Gender.
        if (strcasecmp($values['sex'], 'Male') !== 0
            && strcasecmp($values['sex'], 'Female') !== 0
            && strcasecmp($values['sex'], 'Other') !== 0
            && strcasecmp($values['sex'], 'Unknown') !== 0
        ) {
            return array('error' => 'Invalid sex option.');
        }
        // Validate PSCID.
        $pscidSettings = $config->getSetting('PSCID');
        $user          =& \User::singleton();
        if ($pscidSettings['generation'] == 'user') {
            // Setup Database object.
            $db = \Database::singleton();
            if (empty($values['site'])) { // user is in only one site.
                $centerIDs = $user->getData('CenterIDs');
                $centerID  = $centerIDs[0];
                $site      =& \Site::singleton($centerID);
            } else {
                // user has multiple sites, so validate
                // PSCID against the Site selected.
                $site =& \Site::singleton($values['site']);
            }
            if (empty($values['PSCID'])) {
                return array('error' => 'PSCID must be specified.');
            } else if (!\Candidate::validatePSCID(
                $values['PSCID'],
                $site->getSiteAlias()
            )
            ) {
                return ['error' => 'PSCID does not match the required structure.'];
            } else if ($db->pselectOne(
                "SELECT count(PSCID) FROM candidate WHERE PSCID=:V_PSCID",
                array('V_PSCID' => $values['site'])
            ) > 0
            ) {
                return array('error' => 'PSCID has already been registered.');
            }
        }
        // Validate site.
        $site = intval($values['site']) ?? null;
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites > 1 && (empty($site) || !$user->hasCenter($site))) {
            return ['error' => 'Site must be selected from the available dropdown.'];
        }
        return $values;
    }

    /**
     * QuickForm rule to check that a date is valid.
     *
     * @param array $dateElement The date element in QuickForm array format.
     *
     * @return True if the date is invalid, false if it's valid.
     */
    function _checkDate($dateElement)
    {
        if (empty($dateElement['M'])
            && empty($dateElement['d'])
            && empty($dateElement['Y'])
        ) {
            // if all three elements are empty, return true b/c it'll
            // save the NULL in date field
            return true;
        } elseif (empty($dateElement['M'])
            || empty($dateElement['d'])
            || empty($dateElement['Y'])
        ) {
            // otherwise, if any of the three elements are empty, return
            // false b/c date entry has been attempted
            return false;
        }
        return checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
    }

    /**
     * This function will return an array
     * This array will help to initializing react form
     *
     * @return array An associative array of react setting format
     */
    function getDefaultFields(): array
    {
        $DB     = \Database::singleton();
        $config = \NDB_Config::singleton();
        $user   = \User::singleton();
        $result['startYear'] = $config->getSetting('startYear');
        $result['endYear']   = $config->getSetting('endYear');
        $result['ageMax']    = $config->getSetting('ageMax');
        $result['ageMin']    = $config->getSetting('ageMin');
        $result['dobFormat'] = $config->getSetting('dobFormat');
        $result['edc']       = $config->getSetting('useEDC');
        $result['sex']       = array(
                                'male'   => 'Male',
                                'female' => 'Female',
                               );
        $result['pscidSet']  = "false";
        //get sites for the select dropdown
        $user_list_of_sites = $user->getData('CenterIDs');
        $num_sites          = count($user_list_of_sites);
        if ($num_sites >=1) {
            foreach ($user_list_of_sites as $key => $siteID) {
                $center = $DB->pselectRow(
                    "SELECT CenterID as ID, Name FROM psc WHERE CenterID =:cid",
                    array('cid' => $siteID)
                );
                $psc_labelOptions[$siteID] = $center['Name'];
            }
        } else {
            $psc_labelOptions = array(null => '');
        }
         $result['site'] = $psc_labelOptions;
         //get projects for the select dropdown
        $projects = \Utility::getProjectList();
        foreach ($projects as $key=>$value) {
             $list_of_projects[$key] = $value;
        }
        $result['project'] = $list_of_projects ?? null;
         //get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $result['pscidSet'] = "true";
        }
        return $result;
    }
}


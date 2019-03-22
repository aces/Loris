<?php
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
            $values    = $request->getParsedBody();
            $DB        = \Database::singleton();
            $user      = \User::singleton();
            $config    = \NDB_Config::singleton();
            $site_arr  = $user->getData('CenterIDs');
            $num_sites = count($site_arr);
            if ($num_sites >=1) {
                $candID = \Candidate::createNew(
                    $values['site'],
                    $values['dateTaken'],
                    $values['edcDateTaken'] ?? null,
                    $values['sex'],
                    $values['pscid'] ?? null
                );
            } else {
                $centerIDs = $user->getData('CenterIDs');
                $centerID  = $centerIDs[0];
                $candID    = \Candidate::createNew(
                    $centerID,
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
        $result['startYear']  = $config->getSetting('startYear');
        $result['endYear']    = $config->getSetting('endYear');
        $result['ageMax']     = $config->getSetting('ageMax');
        $result['ageMin']     = $config->getSetting('ageMin');
        $result['dobFormat']  = $config->getSetting('dobFormat');
        $result['edc']        = $config->getSetting('useEDC');
        $result['useProject'] = $config->getSetting('useProjects');
        $result['sex']        = array(
                                 'male'   => 'Male',
                                 'female' => 'Female',
                                );
        $result['pscidSet']   = "false";
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
        $result['project'] = $list_of_projects;
         //get setting through pscid
        $PSCIDsettings = $config->getSetting('PSCID');
        if ($PSCIDsettings['generation'] == 'user') {
            $result['pscidSet'] = "true";
        }
        return $result;
    }
}


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
        if (count($centerIDs) == 1 && !isset($values['site'])) {
            $values['site'] = $centerIDs[0];
        }
        //TODO: add similar logic to projects when user-projects association is
        //incorporated.

        /* Create the candidate and retrieve its ID.
         * Use form values when present, otherwise default to null.
         */
        $candID = \Candidate::createNew(
            (int)$values['site'],
            $values['dobDate'],
            $values['edcDate'] ?? null,
            $values['sex'],
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
            'other'  => 'Other',
        );
        $pscidSet  = "false";
        $minYear   = (isset($startYear, $ageMax)) ? $startYear - $ageMax : null;
        $maxYear   = (isset($endYear, $ageMin)) ? $endYear - $ageMin : null;

        // Get sites for the select dropdown
        $userSites = $user->getData('CenterIDs');
        $sites       = array();
        foreach ($userSites as $key => $siteID) {
            $center = $DB->pselectRow(
                "SELECT CenterID as ID, Name FROM psc WHERE CenterID =:cid",
                array('cid' => $siteID)
            );
            if (!is_null($center)) {
                $sites[$siteID] = $center['Name'];
            }
        }

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
            'site'      => $sites,
            'project'   => $project,
        );
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
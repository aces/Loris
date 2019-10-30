<?php
/**
 * Handles API requests for the candidate's visit
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate;
set_include_path(
    get_include_path()
    . ":" . __DIR__ . "/../"
    . ':' . __DIR__ . "/../../../../php/libraries/"
);

require_once 'Candidate.php';
require_once 'TimePoint.class.inc';

/**
 * Handles API requests for the candidate's visit. Extends
 * Candidate so that the constructor will validate the candidate
 * portion of URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Visit extends \Loris\API\Candidates\Candidate
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $InputData  The data posted to this URL
     */
    public function __construct($method, $CandID, $VisitLabel, $InputData=null)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                    ];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;

        //   $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID);
        if ($method === 'PUT') {
            $this->ReceivedJSON = $InputData;
        } else {
            $timepoints = $this->Candidate->getListOfVisitLabels();
            $Visits     = array_values($timepoints);

            $session = array_keys($timepoints, $VisitLabel);
            if (isset($session[0])) {
                $this->Timepoint = $this->Factory->TimePoint($session[0]);
            }

            if (!in_array($VisitLabel, $Visits)) {
                $this->header("HTTP/1.1 404 Not Found");
                $this->error("Invalid visit $VisitLabel");
                $this->safeExit(0);
            }
        }

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $SubProjTitle = $this->Timepoint->getData("SubprojectTitle");
        $centerID     = $this->Timepoint->getData("CenterID");
        $center       = $this->DB->pselectRow(
            "SELECT Name FROM psc WHERE CenterID =:cid",
            array('cid' => $centerID)
        );
        $centerName   = $center['Name'];

        $this->JSON = [
                       "Meta" => [
                                  "CandID"  => $this->CandID,
                                  'Visit'   => $this->VisitLabel,
                                  'Site'    => $centerName,
                                  'Battery' => $SubProjTitle,
                                 ],
                      ];
        if ($this->Timepoint) {
            $stages = [];
            if ($this->Timepoint->getDateOfScreening() !== null) {
                $Date   = $this->Timepoint->getDateOfScreening();
                $Status = $this->Timepoint->getScreeningStatus();

                $stages['Screening'] = [
                                        'Date'   => $Date,
                                        'Status' => $Status,
                                       ];
            }
            if ($this->Timepoint->getDateOfVisit() !== null) {
                $Date   = $this->Timepoint->getDateOfVisit();
                $Status = $this->Timepoint->getVisitStatus();

                $stages['Visit'] = [
                                    'Date'   => $Date,
                                    'Status' => $Status,
                                   ];
            }
            if ($this->Timepoint->getDateOfApproval() !== null) {
                $Date   = $this->Timepoint->getDateOfApproval();
                $Status = $this->Timepoint->getApprovalStatus();

                $stages['Approval'] = [
                                       'Date'   => $Date,
                                       'Status' => $Status,
                                      ];
            }
            $this->JSON['Stages'] = $stages;
        }
    }

    /**
     * Handles a PUT request for a visit
     *
     * @return void
     */
    public function handlePUT()
    {
        if (!isset($this->ReceivedJSON['Meta']['CandID'])
            || $this->ReceivedJSON['Meta']['CandID'] != $this->CandID
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Candidate from URL does not match metadata");
                $this->safeExit(0);
        }
        if (!isset($this->ReceivedJSON['Meta']['Visit'])
            || $this->ReceivedJSON['Meta']['Visit'] != $this->VisitLabel
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Visit from URL does not match metadata");
                $this->safeExit(0);
        }

        $subprojects  = \Utility::getSubprojectList();
        $subprojectID = null;
        foreach ($subprojects as $subproject => $title) {
            if ($title === $this->ReceivedJSON['Meta']['Battery']) {
                $subprojectID = $subproject;
                break;
            }
        }
        if ($subprojectID === null) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Test battery specified does not exist");
            $this->safeExit(0);

        }
        // The API requires siteName as an input to timepoint creation
        $user      = \User::singleton();
        $centerIDs = $user->getCenterIDs();
        $num_sites = count($centerIDs);
        if ($num_sites == 0) {
            $this->header("HTTP/1.1 401 Unauthorized");
            $this->error("You are not affiliated with any site");
            $this->safeExit(0);
        } else {
            if (!isset($this->ReceivedJSON['Meta']['Site'])) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error(
                    "Users need to specify the name of the site at " .
                    "which the visit took place."
                );
                $this->safeExit(0);
            } else {
                $siteName         = $this->ReceivedJSON['Meta']['Site'];
                $allSiteNames     = $this->DB->pselectColWithIndexKey(
                    "SELECT CenterID, Name FROM psc ",
                    array(),
                    "CenterID"
                );
                $allUserSiteNames = $this->DB->pselectColWithIndexKey(
                    "SELECT CenterID, Name FROM psc ".
                    "WHERE FIND_IN_SET(CenterID, :cid)",
                    array('cid' => implode(',', $centerIDs)),
                    "CenterID"
                );
                if (!in_array($siteName, $allSiteNames)) {
                    $this->header("HTTP/1.1 400 Bad Request");
                    $this->error(
                        "Users need to specify a valid name for the site " .
                        "at which the visit took place."
                    );
                    $this->safeExit(0);
                }
                //Get the CenterID from the provided SiteName
                $centerID = array_search($siteName, $allUserSiteNames);
                if ($centerID === false) {
                    $this->header("HTTP/1.1 403 Forbidden");
                    $this->error(
                        "You are creating a visit at a site you " .
                        "are not affiliated with."
                    );
                    $this->safeExit(0);
                }
                $this->createNew(
                    $this->CandID,
                    $subprojectID,
                    $this->VisitLabel,
                    $centerID
                );
                $this->header("HTTP/1.1 201 Created");
            }
        }
    }

    /**
     * Create a new timepoint
     *
     * This is a wrapper around the Timepoint::createNew function
     * that can be stubbed out for testing.
     *
     * @param integer $CandID       The candidate with the visit
     * @param integer $subprojectID The subproject for the new visit
     * @param string  $VL           The visit label of the visit to
     *                              be created
     * @param integer $CID          The ID of the center of the visit
     *
     * @return void
     */
    function createNew($CandID, $subprojectID, $VL, $CID)
    {
        try {
            \TimePoint::isValidVisitLabel($CandID, $subprojectID, $VL);
        } catch (\LorisException $e) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error($e->getMessage());
            $this->safeExit(0);
        }

        $cand        = \Candidate::singleton($candID);
        $sessionSite = \Site::singleton($CID);

        \TimePoint::createNew($cand, $subprojectID, $VL, $sessionSite);
    }
}

if (isset($_REQUEST['PrintVisit'])) {
    $InputDataArray = file_get_contents("php://input");
    $InputData      = json_decode($InputDataArray, true);
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $obj = new Visit(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            $_REQUEST['VisitLabel'],
            $InputData
        );
    } else {
        $obj = new Visit(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            $_REQUEST['VisitLabel']
        );
    }
    print $obj->toJSONString();
}


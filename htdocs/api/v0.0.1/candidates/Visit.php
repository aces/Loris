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
set_include_path(get_include_path() . ":" . __DIR__ . "/../" . ':' . __DIR__ . "/../../../../php/libraries/");

require_once 'Candidate.php';
require_once 'TimePoint.class.inc';

/**
 * Handles API requests for the candidate's visit
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
        $this->CandID = $CandID;
        $this->VisitLabel = $VisitLabel;


     //   $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID);
        if($method === 'PUT') {
            $this->ReceivedJSON = json_decode($InputData, true);
        } else {
            $timepoints = $this->Candidate->getListOfVisitLabels();
            $Visits = array_values($timepoints);

            $session = array_keys($timepoints, $VisitLabel);
            if(isset($session[0])) {
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
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        $this->JSON = [
                       "Meta" => [
                                  "CandID" => $this->CandID,
                                  'Visit'  => $this->VisitLabel,
                                  'Battery' => $this->Timepoint->getData("SubprojectTitle")
                                 ],
                      ];
       if($this->Timepoint) {
           $stages = [];
           if($this->Timepoint->getDateOfScreening() !== null) {
               $stages['Screening'] = [
                    'Date' => $this->Timepoint->getDateOfScreening(),
                    'Status' => $this->Timepoint->getScreeningStatus()
                   ];
           }
           if($this->Timepoint->getDateOfVisit() !== null) {
               $stages['Visit'] = [
                    'Date' => $this->Timepoint->getDateOfVisit(),
                    'Status' => $this->Timepoint->getVisitStatus()
                   ];
           }
           if($this->Timepoint->getDateOfApproval() !== null) {
               $stages['Approval'] = [
                    'Date' => $this->Timepoint->getDateOfApproval(),
                    'Status' => $this->Timepoint->getApprovalStatus()
                   ];
           }
           $this->JSON['Stages'] = $stages;
       }
    }
    public function handlePUT() {
        if(!isset($this->ReceivedJSON['Meta']['CandID']) ||
            $this->ReceivedJSON['Meta']['CandID'] != $this->CandID
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Candidate from URL does not match metadata");
                $this->safeExit(0);
        }
        if(!isset($this->ReceivedJSON['Meta']['Visit']) ||
            $this->ReceivedJSON['Meta']['Visit'] != $this->VisitLabel
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Visit from URL does not match metadata");
                $this->safeExit(0);
        }


        $subprojects = \Utility::getSubprojectList();
        $subprojectID = null;
        foreach($subprojects as $subproject => $title) {
            if($title === $this->ReceivedJSON['Meta']['Battery']) {
                $subprojectID = $subproject;
                break;
            }
        }
        if($subprojectID === null) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Test battery specified does not exist");
            $this->safeExit(0);

        }
        // need to extract subprojectID
        //TimePoint::createNew($this->CandID, $subprojectID, $this->VisitLabel);
        $this->header("HTTP/1.1 201 Created");
    }
}

if (isset($_REQUEST['PrintVisit'])) {
    if($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $obj = new Visit(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        file_get_contents("php://input")
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
?>

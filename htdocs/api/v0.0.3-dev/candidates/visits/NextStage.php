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
namespace Loris\API\Candidates\Candidate\Visit;
require_once '../Visit.php';
//require_once 'Candidate.php';
//require_once 'TimePoint.class.inc';
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
class NextStage extends \Loris\API\Candidates\Candidate\Visit
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
            $this->AllowedMethods = ['POST'];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;

        // Parent constructor will handle validation of CandID
        parent::__construct($method, $CandID, $VisitLabel);

        if ($method === 'POST') {
            $this->ReceivedJSON = $InputData;
        }

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }
    }

    /**
     * Handles a POST request to start next stage
     *
     * @return void but populates $this->JSON and writes to DB
     */
    public function handlePOST()
    {
        $candid = null;
        $data   = $this->ReceivedJSON;

        if ($data === null) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Can't parse data");
            $this->safeExit(0);
        }

        if (!isset($data['Meta']['CandID'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Candidate object in the POST data");
            $this->safeExit(0);
        }
        if (!isset($data['Meta']['Visit'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no VisitLabel specified in the POST data");
            $this->safeExit(0);
        }
        if (!isset($data['Meta']['DateOfVisit'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Visit date specified in the POST data");
            $this->safeExit(0);
        }
        $dateSegments = explode("-",$data['Meta']['DateOfVisit']);
        if (!checkdate($dateSegments[1],$dateSegments[2],$dateSegments[0])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("The date specified in the POST data is invalid. date must be of the form YYYY-MM-DD");
            $this->safeExit(0);
        }
        $sessionID = $this->DB->pselectOne(
            "SELECT ID FROM session
            WHERE CandID=:cid AND Visit_label=:vl",
            array(
                "cid"=>$data['Meta']['CandID'],
                "vl"=>$data['Meta']['Visit']
            )
        );

        if (empty($sessionID)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Session with the provided criteria in the POST data");
            $this->safeExit(0);
        }

        $session = \TimePoint::singleton($sessionID);
        if ($session->getCurrentStage() === 'Visit' || $session->getCurrentStage() === 'Approval') {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Visit has already been started");
            $this->safeExit(0);
        }
        $newStage = $session->getNextStage();

        // start that stage
        $session->startStage($newStage);

        // set the date for the new stage
        $session->setData(
            array(
                "Date_".$newStage => $data['Meta']['DateOfVisit']
            )
        );

        // create a new battery object && new battery
        $battery   = new \NDB_BVL_Battery;
        $candidate = \Candidate::singleton($session->getCandID());

        $firstVisit = false;
        //get first visit for candidate
        $vLabel = $candidate->getFirstVisit();
        //if current visit label is same as
        // visit label returned must be first visit
        if ($vLabel ==  $session->getVisitLabel()) {
            $firstVisit = true;
        }

        // select a specific time point (sessionID) for the battery
        $battery->selectBattery($sessionID);

        // add instruments to the time point (lower case stage)
        $battery->createBattery(
            $session->getSubprojectID(),
            $newStage,
            $session->getVisitLabel(),
            $session->getCenterID(),
            $firstVisit
        );
        $this->header("HTTP/1.1 201 Next Stage Started");
        $this->JSON="success";
    }

}

if (isset($_REQUEST['nextStage'])) {
    $InputDataArray = file_get_contents("php://input");
    $InputData      = json_decode($InputDataArray, true);
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $obj = new NextStage(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            $_REQUEST['VisitLabel'],
            $InputData
        );
    }
    print $obj->toJSONString();
}

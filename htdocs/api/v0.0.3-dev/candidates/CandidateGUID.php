<?php
/**
 * Handles a request to the candidates portion of the Loris API
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates;
set_include_path(get_include_path() . ":" . __DIR__ . "/../");
require_once 'APIBase.php';
use \LORIS\StudyEntities\Candidate\CandID;

/**
 * Class to handle a request to the candidates portion of the Loris API
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateGUID extends \Loris\API\APIBase
{
    var $RequestData;
    var $CandID;
    var $Candidate;

    /**
     * Create a Candidates request handler
     *
     * @param string $method The HTTP request method of the request
     * @param string $CandID CandID of candidate to be serialized
     * @param array  $data   The data that was POSTed to the request
     */
    public function __construct($method, $CandID, $data=null)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;
        $this->AutoHandleRequestDelegation = false;

        $this->AllowedMethods = [
            'GET',
            'POST',
        ];

        $this->RequestData    = $data;

        parent::__construct($method);

        try {
            $this->CandID    = new CandID($CandID);
            $this->Candidate = $this->Factory->Candidate($CandID);
        } catch (\DomainException $e) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Invalid CandID format");
            $this->safeExit(0);
        } catch (\LorisException $e) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Unknown CandID");
            $this->safeExit(0);
        }

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }
    }

    /**
     * Calculate an ETag by taking a hash of the number of candidates in the
     * database and the time of the most recently changed one.
     *
     * @return string An ETag for ths candidates object
     */
    function calculateETag()
    {
        $ETagCriteria = $this->DB->pselectRow(
            "SELECT MAX(TestDate) as Time,
                    COUNT(DISTINCT CandID) as NumCandidates
             FROM candidate WHERE Active='Y'",
            array()
        );
        return md5(
            'Candidates:'
            . $ETagCriteria['Time']
            . ':' . $ETagCriteria['NumCandidates']
        );
    }
    /**
     * Handles a candidates GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $Site = $this->Candidate->getCandidateSite();
        $Sex  = $this->Candidate->getCandidateSex();

        $this->JSON = [
            "Meta"   => [
                "CandID"  => $this->CandID,
                'Project' => $this->Candidate->getProjectTitle(),
                'PSCID'   => $this->Candidate->getPSCID(),
                'Site'    => $Site,
                'EDC'     => $this->Candidate->getCandidateEDC(),
                'DoB'     => $this->Candidate->getCandidateDoB(),
                'Sex'     => $Sex,
                'GUID'    => $this->Candidate->getData("CandidateGUIDs"),
            ],
            "Visits" => array_values(
                $this->Candidate->getListOfVisitLabels()
            ),
        ];
    }

    /**
     * Handles a candidates POST request to validate data and if everything
     * is valid, create the candidate
     *
     * @return void but populates $this->JSON and writes to DB
     */
    public function handlePOST()
    {
        $data   = $this->RequestData;
        if ($data === null) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Can't parse data");
            $this->safeExit(0);
        }
        if (!isset($data['Candidate'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Candidate object in the POST data");
            $this->safeExit(0);
        }
        if (!isset($data['Candidate']['CandID'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no Candidate Identifier in the POST data");
            $this->safeExit(0);
        }
        if ($data['Candidate']['CandID'] !== strval($this->CandID)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Candidate in the POST data does not match the REQUEST data");
            $this->safeExit(0);
        }
        if (!isset($data['Candidate']['GUID'])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("There is no GUID Identifier in the POST data");
            $this->safeExit(0);
        }
        $candid = $data['Candidate']['CandID'];

        $candidate = \Candidate::singleton($candid);
        try {
            $candidate->setData(array("GUID"=>$data['Candidate']['GUID']));
        } catch(\LorisException $e) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
        $this->header("HTTP/1.1 201 Created");
        $this->JSON = "success";
    }
}

if (isset($_REQUEST['PrintCandidate'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $obj = new CandidateGUID(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID'],
            json_decode($data, true)
        );
    } else {
        $obj = new CandidateGUID(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['CandID']
        );
    }
    print $obj->toJSONString();
}

<?php
/**
 * Handles HTTP requests to the Candidate portion of the
 * Loris REST API.
 *
 * PHP Version 5
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
 * Class to handle HTTP requests to the Candidate portion of the
 * Loris REST API.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidate extends \Loris\API\APIBase
{
    var $Candidate;

    /**
     * Construct class to handle request
     *
     * @param string $method HTTP method of request
     * @param string $CandID CandID of candidate to be serialized
     */
    public function __construct($method, $CandID)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

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
     * Handle a GET request
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
                                   ],
                       "Visits" => array_values(
                           $this->Candidate->getListOfVisitLabels()
                       ),
                      ];
    }

    /**
     * Calculate the ETag for this Candidate by taking a hash of the
     * most recent change to the candidate, visit tables or number of
     * visits
     *
     * @return string An ETag for this object
     */
    function calculateETag()
    {
        $row = $this->DB->pselectRow(
            "SELECT MAX(c.Testdate) as CandChange,
                MAX(s.Testdate) as VisitChange,
                COUNT(s.Visit_label) as VisitCount
            FROM candidate c JOIN session s ON (c.CandID=s.CandID)
            WHERE c.CandID=:candidate",
            array("candidate" => $this->CandID)
        );
        return md5(
            'Candidate:' . $this->CandID . ':'
            . $row['CandChange'] . ':'
            . $row['VisitChange'] . ':'
            . $row['VisitCount']
        );
    }

}

if (isset($_REQUEST['PrintCandidate'])) {
    $obj = new \Loris\API\Candidates\Candidate(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID']
    );
    print $obj->toJSONString();
}


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
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

/**
 * Class to handle a request to the candidates portion of the Loris API
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidates extends APIBase
{
    var $RequestData;

    /**
     * Create a Candidates request handler
     *
     * @param string $method The HTTP request method of the request
     * @param array  $data   The data that was POSTed to the request
     */
    public function __construct($method, $data=null)
    {
        $this->AllowedMethods = [
                                 'GET',
                                 'POST',
                                ];
        $this->RequestData    = $data;

        parent::__construct($method);
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
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {
        // The inaccurately titled "Gender" column was renamed to "Sex"
        // in the backend, but the v0.0.2 version of the API is immutable
        // and still needs to refer to it as Gender, even if it's wrong.
        $candidates = $this->DB->pselect(
            "SELECT CandID, ProjectID, PSCID, s.Alias as Site,
                    EDC, DoB, Sex as Gender
                FROM candidate c JOIN psc s on (s.CenterID=c.RegistrationCenterID)
             WHERE Active='Y'
                ",
            []
        );

        $projects   = \Utility::getProjectList();
        $candValues = array_map(
            function ($row) use ($projects) {
                $row['Project'] = isset($projects[$row['ProjectID']])
                    ? $projects[$row['ProjectID']]
                    : "loris";
                unset($row['ProjectID']);
                return $row;
            },
            $candidates
        );

        $this->JSON = ["Candidates" => $candValues];
    }

    /**
     * Handles a candidates POST request to validate data and if everything
     * is valid, create the candidate
     *
     * @return void (but populates $this->JSON and writes to DB)
     */
    public function handlePOST()
    {
        $data = $this->RequestData;
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

        // This version of the API does not handle candidate creation
        // when users are at multiple sites
        $user      = \User::singleton();
        $centerIDs = $user->getCenterIDs();
        $num_sites = count($centerIDs);

        if ($num_sites == 0) {
            $this->header("HTTP/1.1 401 Unauthorized");
            $this->error("You are not affiliated with any site");
            $this->safeExit(0);
        }

        if ($num_sites > 1) {
            $this->header("HTTP/1.1 501 Not Implemented");
            $this->error(
                "This API version does not support candidate creation " .
                "by users with multiple site affiliations. This will be ".
                "implemented in a future release."
            );
            $this->safeExit(0);
        }

        $centerID = $centerIDs[0];
        $this->verifyField($data, 'Gender', ['Male', 'Female']);
        $this->verifyField($data, 'DoB', 'YYYY-MM-DD');

        //Candidate::createNew
        try {
            $candid = $this->createNew(
                $centerID,
                $data['Candidate']['DoB'],
                $data['Candidate']['EDC'],
                $data['Candidate']['Gender'],
                $data['Candidate']['PSCID']
            );

        } catch(\LorisException $e) {
            $this->header("HTTP/1.1 500 Internal Server Error");
            $this->error("Candidate can't be created");
            $this->safeExit(0);
        }

        if (isset($data['Candidate']['Project'])) {
            $projectName = $data['Candidate']['Project'];
            $project     = \Project::singleton($projectName);
            if (!empty($project)) {
                \Candidate::singleton($candid)->setData(
                    array('ProjectID' => $project->getId())
                );
            }
        }

        $this->header("HTTP/1.1 201 Created");
        $this->JSON = [
                       'Meta' => ["CandID" => $candid],
                      ];
    }

    /**
     * Verifies that the field POSTed to the URL is valid.
     *
     * @param array  $data   The data that was posted
     * @param string $field  The field to be validated in $data
     * @param mixed  $values Can either be an array of valid values for
     *                       the field, or a string representing the format
     *                       expected of the data.
     *
     * @return void (but will generate an error and exit if the value is invalid.)
     */
    protected function verifyField($data, $field, $values)
    {
        if (!isset($data['Candidate'][$field])) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Candidate's field missing");
            $this->safeExit(0);
        }
        if (is_array($values) && !in_array($data['Candidate'][$field], $values)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Value not permitted");
            $this->safeExit(0);
        }
        if ($values === 'YYYY-MM-DD'
            && !preg_match("/\d\d\d\d\-\d\d\-\d\d/", $data['Candidate'][$field])
        ) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Invalid date format");
            $this->safeExit(0);
        }
    }

    /**
     * Testable wrapper for Candidate::createNew
     *
     * @param string $centerID The center id of the candidate
     * @param string $DoB      Date of birth of the candidate
     * @param string $edc      EDC of the candidate
     * @param string $gender   Gender of the candidate to be created
     * @param string $PSCID    PSCID of the candidate to be created
     *
     * @return none
     */
    public function createNew($centerID, $DoB, $edc, $gender, $PSCID)
    {
        return \Candidate::createNew(
            $centerID,
            $DoB,
            $edc,
            $gender,
            $PSCID
        );
    }
}

if (isset($_REQUEST['PrintCandidates'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $obj = new Candidates($_SERVER['REQUEST_METHOD'], json_decode($data, true));
    } else {
        $obj = new Candidates($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}


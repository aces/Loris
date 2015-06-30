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
     * Handles a candidates GET request
     *
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        $candidates = $this->DB->pselect(
            "SELECT CandID FROM candidate WHERE Active='Y'",
            []
        );

        $candValues = array_column($candidates, "CandID");

        $this->JSON = ["Candidates" => $candValues];
    }

    /**
     * Handles a candidates POST request to validate data and if everything
     * is valid, create the candidate
     *
     * @return none, but populates $this->JSON and writes to DB
     */
    public function handlePOST()
    {
        if (isset($this->RequestData['candidate'])) {
            $data = json_decode($this->RequestData['candidate'], true);
            if ($data === null) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->safeExit(0);
            }

            $this->verifyField($data, 'Gender', ['Male', 'Female']);
            $this->verifyField($data, 'EDC', 'YYYY-MM-DD');
            $this->verifyField($data, 'DoB', 'YYYY-MM-DD');
            //Candidate::createNew
            try {
                $this->createNew(
                    $data['Candidate']['DoB'],
                    $data['Candidate']['EDC'],
                    $data['Candidate']['Gender'],
                    $data['Candidate']['PSCID']
                );
                $this->header("HTTP/1.1 201 Created");
                $this->JSON = [
                               'Meta' => ["CandID" => "123456"],
                              ];
            } catch(\LorisException $e) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->safeExit(0);
            }
        } else {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
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
     * @return none, but will generate an error and exit if the value is invalid.
     */
    protected function verifyField($data, $field, $values)
    {
        if (!isset($data['Candidate'][$field])) {
            $this->header("HTTP/1.1 400 Bad Request");
            throw new \Exception("AAAAH $field");
            $this->safeExit(0);
        }
        if (is_array($values) && !in_array($data['Candidate'][$field], $values)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
        if ($values === 'YYYY-MM-DD'
            && !preg_match("/\d\d\d\d\-\d\d\-\d\d/", $data['Candidate'][$field])
        ) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
    }

    /**
     * Testable wrapper for Candidate::createNew
     *
     * @param string $DoB    Date of birth of the candidate
     * @param string $edc    EDC of the candidate
     * @param string $gender Gender of the candidate to be created
     * @param string $PSCID  PSCID of the candidate to be created
     *
     * @return none
     */
    public function createNew($DoB, $edc, $gender, $PSCID)
    {
        $user = \User::singleton();
        \Candidate::createNew(
            $user->getCenterID(),
            $DoB,
            $edc,
            $gender,
            $pscid
        );
    }
}

if (isset($_REQUEST['PrintCandidates'])) {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $obj = new Candidates($_SERVER['REQUEST_METHOD'], $_POST);
    } else {
        $obj = new Candidates($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}
?>

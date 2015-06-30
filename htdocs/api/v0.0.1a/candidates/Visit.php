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
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'Candidate.php';

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
    public function __construct($method, $CandID, $VisitLabel)
    {
        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                    ];
        }
        $this->VisitLabel = $VisitLabel;


        $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID);

        $Visits = array_values($this->Candidate->getListOfVisitLabels());


        if (!in_array($VisitLabel, $Visits)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid visit $VisitLabel");
            $this->safeExit(0);
        }



    }

    /**
     * Handles a GET request
     *
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        print_r($this->Timepoint);
        $this->JSON = [
                       "Meta" => [
                                  "CandID" => $this->CandID,
                                  'Visit'  => $this->VisitLabel,
                                  'Battery' => $this->Timepoint->getData("SubprojectTitle")
                                 ],
                      ];
    }
}

if (isset($_REQUEST['PrintVisit'])) {
    $obj = new Visit(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}
?>

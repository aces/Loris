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
namespace Loris\API\Candidates\Candidate\Visit\QC;
require_once '../../Visit.php';
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
class Imaging extends \Loris\API\Candidates\Candidate\Visit
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $InputData  The data posted to this URL
     */
    public function __construct($method, $CandID, $VisitLabel)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET', 'PUT', 'PATCH'];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;

        //   $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID, $VisitLabel);

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
        $factory = \NDB_Factory::singleton();
        $DB = $factory->database();
         $qcstatus = $DB->pselectRow(
         "SELECT MRIQCStatus, MRIQCPending 
             FROM session s JOIN candidate c ON (c.CandID=s.CandID) WHERE c.Active='Y' AND s.Active='Y'
             AND s.Visit_label=:VL AND c.CandID=:CID",
             array('VL' => $this->VisitLabel, 'CID' => $this->CandID)
         );
          

        $this->JSON = [
                       'Meta' => [
                                    'CandID' => $this->CandID,
                                    'Visit' => $this->VisitLabel
                                 ]
                      ];

        $this->JSON['SessionQC'] = $qcstatus['MRIQCStatus'];
        $this->JSON['Pending'] = $qcstatus['MRIQCPending'] === 'N' ? false : true;

    }

    public function handlePUT() {
    {
    }
    public function handlePATCH() {
    {
    }
}

if (isset($_REQUEST['PrintQC'])) {
    $obj = new Imaging(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}
?>

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
class Dicoms extends \Loris\API\Candidates\Candidate\Visit
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
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
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
        $this->JSON          = [
                                'Meta' => [
                                           'CandID' => $this->CandID,
                                           'Visit'  => $this->VisitLabel,
                                          ],
                               ];
        $this->JSON['DicomTars'] = $this->getVisitDicoms();

    }

    /**
     * Gets a list of Tars for this visit. Tarname only.
     *
     * @return an array of strings of Tarnames
     */
    function getVisitDicoms()
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $cand_info = $DB->pselectRow(
            "SELECT c.PSCID, c.Entity_type
                FROM candidate c
                    JOIN session s ON (c.CandID=s.CandID)
                WHERE c.Active='Y' AND s.Active='Y'
                AND c.CandID=:CID
                AND s.Visit_label=:VL", 
            [
             'CID' => $this->CandID,
             'VL'  => $this->VisitLabel,
            ]
        );
        if ($cand_info['Entity_type'] == 'Scanner') {
            $ID            = "'" . $this->VisitLabel . "'" ;
            $params['PVL'] = $this->VisitLabel;
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $cand_info['PSCID'];
            $params['PCandID'] = $this->CandID;
            $params['PVL']     = $this->VisitLabel;
        }
        $rows    = $DB->pselect(
            "SELECT SUBSTRING_INDEX(ArchiveLocation, '/', -1) as Tarname
                FROM tarchive t 
                WHERE t.PatientName LIKE $ID", 
                $params
        );
        return $rows;
    }

}

if (isset($_REQUEST['PrintDicoms'])) {
    $obj = new Dicoms(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}
?>

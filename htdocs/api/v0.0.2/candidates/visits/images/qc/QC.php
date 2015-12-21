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
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Qc;
require_once __DIR__ . '/../Image.php';
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
class QC extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $InputData  The data posted to this URL
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET', 'PUT', 'PATCH'];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

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
        $DB = $factory->Database();
        $QCStatus = $DB->pselectRow("SELECT QCStatus, 
                pf.Value as Selected FROM files f
                LEFT JOIN files_qcstatus fqc ON (f.FileID=fqc.FileID)
                LEFT JOIN parameter_file pf ON (f.FileID=pf.FileID)
                LEFT JOIN parameter_type pt ON (pf.ParameterTypeID=pt.ParameterTypeID AND pt.Name = 'Selected')
                WHERE f.File LIKE CONCAT('%', :FName)", array('FName' => $this->Filename));
        $this->JSON = [
            'Meta' => [
                'CandID' => $this->CandID,
                'Visit' => $this->VisitLabel,
                'File' => $this->Filename,
                ],
                'QC' => $QCStatus['QCStatus'],
                'Selected' => $QCStatus['Selected'],
                'CaveatList' => 'Not yet implemented',
                'Comments' => 'Not yet implemented',
            ];
    }
    public function calculateETag() {
        return null;
    }

    public function handlePUT()
    {
    }

    public function handlePATCH()
    {
    }
}

if (isset($_REQUEST['PrintImageQC'])) {
    $obj = new QC(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}
?>

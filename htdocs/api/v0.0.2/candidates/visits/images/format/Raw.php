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
namespace Loris\API\Candidates\Candidate\Visit\Imaging\Format;
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
class Raw extends \Loris\API\Candidates\Candidate\Visit\Imaging\Image
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
            $this->AllowedMethods = ['GET'];
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
        $mincfile = $this->getFullPath();
        if(`which minctoraw`) {
            $this->Header("Content-Type: application/x.raw");
            passthru("minctoraw -byte -unsigned -normalize " . escapeshellarg($mincfile));
            $this->safeExit(0);
        }

        $this->header("HTTP/1.1 500 Internal Server Error", true, 500);
        $this->error("Minc Tools not installed on server");
    }

    protected function getHeader($headerName) {
        $factory = \NDB_Factory::singleton();
        $db = $factory->Database();

        return $db->pselectOne("SELECT Value
            FROM parameter_file pf 
            JOIN parameter_type pt USING (ParameterTypeID)
            JOIN files f USING (FileID)
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c ON (s.CandID=c.CandID)
            WHERE c.Active='Y' AND s.Active='Y' AND c.CandID=:CID and s.Visit_label=:VL AND f.File LIKE CONCAT('%', :Fname) AND pt.Name = :Header",
                array(
                    'CID' => $this->CandID,
                    'VL' => $this->VisitLabel,
                    'Fname' => $this->Filename,
                    'Header'=>$headerName
                )
            );

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

if (isset($_REQUEST['PrintRawFormat'])) {
    $obj = new Raw(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
}
?>

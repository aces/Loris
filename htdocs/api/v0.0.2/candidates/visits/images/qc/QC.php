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
     * Construct an Image class object to serialize candidate images
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The file name to be serialized
     */
    public function __construct($method, $CandID, $VisitLabel, $Filename)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                    ];
        }

        parent::__construct($method, $CandID, $VisitLabel, $Filename);

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {
        $factory    = \NDB_Factory::singleton();
        $DB         = $factory->Database();
        $QCStatus   = $DB->pselectRow(
            "SELECT QCStatus, Selected 
             FROM files_qcstatus
             WHERE FileID in ( 
                SELECT FileID
                FROM files
                WHERE File LIKE CONCAT('%', :FName)
            )",
            array('FName' => $this->Filename)
        );
        $this->JSON = [
                       'Meta'     => [
                                      'CandID' => $this->CandID,
                                      'Visit'  => $this->VisitLabel,
                                      'File'   => $this->Filename,
                                     ],
                       'QC'       => $QCStatus['QCStatus'],
                       'Selected' => $QCStatus['Selected'],
                      ];
    }

    /**
     * Calculates the ETag for the current QC status
     *
     * @return string
     */
    public function calculateETag()
    {
        return null;
    }

    /**
     * Handles a PUT request for QC data
     *
     * @return void
     */
    public function handlePUT()
    {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        //parse_str(urldecode($data), $data);
        $data = json_decode($data, true);
        if (!isset($data['Meta']['CandID'])
            || $data['Meta']['CandID'] != $this->CandID
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Candidate from URL does not match JSON metadata.");
                $this->safeExit(0);
        }
        if (!isset($data['Meta']['Visit'])
            || $data['Meta']['Visit'] != $this->VisitLabel
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Visit from URL does not match JSON metadata");
                $this->safeExit(0);
        }
        if (!isset($data['Meta']['File'])
            || $data['Meta']['File'] != $this->Filename
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("File name from URL does not match JSON metadata");
                $this->safeExit(0);
        }

        if (!isset($data['QCStatus'])) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Missing QCStatus to save.");
                $this->safeExit(0);
        }
        if ($data['QCStatus'] != "Pass" && $data['QCStatus'] != "Fail") {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Invalid value for QCStatus . Must be Pass or Fail.");
                $this->safeExit(0);
        }
        if (!isset($data['Selected'])) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Missing Selected flag.");
                $this->safeExit(0);
        }

        // We know that it's set to something, because we checked above, so verify
        // that Pending is a valid value.
        // true is equal to "true", but false is not equal to "false".
        if ($data['Selected'] != "true"
            && $data['Selected'] != "false"
            && $data['Selected'] !== false
        ) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->error("Invalid value for Selected. Must be true or false.");
                $this->safeExit(0);
        }

        $selval = "";
        // don't need to handle false, because $selval was initialized to the empty
        // string (which is what // false would save..
        if ($data['Selected'] == "true") {
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->Database();
            $selval  = $DB->pselectOne(
                "SELECT mst.Scan_type 
                 FROM files f 
                    LEFT JOIN mri_scan_type mst ON (f.AcquisitionProtocolID=mst.ID)
                 WHERE f.File LIKE CONCAT('%', :FName)",
                array('FName' => $this->Filename)
            );

        }
        $this->_saveFileQC($data['QCStatus'], $selval);

        $this->JSON = ['success' => 'Updated file QC information'];

    }

    /**
     * Save the QC value to the database. Only call this after everything
     * has been validated
     *
     * @param string $qcval  The Pass/Fail status
     * @param string $selval The value to set the selected field to.
     *
     * @return void
     */
    private function _saveFileQC($qcval, $selval)
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->Database();
        $FileID  = $DB->pselectOne(
            "SELECT f.FileID FROM files f
                WHERE f.File LIKE CONCAT('%', :FName)",
            array('FName' => $this->Filename)
        );
        $AlreadySavedQC = $DB->pselectOne(
            "SELECT COUNT(*) FROM files_qcstatus WHERE FileID=:FID",
            array('FID' => $FileID)
        );
        if ($AlreadySavedQC > 0) {
            $DB->update(
                "files_qcstatus",
                [
                 'QCStatus' => $qcval,
                 'Selected' => $selval,
                ],
                ['FileID' => $FileID]
            );
        } else {
            $DB->insert(
                "files_qcstatus",
                [
                 'QCStatus' => $qcval,
                 'Selected' => $selval,
                 'FileID'   => $FileID,
                ]
            );
        }
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

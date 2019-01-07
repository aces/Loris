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
namespace Loris\API\Candidates\Candidate\Visit\Imaging;
require_once __DIR__ . '/../../Visit.php';
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
class Image extends \Loris\API\Candidates\Candidate\Visit
{
    /**
     * Construct a visit class object to serialize candidate visits
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Filename   The file name to be retrieved
     */
    public function __construct(
        string $method,
        string $CandID,
        string $VisitLabel,
        string $Filename
    ) {

        ob_start();
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                    ];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;
        $this->Filename   = $Filename;

        //   $this->Timepoint = \Timepoint::singleton($timepointID);
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($method, $CandID, $VisitLabel);

        $results =  $this->getDatabaseDir();
        if (empty($results)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("File not found");
            $this->safeExit(0);
        }

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }

    }

    /**
     * Handles a GET request
     *
     * @return void but populates $this->JSON
     */
    public function handleGET(): void
    {
        $fullDir = $this->getFullPath();
        ob_end_clean();

        $fp = fopen($fullDir, "r");
        if ($fp === false) {
            $this->header("HTTP/1.1 500 Internal Server Error");
            error_log("Could not open $fullDir to send to client");
            $this->safeExit(1);
        }

        $this->Header('Cache-control: private');

        $mincHeader = $this->getHeader("header");

        if (substr($mincHeader, 0, 4) === 'hdf5') {
            $contentType = 'application/x.minc2';
        } else {
            $contentType = 'application/octet-stream';
        }
        $this->Header("Content-Type: $contentType");
        $this->Header('Content-Length: '.filesize($fullDir));
        $this->Header('Content-Disposition: attachment; filename='.$this->Filename);

        while (!feof($fp)) {
            print fread($fp, 1024);
        }
        $this->safeExit(0);
    }

    /**
     * Gets an image's header from the database.
     *
     * @param string $headerName The header to retrieve for the current
     *                           file
     *
     * @return string of the header value
     */
    protected function getHeader(string $headerName): string
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->Database();

        return $db->pselectOne(
            "SELECT Value
            FROM parameter_file pf 
            JOIN parameter_type pt USING (ParameterTypeID)
            JOIN files f USING (FileID)
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c ON (s.CandID=c.CandID)
            WHERE c.Active='Y' AND s.Active='Y' AND c.CandID=:CID 
                AND s.Visit_label=:VL 
                AND f.File LIKE CONCAT('%', :Fname) AND pt.Name = :Header",
            array(
             'CID'    => $this->CandID,
             'VL'     => $this->VisitLabel,
             'Fname'  => $this->Filename,
             'Header' => $headerName,
            )
        );

    }

    /**
     * Calculate the entity tag for this image
     *
     * @return null
     */
    public function calculateETag()
    {
        return null;
    }

    /**
     * Gets the full path of this image on the filesystem, in order
     * to be able to pass it to an fopen command (or similar)
     *
     * @return string
     */
    protected function getFullPath(): string
    {
        return $this->getAssemblyRoot() . "/" . $this->getDatabaseDir();
    }

    /**
     * Gets the root of the assembly directory, so that we know where
     * to retrieve images relative to.
     *
     * @return string
     */
    protected function getAssemblyRoot(): string
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->Config();
        return $config->getSetting("mincPath");
    }

    /**
     * Gets the filename saved in the database for this file
     *
     * @return string
     */
    protected function getDatabaseDir()
    {
        $factory = \NDB_Factory::singleton();
        $db      = $factory->Database();
        return $db->pselectOne(
            "SELECT File
                FROM files f
                    JOIN session s ON (f.SessionID=s.ID)
                    JOIN candidate c ON (s.CandID=c.CandID)
                WHERE c.Active='Y' AND s.Active='Y' 
                    AND c.CandID=:CID AND s.Visit_label=:VL
                    AND f.File LIKE CONCAT('%', :Fname)",
            array(
             'CID'   => $this->CandID,
             'VL'    => $this->VisitLabel,
             'Fname' => $this->Filename,
            )
        );
    }
}

if (isset($_REQUEST['PrintImageData'])) {
    $obj = new Image(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Filename']
    );
    print $obj->toJSONString();
}


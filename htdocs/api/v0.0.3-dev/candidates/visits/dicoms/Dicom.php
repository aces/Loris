<?php
/**
 * Handles API requests for the candidate's visit DICOM tar file
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Mouna Safi-Harab <mouna.safiharab@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate\Visit\Dicoms;
require_once __DIR__ . '/../../Visit.php';
/**
 * Handles API requests for the candidate's visit DICOM tar file. Extends
 * Visit so that the constructor will validate the candidate
 * and visit_label portion of the URL automatically.
 *
 * @category Main
 * @package  API
 * @author   Mouna Safi-Harab <mouna.safiharab@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Dicom extends \Loris\API\Candidates\Candidate\Visit
{
    /**
     * Construct a DICOM class object to output the candidate's visit DICOM tar file
     *
     * @param string $method     The method of the HTTP request
     * @param string $CandID     The CandID to be serialized
     * @param string $VisitLabel The visit label to be serialized
     * @param string $Tarname    The DICOM archive to be retrieved
     */
    public function __construct($method, $CandID, $VisitLabel, $Tarname)
    {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;

        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;
        $this->Tarname    = $Tarname;

        parent::__construct($method, $CandID, $VisitLabel);

        $results =  $this->getFullPath();
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
     * @return void but send the file content to stdout
     */
    public function handleGET()
    {
        $fullDir = $this->getFullPath();
        $fp      = fopen($fullDir, "r");
        if ($fp !== false) {
            $this->Header("Content-Type: application/x-tar");
            $this->Header('Content-Length: '.filesize($fullDir));
            $this->Header(
                'Content-Disposition: attachment; filename='.$this->Tarname
            );
            fpassthru($fp);
            fclose($fp);
            $this->safeExit(0);
        } else {
            $this->header("HTTP/1.1 500 Internal Server Error");
            $this->error("Could not load Tarfile");
            $this->safeExit(1);
        }
    }

    /**
     * Gets the full path of this image on the filesystem, in order
     * to be able to pass it to an fopen command (or similar)
     *
     * @return string
     */
    protected function getFullPath()
    {
        return $this->getTarchivePath() . "/" . $this->getTarFile();
    }

    /**
     * Gets the root of the tarchive directory, so that we know where
     * to retrieve images relative to.
     *
     * @return string
     */
    protected function getTarchivePath()
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->Config();
        return $config->getSetting("tarchiveLibraryDir");
    }

    /**
     * Gets the DICOM archive relative location and name, as saved
     * in the database, for this file
     *
     * @return string
     */
    protected function getTarFile()
    {
        $factory      = \NDB_Factory::singleton();
        $db           = $factory->Database();
        $partial_path = $db->pselectOne(
            "SELECT ArchiveLocation
                FROM tarchive t
                    JOIN session s ON (t.SessionID=t.SessionID)
                    JOIN candidate c ON (s.CandID=c.CandID)
                WHERE c.Active='Y' AND s.Active='Y' 
                    AND c.CandID=:CID AND s.Visit_label=:VL
                    AND t.ArchiveLocation LIKE CONCAT('%', :Tname)",
            array(
             'CID'   => $this->CandID,
             'VL'    => $this->VisitLabel,
             'Tname' => $this->Tarname,
            )
        );
        return $partial_path;
    }
}

if (isset($_REQUEST['PrintDicomData'])) {
    $obj = new Dicom(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel'],
        $_REQUEST['Tarname']
    );
    print $obj->toJSONString();
}


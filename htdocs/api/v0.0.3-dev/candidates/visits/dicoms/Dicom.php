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
use LORIS\server_processes_manager as SP;
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
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                     'POST',
                                    ];
        }
        $this->CandID     = $CandID;
        $this->VisitLabel = $VisitLabel;
        $this->Tarname    = $Tarname;

        parent::__construct($method, $CandID, $VisitLabel);

        if ($method=='GET') {
            $results =  $this->getFullPath();
            if (empty($results)) {
                $this->header("HTTP/1.1 404 Not Found");
                $this->error("File not found");
                $this->safeExit(0);
            }
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
        if (isset($_REQUEST['ProcessID']) && !empty($_REQUEST['ProcessID'])) {
            $ids = explode(",", $_REQUEST['ProcessID']);
            $this->printProcessResults($ids);
        } else {
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
    }

    /**
     * Handle a PUT request
     *
     * @return void but populates $this->JSON and writes to database
     */
    public function handlePUT()
    {

        //if (!isset($_REQUEST['Filename'], $_SERVER['HTTP_X_IS_PHANTOM'])) {
        if (!isset($_REQUEST['Tarname'], $_SERVER['HTTP_X_IS_PHANTOM'])) {
            // Missing data. Filname and IsPhantom values are required.
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Missing data. Check your request.");
            $this->safeExit(1);
        }

        // Get file
        $fp   = fopen("php://input", "rb");
        $data = '';
        while (!feof($fp)) {
            if (($buf = fread($fp, 8092)) !='') {
                $data .= $buf;
            }
        }
        fclose($fp);

        if (!empty($data)) {
            $factory = \NDB_Factory::singleton();
            $config  = $factory->Config();
            $MRIUploadIncomingPath = $config->getSetting('MRIUploadIncomingPath');
            if (($MRIUploadIncomingPath) && (is_dir($MRIUploadIncomingPath))
                && (is_writable($MRIUploadIncomingPath))
            ) {
                //@TODO: Check with JohnSaigle et al about security related re
                //$_REQUEST['Tarname'] (sanitisation etc)
                //$dest = $MRIUploadIncomingPath . "/" . $_REQUEST['Filename'];
                $dest = $MRIUploadIncomingPath . "/" . $_REQUEST['Tarname'];
                $op   = fopen($dest, 'wb');
                if (!fwrite($op, $data)) {
                    $this->JSON = array("error" => "Could not write file");
                } else {
                    //$isPhantom = $_REQUEST['IsPhantom'];
                    $isPhantom = $_SERVER['HTTP_X_IS_PHANTOM'];
                    $args      = $this->createProcessArgs($isPhantom);
                    if (!empty($args)) {
                        // Add path to mri upload file
                        $args['values']['uploaded_file_path'] = $dest;
                        $mri_upload_id = $this->_process($args);
                        if ($mri_upload_id) {
                            $this->JSON  = array(
                                            "status"        => "uploaded",
                                            "mri_upload_id" => $mri_upload_id,
                                           );
                            $processDbId = $this->performRealUpload(
                                $mri_upload_id,
                                $dest
                            );
                            if ($processDbId) {
                                $this->printProcessResults(
                                    array($processDbId),
                                    $mri_upload_id
                                );
                            }
                        } else {
                            //@TODO Set header for some 4XX error status I imagine
                            $msg        = "Could not insert mri upload";
                            $this->JSON = array("error" => $msg);
                        }
                    }
                }
                if ($op) {
                    fclose($op);
                }
            } else {
                //@TODO Set header for some 4XX error status I imagine
                $this->JSON = array("error" => "Could not write file");
            }
        }
    }

    /**
     * Handle a POST request
     *
     * @return void but populates $this->JSON and writes to database
     */
    public function handlePOST()
    {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            if (($buf = fread($fp, 1024)) !='') {
                $data .= $buf;
            }
        }
        fclose($fp);

        //@TODO Validate $data
        $data = json_decode($data);

        if (!$this->checkValidUploadData($data)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->error("Missing or incorrect data. Check your request.");
            $this->safeExit(1);
        }

        if (!empty($data)) {
            $factory = \NDB_Factory::singleton();
            $config  = $factory->Config();
            $MRIUploadIncomingPath = $config->getSetting('MRIUploadIncomingPath');
            if (($MRIUploadIncomingPath) && (is_dir($MRIUploadIncomingPath))
                && (is_writable($MRIUploadIncomingPath))
            ) {
                //@TODO: Check with JohnSaigle et al about security related to
                //$data->Filename and others (sanitisation etc)
                $filename      = $data->Filename;
                $mri_upload_id = $data->mri_upload_id;
                $dest          = $MRIUploadIncomingPath . "/" . $filename;
                $op            = stat($dest);
                if (!$op) {
                    $msg = "Could not find file.";
                    $this->header("HTTP/1.1 500 Internal Server Error");
                    $this->error($msg);
                    $this->JSON = array("error" => $msg);
                    $this->safeExit(1);
                } else {
                    $mri_upload_id = $mri_upload_id;
                    //@TODO Check if upload was successfully run before?? If
                    //yes, what to do? Quit?
                    $processDbId = $this->performRealUpload(
                        $mri_upload_id,
                        $dest,
                        true
                    );
                    $this->printProcessResults(
                        array($processDbId),
                        $mri_upload_id,
                        true
                    );
                }
            } else {
                $msg        = "Could not access upload file.";
                $this->JSON = array("error" => $msg);
                $this->header("HTTP/1.1 500 Internal Server Error");
                $this->error($msg);
                $this->safeExit(1);
            }
        }
    }

    /**
     * Process file with Batch upload imaging script
     *
     * @param mixed $args Inputs for processing the file
     *
     * @return true on success, false othewise
     */
    function _process($args)
    {
        $db          = \Database::singleton();
        $user        = \User::singleton();
        $user_name   = $user->getUsername();
        $date        = date('Y-m-d H:i:s');
        $pscid       = $args['values']['pSCID'];
        $candid      = $args['values']['candID'];
        $visit_label = $args['values']['visitLabel'];
        $uploaded_file_path = $args['values']['uploaded_file_path'];
        $isPhantom          = $args['values']['IsPhantom'];
        $pname    = $pscid. "_" . $candid . "_" . $visit_label;
        $sessioni = $db->pselectOne(
            "SELECT ID FROM  session WHERE CandID = :cid
            AND Visit_label =:vlabel",
            array(
             'cid'    => $candid,
             'vlabel' => $visit_label,
            )
        );
        $values   = array(
                     'UploadedBy'     => $user_name,
                     'UploadDate'     => $date,
                     'UploadLocation' => $uploaded_file_path,
                     'SessionID'      => $sessionid,
                     'PatientName'    => $pname,
                     'IsPhantom'      => $isPhantom,
                    );

        $db->insert('mri_upload', $values);
        $mri_upload_id = $db->getLastInsertId();
        if ($mri_upload_id>0) {
            return $mri_upload_id;
        }

        //Something went wrong
        return false;
    }

    /**
     * Gets basic candidate information
     * in order to access PSCID and similar
     *
     * @return mixed
     */
    function getCandData()
    {
        $factory   = \NDB_Factory::singleton();
        $DB        = $factory->database();
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
        return $cand_info;
    }

    /**
     * Creates an array of args for _process()
     *
     * @param bool $isPhantom Fileset is phantom or not
     *
     * @return mixed
     */
    function createProcessArgs($isPhantom=null)
    {
        $cand_info = $this->getCandData();
        if (!empty($cand_info) && !empty($cand_info['PSCID'])) {
            //Create values for processing the file
            $args['values']['candID']     = $this->CandID;
            $args['values']['pSCID']      = $cand_info['PSCID'];
            $args['values']['visitLabel'] = $this->VisitLabel;
            $args['values']['overwrite']  = false;
            $args['values']['IsPhantom']  = $isPhantom;

            return $args;
        }
        //Nothing found
        return false;
    }

    /**
     * Perform the actual upload by executing the imaging uploader pipeline
     *
     * @param mixed  $mri_upload_id      The upload id of the mri
     * @param string $uploaded_file_path The path the the uploaded file on Loris
     * @param bool   $trigger_pipeline   Trigger imaging pipeline manually
     *
     * @return int ID (in the database) of the launched process
     * or null if it could not be launched
     * or false if processing was not attempted
     */
    function performRealUpload($mri_upload_id, $uploaded_file_path,
        $trigger_pipeline=false
    ) {
        $config = \NDB_Config::singleton();
        $ImagingUploaderAutoLaunch = $config->getSetting(
            'ImagingUploaderAutoLaunch'
        );
        if ($ImagingUploaderAutoLaunch || $trigger_pipeline) {
            // Instantiate the server process module to autoload
            // its namespace classes
            $spm_module = \Module::factory('server_processes_manager');
            // Perform the real upload on the server
            $serverProcessLauncher = new SP\ServerProcessLauncher();
            $processDbId           = $serverProcessLauncher->mriUpload(
                $mri_upload_id,
                $uploaded_file_path
            );
            return $processDbId;
        }
        // Did not launch upload
        return false;
    }

    /**
     * Check if MRI Upload data (mri upload id etc) are valid before triggering
     * the Imaging pipeline
     *
     * @param mixed $data The data to validate
     *
     * @return mixed
     */
    function checkValidUploadData($data)
    {
        $Filename      = $data->Filename;
        $mri_upload_id = $data->mri_upload_id;
        $isPhantom     = $data->mri_upload_id;
        $d_ok          = isset($Filename, $isPhantom, $mri_upload_id);

        $factory = \NDB_Factory::singleton();
        $db      = $factory->database();
        $mid     = $db->pselectOne(
            "SELECT UploadID FROM mri_upload WHERE UploadID = :mid",
            array('mid' => $mri_upload_id)
        );

        if (!empty($d_ok) && !empty($mid)) {
            return true;
        }

        return false;
    }

    /**
     * Get info about a Loris process
     *
     * @param array $idsToMonitor IDs of the server processes to monitor
     *
     * @return an associative array of the current state of the processes.
     */
    function getProcessInfo($idsToMonitor)
    {
        // Instantiate the server process module to autoload
        // its namespace classes
        $spm_module = \Module::factory('server_processes_manager');
        // Perform the real upload on the server
        $serverProcessesMonitor = new SP\ServerProcessesMonitor();
        $user        = \User::singleton();
        $user_name   = $user->getUsername();
        // filter to current user
        // @TODO Add permissions check that user can get process info
        $processes = $serverProcessesMonitor->getProcessesState(
            $idsToMonitor,
            $user_name
        );
        //@TODO Catch \DatabaseException thrown by getProcessesState() ??
        foreach ($processes as $proc) {
            $processesInfo[] = array(
                                "process_id" => $proc['ID'],
                                "pid"        => $proc['PID'],
                                "status"    => $proc['STATE'],
                                "message"     => $proc['PROGRESS'],
                               );
        }
        return $processesInfo;
    }

    /**
     * Get info about a Loris process
     *
     * @param array $idsToMonitor     IDs of the server processes to monitor
     * @param int   $mri_upload_id    Upload id of the DICOM fileset
     * @param bool  $trigger_pipeline Imaging pipeline manually triggered
     *
     * @return an associative array of the current state of the processes.
     */
    function printProcessResults($idsToMonitor,
        $mri_upload_id=null,
        $trigger_pipeline=false
    ) {
        $this->header("HTTP/1.1 202 Accepted");
        if (!empty($idsToMonitor)) {
            $processesInfo = $this->getProcessInfo($idsToMonitor);
            if (!empty($this->JSON)) {
                $this->JSON = array_merge(
                    $this->JSON,
                    array("processes" => $processesInfo)
                );
            } else {
                $this->JSON = array("processes" => $processesInfo);
            }
        } else if ($trigger_pipeline) {
            $msg        = "Could not launch processing.";
            $this->JSON = array_merge($this->JSON, array("error" => $msg));
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
?>

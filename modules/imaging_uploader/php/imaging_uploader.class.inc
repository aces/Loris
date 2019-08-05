<?php
/**
 * Mri_upload class file
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/mohadesz/Loris-Trunk
 */
namespace LORIS\imaging_uploader;
use LORIS\server_processes_manager as SP;
/**
 * This module allows a zipped/tgz/gz file to be uploaded into the incoming folder
 * after passing a series of validation.
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Imaging_Uploader extends \NDB_Menu_Filter_Form
{
    var $show_queries    = true;
    var $temp_path       = null;
    var $AjaxModule      = true;
    public $skipTemplate = true;
    /**
     * ID of the uploaded file in mri_upload table (if upload successful).
     * If the file is a reupload of an existing file, then it will be set to
     * the ID of the original upload.
     */
    var $mri_upload_id;
    /**
     * Path to the uploaded file (value of SourceLocation in mri_upload table).
     */
    var $uploaded_file_path;
    /**
     * The hasAccess function ensures that the user has the imaging_uploader
     * permission.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('imaging_uploader');
    }
    /**
     * Sets up the Filter Variables
     *
     * @return void
     */
    function _setupVariables()
    {
        $this->_resetFilters();
        $progressSelectPart = "IF(ISNULL(Inserting), 'Not Started',"
            . "IF(Inserting=1, 'In Progress...', "
            . "IF(InsertionComplete=0, 'Failure', 'Success'))) as Progress";
        // set the class variables
        $this->columns      = array(
            'UploadID AS Upload_ID',
            $progressSelectPart,
            's.CandID',
            'c.PSCID',
            's.Visit_label',
            'UploadLocation AS Upload_Location',
            'UploadDate AS Upload_Date',
            'UploadedBy AS Uploaded_By',
            'mu.TarchiveID AS Tarchive_Info',
            'number_of_mincCreated AS Number_of_MINC_Created',
            'number_of_mincInserted AS Number_of_MINC_Inserted',
            'ta.PatientName',
            's.ID AS SessionID',
        );
        $this->validFilters = array(
            's.CandID',
            'c.PSCID',
            's.Visit_label',
            'mu.IsPhantom',
        );
        $this->query        = " FROM mri_upload mu LEFT JOIN session".
                              " s ON (s.ID = mu.SessionID)".
                              " LEFT JOIN candidate c ON (c.CandID = s.CandID)".
                              " LEFT JOIN tarchive ta ON".
                              " (mu.TarchiveID = ta.TarchiveID)".
                              " WHERE 1=1 ";
        $this->formToFilter = array(
            'CandID'      => 's.CandID',
            'PSCID'       => 'c.PSCID',
            'Visit_label' => 's.Visit_label',
            'IsPhantom'   => 'mu.IsPhantom',
        );
        return true;
    }
     /**
      * Sets up the menu filter items for the imaging uploader
      *
      * @return void
      */
    function setup()
    {
        parent::setup();
        $phantomOtions = [
            'N' => 'No',
            'Y' => 'Yes',
        ];
        $visitlabels   = \Utility::getExistingVisitLabels();
        // Fields used for selection filter and upload form
        $this->addSelect('IsPhantom', 'Phantom Scans', $phantomOtions);
        $this->addBasicText('candID', 'CandID');
        $this->addBasicText('pSCID', 'PSCID');
        $this->addSelect('visitLabel', 'Visit Label', $visitlabels);
        $this->addFile('mriFile', 'File to Upload');
        ///////////////////////////////////////////////////////////////////////
        //////////////////Upload-related Error messages ///////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (empty($_FILES) && empty($_POST)
            && ($_SERVER['REQUEST_METHOD']=='POST')
        ) { //catch file overload error...
            $upload_max_size = \Utility::getMaxUploadSize();
            $error_message   = "Please make sure files are not larger than " .
                                $upload_max_size;
            http_response_code(400);
            $errors = array(
                'IsPhantom'  => array(),
                'candID'     => array(),
                'pSCID'      => array(),
                'visitLabel' => array(),
                'mriFile'    => array($error_message),
            );
            header('Content-Type: application/json; charset=UTF-8');
            exit(json_encode(['errors' => $errors]));
        }
    }
    /**
     * Returns true if the _saveFile has successfully
     * completed
     *
     * @param array $values the array of values from the form
     *
     * @return bool true on success, false othewise
     */
    function _process($values)
    {
        if ($this->_saveFile($values)) {
            // MRI archive is now in the mri_upload table. If there are existing
            // records in table notification_spool for that upload (i.e a re-upload
            // of a scan that the MRI pipeline failed to process), inactivate them
            $db = \Database::singleton();
            $db->update(
                'notification_spool',
                array('Active' => 'N'),
                array('ProcessID' => $this->mri_upload_id)
            );

            // Save file succeeded. All that's left to do is launch the MRI
            // pipeline if the auto-launch switch is on
            $config = \NDB_Config::singleton();
            $ImagingUploaderAutoLaunch = $config->getSetting(
                'ImagingUploaderAutoLaunch'
            );
            if ($ImagingUploaderAutoLaunch == '1'
                || $ImagingUploaderAutoLaunch == 'true'
            ) {
                try {
                    // Instantiate the server process module to autoload
                    // its namespace classes
                    $spm_module = \Module::factory('server_processes_manager');
                    // Perform the real upload on the server
                    $serverProcessLauncher = new SP\ServerProcessLauncher();
                    $serverProcessLauncher->mriUpload(
                        $this->mri_upload_id,
                        $this->uploaded_file_path
                    );
                    $db->update(
                        'mri_upload',
                        array('Inserting' => 1),
                        array('UploadID' => $this->mri_upload_id)
                    );
                } catch (\Exception $e) {
                    $notificationTypeID = $db->pselectOne(
                        "SELECT NotificationTypeID
                         FROM notification_types
                         WHERE Type = :type",
                        array('type' => 'mri upload handler emergency')
                    );
                    $values = array(
                        'NotificationTypeID' => $notificationTypeID,
                        'Message'            => 'MRI pipeline could not be '
                                              . 'started: ' . $e->getMessage() . "\n"
                                              . 'This indicates an incorrect or non-'
                                              . "existent MRI pipeline setup\n",
                        'Origin'             => 'Launch of the MRI pipeline',
                        'ProcessID'          => $this->mri_upload_id,
                        'Error'              => 'Y',
                        'Verbose'            => 'N',
                    );
                    $db->insert('notification_spool', $values);
                    $db->update(
                        'mri_upload',
                        array('Inserting' => 0),
                        array('UploadID' => $this->mri_upload_id)
                    );
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    // methods available to all children
    /**
     * Save the file to the DataBase by:
     * 1) registering the file handlers
     * 2) Calling the processFiles function which in return will call
     *   - isValid function
     *   - importFile Function
     *
     * @param array $values the array of values from the form
     *
     * @return true on success, false otherwise
     */
    function _saveFile($values)
    {
        //get the stored-file path
        $file   = new \File_Upload;
        $config = \NDB_Config::singleton();
        $paths  = $config->getSetting('paths');
        $file->setOverwriteMode("overwrite");
        $file->fileMove = false;
        //pass the existing form ($form) by reference to File_Upload,
        // and register the file_upload field names being used.
        $file->registerForm($this->form);
        //Set the target directory that you want files moved
        //into once they are validated and processed.
        $MRIUploadIncomingPath = $config->getSetting('MRIUploadIncomingPath');
        if (($MRIUploadIncomingPath) && (is_dir($MRIUploadIncomingPath))
            && (is_writable($MRIUploadIncomingPath))
        ) {
             $file->fileMove = true;
             $file->setBaseUploadDirectory($MRIUploadIncomingPath);
        }
        //Tell File_Upload what file handlers to use.
        $file->setFileHandler(
            "mriFile",
            $this
        );
        $user = \User::singleton();
        //set the the IDs to the handler functions.
        $file->setHandlerArgs(array("values" => $values));
        //proccesses them (including verify, move, and import steps)
        $file->processFiles();
        return true;
    }
    /**
     * If file is not Phantom, validates advanced options by ensuring that:
     *  - The CandID exists in the database
     *  - The PSCID is valid for the CandID
     *  - The Visit Label is valid for the CandID
     *  - The candidate that was input is active in the database
     *  - The session that was input is active in the database
     *  - Once CandID, PSCID, and Visit Label are validated, checks if file has
     *       proper naming convention: PSCID_CandID_VisitLabel
     * In all cases, validates the file to be uploaded by ensuring that:
     *  - The uploaded file is compressed and is of type:
     *       .gz, .zip or .tgz
     *  - The uploaded file is copied to a newly created temporary folder
     *
     * @param Object $file The uploaded file
     * @param Array  $args The list of arguments
     *
     * @return true on success, throws error otherwise
     */
    function isValid($file, $args)
    {
        //make sure the file-name is  valid
        $temp_file = $file->fileInfo['tmp_name'];
        $temp_dir  = $this->tempdir();
        $db        = \Database::singleton();
        // creates associative array to store error messages for each form element
        $errors = array(
            'IsPhantom'  => array(),
            'candID'     => array(),
            'pSCID'      => array(),
            'visitLabel' => array(),
            'mriFile'    => array(),
        );
        // creates empty string variable to store error message for wrong file name
        $file_name_error = "";
        $config          = \NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting(
            'imaging_modules'
        );
        $corect_name            = $dicom_archive_settings['patientNameRegex'];
        $header_patient_name    = array();
        $file_name = $file->fileInfo['name'];
        $file_path = $temp_dir. "/". $file_name;
        $isPhantom = $args['values']['IsPhantom'];
        ///////////////////////////////////////////////////////////////////////
        /////////Validate the advanced Options only if it's not a Phantom//////
        ///////////////////////////////////////////////////////////////////////
        if ($args['values']['IsPhantom']=='N') {
            $candid      = trim($args['values']['candID']);
            $pscid       = trim($args['values']['pSCID']);
            $visit_label = trim($args['values']['visitLabel']);
            ////////////////////////////////////////////////////////////////
            //////     checks if candid exists                        //////
            //////     checks if pscid is valid for candid            //////
            //////     checks if visit_label is valid for candid      //////
            //////     checks if candidate is active                  //////
            //////     checks if session is active                    //////
            //////     stores error messages in associative array     //////
            ////////////////////////////////////////////////////////////////
            if ((!empty($candid)) && (!empty($pscid)) && (!empty($visit_label))) {
                $candidate = $db->pselectRow(
                    "SELECT c.candid AS candid,
                     c2.candid AS candid_with_pscid,
                     s.visit_label,
                     c2.active AS candidate_active,
                     s.active AS session_active
                     FROM candidate c
                     LEFT JOIN candidate c2
                     ON (c.candid=c2.candid AND c2.pscid = :pid)
                     LEFT JOIN session s
                     ON (s.candid=c.candid and s.visit_label = :vlabel)
                     WHERE c.candid = :cid",
                    [
                        ':cid'    => $candid,
                        ':pid'    => $pscid,
                        ':vlabel' => $visit_label,
                    ]
                );
                if (is_null($candidate) || $candidate["candid"] !== $candid) {
                    array_push(
                        $errors["candID"],
                        "The CandID " . $candid .
                        " does not exist in the database."
                    );
                } else {
                    if (!$candidate['candid_with_pscid']) {
                        array_push(
                            $errors["pSCID"],
                            "Invalid PSCID " . $pscid .
                             " for CandID " . $candid .
                             ". Check that you entered the correct" .
                             " PSCID and CandID."
                        );
                    }
                    if (!$candidate['visit_label']) {
                            array_push(
                                $errors["visitLabel"],
                                "Invalid Visit Label " . $visit_label .
                                " for CandID " . $candid .
                                ". Check that you entered the correct" .
                                " Visit Label and CandID."
                            );
                    }
                    if ($candidate['candidate_active'] == 'N') {
                        array_push(
                            $errors["pSCID"],
                            "The candidate associated with CandID " .
                            $candid . " and PSCID " .
                            $pscid . " is not active in the database."
                        );
                    }
                    if ($candidate['session_active'] == 'N') {
                        array_push(
                            $errors["visitLabel"],
                            "The session associated with CandID " .
                            $candid . " and Visit Label " .
                            $visit_label . " is not active in".
                            " the database."
                        );
                    }
                }
            }
            ///////////////////////////////////////////////////////////////////////
            ///////////    Make sure the file name matches the format   ///////////
            ///////////         $pscid_$candid_$visit_label             ///////////
            ///////////              OR starts with                     ///////////
            ///////////         $pscid_$candid_$visit_label_            ///////////
            ///////////    Stores error message in string variable      ///////////
            ///////////////////////////////////////////////////////////////////////
            $pcv  = $pscid . "_" . $candid . "_" . $visit_label;
            $pcvu = $pcv . "_";
            if ((!preg_match("/^{$pcv}\.(zip|tgz|tar.gz)/", $file_name))
                && (!preg_match("/^{$pcvu}.*(\.(zip|tgz|tar.gz))/", $file_name))
            ) {
                     $file_name_error
                         = "File name and fields entered in CandID, PSCID," .
                     " Visit Label must match. Verify that the information" .
                     " entered in all the fields above is correct or rename" .
                     " the file so that the file name matches " . $pcv .
                     " or begins with " . "\"". $pcvu . "\"" .
                     ", and has the extension .tgz, tar.gz or .zip";
            }
        }
        ///////////////////////////////////////////////////////////////////////
        ////////////// Checks to see if the file is of type////////////////////
        //////////////.gz, .zip or .tgz////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (!$this->isCompressed($temp_file)) {
            array_push(
                $errors["mriFile"],
                "The file $file_name is not of type".
                " .tgz, .tar.gz or .zip."
            );
        }
        ///////////////////////////////////////////////////////////////////////
        //////// Make sure there's no existing identical entry ////////////////
        //////// for "new" scans //////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $updateFile = isset($args['values']['overwrite'])
            ? (boolean) $args['values']['overwrite'] : false;
        $id         = $db->pselectOne(
            "SELECT 
                IF (InsertionComplete=0 AND 
                (ISNULL(Inserting) OR Inserting=0), UploadID, NULL) as UploadID 
                FROM mri_upload WHERE UploadLocation LIKE :ul",
            array('ul' => "%$file_name")
        );

        $uploadPath = $config->getSetting('MRIUploadIncomingPath') . $file_name;

        if (!$updateFile && !empty($id) && file_exists($uploadPath)) {
            array_push(
                $errors['mriFile'],
                "This file has already been uploaded."
            );
        }
        // Loops through associative array of error messages
        // If there are error messages, array is passed to front end
        // If there are no error messages but the file name is wrong,
        // file name error is added to array and array is passed to front end
        // This way, file name error is thrown after other fields are validated
        $associative_array_errors = false;
        foreach ($errors as $error) {
            if (count($error) != 0) {
                $associative_array_errors = true;
            }
        }
        if ($associative_array_errors) {
            http_response_code(400);
            header('Content-Type: application/json; charset=UTF-8');
            exit(json_encode(['errors' => $errors]));
        } else if (strlen($file_name_error) != 0) {
            array_push($errors["mriFile"], $file_name_error);
            http_response_code(400);
            header('Content-Type: application/json; charset=UTF-8');
            exit(json_encode(['errors' => $errors]));
        }
        ///////////////////////////////////////////////////////////////////////
        /////////copy the temporary file to a temporary directory//////////////
        //////////with a correct extension/////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $temp_dir      = $this->tempdir();
        $new_temp_file = $temp_dir. "/". $file->fileInfo['name'];
        if (!copy($temp_file, $new_temp_file)) {
            $msg = "An internal server error prevented this file from being "
                 . "uploaded. Please contact the system administrator: "
                 . "failed to copy $temp_file to $new_temp_file";
            array_push($errors["mriFile"], $msg);
            http_response_code(400);
            header('Content-Type: application/json; charset=UTF-8');
            exit(json_encode(['errors' => $errors]));
        }

        $this->setTempPath($new_temp_file);
        return true;
    }
    /**
     * Inserts into the mri_upload table the following information:
     *   - UploadedBy, UploadDate, UploadLocation, SessionID and
     *     PatientName
     *
     * @param Object $file The uploaded file
     * @param Array  $args The list of arguments
     *
     * @return boolean
     */
    function importFile($file, $args)
    {
        $feedbacks  = array();
        $db         = \Database::singleton();
        $pname      = '';
        $IsPhantom  = $args['values']['IsPhantom'];
        $updateFile = isset($args['values']['overwrite'])
            ? (boolean) $args['values']['overwrite'] : false;
        ///////////////////////////////////////////////////////////////////////
        ///////////////If empty get it using User class////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $user_name = $args['user_id'] ?? null;
        if (($user_name==null) || (!(isset($user_name)))) {
            $user      = \User::singleton();
            $user_name = $user->getUsername();
        }
        ///////////////////////////////////////////////////////////////////////
        ////////////////////Insert values into mri_upload//////////////////////
        ///////////////////////////////////////////////////////////////////////
        $date = date('Y-m-d H:i:s');
        ///////////////////////////////////////////////////////////////////////
        /////Get the pscid, candid and visit_label/////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if ($args['values']['IsPhantom']=='N') {
            if ((!empty($args['values']['candID']))
                && (!empty($args['values']['pSCID']))
                &&(!empty($args['values']['visitLabel']))
            ) {
                ///////////////////////////////////////////////////////////////////
                ////////////////////Use the arguments//////////////////////////////
                ///////////////////////////////////////////////////////////////////
                $visit_label = $args['values']['visitLabel'];
                $candid      = $args['values']['candID'];
                $pscid       = $args['values']['pSCID'];
                $pname       = $pscid. "_" . $candid . "_" . $visit_label;
                $sessionid   = $db->pselectOne(
                    "SELECT ID FROM  session WHERE CandID = :cid
                     AND Visit_label =:vlabel",
                    array(
                        'cid'    => $candid,
                        'vlabel' => $visit_label,
                    )
                );
            }
        }
        //////////////////////////////////////////////////////////////////
        ///Get the directory to which the temp file has been moved to/////
        /// MRI_upload Incoming directory/////////////////////////////////
        //////////////////////////////////////////////////////////////////
        $this->uploaded_file_path = trim(
            $file->getDestinationDirectory() .
            $file->getDestinationFilename()
        );
        ///////////////////////////////////////////////////////////////
        ///if the DestinationDirectory/getDestinationFilename//////////
        //is not empty, then remove the uploaded directory in the /tmp/
        ////Otherwise keep uploaded directory in the /tmp and insert///
        ////into the mri_upload table//////////////////////////////////
        ///////////////////////////////////////////////////////////////
        if ($this->uploaded_file_path) {
            $this->removeTempDir();
        } else {
                $this->uploaded_file_path = $this->getTempPath();
        }
        $values = array(
            'UploadedBy'               => $user_name,
            'UploadDate'               => $date,
            'UploadLocation'           => $this->uploaded_file_path,
            'SessionID'                => $sessionid,
            'PatientName'              => $pname,
            'IsPhantom'                => $IsPhantom,
            'TarchiveID'               => null,
            'Inserting'                => null,
            'InsertionComplete'        => 0,
            'IsCandidateInfoValidated' => null,
            'IsTarchiveValidated'      => 0,
            'number_of_mincInserted'   => null,
            'number_of_mincCreated'    => null,
        );
        if ($updateFile) {
            // Only overwrite file if it failed MRI pipeline. Need to use
            // wildcard for files that were uploaded to a random temp path.
            $fileName = $file->fileInfo['name'];
            $id       = $db->pselectOne(
                "SELECT 
                IF (InsertionComplete=0 AND 
                (ISNULL(Inserting) OR Inserting=0), UploadID, NULL) as UploadID 
                FROM mri_upload WHERE UploadLocation LIKE :ul",
                array('ul' => "%$fileName")
            );
            if (!empty($id)) {
                $db->update('mri_upload', $values, array('UploadID' => $id));
                $this->mri_upload_id = $id;
                return true;
            }
        }
        $db->insert('mri_upload', $values);
        $this->mri_upload_id = $db->getLastInsertId();
        return true;
    }
    /**
     * Creates a temporary directory
     *
     * @return String
     */
    function tempdir()
    {
        $tempfile =tempnam(
            sys_get_temp_dir(),
            ''
        );
        if (file_exists($tempfile)) {
            unlink($tempfile);
        }
        mkdir($tempfile);
        if (is_dir($tempfile)) {
            return $tempfile;
        }
    }
    /**
     * The SetTempDir sets the tempdir
     *
     * @param string $tempFilePath The path to the temp file
     *
     * @return NULL
     */
    function setTempPath($tempFilePath)
    {
        $this->temp_path = $tempFilePath;
    }
    /**
     * The getTempPath gets the temp_path
     *
     * @return String returns temp_path
     */
    function getTempPath()
    {
        return $this->temp_path;
    }
    /**
<<<<<<< HEAD
    * The getTargetDirectory retrieves info about where the file should be stored.
    *
    * The returned directory is added to the baseUploadDirectory property.
    * It should have a trailing slash.
    *
    * @param string $file The full filename including directory.
    * @param Array  $args The list of arguments
    *
    * @return string  $success if operation succeeded
    */
=======
     * The getTargetDirectory retrieves info about where the file should be stored.
     *
     * The returned directory is added to the baseUploadDirectory property.
     * It should have a trailing slash.
     *
     * @param string $file The full filename including directory.
     * @param Array  $args The list of arguments
     *
     * @return bool  $success if operation succeeded
     */
>>>>>>> 2f4e0817e... Change array rule and fix violations
    function getTargetDirectory($file, $args)
    {
        return sprintf(
            "%s/",
            $args['user_id'] ?? \User::singleton()->getUsername()
        );
    }
    /**
<<<<<<< HEAD
    * The function isCompressed returns true if the file is
    * compressed (gzip or zip) or false otherwise
    *
    * @param string $file The full filename including directory
    *
    * @return bool Whether the file is compressed
    */
=======
     * The function isCompressed returns true if the file is
     * compressed (gzip or zip) or false otherwise
     *
     * @param string $file The full filename including directory.
     *
     * @return bool  $success if operation succeeded
     */
>>>>>>> 2f4e0817e... Change array rule and fix violations
    function isCompressed($file)
    {
        return strpos(mime_content_type($file), 'zip') !== false;
    }
    /**
     * The function removes the uploaded file from the /tmp directory
     * only if the file is moved from the /tmp directory to the
     * MRI-Upload Directory
     *
     * @return bool  $success if operation succeeded
     */
    function removeTempDir()
    {
        $tempFolderPath = dirname($this->getTempPath());
        $success        = false;
        if (($tempFolderPath) && (is_dir($tempFolderPath))) {
            $success = $this->removeDir($tempFolderPath);
        }
        return $success;
    }
    /**
     * The function removes the directory and all its contents
     *
     * @param string $folder The full folder path
     *
     * @return bool  $success if operation succeeded
     */
    function removeDir($folder)
    {
        $d = dir($folder);
        while ($entry = $d->read()) {
            if ($entry!= "." && $entry!= "..") {
                unlink($folder . "/" . $entry);
            }
        }
        return rmdir($folder);
    }
    /**
     * The function returns an array of filenames that exist in the mri
     * upload directory.
     *
     * @param array $data data retrieved from mri_upload table
     *
     * @return array list of filenames
     */
    function _getFileList($data)
    {
        $files = array();
        foreach ($data as $row) {
            $uploadStatus = $row[1];
            $filePath     = $row[5];
            $mincInserted = $row[10];
            $fileName     = basename($filePath);
            // Checks if a file is already in files array
            $isDuplicate = (
                array_search(
                    $fileName,
                    array_column($files, 'fileName')
                ) > -1
            );
            // If file successfully completed pipeline, then filePath is no longer
            // valid as the file would have been deleted.
            // Check that mincInserted > 0 in mri_upload to handle Successful uploads
            if ((file_exists($filePath) || $mincInserted)
                && !$isDuplicate
            ) {
                array_push(
                    $files,
                    [
                        "fileName" => $fileName,
                        "status"   => $uploadStatus,
                    ]
                );
            }
        }
        return $files;
    }
    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/imaging_uploader/js/index.js",
                $baseURL . "/imaging_uploader/js/imaging_uploader_helper.js",
            )
        );
    }
    /**
     * Include additional CSS files:
     *  imaging_uploader.css
     *
     * @return array of css to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/imaging_uploader/css/imaging_uploader.css"]
        );
    }
    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result            = $this->toArray();
        $result['form']    = $this->form->form;
        $result['mriList'] = $this->_getFileList($result['Data']);
        $config            = \NDB_Config::singleton();
        $result['imagingUploaderAutoLaunch'] = $config->getSetting(
            'ImagingUploaderAutoLaunch'
        );
        $result['maxUploadSize'] = \Utility::getMaxUploadSize();
        return json_encode($result);
    }
}


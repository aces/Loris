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

require_once 'NDB_Menu_Filter_Form.class.inc';
require_once 'Log.class.inc';
require_once "Archive/Tar.php";
require_once "File_Decompress.class.inc";
require_once "Message.class.inc";
require_once __DIR__
             . "/../../server_processes_manager/php/ServerProcessLauncher.class.inc";

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
class NDB_Menu_Filter_Mri_Upload extends NDB_Menu_Filter_Form
{

    var $show_queries = true;
    var $temp_path    = null;
    /**
     * The _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        return $user->hasPermission('mri_upload');
    }

    /**
     * Sets up the Filter Variables
     *
     * @return boolean
     */
    function _setupVariables()
    {

        // set the class variables
        $this->columns = array(
                          'UploadID',
                          's.CandID',
                          'c.PSCID',
                          's.visit_label',
                          'UploadLocation',
                          'UploadDate',
                          'UploadedBy',
                          'TarchiveID AS Tarchive_Info',
                          'number_of_mincCreated',
                          'number_of_mincInserted',
                         );

        $this->validFilters = array(
                               's.CandID',
                               'c.PSCID',
                               's.visit_label',
                               'mu.IsPhantom',
                              );
        $this->query        = " FROM mri_upload mu LEFT JOIN session".
                              " s ON (s.ID = mu.SessionID)".
                              " LEFT JOIN candidate c ON (c.CandID = s.CandID)".
                              " WHERE 1=1 ";
        $this->formToFilter = array(
                               'CandID'      => 's.CandID',
                               'PSCID'       => 'c.PSCID',
                               'visit_label' => 's.visit_label',
                               'IsPhantom'   => 'mu.IsPhantom',
                              );
        return true;
    }

    /**
     * Creates the following fields:
     *   - MRI-upload browse-button and static fields
     *   - Three text elements: CandID, PSCID and VisitLabel
     * It wil also throw an error message if the file cannot be uploaded
     *
     * @return boolean
     */
    function _setFilterForm()
    {

        ///////////////////////////////////////////////////////////////////////
        ////////////////////////Upload related fields//////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $this->addFile('mri_file', 'File to Upload');
        $this->addScoreColumn('File_name', 'File name');
        $this->addScoreColumn('status', 'Status');

        ///////////////////////////////////////////////////////////////////////
        //////////////////CandID, PSCID and VisitLabel fields//////////////////
        ///////////////////////////////////////////////////////////////////////
        $this->addBasicText('CandID', 'CandID:');
        $this->addBasicText('PSCID', 'PSCID:');
        $visitlabels = array_merge(
            array(null => ''),
            Utility::getExistingVisitLabels()
        );
        $this->addSelect(
            'VisitLabel',
            'VisitLabel:',
            $visitlabels
        );
        $phantom_options = array(
                            null => '',
                            'N'  => 'No',
                            'Y'  => 'Yes',
                           );
        $this->addSelect(
            'IsPhantom',
            'Are these Phantom Scans:',
            $phantom_options
        );
        ///////////////////////////////////////////////////////////////////////
        //////////////////Upload-related Error messages ///////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (empty($_FILES) && empty($_POST)
            && ($_SERVER['REQUEST_METHOD']=='POST')
        ) { //catch file overload error...
            $upload_max_size = ini_get('upload_max_filesize');
            $error_message   = "Please make sure files are not larger than " .
                     $upload_max_size;
            $tpl_data['error_message'][] =  $error_message;
        }
        return true;
    }
     /**
      * Returns true if the _saveFile has successfully
      * completed
      *
      * @param array $values the array of values from the form
      *
      * @return true on success, false othewise
     */
    function _process($values)
    {
        if ($this->_saveFile($values)) {
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
       * @return true on success, false othewise
       */
    function _saveFile($values)
    {

        include_once "File_Upload.class.inc";

        //get the stored-file path

        $file   = new File_Upload;
        $config = NDB_Config::singleton();
        $paths  = $config->getSetting('paths');
        $file->overwriteMode = "reject";
        $file->fileMove      = false;

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
            "mri_file",
            $this
        );

        $user = User::singleton();
        //set the the IDs to the handler functions.
        $file->setHandlerArgs(array("values" => $values));

        //proccesses them (including verify, move, and import steps)
        $file->processFiles();

        //display error messages
        if (!empty($file->errorLog)) {
            while (list($fileType,$fileErrors)=each($file->errorLog)) {
                foreach ($fileErrors AS $error) {
                    throw new LorisException(" $fileType: $error ");
                }
            }
            return false;
        }
        return true;
    }
    /**
     * Validates the file to be uploaded by ensuring that:
     *  - The uploaded file is compressed and is of type:
     *       .gz, .zip or .tgz
     *  - The fields   CandID, PSCID  and VisitLabel are filled out
     *  - The inputted PSCID,  CandID and VisitLabel exist in the database
     *  - The uploaded file is copied to a newly created temporary folder
     *
     * @param FILE  $file The uploaded file
     * @param Array $args The list of arguments
     *
     * @return Array  Returns an array of errors or
     * boolean if it's true
     */
    function isValid($file, $args)
    {
        //make sure the file-name is  valid
        $temp_file = $file->fileInfo['tmp_name'];
        $db        = Database::singleton();
        $errors    = array();
        $config    = NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting(
            'dicom_archive'
        );
        $corect_name            = $dicom_archive_settings['patientNameRegex'];
        $header_patient_name    = array();
        $file_name = $file->fileInfo['name'];
        $file_path = $temp_dir. "/". $file_name;
        ///////////////////////////////////////////////////////////////////////
        /////////Validate the advanced Options only if it's not a Phantom//////
        ///////////////////////////////////////////////////////////////////////
        if ($args['values']['IsPhantom']=='N') {
            ///////////////////////////////////////////////////////////////////////
            ////////////// make sure the advanced options are filled out///////////
            ///////////////////////////////////////////////////////////////////////
            $candid      = trim($args['values']['CandID']);
            $pscid       = trim($args['values']['PSCID']);
            $visit_label = trim($args['values']['VisitLabel']);
            if ((empty($candid)) || (empty($pscid)) || (empty($visit_label))) {
                $errors[] ="Make sure the CandID, PSCID and Visit_label are ".
                "filled out ";
            }

            ///////////////////////////////////////////////////////////////////////
            //////check to see if candid/pscid and visit-label exist///////////////
            ///////////////////////////////////////////////////////////////////////
            if ((!empty($candid)) && (!empty($pscid)) && (!empty($visit_label))) {
                if ($db->pselectOne(
                    "SELECT COUNT(*) FROM session s
                     JOIN candidate c ON (c.candid=s.candid)
                     WHERE s.Visit_label = :vlabel
                     AND c.pscid = :pid AND c.candid = :cid",
                    array(
                     'cid'    => $candid,
                     'vlabel' => $visit_label,
                     'pid'    => $pscid,
                    )
                )==0) {
                        $errors[] = "Make sure you enter the CandID: $candid ,".
                                    " PSCID: $pscid and the corresponding".
                                    " Visit-label: $visit_label which".
                                    " already exist";
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////
        ////////////// Checks to see if the file is of type////////////////////
        //////////////.gz, .zip or .tgz////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (!$this->isCompressed($temp_file)) {
            $errors[] = "The file $temp_file is not of type".
                        " .tgz, .tar.gz or .zip";
        }

        if (count($errors) > 0) {
            return $errors;
        }
        ///////////////////////////////////////////////////////////////////////
        /////////copy the temporary file to a temporary directory//////////////
        //////////with a correct extension/////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $temp_dir      = $this->tempdir();
        $new_temp_file = $temp_dir. "/". $file->fileInfo['name'];

        if (!copy($temp_file, $new_temp_file)) {
            throw new LorisException(
                "failed to copy $temp_file to $new_temp_file \n"
            );
        }
        $this->setTempPath($new_temp_file);
        return true;
    }

    /**
     * Inserts into the mri_upload table the following information:
     *   - UploadedBy, UploadDate, UploadLocation, SessionID and
     *     PatientName
     *
     * @param FILE  $file The uploaded file
     * @param Array $args The list of arguments
     *
     * @return boolean
     */
    function importFile($file, $args)
    {
        $feedbacks = array();
        $db        = Database::singleton();
        $file_name =  $file->fileInfo['name'];
        $config    = NDB_Config::singleton();
        $ImagingUploaderAutoLaunch = $config->getSetting(
            'ImagingUploaderAutoLaunch'
        );

        $pname     = '';
        $IsPhantom = $args['values']['IsPhantom'];
        ///////////////////////////////////////////////////////////////////////
        ///////////////If empty get it using User class////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $user_name = $args['user_id'];
        if (($user_name==null) || (!(isset($user_name)))) {
            $user      = User::singleton();
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
            if ((!empty($args['values']['CandID']))
                && (!empty($args['values']['PSCID']))
                &&(!empty($args['values']['VisitLabel']))
            ) {
                ///////////////////////////////////////////////////////////////////
                ////////////////////Use the arguments//////////////////////////////
                ///////////////////////////////////////////////////////////////////
                $visit_label = $args['values']['VisitLabel'];
                $candid      = $args['values']['CandID'];
                $pscid       = $args['values']['PSCID'];
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
        $uploaded_file_path = trim(
            $file->getDestinationDirectory() .
            $file->getDestinationFilename()
        );
        ///////////////////////////////////////////////////////////////
        ///if the DestinationDirectory/getDestinationFilename//////////
        //is not empty, then remove the uploaded directory in the /tmp/
        ////Otherwise keep uploaded directory in the /tmp and insert///
        ////into the mri_upload table//////////////////////////////////
        ///////////////////////////////////////////////////////////////
        if ($uploaded_file_path) {
            $this->removeTempDir();
        } else {
                $uploaded_file_path = $this->getTempPath();
        }
        $values = array(
                   'UploadedBy'     => $user_name,
                   'UploadDate'     => $date,
                   'UploadLocation' => $uploaded_file_path,
                   'SessionID'      => $sessionid,
                   'PatientName'    => $pname,
                   'IsPhantom'      => $IsPhantom,
                  );
        $db->Insert(
            'mri_upload',
            $values
        );
        if ($ImagingUploaderAutoLaunch) {
            // Get MRI upload ID of the upload entry that was just inserted
            $query       = "SELECT UploadID
                       FROM mri_upload
                       WHERE UploadedBy     = :UploadedBy
                       AND   UploadDate     = :UploadDate
                       AND   UploadLocation = :UploadLocation
                       AND   SessionID      = :SessionID
                       AND   PatientName    = :PatientName
                       AND   IsPhantom      = :IsPhantom";
            $mriUploadId = $db->pselectOne($query, $values);
            // Perform the real upload on the server
            $serverProcessLauncher = new ServerProcessLauncher();
            $serverProcessLauncher->mriUpload($mriUploadId, $uploaded_file_path);
        }
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
    function getTargetDirectory($file, $args)
    {
        $output ="{$args["user_id"]}/";
        return $output;
    }


    /**
    * The function isCompressed returns true if the file is
    * compressed (gzip or zip) or false otherwise
    *
    * @param string $file The full filename including directory.
    *
    * @return bool  $success if operation succeeded
    */
    function isCompressed($file)
    {

        $file_info =  mime_content_type($file);
        if (preg_match('/zip/', $file_info, $matches)) {
            return true;
        }
        return false;
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
}
?>

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
class NDB_Menu_Filter_Imaging_Uploader extends NDB_Menu_Filter_Form
{

    var $show_queries = true;
    var $temp_path    = null;
    var $AjaxModule   = true;

    /**
     * ID of the uploaded file in mri_upload table (if upload successful).
     */
    var $mri_upload_id;

    /**
     * Path to the uploaded file (value of SourceLocation in mri_upload table).
     */
    var $uploaded_file_path;

    /**
     * Override default behaviour, since the page is loaded from index.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }


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
        return $user->hasPermission('imaging_uploader');
    }

    /**
     * Sets up the Filter Variables
     *
     * @return boolean
     */
    function _setupVariables()
    {

        $progressSelectPart = "IF(ISNULL(Inserting), 'Not Started',"
            . "IF(Inserting=1, 'In Progress...', "
            . "IF(InsertionComplete=0, 'Failure', 'Success'))) as Progress";

        // set the class variables
        $this->columns = array(
                          'UploadID',
                          $progressSelectPart,
                          's.CandID',
                          'c.PSCID',
                          's.Visit_label',
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
                               's.Visit_label',
                               'mu.IsPhantom',
                              );
        $this->query        = " FROM mri_upload mu LEFT JOIN session".
                              " s ON (s.ID = mu.SessionID)".
                              " LEFT JOIN candidate c ON (c.CandID = s.CandID)".
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
     * Creates the following fields:
     *   - MRI-upload browse-button and static fields
     *   - Three text elements: CandID, PSCID and VisitLabel
     * It wil also throw an error message if the file cannot be uploaded
     *
     * @return boolean
     */
    function _setFilterForm()
    {
        $phantomOtions = [
                          'N' => 'No',
                          'Y' => 'Yes',
                         ];
        $visitlabels   = Utility::getExistingVisitLabels();

        // Fields used for selection filter and upload form
        $this->addSelect('IsPhantom', 'Phantom Scans', $phantomOtions);
        $this->addBasicText('candID', 'CandID');
        $this->addBasicText('pSCID', 'PSCID');
        $this->addSelect('visitLabel', 'Visit Label', $visitlabels);
        $this->addFile('mri_file', 'File to Upload');

        ///////////////////////////////////////////////////////////////////////
        //////////////////Upload-related Error messages ///////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (empty($_FILES) && empty($_POST)
            && ($_SERVER['REQUEST_METHOD']=='POST')
        ) { //catch file overload error...
            $upload_max_size = ini_get('upload_max_filesize');
            $error_message   = "Please make sure files are not larger than " .
                 $upload_max_size . "<br>Please refresh this page to return ".
                "to the Imaging Uploader module";
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
            // Save file succeeded. All that's left to do is launch the MRI
            // pipeline if the auto-launch switch is on
            $config = NDB_Config::singleton();
            $ImagingUploaderAutoLaunch = $config->getSetting(
                'ImagingUploaderAutoLaunch'
            );

            if ($ImagingUploaderAutoLaunch) {
                // Perform the real upload on the server
                $serverProcessLauncher = new ServerProcessLauncher();
                $serverProcessLauncher->mriUpload(
                    $this->mri_upload_id,
                    $this->uploaded_file_path
                );
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
       * @return true on success, false othewise
       */
    function _saveFile($values)
    {

        include_once "File_Upload.class.inc";

        //get the stored-file path

        $file   = new File_Upload;
        $config = NDB_Config::singleton();
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
        $temp_dir  = $this->tempdir();
        $db        = Database::singleton();
        $errors    = array();
        $config    = NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting(
            'imaging_modules'
        );
        $corect_name            = $dicom_archive_settings['patientNameRegex'];
        $header_patient_name    = array();
        $file_name = $file->fileInfo['name'];
        $file_path = $temp_dir. "/". $file_name;
        $isPhantom = $args['values']['IsPhantom'];
        if (empty($isPhantom)) {
            $errors[] ="Make sure 'Are these Phantom Scans' is filled out.
            <br>Please refresh this page to return to the Imaging Uploader module";
        }
        ///////////////////////////////////////////////////////////////////////
        /////////Validate the advanced Options only if it's not a Phantom//////
        ///////////////////////////////////////////////////////////////////////
        if ($args['values']['IsPhantom']=='N') {
            ///////////////////////////////////////////////////////////////////////
            ////////////// make sure the advanced options are filled out///////////
            ///////////////////////////////////////////////////////////////////////
            $candid      = trim($args['values']['candID']);
            $pscid       = trim($args['values']['pSCID']);
            $visit_label = trim($args['values']['visitLabel']);
            if ((empty($candid)) || (empty($pscid)) || (empty($visit_label))) {
                $errors[] ="Make sure the Cand ID, PSCID and Visit Label are ".
                "filled out. <br>Please refresh this page to return to the Imaging
                Uploader module.";
            }

            ///////////////////////////////////////////////////////////////////////
            ///////////    Make sure the file name matches the format   ///////////
            ///////////         $pscid_$candid_$visit_label             ///////////
            ///////////              OR starts with                     ///////////
            ///////////         $pscid_$candid_$visit_label_            ///////////
            ///////////////////////////////////////////////////////////////////////
            $pcv  = $pscid . "_" . $candid . "_" . $visit_label;
            $pcvu = $pcv . "_";
            if ((!preg_match("/{$pcv}\.(zip|tgz|tar.gz)/", $file_name))
                && (!preg_match("/^{$pcvu}.*(\.(zip|tgz|tar.gz))/", $file_name))
            ) {
                    $errors[] = "File name must match " . $pcv .
                    " or begin with " . "\"". $pcvu . "\"" .
                    ", and have the extension of .tgz, tar.gz or .zip";
            }

            ///////////////////////////////////////////////////////////////////////
            //////check to see if candid/pscid and visit-label exist///////////////
            ///////////////////////////////////////////////////////////////////////
            if ((!empty($candid)) && (!empty($pscid)) && (!empty($visit_label))) {
                $result = $db->pselectOne(
                    "SELECT COUNT(*) FROM session s
                     JOIN candidate c ON (c.candid=s.candid)
                     WHERE s.Visit_label = :vlabel
                     AND c.pscid = :pid AND c.candid = :cid",
                    [
                     ':cid'    => $candid,
                     ':vlabel' => $visit_label,
                     ':pid'    => $pscid,
                    ]
                );

                if ($result == 0) {
                    $errors[] = "Make sure you enter the CandID: $candid,".
                                " PSCID: $pscid and the corresponding".
                                " Visit-label: $visit_label. Candidate and".
                                " corresponding visit label must already be" .
                                " created in the database. <br>Please refresh this".
                                " page to return to the Imaging Uploader module";
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////
        ////////////// Checks to see if the file is of type////////////////////
        //////////////.gz, .zip or .tgz////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (!$this->isCompressed($temp_file)) {
            $errors[] = "The file $temp_file is not of type".
                        " .tgz, .tar.gz or .zip. <br>Please refresh this
                        page to return to the Imaging Uploader module";
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
                   'UploadedBy'     => $user_name,
                   'UploadDate'     => $date,
                   'UploadLocation' => $this->uploaded_file_path,
                   'SessionID'      => $sessionid,
                   'PatientName'    => $pname,
                   'IsPhantom'      => $IsPhantom,
                  );
        $db->Insert(
            'mri_upload',
            $values
        );
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

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
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
        $factory = NDB_Factory::singleton();
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
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;

        return json_encode($result);
    }
}
?>

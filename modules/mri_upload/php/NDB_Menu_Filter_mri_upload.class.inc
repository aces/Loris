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
                          'SourceLocation',
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
                              );
        $this->query        = " FROM mri_upload mu JOIN session".
                              " s ON (s.ID = mu.SessionID)".
                              " JOIN candidate c ON (c.CandID = s.CandID)".
                              " WHERE 1=1 ";
        $this->formToFilter = array(
                               'CandID'      => 's.CandID',
                               'PSCID'       => 'c.PSCID',
                               'visit_label' => 's.visit_label',
                              );
        return true;
    }

    /**
     * Creates the following fields:
        - MRI-upload browse-button and static fields
        - Three text elements: CandID, PSCID and VisitLabel
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
      * Completed
      *
      * @param array $values the array of values from the form
      *
      * @return true on success, false othewise
      * @access private
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
          - isValid function
          - improFile Function
       *
       * @param array $values the array of values from the form
       *
       * @return true on success, false othewise
       * @access private
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
                    throw new Exception(" $fileType: $error ");
                }
            }
            return false;
        }
        return true;
    }
    /**
     * Validate the file to be uploaded by ensuring that:
       - The uploaded file is compressed and is of type:
            .gz, .zip or .tgz
       - The fields CandID, PSCID and VisitLabel are filled out
       - The inputted PSCID, CandID and VisitLabel exist in the database
       - The uploaded file is copied to a newly created temporary folder
     *
     * @param FILE  $file The uploaded file
     * @param Array $args The list of arguments
     *
     * @return Array  Returns an array of errors or
     * Boolean if it's true
     */
    function isValid($file, $args)
    {
        //make sure the file-name is  valid
        $temp_file     = $file->fileInfo['tmp_name'];
        $temp_dir      = $this->tempdir();
        $new_temp_file = $temp_dir. "/". $file->fileInfo['name'];
        $this->setTempPath($new_temp_file);
        $db     = Database::singleton();
        $errors = array();
        $config = NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting(
            'dicom_archive'
        );
        $corect_name            = $dicom_archive_settings['patientNameRegex'];
        $header_patient_name    = array();
        $file_name = $file->fileInfo['name'];
        $file_path = $temp_dir. "/".$file_name;
        ///////////////////////////////////////////////////////////////////////
        ////////////// make sure the Advanced Options are filled out///////////
        ///////////////////////////////////////////////////////////////////////
        $candid      = trim($args['values']['CandID']);
        $pscid       = trim($args['values']['PSCID']);
        $visit_label = trim($args['values']['VisitLabel']);

        if ((empty($candid)) || (empty($pscid)) || (empty($visit_label))) {
            $errors[] ="Make sure the CandID, PSCID and Visit_label are
            filled out ";
        }

        $patient_name = $pscid . "_" . $candid . "_" . $visit_label;
        //////////////////////////////////////////////////////////////////////
        //////check to se if candid exists////////////////////////////////////
        //////////////////////////////////////////////////////////////////////
        if (!empty($candid)) {
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate".
                " WHERE candid = :cid",
                array('cid' => $candid)
            )==0) {
                    $errors[] = "The CandID: $candid Doesn't exist";
            }
        }
        //////////////////////////////////////////////////////////////////
        //////check to se if pscid exists//////////////////////////////////
        ///////////////////////////////////////////////////////////////////
        if (!empty($pscid)) {
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate WHERE PSCID = :pid",
                array('pid' => $pscid)
            )==0) {
                $errors[] = "The PSCID: $pscid Doesn't exist";
            }
        }
        ///////////////////////////////////////////////////////////////////
        //////check to se if visit_label exists////////////////////////////
        ///////////////////////////////////////////////////////////////////
        if (!empty($visit_label)) {
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM session WHERE Visit_label = :vlabel",
                array('vlabel' => $visit_label)
            )==0) {
                $errors[] = "The VisitLabel: $visit_label Doesn't exist";
            }
        }

        ///////////////////////////////////////////////////////////////////
        /////////copy the temporairy file to a temporairy directory////////
        //////////with a correct Extension/////////////////////////////////
        ///////////////////////////////////////////////////////////////////
        if (!copy($temp_file, $new_temp_file)) {
            $errors[] = "failed to copy $temp_file to $new_temp_file \n";
        }
        $this->setTempPath($new_temp_file);

        ///////////////////////////////////////////////////////////////////////
        ////////////// Checks to see if the file is of type////////////////////
        //////////////.gz, .zip or .tgz////////////////////////////////////////
        ////////////////TODO///////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (!$this->isCompressed($new_temp_file)) {
            $errors[] = "The file $file_name is not of type".
                        " .tgz, .tar.gz or .zip";
        }

        if (count($errors) > 0) {
            return $errors;
        }
        return true;
    }

    /**
     * Inserts into the mri_upload table the following information:
        - UploadedBy, UploadDate, SourceLocation, SessionID and
          PatientName
     *
     * @param FILE  $file The uploaded file
     * @param Array $args The list of arguments
     *
     * @return boolean
     */
    function importFile($file, $args)
    {
        $userid    = $args['user_id'];
        $feedbacks = array();
        $db        = Database::singleton();
        $file_name =  $file->fileInfo['name'];

        ///////////////////////////////////////////////////////////////////////
        ///////////////if empty get it using User class////////////////////////
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
                    "SELECT ID FROM  session WHERE CandID = :cid".
                    " AND Visit_label =:vlabel ",
                    array(
                     'cid'    => $candid,
                     'vlabel' => $visit_label,
                    )
                );

                $uploaded_file_path = $file->getDestinationDirectory() .
                                      $file->getDestinationFilename();

                if ($uploaded_file_path) {
                    $this->removeTempDir();
                } else {
                    $uploaded_file_path = $this->getTempPath();
                }
                $values = array(
                           'UploadedBy'     => $user_name,
                           'UploadDate'     => $date,
                           'SourceLocation' => $uploaded_file_path,
                           'SessionID'      => $sessionid,
                           'PatientName'    => $pname,
                          );
                $db->Insert(
                    'mri_upload',
                    $values
                );
                return true;
        }
        return false;
    }
    /**
     * Creates a temporairy directory
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
    * The returned directory is ADDED to the baseUploadDirectory property.
    * It should have a trailing slash.
    *
    * @param string $file The full filename including directory.
    * @param Array  $args The list of arguments
    *
    * @return bool  $success if operation succeeded
    * @access public
    */
    function getTargetDirectory($file, $args)
    {
        $output ="{$args["user_id"]}/";
        return $output;
    }


    /**
    * The function isCompressed returns true if the file is
        compressed (gzip or zip) or false otherwise
    *
    * @param string $file The full filename including directory.
    *
    * @return bool  $success if operation succeeded
    * @access public
    */
    function isCompressed($file)
    {

        $file_info =  mime_content_type($file);
        if (preg_match('/gzip|zip/', $file_info, $matches)) {
            return true;
        }
        return false;
    }

    /**
    * The function removes the uploaded file from the /tmp directory
        only if the file is moved from the /tmp directory to the
        MRI-Upload Directory
    *
    * @return bool  $success if operation succeeded
    * @access public
    */
    function removeTempDir()
    {

        $tempFolderPath = dir($this->getTempPath());
        if (($tempFolderPath) && (is_dir($tempFolderPath))) {
            return rmdir($tempFolderPath);
        }
    }
}
?>

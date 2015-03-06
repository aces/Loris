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
 * after passing a series of validation. Once uploaded the dicomtar.pl and
 * batch_uploads_tarchive will be ran on the scan.
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
    var $temp_path    =null;
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
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        //return $user->hasPermission('mri_upload');
        return true;
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
        $this->query        = " FROM mri_upload mu JOIN session ".
        "s ON (s.ID = mu.SessionID)
        JOIN candidate c on (c.CandID = s.CandID)
         WHERE 1=1 ";
        $this->formToFilter = array(
                               'CandID'      => 's.CandID',
                               'PSCID'       => 'c.PSCID',
                               'visit_label' => 's.visit_label',
                              );
        return true;
    }

    /**
     * Sets up the Filter Form
     *
     * @return boolean
     */
    function _setFilterForm()
    {

        // create user object
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////Upload related fields//////////////////////////
        ///////////////////////////////////////////////////////////////////////

        $this->addFile('mri_file', 'File to Upload');
        $this->addScoreColumn('File_name', 'File name');
        $this->addScoreColumn('status', 'Status');

        ///////////////////////////////////////////////////////////////////////
        //////////////////Patient-name and Patient-ID fields///////////////////
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
        if (empty($_FILES) && empty($_POST)
            && ($_SERVER['REQUEST_METHOD']=='POST')
        ) { //catch file overload error...
            $upload_max_size = ini_get('upload_max_filesize');
            echo "<p style=\"color: #F00;\">\nPlease make sure files are
            not larger than {$upload_max_size} <br></p>";
            // echo out error and solutions...
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
       * Save the file to the DataBase
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

        $file   =new File_Upload;
        $config = NDB_Config::singleton();
        $paths  = $config->getSetting('paths');
        $stored_file_path    = $paths['IncomingPath'];
        $file->overwriteMode = "reject";
        $file->fileMove      = false;

        //pass the existing form ($form) by reference to File_Upload,
        // and register the file_upload field names being used.
        $file->registerForm($this->form);

        //Tell File_Upload what file handlers to use.
        $file->setFileHandler(
            "mri_file",
            $this
        );

        $user = User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError(
                "User Error: ".
                $user->getMessage()
            );
        }
        //set the the IDs to the handler functions.
        $file->setHandlerArgs(array("values" => $values));

        //proccesses them (including verify, move, and import steps)
        $file->processFiles();
        //echo error messages
        if (!empty($file->errorLog)) {
            while (list($fileType,$fileErrors)=each($file->errorLog)) {
                foreach ($fileErrors AS $error) {
                    echo "<span style='color:red'><b>Upload Error</b>
                    $fileType: $error</span><br>";
                }
            }
            return false;
        }
        return true;
    }
    /**
     * Validate the file to be uploaded
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

        ///////////////////////////////////////////////////////////////////////
        ////////////// Checks to see if the file is of type////////////////////
        //////////////.gz, .zip or .tgz////////////////////////////////////////
        ////////////////TODO///////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
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

        ///////////////////////////////////////////////////////////////////////
        ////////////// make sure the PSCID, CandID and Visit_label/////////////
        //////// exist in the back-end/////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if ((!empty($candid)) && (!empty($pscid)) &&(!empty($visit_label))) {
            $patient_name = $pscid . "_" . $candid . "_" . $visit_label;
            ///////////////////////////////////////////////////////////////////
            //////check to se if candid exists/////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate".
                " WHERE candid = :cid",
                array('cid' => $candid)
            )==0) {
                $errors[] = "The CandID: $candid Doesn't exist";
            }
            //////////////////////////////////////////////////////////////////
            //////check to se if pscid exists//////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate WHERE PSCID = :pid",
                array('pid' => $pscid)
            )==0) {
                $errors[] = "The PSCID: $pscid Doesn't exist";
            }
            ///////////////////////////////////////////////////////////////////
            //////check to se if visit_label exists////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM session WHERE Visit_label = :vlabel",
                array('vlabel' => $visit_label)
            )==0) {
                $errors[] = "The VisitLabel: $visit_label Doesn't exist";
            }
            ///////////////////////////////////////////////////////////////////
            //////////copy the temporairy file to a temporairy directory///////
            //////////with a correct Extension/////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if (!copy($temp_file, $new_temp_file)) {
                echo "failed to copy $temp_file to $new_temp_file \n";
            }
            $this->setTempPath($new_temp_file);
        }
        if (count($errors) > 0) {
            return $errors;
        }
        return true;
    }

    /**
     * Import File-related fields into the
     * Database
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
            $user = User::singleton();
            if (Utility::isErrorX($user)) {
                return PEAR::raiseError(
                    "User Error: ".$user->getMessage()
                );
            }
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
                $values      = array(
                                'UploadedBy'     => $user_name,
                                'UploadDate'     => $date,
                                'SourceLocation' => $this->getTempPath(),
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


}
?>

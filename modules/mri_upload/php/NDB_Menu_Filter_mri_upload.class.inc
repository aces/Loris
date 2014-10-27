<?php

/**
 * Mri_upload class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  GPLv3
 * @link     https://github.com/mohadesz/Loris-Trunk
*/

require_once 'NDB_Menu_Filter_Form.class.inc';
require_once 'Log.class.inc';
require_once "Archive/Tar.php";
require_once "File_Decompress.class.inc";
require_once "Message.class.inc";

/**
 * Log Class
 *
 * This class is MRI_upload Filter Menu
 * 
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  GPLv3
 * @link     https://github.com/mohadesz/Loris-Trunk
*/
class NDB_Menu_Filter_Mri_Upload extends NDB_Menu_Filter_Form
{

    var $show_queries = true;

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

        $this->validFilters = array('s.CandID',
                                    'c.PSCID',
                                    's.visit_label'
                          
        );
        $this->query        = " FROM mri_upload mu JOIN session ".
        "s ON (s.ID = mu.SessionID)
        JOIN candidate c on (c.CandID = s.CandID)
         WHERE 1=1 ";
        $this->formToFilter = array(
                'CandID'     => 's.CandID',
                'PSCID'      =>'c.PSCID',
                'visit_label'=>'s.visit_label'
        );
        ////////////////////////////////////////////////////////////////////
        ////Create the log directory////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////

        // Extract info from the config file and create the log file
        $config       = NDB_Config::singleton();
        $log_location = $config->getSetting("log");
        $paths        = $config->getSetting('paths');
        //////////////////////log directory//////////////////////////////////
        $log_directory = $paths['base'] ."/". $config->getSetting('log')
        . "/MRI_upload";

        /////////////////////////////////////////////////////////////////////
        // Create an MRI_upload directory in the tools/logs//////////////////
        /////////////////////////////////////////////////////////////////////
        if (!file_exists($log_directory)) {
            if (mkdir($log_directory)) {

                ////////////////////////////////////////////////////////////
                ////change the directory permission/////////////////////////
                ////////////////////////////////////////////////////////////
                if (!(chmod($log_directory, 0774))) {
                    print('Cannot change the permission of the folder');
                    error_log("Cannot change the permission of the folder");
                }
            } else {
                print('Failed to create mri folder');
                error_log("Log file cannot be created");
            }

        }

        ///////////////////////////////////////////////////////////////////////
        ////Create the log file////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $this->message = new Message("MRI_upload", $log_directory);
        $log_path      = $this->message->getMessagePath();

        if (!(chmod($log_path, 0770))) {
            print "file permission cannot be changed";
            error_log("file permission cannot be changed");
        }
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
        $new_files = array();
        $DB        =  Database::singleton();
        $files     =  $DB->pselect(
            "SELECT distinct SourceLocation"." FROM mri_upload", 
            array()
        );

        foreach ($files as $file) {
            $new_files[$file['SourceLocation']] =$file['SourceLocation'];
        }
        $new_files = array(null => 'Any') + $new_files;

        $this->addSelect('SourceLocation', 'SourceLocation', $new_files);

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
     * Process the form
     *
     * @param Array $values the array of values from the form
     * 
     * @return NULL
     */
    function _process($values)
    {
        if ($this->_saveFile($values)) {
            $this->message->addMessage("Setting up variables \n");

            ///////////////////////////////////////////////////////////////////
            ////////////////////////initialization/////////////////////////////
            ///////////////////////////////////////////////////////////////////
            $db = Database::singleton();
            /////get the location of the last uploaded folder//////////////////
            $query = "SELECT  SourceLocation,UploadedBy FROM mri_upload".
            " WHERE TarchiveID IS NULL ORDER BY UploadID DESC";

            $upload_info     = $db->pselectRow($query, array());
            $source_location = $upload_info['SourceLocation'];
            $mri_user        = $upload_info['UploadedBy'];
            $config          = NDB_Config::singleton();
            $paths           = $config->getSetting('paths');
            $candid          = $values['CandID'];
            $pscid           = $values['PSCID'];
            $visit_label     = $values['VisitLabel'];
            $patient_name    = $pscid . "_" . $candid . "_" . $visit_label;
            $log_directory   = $paths['base'] ."/". $config->getSetting('log')
            . "/MRI_upload";
            $mri_code_path   = $paths['MRICodePath'];
            $DICOMTAR        = $mri_code_path. "dicom-archive/dicomTar.pl";
            $mri_header_executer    = $mri_code_path . "customize_headers.pl";
            $environment_script     = $mri_code_path . "environment";
            $tarchive_location      = $paths['data'] . "tarchive";
            $batch_upload_script    = $mri_code_path . "batch_uploads_tarchive";
            $mri_incoming_path      = $paths['IncomingPath'];
            $dicom_archive_settings = $config->getSetting('dicom_archive');

            ///////////////////////////////////////////////////////////////////
            //////////////////////////////changes the file-name////////////////
            ///////////////////////////////////////////////////////////////////
            $today = getdate();
            $date  = sprintf(
                "%04d-%02d-%02d", 
                $today['year'],
                $today['mon'], 
                $today['mday']
            );
            $this->message->changeLogName(
                'MRI_upload_'. $patient_name . "." .$date. ".log"
            );
            $dicom_created = false;
            $this->tpl_data['minc_success'] = false;
            

            $file_name = pathinfo($source_location, PATHINFO_FILENAME);
            if ($this->show_queries) {
                print "file-name : $file_name, and sourcelocation ".
                $source_location;
                print " visitlabel $visit_label pscid: $pscid and candid: ".
                $candid;
                ///////////////////////////////////////////////////////////////////
                /////////////////log message///////////////////////////////////////
                ///////////////////////////////////////////////////////////////////
                $this->message->addMessage(
                    "file-name : $file_name, ". "and sourcelocation".
                    $source_location
                );
                $this->message->addMessage(
                    " visitlabel $visit_label pscid: $pscid"."and candid: ".
                    $candid
                );
            }

            ///////////////////////////////////////////////////////////////////
            /////untar or unzip the uploaded folder////////////////////////////
            ///////////////////////////////////////////////////////////////////
            $decomp = new File_Decompress(
                $source_location, 
                $mri_incoming_path
            );
            $decompressed_folder = $decomp->decompressFile();
            $decompressed_folder = $mri_incoming_path . "/" . $decompressed_folder;
            if ($decompressed_folder) { //decompress the file
                $this->message->addMessage(
                    "The File $source_location is now" .
                    "untarred into $mri_incoming_path \n"
                );
            }

            ///////////////////////////////////////////////////////////////////
            /////Source Environment Variables//////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            $this->sourceEnvironment($mri_code_path, $mri_user);

            ///////////////////////////////////////////////////////////////////
            //////////////////////run dicomtar for the DICOM file//////////////
            ///////////////////////////////////////////////////////////////////

            ///if the candid, pscid, and visit_label are inserted
            if ((!empty($candid))
                && (!empty($pscid))
                && (!empty($visit_label))
            ) {

                $result          = $this->insertDicom(
                    $DICOMTAR, 
                    $file_name,
                    $decompressed_folder, 
                    $tarchive_location, 
                    $patient_name,
                    $patient_id
                );
                $dicom_created   = $result[0];
                $tarchive_id     = $result[1];
                $ArchiveLocation = $result[2];
            }

            ///////////////////////////////////////////////////////////////////
            ////////////////set the tarchiveid in mri_upload table/////////////
            ///////////////////////////////////////////////////////////////////
            if ($tarchive_id) {
                $db->update(
                    "mri_upload", 
                    array('TarchiveID' => $tarchive_id),
                    array('SourceLocation' => $source_location)
                );
                $this->tpl_data['dicom_success'] = true;
            }

            ///////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            ///////////////////////////RUN the MINC Insertion//////////////////
            ///////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            //////Set the file-path based on the patient_name//////////////////
            ///////////////////////////////////////////////////////////////////
            if ($dicom_created) {

                $tarchive_log = new Log(
                    $patient_name. "_tarchive_file",
                    $log_directory
                );
                $tarchive_log->addLog($ArchiveLocation, false);

                //get the path to the error_log
                $tarchive_file_log = $tarchive_log->getLogPath();

                $command = "cd $mri_code_path; perl $batch_upload_script ".
                "< $tarchive_file_log";

                $query = "SELECT COUNT(f.FileID) FROM mri_upload mu ".
                "JOIN files f ON (f.sessionID = mu.SessionID) ".
                "JOIN session s ON (s.ID = f.sessionID) ".
                "WHERE s.CandID =  :cid AND s.Visit_label= :vlabel ";
                $count = $db->pselectOne(
                    $query, 
                    array(
                     'cid'    => $candid,
                     'vlabel' => $visit_label,
                    )
                );

                ///////////////////////////////////////////////////////////////
                //if the minc is not inserted into the files table/////////////
                ////Run the minc-insertion pipeline////////////////////////////
                ///////////////////////////////////////////////////////////////

                if ($count==0) {
                    $this->message->addMessage(
                        "Inserting MINC into the".
                        " files table \n"
                    );
                    $output = shell_exec($command);
                    if ($this->show_queries) {
                        print "command is $command";
                        $this->message->addMessage("command is $command");
                        print $output;
                        $this->message->addMessage($output);
                    }
                    ////////////////////TODO://////////////////////////////////
                    //extra checks can be added to make sure that the//////////
                    /// mincs are created, before the minc-inserted is set/////
                    /////////// to true////////////////////////////////////////
                    if ($output==0) {

                        $this->message->addMessage(
                            "The minc file for" .
                            " patient-name $patient_name is now inserted into db".
                            "\n"
                        );
                        $this->message->addMessage(
                            "The process completed".
                            "successfully \n"
                        );
                        $this->tpl_data['minc_success'] = true;
                    }
                }

            }
            $this->tpl_data['upload_success'] = true;
        }
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
        $config           = NDB_Config::singleton();
        $paths            = $config->getSetting('paths');
        $stored_file_path = $paths['IncomingPath'];

        $file =new File_Upload;

        $file->overwriteMode = "reject";
        //pass the existing form ($form) by reference to File_Upload,
        // and register the file_upload field names being used.
        $file->registerForm($this->form);

        //Tell File_Upload what file handlers to use.
        $file->setFileHandler(
            "mri_file", 
            $this
        );

        //Set the target directory that you want files moved
        //into once they are validated and processed.
        $file->setBaseUploadDirectory($stored_file_path);
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
        $temp_dir      = $this->tempdir(true);
        $new_temp_file = $temp_dir. "/". $file->fileInfo['name'];
        if (!copy($temp_file, '/tmp/new_compressed')) {
            echo "failed to copy $temp_file...\n";
        }
        $db     = Database::singleton();
        $errors = array();
        $config = NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting(
            'dicom_archive'
        );
        $corect_name            = $dicom_archive_settings['patientNameRegex'];
        $file_name          = $file->fileInfo['name'];
        $not_dicom          = false;
        $files_not_dicom    = 0;
        $files_not_readable = 0;
        $file_not_matching_patient_name = 0;
        $header_patient_name            = array();

        ///////////////////////////////////////////////////////////////////////
        //////////////Make sure the extension is valid/////////////////////////
        ///////////////////////////////////////////////////////////////////////
        if (!(preg_match("/.zip/i", $file_name))
            && (!(preg_match("/.tgz/i", $file_name)))
            && (!(preg_match("/.tar.gz/i", $file_name)))
        ) {
            $errors[] ="Incorrect File-name extention, The file-name
            should either of type '.gz', '.zip' or 'tgz' ";
        }


        ///////////////////////////////////////////////////////////////////////
        ////////////// make sure the Advanced Options are filled out///////////
        ///////////////////////////////////////////////////////////////////////
        $candid      = $args['values']['CandID'];
        $pscid       = $args['values']['PSCID'];
        $visit_label = $args['values']['VisitLabel'];

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

            //////check to se if candid exists/////////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate".
                " WHERE candid = :cid", 
                array('cid' => $candid)
            )==0) {
                $errors[] = "The CandID: $candid Doesn't exist";
            }
            //////check to se if pscid exists//////////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate WHERE PSCID = :pid",
                array('pid' => $pscid)
            )==0) {
                $errors[] = "The PSCID: $pscid Doesn't exist";
            }
            //////check to se if visit_label exists////////////////////////////
            if ($db->pselectOne(
                "SELECT COUNT(*) FROM session WHERE Visit_label = :vlabel",
                array('vlabel' => $visit_label)
            )==0) {
                $errors[] = "The VisitLabel: $visit_label Doesn't exist";
            }

            ///////////////////////////////////////////////////////////////////
            //////////////////Check to see if the dicom file is already////////
            //////////////////////////////inserted in the tarchive table///////
            ///////////////////////////////////////////////////////////////////
            if (($db->pselectOne(
                "SELECT COUNT(*) FROM tarchive WHERE patientname = :pname",
                array('pname' => $patient_name)
            ))>0) {
                $errors[] =" The Dicom file $file_name has already been ".
                "inserted into the tarchive table";
            }

            ///////////////////////////////////////////////////////////////////
            ///////validate the files in the compressed uploaded folder////////
            //////////Are in fact DICOM////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            /**
             * Copy the temp file to $file->fileInfo['name']
             * Uncompress the file
             * Go through the folder and iterate..
             * Check to see if each file is of type dicom..
            */

            ///////////////////////////////////////////////////////////////////
            //////////copy the temporairy file to a temporairy directory///////
            //////////with a correct Extension/////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if (!copy($temp_file, $new_temp_file)) {
                echo "failed to copy $temp_file to $new_temp_file \n";
            }

            ///////////////////////////////////////////////////////////////////
            ///////////////////////decompress the uploaded file////////////////
            ///////////////////////////////////////////////////////////////////
            $decomp = new File_Decompress($new_temp_file, $temp_dir);
            $decomp->decompressFile(); //decompress the file

            ///////////////////////////////////////////////////////////////////
            //////////////////iterate through the folder///////////////////////
            ///////////////////////////////////////////////////////////////////
            $objects = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($temp_dir),
                RecursiveIteratorIterator::SELF_FIRST
            );

            $this->message->addMessage("Processing files \n");

            $count = 0;
            foreach ($objects as $name => $file) {

                if (is_file($file)) {
                    ///////////////////////////////////////////////////////////
                    ///////////////determin the file-type//////////////////////
                    ///////////////////////////////////////////////////////////
                    $file_type = shell_exec("file $file");

                    ///////////////////////////////////////////////////////////
                    /////////////// check if it's readable/////////////////////
                    ///////////////////////////////////////////////////////////
                    if (!is_readable($file)) {
                        $files_not_readable++;
                        continue;
                    }

                    ///////////////////////////////////////////////////////////
                    ///////////////if the file is not a dicom//////////////////
                    ///////////////////////////////////////////////////////////
                    if (!(preg_match("/DICOM/", $file_type))) {

                        ///////////////////////////////////////////////////////
                        /////////////if it's not of type archive or gzip///////
                        ///////////////////////////////////////////////////////
                        if ((!(preg_match("/archive/i", $file_type)))
                            && (!(preg_match("/gzip compressed data/i", $file_type)))
                        ) {

                            $files_not_dicom++;
                        }
                        continue;
                    }
                    ///////////////////////////////////////////////////////////
                    ///////////////if it's dicom///////////////////////////////
                    ///////////////////////////////////////////////////////////

                    $cmd = "dcmdump $file | grep -i patientname";

                    $patient_name_string = shell_exec($cmd);
                    preg_match("^\[(.*?)\]^", $patient_name_string, $fields);
                    $patient_name_from_header = $fields[1];

                    ///////////////////////////////////////////////////////////
                    /////////////remove the spaces in the string///////////////
                    ///////////////////////////////////////////////////////////
                    $patient_name_from_header = str_replace(
                        ' ',
                        '', 
                        $patient_name_from_header
                    );
                    $patient_name = str_replace(' ', '', $patient_name);

                    ///////////////////////////////////////////////////////////
                    //if the patient-name doesn't match the header/////////////
                    ///////////////////////////////////////////////////////////
                    if (!($patient_name == $patient_name_from_header)) {
                        $file_not_matching_patient_name++;
                    }
                    $count++;
                    if ($count % 500 == 0) {
                        $this->message->addMessage(
                            "$count files have been processed \n"
                        );
                    }
                }
            }

            if ($files_not_dicom > 0) {
                $errors[] =" There are  $files_not_dicom files detected which ".
                "are not of type DICOM";
            }

            if ($files_not_readable > 0) {
                $errors[] =" There are  $files_not_readable files which are not ".
                "readable by the browser. Please make sure that the files have ".
                "the right permission";
            }


            if ($file_not_matching_patient_name > 0) {
                $errors[] =" There are  $file_not_matching_patient_name ".
                "DICOM files where the patient_name is  ".
                "$patient_name_from_header and doesn't match $patient_name";
            }

            ///////////////////////////////////////////////////////////////////
            ///////////////remove the  temp_folder/////////////////////////////
            ///////////////////////////////////////////////////////////////////
            if (!is_dir($temp_dir)) {
                rmdir($temp_dir);
            }

            ///////////////////////////////////////////////////////////////////
            //Check to see if the file has already been uploaded or not////////
            ///////////////////////////////////////////////////////////////////
            print "patient-name is " . $patient_name . "<BR>";
            if (($db->pselectOne(
                "SELECT COUNT(*) FROM mri_upload mu ".
                "JOIN tarchive t on (t.TarchiveID = mu.TarchiveID) ".
                "WHERE t.patientname = :pname",
                array('pname' => $patient_name)
            ))>0) {
                $errors[] =" The file-name $file_name has already been uploaded";
            }

            if (count($errors) > 0) {
                print_r($errors);
                foreach ($errors as $error) {
                    $this->message->addMessage("$error");
                }

                $this->message->addMessage(
                    "Error: the process completed with errors \n"
                );
                return $errors;
            }
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

        ///////////////////////////////////////////////////////////////////////
        ////////// create user object//////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
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
        ///////////////////////////////////////////////////////////////////////

        //////////get the stored-file path/////////////////////////////////////
        $date   = date('Y-m-d H:i:s');
        $config = NDB_Config::singleton();
        $paths  = $config->getSetting('paths');
        $stored_file_path = $paths['IncomingPath'];
        $file_name        = $stored_file_path . $file->fileInfo['name'];
        
        //only insert if the file-name doesn't exist in the table:
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
            
        }

        $sessionid = $db->pselectOne(
            "SELECT ID FROM  session WHERE CandID = :cid".
            " AND Visit_label =:vlabel ",
            array(
             'cid'    => $candid, 
             'vlabel' => $visit_label,
            )
        );

        $values = array(
                   'UploadedBy'     => $user_name,
                   'UploadDate'     => $date,
                   'SourceLocation' => $file_name,
                   'SessionID'      => $sessionid,
                  );
        $db->Insert(
            'mri_upload', 
            $values
        );
        return true;
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
     * Source the environment variable
     *
     * @param String $mri_code_path Path to the MRI-Code
     * @param string $mri_user      user
     * 
     * @return NULL
     */
    function sourceEnvironment($mri_code_path, $mri_user)
    {

        $path = $mri_code_path . ":" . $mri_code_path."/uploadNeuroDB/". ":".
        $mri_code_path."/uploadNeuroDB/bin/". ":". getenv('PATH');

        putenv("PATH=$path");

        $loris_config = $mri_code_path . "dicom-archive";
        putenv("LORIS_CONFIG=$loris_config");

        $perlib = getenv('PERL5LIB');
        if (isset($perlib)) {
            $path .= getenv('PERL5LIB');
        } else {
            $path .= '/usr/lib/perl5/';
        }

        putenv("PERL5LIB=$path");

        $tempdir = getenv('TMPDIR');
        //Set the TMPDIR path only if it's not already set
        if (!isset($tempdir)) {
            putenv("TMPDIR=/tmp");
        }

        putenv("USER=$mri_user");
        $this->message->addMessage("The Environment Variables are now set \n");

    }

    /**
     * Runs the dicomTar.pl and will return true if the dicom is inserted,
     * ,tarchiveid, and archivelocation
     *
     * @param String $DICOMTAR            Path to Dicomtar.pl
     * @param String $file_name           Path to the uploaded file
     * @param String $decompressed_folder Path to the decompressed folder
     * @param String $tarchive_location   Path to where the tarchive folder
     * 
     * @return String $result
     */
    function insertDicom($DICOMTAR,$file_name,$decompressed_folder,
        $tarchive_location
    ) {
        $db = Database::singleton();
        $dicom_inserted = false;

        ///////////////////////////////////////////////////////////////////////
        //////////////////Run the dicom_tar////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $cmd = "perl $DICOMTAR $decompressed_folder $tarchive_location"
        .  " -clobber -database -profile prod";

        $this->message->addMessage("Running DICOM \n");
        $output = shell_exec($cmd);

        if ($this->show_queries) {
            print "cmd : $cmd \n";
            print $output;
            $this->message->addMessage("cmd : $cmd \n");
            $this->message->addMessage($output);
        }

        ///////////////////////////////////////////////////////////////////////
        //////////////////Get the ArchiveLocation//////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        $row = $db->pselectRow(
            "Select ArchiveLocation,TarchiveID FROM tarchive".
            " ORDER BY Lastupdate DESC", 
            array()
        );
        $ArchiveLocation = $row['ArchiveLocation'];
        $tarchive_id     = $row['TarchiveID'];

        ///////////////////////////////////////////////////////////////////////
        //////display the log only if the tarchives are created correctly//////
        ///////////////////////////////////////////////////////////////////////
        if (isset($ArchiveLocation) && isset($tarchive_id)) {
            $this->message->addMessage(
                "The DICOM file is now tarred into $ArchiveLocation \n"
            );
        }

        ///////////////////FIX THIS////////////////////////////////////////////
        $tarchive_file_created = true;

        //////////////////////////////////////////////////////////////////////
        /////////////////if successfully completed return true////////////////
        //////////////////////////////////////////////////////////////////////

        if (($tarchive_file_created)
            && ($tarchive_id!=null)
        ) {
            $dicom_inserted = true;
        }

        $result[] = $dicom_inserted;
        $result[] = $tarchive_id;
        $result[] = $ArchiveLocation;
        return $result;
    }
    
    
    /**
     * Creates a temporairy file or directory
     *
     * @param String $dir Path to the directory
     * 
     * @return String
     */
    function tempdir($dir=false)
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

}
?>
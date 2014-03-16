<?php

/**
 * mri_upload class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/mohadesz/Loris-Trunk
*/

require_once 'NDB_Menu_Filter_Form.class.inc';
require_once 'Log.class.inc';
require_once "Archive/Tar.php";
require_once "File_Decompress.class.inc";

/**
 * Log Class
 *
 * This class is MRI_upload Filter Menu
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  Loris License
 * @link     https://github.com/mohadesz/Loris-Trunk
*/
class NDB_Menu_Filter_Mri_Upload extends NDB_Menu_Filter_Form
{
    //var $log;
    /**
    * overloading this method to allow access to site users 
    * (their own site only) and users w/ multisite privs
    * 
    * @note   overloaded function
    * 
    * @return bool
    * @access private
    */

    var $show_errors = true;


    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
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
        $this->columns = array('UploadID','s.CandID','s.visit_label',
        'SourceLocation','FileType','UploadDate','UploadedBy',
        'TarchiveID AS Tarchive_Info','number_of_mincInserted',
        'number_of_mincCreated');
        //'MincInserted AS MRI_Browser' );

        $this->validFilters = array();
        $this->query = " FROM mri_upload mu
           JOIN session s ON (s.ID = mu.SessionID)
            WHERE 1=1 ";
        $this->formToFilter = array();
        $this->log= new Log("MRI_upload", "/data/gusto/data/logs/");

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
        /////////////////////////////////////////////////////////////
        ////////////////////////Upload related fields///////////////
        /////////////////////////////////////////////////////////////
        $this->form->addElement('file', 'mri_file', 'File to Upload');
        $this->form->addElement('static', 'File_name', 'File name');
        $this->form->addElement('static', 'status', 'Status');

        /////////////////////////////////////////////////////////////
        //////////////////Patient-name and Patient-ID fields/////////
        /////////////////////////////////////////////////////////////
        $this->addBasicText('CandID', 'CandID:');
        $this->addBasicText('PSCID', 'PSCID:');
        $visitlabels = array_merge(array(null=>''),Utility::getExistingVisitLabels());
        $this->addSelect('VisitLabel', 'VisitLabel:', $visitlabels);
        $new_files = array();
        $DB =& Database::singleton();

        $files = $DB->pselect(
        'SELECT distinct SourceLocation FROM mri_upload',
        array()
        );

        foreach ($files as $file) {
            $new_files[$file['SourceLocation']] =$file['SourceLocation'];
        }
        $new_files = array(null=>'Any') + $new_files;
        $this->form->addElement(
        'select', 'SourceLocation',
        'SourceLocation', $new_files
        );

        if (empty($_FILES) && empty($_POST)
        && ($_SERVER['REQUEST_METHOD']=='POST')
        ) { //catch file overload error...
            //$postMax = ini_get('post_max_size'); //grab the size limits...
            $upload_max_size = ini_get('upload_max_filesiqze');
            //echo "upload max size is $upload_max_size <BR>";
            echo "<p style=\"color: #F00;\">\nPlease make sure files are
            not larger than {$upload_max_size} <br></p>";
            // echo out error and solutions...
        }
        return true;
    }

    /**
     * process the form
     *
     * @param Array $values the array of values from the form
     * 
     * @return NULL
     */

    function _process($values)
    {

        if ($this->_saveFile($values)) {

            /////////////////////////////////////////////////////////////
            ////////////////////////initialization///////////////////////
            /////////////////////////////////////////////////////////////
            $db=& Database::singleton();
            /////get the location of the last uploaded folder//////////
            $source_location = $db->pselectOne(
            "SELECT  SourceLocation FROM mri_upload
                WHERE TarchiveID IS NULL ORDER BY UploadID DESC",array());
            $config =& NDB_Config::singleton();
            $paths = $config->getSetting('paths');
            $mri_user = $paths['MRIUser'];
            $mri_code_path = $paths['MRICodePath'];
            $mri_incoming_path = $paths['IncomingPath'];
            $mri_header_executer = $mri_code_path . "customize_headers.pl";
            $environment_script = $mri_code_path . "environment";
            $DICOMTAR = $mri_code_path. "dicom-archive-tools/dicomTar.pl";
            $update_header = $mri_code_path. "dicom-archive-tools/updateHeaders.pl";
            $tarchive_location =  $paths['data'] . "tarchive";
            $bach_upload_script  = $mri_code_path . "batch_uploads_tarchive";
            $candid = $values['CandID'];
            $pscid = $values['PSCID'];
            $visit_label = $values['VisitLabel'];
            $patient_name = $pscid . "_" . $candid . "_" . $visit_label;
            $patient_id = "GUSTO";
            $this->tpl_data['minc_success'] = false;
            $dicom_created = false;
            ///////////////////////////////////////////////////////////
            ///////////dynamic output log file/////////////////////////
            ///////////////////////////////////////////////////////////
            $mri_log_file = $paths['data'] . "logs/" . $patient_name. "_mri_upload_log.log";
            ///log file containing the name of the tarred file which will be the input for batchupload

            $file_name = pathinfo($source_location, PATHINFO_FILENAME);
            //$file_name_without_exention = preg_replace(
            //"/\\.[^.\\s]{3,4}$/", "", $source_location
            //);
            if ($this->show_errors) {
                print "file-name : $file_name, file-name-wo-extension:
                       $file_name_without_exention and sourcelocation $source_location";
                print "visitlabel $visit_label pscid: $pscid and candid : $candid";
            }

            ///////////////////////////////////////////////////////////////
            /////untar or unzip the uploaded folder///////////////////////
            /////////////////////////////////////////////////////////////////
            $decomp = new File_Decompress($source_location,$mri_incoming_path);
            $decompressed_folder = $mri_incoming_path . "/" .$decomp->decompress_file();
            if (!($decompressed_folder))  { //decompress the file
                $this->log->addLog(
                "The File $source_location is now
                    untarred into $mri_incoming_path \n <BR>"
                    );
            }

            ///////////////////////////////////////////////////////////////////
            /////Source Environment Variables//////////////////////////////////
            ///////////////////////////////////////////////////////////////////
            $this->sourceEnvironment($mri_code_path,$mri_user);
            print "mri_user" . $mri_user . "<BR>";
            
            ///////////////////////////////////////////////////////////////////
            //////////////////////run dicomtar for the DICOM file//////////////
            ///////////////////////////////////////////////////////////////////

            ///if the candid, pscid, and visit_label are inserted
            if ((!empty($candid)) && (!empty($pscid)) &&(!empty($visit_label))) {
                $result = $this->InsertDicom($DICOMTAR,$file_name,
                               $decompressed_folder,$tarchive_location,$patient_name,$patient_id,$update_header);
         
                $dicom_created = $result[0];
                $tarchive_id = $result[1];
                $ArchiveLocation = $result[2];
            }
            print "dicom created is " . $dicom_created . "<BR>";
            //////////////////////////////////////////////////////////////////////////////////
            /////////////////////////set the tarchiveid in mri_upload table///////////////////
            //////////////////////////////////////////////////////////////////////////////////
            if ($tarchive_id){
                $db->update(
                "mri_upload", array('TarchiveID'=>$tarchive_id),
                array('SourceLocation'=>$source_location)
                );
                $this->tpl_data['dicom_success'] = true;
            }

            /////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////
            ///////////////////////////RUN the MINC Insertion///////////////////
            ///////////////////////////////////////////////////////////////////////

            ///////////////////////////////////////////////////////////////////////////////
            ////Write into the tarchive-file log filrchiveLocation $new_file_location";
            //if it already exists remove it...
            //////////////////////////////////////////////////////////////////////////////////
            ///////////////Set the file-path based on the patient_name//////////////////////
            ////////////////////////////////////////////////////////////////////////////////////
            if ($dicom_created){
                $tarchive_file_log = $paths['data'] . "logs/" . $patient_name ."_tarchive_file.txt";
                if (file_exists($tarchive_file_log)){
                    unlink($tarchive_file_log);
                }
                $handle = fopen($tarchive_file_log, "w");
                fwrite($handle, $ArchiveLocation);
                fclose($handle);

                $command = "cd $mri_code_path; /usr/bin/perl $bach_upload_script < $tarchive_file_log";
                //print "command is $command \n";
                $count = $db->pselectOne("SELECT COUNT(f.FileID) FROM mri_upload mu
                                  JOIN files f ON (f.sessionID = mu.SessionID)
                                  JOIN session s ON (s.ID = f.sessionID)
                                   WHERE s.CandID =  :cid AND s.Visit_label= :vlabel", 
                array('cid'=>$candid,'vlabel'=>$visit_label));

                ///////////////////////////////////////////////////////////////////////////////
                ////if the minc is not inserted into the files table///////////////
                ////Run the minc-insertion pipeline
                /////////////////////////////////////////////////////////////////////////
                if ($count==0){

                    $output = shell_exec($command);
                    if ($this->show_errors) {
                        print "command is $command";
                        print $output;
                    }
                    ////////////////////TODO:////////////////////////////////////////////////////////////////////////////////////
                    //extra checks can be added to make sure that the mincs are created, before the minc-inserted is set to true
                    if ($output==0) {
                        //$db->update('mri_upload',array('MincInserted'=>1),array('SourceLocation'=>$source_location));
                        $this->log->addLog(
                        "The minc file for patient-name $patient_name is now inserted into the db \n <BR>"
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
        $config =& NDB_Config::singleton();
        $paths = $config->getSetting('paths');
        $stored_file_path = $paths['IncomingPath'];

        //print $stored_file_path;
        $file=new File_Upload;

        $file->overwriteMode="reject";
        //pass the existing form ($form) by reference to File_Upload,
        // and register the file_upload field names being used.
        $file->registerForm($this->form);

        //Tell File_Upload what file handlers to use.
        $file->setFileHandler("mri_file", $this);

        //Set the target directory that you want files moved
        //into once they are validated and processed.
        $file->setBaseUploadDirectory($stored_file_path);
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError(
            "User Error: ". $user->getMessage()
            );
        }

        //set the the IDs to the handler functions.
        $file->setHandlerArgs(array("values"=>$values));

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
     * @return Boolean
     */
    function isValid($file, $args)
    {

        //make sure the file-name is  valid
        /**
         * 1) The patient-name and the vist-label do exist...
         * 2) if not correct the user can input the correct name...
         * 3) Make sure it's not corrupted..
         * 1) Ask them to use the database_based visit_labels:
         * 
        */

        $temp_file = $file->fileInfo['tmp_name'];
        $temp_dir = $this->tempdir(true);
        $new_temp_file = $temp_dir. "/". $file->fileInfo['name'];
        print "temp file " . $temp_file . "<BR>";
        if (!copy($temp_file, '/tmp/new_compressed')) {
            echo "failed to copy $temp_file...\n";
        }
        $db=& Database::singleton();
        $errors = array();
        $config=&NDB_Config::singleton();
        $dicom_archive_settings = $config->getSetting('dicom_archive');
        $corect_name = $dicom_archive_settings['patientNameRegex'];
        $file_name = $file->fileInfo['name'];
        $not_dicom = false;
        $files_not_dicom = 0;
        $file_not_matching_patient_name = 0;
        $header_patient_name = array();
        $hader_patient_name;

        //////////////////////////////////////////////////////
        //////////////Make sure the extension is valid////////
        //////////////////////////////////////////////////////
        if (!(preg_match("/.zip/i", $file->fileInfo['name']))
        && (!(preg_match("/.tgz/i", $file->fileInfo['name'])))
        && (!(preg_match("/.tar.gz/i", $file->fileInfo['name'])))
        ) {
            $errors[]="Incorrect File-name extention, The file-name
            should either of type '.gz', '.zip' or 'tgz' ";
        }


        ////////////////////////////////////////////////////////////
        ////////////// make sure the Advanced Options are filled out////////
        //////////////////////////////////////////////////////////
        $candid = $args['values']['CandID'];
        $pscid = $args['values']['PSCID'];
        $visit_label = $args['values']['VisitLabel'];

        if ((empty($candid)) || (empty($pscid)) || (empty($visit_label))) {
            $errors[]="Make sure the CandID, PSCID and Visit_label are
            filled out ";
        }

        ////////////////////////////////////////////////////////////////////
        ////////////// make sure the PSCID, CandID and Visit_label
        //////// exist in the back-end//////////////////////////////////////
        //////////////////////////////////////////////////////////////////////
        if ((!empty($candid)) && (!empty($pscid)) &&(!empty($visit_label))) {
            $patient_name = $pscid . "_" . $candid . "_" . $visit_label;

            if ($db->pselectOne(
            "SELECT COUNT(*) FROM candidate
                WHERE candid = :cid", array('cid'=>$candid)
                )==0) {
                    $errors[] = "The CandID: $candid Doesn't exist";
                }
                if ($db->pselectOne(
                "SELECT COUNT(*) FROM candidate WHERE PSCID = :pid",
                array('pid'=>$pscid)
                )==0) {
                    $errors[] = "The PSCID: $pscid Doesn't exist";
                }

                if ($db->pselectOne(
                "SELECT COUNT(*) FROM session WHERE Visit_label = :vlabel",
                array('vlabel'=>$visit_label)
                )==0) {
                    $errors[] = "The VisitLabel: $visit_label Doesn't exist";
                }

                /////////////////////////////////////////////////////////////////////
                //////////////////Check to see if the dicom file is already//////////
                //////////////////////////////inserted in the tarchive table/////////
                //////////////////////////////////////////////////////////////////////
                if (($db->pselectOne(
                "SELECT COUNT(*) FROM tarchive WHERE patientname = :pname",
                array('pname'=>$patient_name)
                ))>0) {
                    $errors[]=" The Dicom file $file_name has already been inserted into
                    the tarchive table";
                }

                ///////////////////////////////////////////////////////////////
                ///////validate the files in teh compressed uploaded folder////
                //////////Are in fact DICOM////////////////////////////////////
                ///////////////////////////////////////////////////////////////
                /**
                        * 1) copy the temp file to $file->fileInfo['name']
                        * 1) uncompress the file
                        * 2) go through the folder and iterate..
                        * 3) Check to see if each file is of type dicom..
                    */

                ///////////////////////////////////////////////////////////////
                //////////copy the temporairy file to a temporairy directory///
                //////////with a correct Extension/////////////////////////////
                ///////////////////////////////////////////////////////////////
                if (!copy($temp_file, $new_temp_file)) {
                    echo "failed to copy $temp_file to $new_temp_file \n";
                }

                ///////////////////////////////////////////////////////////////
                ///////////////////////decompress the uploaded file////////////
                ///////////////////////////////////////////////////////////////
                $decomp = new File_Decompress($new_temp_file,$temp_dir);
                $decomp->decompress_file(); //decompress the file

                ///////////////////////////////////////////////////////////////
                //////////////////iterate through the folder///////////////////
                ///////////////////////////////////////////////////////////////
                $objects = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator($temp_dir),
                RecursiveIteratorIterator::SELF_FIRST
                );
                foreach($objects as $name => $file){

                    if (is_file($file)) {
                        ///////////////////////////////////////////////////////
                        ///////////////determin the file-type//////////////////
                        ///////////////////////////////////////////////////////
                        $file_type = shell_exec("file $file");

                        ///////////////////////////////////////////////////////
                        ///////////////if the file is not a dicom//////////////
                        ///////////////////////////////////////////////////////
                        if (!(preg_match("/DICOM/",$file_type))) {

                            //////////////////////////////////////////////////
                            /////////////if it's not of type archive or gzip//
                            //////////////////////////////////////////////////
                            if ((!(preg_match("/archive/i",$file_type))) &&
                            (!(preg_match("/gzip compressed data/i",$file_type)))) {
                                $files_not_dicom++;
                            }
                            continue;
                        }
                        ///////////////////////////////////////////////////////
                        ///////////////if it's dicom///////////////////////////
                        ///////////////////////////////////////////////////////

                        $cmd = "dcmdump $file | grep -ri patientname";
                        $patient_name_string = shell_exec($cmd);
                        preg_match("^\[(.*?)\]^",$patient_name_string,$fields);
                        $patient_name_from_header = $fields[1];

                        ///////////////////////////////////////////////////
                        //if the patient-name doesn't match the header/////
                        ///////////////////////////////////////////////////
                        if (!($patient_name == $patient_name_from_header)) {
                            $file_not_matching_patient_name++;
                        }
                    }
                }
                if ($files_not_dicom > 0) {
                    $errors[]=" There are  $files_not_dicom files detected which are not of type DICOM";
                }

                if ($file_not_matching_patient_name > 0) {
                    /*
                    $errors[]=" There are  $file_not_matching_patient_name ".
                    "DICOM files where the patient_name is  ".
                    "$patient_name_from_header and doesn't match $patient_name";
                    */
                }

                ////////////////////////////////////////////////////////////////
                ///////////////remove the  temp_folder//////////////////////////
                ////////////////////////////////////////////////////////////////
                if (!is_dir($temp_dir)) {
                    rmdir($temp_dir);
                }

                /////////////////////////////////////////////////////////////////////////
                ////////Check to see if the file has already been uploaded or not////////
                /////////////////////////////////////////////////////////////////////////
                if (($db->pselectOne(
                "SELECT COUNT(*) FROM mri_upload mu
                    JOIN tarchive t on (t.TarchiveID = mu.TarchiveID)
                    WHERE t.patientname = :pname",
                array('pname'=>$patient_name)
                ))>0) {
                    $errors[]=" The file-name $file_name has already been uploaded";
                }

                if (count($errors) > 0) {
                    return $errors;
                }

        }
        return false;
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
        $userid = $args['user_id'];
        $feedbacks = array();
        $db=& Database::singleton();

        //////////////////////////////////////
        ////////// create user object//////////
        ///////////////////////////////////////
        ////////////////////////////////////////
        //if empty get it using User class//////
        ////////////////////////////////////////
        $user_name = $args['user_id'];
        if (($user_name==null) || (!(isset($user_name)))) {
            $user =& User::singleton();
            if (PEAR::isError($user)) {
                return PEAR::raiseError("User Error: ".$user->getMessage());
            }
            $user_name = $user->getUsername();
        }

        /////////////////////////////////////////////////////
        ////////////////////Insert values into mri_upload/////
        /////////////////////////////////////////////////////
        //////////////////////////////////////
        //get the stored-file path/////////
        $config =& NDB_Config::singleton();
        $paths = $config->getSetting('paths');
        $stored_file_path = $paths['IncomingPath'];
        $file_name = $stored_file_path . $file->fileInfo['name'];
        $date = date('Y-m-d H:i:s');
        //only insert if the file-name doesn't exist in the table:
        //////////////////////////////////////////////////////////////
        /////Get the pscid, candid and visit_label
        ////////////////////////////////////////////////////////
        if ((!empty($args['values']['CandID']))
        && (!empty($args['values']['PSCID']))
        &&(!empty($args['values']['VisitLabel']))
        ) {
            ///////////////////////////////////////////////
            ////////////////////Use the arguments//////////////
            //////////////////////////////////////////////////
            $candid = $args['values']['CandID'];
            $pscid = $args['values']['PSCID'];
            $visit_label = $args['values']['VisitLabel'];
            //print "visitlabel $visit_label pscid: $pscid and candid : $candid";
        }

        $sessionid = $db->pselectOne(
        "SELECT ID FROM  session WHERE CandID = :cid AND Visit_label =:vlabel ",
        array('cid'=>$candid,'vlabel'=>$visit_label)
        );

        $ext = pathinfo($file_name, PATHINFO_EXTENSION);

        $values = array('FileType'=>$ext,'UploadedBy'=>$user_name,
        'UploadDate'=>$date,'SourceLocation'=>$file_name,
        'SessionID'=>$sessionid);
        $db->Insert('mri_upload', $values);
        return true;
    }



    /**
    * getTargetDirectory retrieves info about where the file should be stored.
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
        $output="{$args["user_id"]}/";
        return $output;
    }


    /**
     * source the environment variable
     *
     * @param String $mri_code_path Path to the MRI-Code
     * @param String $mri_user Linux MRI User
     * 
     * @return NULL
     */
    function sourceEnvironment($mri_code_path,$mri_user){

        $path = $mri_code_path. ":". getenv('PATH');
        putenv("PATH=$path");
        $path = $mri_code_path. "uploadNeuroDB:". getenv('PERL5LIB');
        putenv("PERL5LIB=$path");
        putenv("TMPDIR=/tmp");
        putenv("HOME=/home/$mri_user");
        putenv("USER=$mri_user");
        $this->log->addLog("The Environment Variables are now set \n");
    }

    /**
     * Enter description here...
     *
     * @param String $DICOMTAR Path to Dicomtar.pl
     * @param String $tarchive_location Path to where the tarchive folder
     * @param String $patient_id Patient ID
     * 
     * @return Boolean True if successfully completed, otherwise false
     */

    function InsertDicom($DICOMTAR,$file_name,$decompressed_folder,
                        $tarchive_location,$patient_name,$patient_id,$update_header)
    {
        $db=& Database::singleton();
        $dicom_inserted = false;

        ///////////////////////////////////////////////////////////////////
        //////////////////Run the dicom_tar////////////////////////////////
        ///////////////////////////////////////////////////////////////////
        $cmd = "/usr/bin/perl $DICOMTAR $decompressed_folder $tarchive_location"
        .  " -clobber -database -profile prod";
        $output = shell_exec($cmd);
        if ($this->show_errors) {
            print "cmd : $cmd \n";
            print $output;
        }

        ///////////////////////////////////////////////////////////////////
        //////////////////Get the ArchiveLocation//////////////////////////
        ///////////////////////////////////////////////////////////////////
        $row = $db->pselectRow("Select ArchiveLocation,TarchiveID FROM tarchive
                    ORDER BY Lastupdate DESC"
        );
        $ArchiveLocation = $row['ArchiveLocation'];
        $tarchive_id = $row['TarchiveID'];
        $this->log->addLog(
                    "The DICOM file is now tarred into $ArchiveLocation \n <BR>"
               );
               

         ///////////////////////////////////////////////////////////////////
         /////////////Check to see if the file exists in tarchive folder////
         ////////////////////////////////////////////////////////////////////
         print "tarchive location is $tarchive_location";
         ///////////////////FIX THIS///////////////////////////
         $tarchive_file_created = true;
         /*
         $objects = new RecursiveIteratorIterator(
                        new RecursiveDirectoryIterator($tarchive_location), 
                        RecursiveIteratorIterator::SELF_FIRST
                    );
                    
         foreach($objects as $name => $object){
            print "name is $name and file-name is $file_name <BR>";
            if (is_file($object)) {
                if ($name==$file_name) {
                    $tarchive_file_created= true;
                 }
             }
         }

         */
         
         
          ///////////////////////////////////////////////////////////////////
          /////////////update the header if the ArchiveLocation is set///////
          ///////////////////////////////////////////////////////////////////
          if (isset($ArchiveLocation)) {
            $cmd = "/usr/bin/perl $update_header $ArchiveLocation -verbose -set"
                        . " '(0010,0010)' $patient_name -set '(0010,0020)' $patient_id -database -profile prod";
            print $cmd . "<BR>";
            $output = shell_exec($cmd);
            print $output;
            print "-----------------------------";
            print "<BR>";
            $this->log->addLog(
                     "The DICOM tar file $ArchiveLocation is now updated
             with the following patientname: $patient_name patientid: 
            $patient_id \n <BR> "
            );
          }

         
         
         ////////////////////////////////////////////////////////////////////
         /////////////////if successfully completed return true//////////////
         ////////////////////////////////////////////////////////////////////

         if (($tarchive_file_created)&& ($tarchive_id!=null)) {
            print "setting the dicom_inserted to true <BR>";
            $dicom_inserted  =true;
         }

         $result[] = $dicom_inserted;
         $result[] = $tarchive_id;
         $result[] = $ArchiveLocation;
         return $result;
    }


    function tempdir($dir=false,$prefix='php') {
        $tempfile=tempnam(sys_get_temp_dir(),'');
        if (file_exists($tempfile)) { unlink($tempfile); }
        mkdir($tempfile);
        if (is_dir($tempfile)) { return $tempfile; }
    }



    /**
     * fileDecompress, decompresses the file based on the file-type
     *
     * @param String $file-name Path to file
     * @param String $destination Path to the destination folder
     * 
     * @return Boolean True if successfully completed, otherwise false
     */

    function fileDecompress() {
        return true;

    }
}

?>

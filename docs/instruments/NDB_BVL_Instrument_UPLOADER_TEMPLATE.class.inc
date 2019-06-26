<?php
class NDB_BVL_Instrument_TEST_NAME extends NDB_BVL_Instrument
{
    /**
    * sets up basic data, such as the HTML_Quickform object, and so on.
    *
    * @param string $commentID  the CommentID identifying the data to load
    * @param string $page       if a multipage form, the page to show
    * @return void
    * @access public
    */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType="XIN";
        $this->form = new LorisForm('test_form');
        $this->page = $page;            // page label (number or
        // string - used by
        // user-defined child classes)

        // set the object properties
        $this->testName = "<TEST_NAME>";           // test_names.Test_name
        $this->table = '<TEST_NAME>';              // name of database table corresponding to instrument
        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        $this->dateTimeFields=array("Date_taken");

        //The array of selects with multiple answers allowed
        //Any HTML_Quickform multiple selects must be listed here
        $this->_selectMultipleElements = array();

        // required fields for data entry completion status
        $this->_requiredElements = array('Examiner', '<FIRST QUESTION OF EACH PAGE>');

        // setup the form
        $this->_setupForm();

   }

    //If the instrument is not paged, remove the switch from the _setupForm method and add all the form Elements in this function.

    /**
    * method to build the HTML_Quickform object into a paged form
    *
    * @return void
    * @access private
    */
    function _setupForm(){
        switch($this->page) {
            case "<TEST_NAME>_page1":
            $this->_page1();
            break;

            default:
            $this->_main();
            break;
        }
        //Defines the call back function for HTML Quickform to use when validating the form.
        $this->form->addFormRule(array(&$this,'XINValidate'));
    }

    /**
    * generates the main page of the form.
    *
    * @return void
    * @access private
    *
    */
    function _main(){
        // display test name
        $this->addHeader("<INSTRUMENT TITLE>");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();
    }

    function _page1(){

       //add form Elements here as needed.
       //continue onto further pages, if needed.

       //upload file
       $this->addFile('file', 'upload_file', 'Upload a file');

    }

    function _saveValues($values)
    {
         $timepoint = TimePoint::singleton($this->getSessionID());
         $candidate = Candidate::singleton($timepoint->getCandID());

         if(isset($values['upload_file']) && !empty($values['upload_file']['name'])) {
            require_once "File_Upload.class.inc";
            $file=new File_Upload;

            //pass the existing form ($form) by reference to File_Upload, and register the file_upload field names being used.
            $file->registerForm($this->form);


            //Tell File_Upload what file handlers to use.
            $file->setFileHandler("upload_file", $this);

            //Set the target directory that you want files moved into once they are validated and processed.
            $config = NDB_Config::singleton();
            $dir = $config->getSetting("UploadDir");
            if(empty($dir)) {
                $dir = ".";
            };
            $file->setBaseUploadDirectory($dir . "/<TEST_NAME>/");

            //Set the prefix to prepend to the filenames
            //$file->setFilenamePrefix($timepoint->getVisitLabel()."-".$this->testName."-");

            //set the the IDs to the handler functions.
            $user =& User::singleton();
            $file->setHandlerArgs(array("CommentID"=>$this->getCommentID(),
                        "candID"=>$candidate->getCandID(),
                        "PSCID"=>$candidate->getPSCID(),
                        "visitLabel"=>$timepoint->getVisitLabel(),
                        "username"=>$user->getUsername(),
                        "values"=>$values)
                    );



            //If the form is validated, call File_Upload::processFiles() which loops through the files and 
            //proccesses them (including verify, move, and import steps)
            $file->processFiles();
        }
        //echo error messages
        if(!empty($file->errorLog)){
        while(list($fileType,$fileErrors)=each($file->errorLog)){
            foreach($fileErrors AS $error){
                 echo "<span style='color:red'><b>Upload Error</b> $fileType: $error</span><br>";
            }
         }
        }
        unset($values['candID'], $values['sessionID'], $values['commentID'], $values['test_name'],
              $values['page'], $values['fire_away'], $values['subtest'], $values['MAX_FILE_SIZE'], 
              $values['upload_file']);
      $this->_save($values);

   }

   /**
     * getTargetDirectory retrieves info about where the file should be stored.
     *
     * The returned directory is ADDED to the baseUploadDirectory property.  It should have a trailing slash.
     *
     * @param     string  $file    The full filename including directory.
     *
     * @return    bool    $success     if operation succeeded
     * @access    public
     */
    function getTargetDirectory(&$file, $args){
        $output=$args['candID']."/";
        return $output;
    }

   /*
    * Import data from the uploaded file
    *
    * @param $file Reference to file object
    * @param $args An associative array set by setHandlerArgs function
    *
    * @return true If operation succeeded
    */
   function importFile(&$file, $args) {
        $fp=fopen($file->fileInfo['tmp_name'], "r");

        $db=& Database::singleton();
        ///Setting trackchanges to false because getting error messages
        $db->_trackChanges = false;
        ////////////////////////////////////////////////////////////////
        $upload_values = array(); //uploading values to <TEST_NAME> table

       /*parse the file and store the values to upload in the array above
       * and save to the database
       */

       // update database
       $result = $db->update($this->testName, $upload_values, array('CommentID'=>$args['CommentID']));

       echo "<span style='color:red'><b>Upload Successful : </b>".$upload_values[$field]."</span><br>";
       return true;
   }

}
?>

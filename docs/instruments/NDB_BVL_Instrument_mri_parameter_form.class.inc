<?php
class NDB_BVL_Instrument_mri_parameter_form extends NDB_BVL_Instrument
{
    var $ValidityEnabled = false;
    var $ValidityRequired = false;

    /**
    * sets up basic data, such as the HTML_Quickform object, and so on.
    *
    * @param string $commentID  the CommentID identifying the data to load
    * @param string $page       if a multipage form, the page to show
    * @return void
    * @access public
    */
    function setup($commentID = NULL, $page = NULL){

        $this->formType="XIN";
        $this->form = new LorisForm('test_form');
        $this->page = $page;            // page label (number or
        // string - used by
        // user-defined child classes)

        // set the object properties
        $this->testName = "mri_parameter_form";           // test_names.Test_name
        $this->table = 'mri_parameter_form';             // name of table containing

        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        $this->dateTimeFields=array("Date_taken", "wait_time", "total_duration");

        $this->_requiredElements = array('Date_taken', 'Examiner'); //, 'CaregiverReport');

        $config =& NDB_Config::singleton();
        $this->dateOptions = array(
            'language' => 'en',
            'format'   => 'YMd',
            'minYear'  => $config->getSetting('startYear'),
            'maxYear'  => $config->getSetting('endYear'),
            'addEmptyOption' => true,
            'emptyOptionValue' => null
        );
        
        if (!empty($commentID)) {
            $db =& Database::singleton();

            $query = "SELECT * FROM ".$this->table." WHERE CommentID='".$this->getCommentID()."'";
            $db->selectRow($query, $record);
        
            if (!is_array($record)) {
                $record = array();
            }
        
            for($i=0; $i < 25; $i++){
                $vector_x = number_format($record["vector{$i}_x"], 5);
                $vector_y = number_format($record["vector{$i}_y"], 5);
                $vector_z = number_format($record["vector{$i}_z"], 5);

                $this->localDefaults["vector{$i}"] = "({$vector_x}, {$vector_y}, {$vector_z})";
            }
         }
        
         // setup the form
         $this->_setupForm();
    }

    /**
    * method to build the HTML_Quickform object into a paged form
    *
    * @return void
    * @access private
    */
    function _setupForm(){

        // display test name
        $this->form->addElement('header', 'instrument_title', "MRI Parameter Form");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();
        
        $this->form->addElement("select", "Scanner_Type", "Type of Scanner:", array("" => NULL, "hospital" => "Hospital", "research" => "Research", "other" => "Other"));
        $this->form->addElement("text", "Scanner_Type_other", "If other, specify:");
        //$this->XINRegisterRule("Scanner_Type_other", array("Scanner_Type{@}=={@}other"), "Required if scanner type is other");

        $this->addTextElement("session_attempts", "Number of Session Attempts:");
        $this->addHourMinElement("wait_time", "Wait Time for Scanner (hours:minutes)");
        $this->addHourMinElement("total_duration", "Total Duration of Session (hours:minutes)");
        $this->form->addElement('select','sedation', "Was sedation administered?", array(""=>NULL,"Yes" => "Yes", "No"=>"No"));
        $this->form->addElement('static', null, "(please use comment field for details)");
        $this->form->addElement('select','medication', "Was the child on any medication?", array(""=>NULL,"Yes" => "Yes", "No"=>"No", 'not_answered'=>'Not Answered'));

        $this->form->addElement("text", "medication_specify", "If yes, specify:");
        $this->form->addFormRule(array(&$this, 'Medication_Rules'));
        $yes_no_option= array(""=>NULL, "No"=>"No", "Complete"=>"Yes, Complete Acquisition", "Partial"=>"Yes, Partial Acquisition", "not_answered"=>"Not Answered");

        $this->form->addElement('header', null, 'Localizer');
        $this->form->addElement('static', null, 'Scan time: 1-2 min (exact details are not critical)');

        $this->form->addElement('header', null, 'Warm up scan (Coarse TSE PD/T2W)');
        $this->form->addElement('static', null, 'Optional warm-up sequence of site\'s choosing');
        $this->form->addElement('static', null, 'Scan time:  should not exceed 2 minutes');

        $this->form->addElement('header', null, '3D T1 MP-Rage');
        $this->form->addElement('static', null, 'SIEMENS: tfl');
        $this->form->addElement('select', 'T1_Scan_done', 'Was this sequence acquired?', $yes_no_option);
        $this->form->addElement('text', "T1_number_attempts", "Number of scan attempts:");
        $this->addDateElement('T1_Scan_done', 'If so, when?');
        $this->addTextAreaElement('T1_Comments', 'Comments');

        $this->form->addElement('header', null, 'High Resolution 3D T2W');
        $this->form->addElement('static', null, 'SIEMENS: tse_vfl');
        $this->form->addElement('select', 'T2_Scan_done', 'Was this sequence acquired?', $yes_no_option);
        $this->form->addElement('text',"T2_number_attempts", "Number of scan attempts:");
        $this->addDateElement('T2_Scan_done', 'If so, when?');
        $this->addTextAreaElement('T2_Comments', 'Comments');

        $this->form->addElement('header', null, '25 Direction DTI');
        $this->form->addElement('static', null, 'SIEMENS: epd2_diff');
        $this->form->addElement('select', 'DTI_Scan_done', 'Was this sequence acquired?', $yes_no_option);
        $this->form->addElement('text', "DTI_number_attempts", "Number of scan attempts:");
        $this->addDateElement('DTI_Scan_done', 'If so, when?');
        $this->addTextAreaElement('DTI_Comments', 'Comments');
        
        $this->form->addElement('header', null, '65 Direction DTI');
        $this->form->addElement('static', null, 'SIEMENS: epd2_diff_12ch_b2000');
        $this->form->addElement('select', 'DTI65Dir_Scan_done', 'Was this sequence acquired?', $yes_no_option);
        $this->form->addElement('text', "DTI65Dir_number_attempts", "Number of scan attempts:");
        $this->addDateElement('DTI65Dir_Scan_done', 'If so, when?');
        $this->addTextAreaElement('DTI65Dir_Comments', 'Comments');

        $this->form->addElement('header', null, 'Resting BOLD');
        $yes_no_option2 = array(""=>NULL, "No"=>"No", "Complete"=>"Yes, Complete Acquisition", "Partial"=>"Yes, Partial Acquisition", "not_answered"=>"Not Answered");
        $this->form->addElement('select', 'BOLD_Scan_done', 'Was this sequence acquired?', $yes_no_option2);
        $this->form->addElement('select', 'BOLD_Number_Complete_Runs', 'Number of complete runs:', array('' => '', '1' => '1', '2'=> '2', '3' => '3'));
        // Adding XIN rules would be complicated at this point, since everything would need to ne explicitly never_required'd.
        // So just add a form rule
        $this->form->addFormRule(array(&$this, 'MRI_Bold_Rules'));
        $this->XINRegisterRule("BOLD_Number_Complete_Runs", array("Bold_Scan_done{@}=={@}Complete"), "Required if ");
        $this->form->addElement('text', "BOLD_number_attempts", "Number of scan attempts:");
        $this->addDateElement('BOLD_Scan_done', 'If so, when?');
        $yes_no_option3 = array(""=>NULL,"No"=>"No","Yes"=>"Yes","Possibly"=>"Possibly");
        $this->form->addElement('select','BOLD_child_awake','Was the child awake during the BOLD scanning?',$yes_no_option3);
        $this->addTextAreaElement('BOLD_Comments', 'Comments');

        $this->form->addElement('header', null, 'Spectroscopy');
        $this->form->addElement('select', 'Spectroscopy_Scan_done', 'Was this sequence acquired?', $yes_no_option);
        $this->form->addElement('text', "Spectroscopy_number_attempts", "Number of scan attempts:");
        $this->addDateElement('Spectroscopy_Scan_done', 'If so, when?');
        $this->form->addElement('static', null, 'Which scans were acquired?');

        $acquired_option= array(""=>NULL, "acquired" => "Acquired", "not_acquired" => "Not Acquired");
        $this->form->addElement('select', 'Spectroscopy_long_echo_acquired', "Long echo", $acquired_option);
        $this->form->addElement('select', 'Spectroscopy_short_echo_acquired', "Short echo", $acquired_option);
        $this->form->addElement('select', 'Spectroscopy_water_scan_acquired', "Water Scan", $acquired_option);

        $this->addTextAreaElement('Spectroscopy_Comments', 'Comments');






        $this->form->addElement('header', null, 'Direction File');
        
        $this->form->addElement('static', 'coordinate_system', 'Coordinate system:');
        $this->form->addElement('static', 'normalization', 'Normalization:');
        
        for($i=0; $i < 25; $i++){
          $this->form->addElement('static', "vector{$i}", "Vector {$i}:");
        }

        $this->form->addElement('file', 'directions_file', 'Upload the directions file (optional)');
    } // End setupForm

    function Medication_Rules($values) {
        if($values['medication'] == 'Yes' && $values['medication_specify'] == '') {
            return array('medication_specify' => 'Required if on medication');
        }
        return array();
    }

    function MRI_Bold_Rules($values) {
        if(($values['BOLD_Scan_done'] == 'Complete' || $values['BOLD_Scan_done'] == 'Partial')&& $values['BOLD_Number_Complete_Runs'] == '') {
            return array('BOLD_Number_Complete_Runs' => 'Required if acquisition complete or partial');
        }
        return array();
    }

    
         // methods available to all children
          /**
           * preprocesses the array of values to be saved into the database
           * (such as to rearrange date fields)
           *
           * @param array $values      the array of values ready to be passed to
           * an Database::update call as the set array
           * @return void
           * @access private
           */
          function _saveValues($values)
          {
              $timepoint =& TimePoint::singleton($this->getSessionID());
              $candidate =& Candidate::singleton($timepoint->getCandID());
              $this->_nullStatus($values);

              if(isset($values['Date_taken'])) {
                  $date = $values['Date_taken'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['Date_taken'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      $this->_saveCandidateAge($values);
                  }  else {
                      unset($values['Date_taken']);
                  }
             }
              
              if(isset($values['T1_Scan_done_date'])) {
                  $date = $values['T1_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['T1_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['T1_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['T1_Scan_done_date']);
                  }

              }
              
              if(isset($values['T2_Scan_done_date'])) {
                  $date = $values['T2_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['T2_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['T2_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['T2_Scan_done_date']);
                  }

              }
              
              if(isset($values['DTI_Scan_done_date'])) {
                  $date = $values['DTI_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['DTI_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['DTI_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['DTI_Scan_done_date']);
                  }

              }

              if(isset($values['DTI65Dir_Scan_done_date'])) {
                  $date = $values['DTI65Dir_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['DTI65Dir_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['DTI65Dir_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['DTI65Dir_Scan_done_date']);
                  }

              }
              if(isset($values['BOLD_Scan_done_date'])) {
                  $date = $values['BOLD_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['BOLD_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['BOLD_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['BOLD_Scan_done_date']);
                  }

              }
              if(isset($values['Spectroscopy_Scan_done_date'])) {
                  $date = $values['Spectroscopy_Scan_done_date'];
                  if(!empty($date['Y']) && !empty($date['M']) && !empty($date['d'])) {
                      $values['Spectroscopy_Scan_done_date'] = $this->_getDatabaseDate($date); //sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                      //$values['Spectroscopy_Scan_done_date'] = sprintf("%04d-%02d-%02d", $date['Y'], $date['M'], $date['d']);
                  } else {
                      unset($values['Spectroscopy_Scan_done_date']);
                  }

              }
              
              if(isset($values['wait_time'])) {
                  $time = $values['wait_time'];
                  $values['wait_time'] = sprintf("%02d:%02d:00", $time['H'], $time['i']);
              }
              
              if(isset($values['total_duration'])) {
                  $time = $values['total_duration'];
                  $values['total_duration'] = sprintf("%02d:%02d:00", $time['H'], $time['i']);
              }
              
              //print_r($values['wait_time']);
              if(isset($values['directions_file']) && !empty($values['directions_file']['name'])) {
                require_once "File_Upload.class.inc";
                $file=new File_Upload;

                //pass the existing form ($form) by reference to File_Upload, and register the file_upload field names being used.
                $file->registerForm($this->form);

                //Tell File_Upload what file handlers to use.
                $file->setFileHandler("directions_file", $this);

                //Set the target directory that you want files moved into once they are validated and processed.
                $config = NDB_Config::singleton();
                $dir = $config->getSetting("UploadDir");
                if(empty($dir)) {
                    $dir = ".";
                }
                
                $file->setBaseUploadDirectory($dir . "/mri_parameter_directions");

                //Set the prefix to prepend to the filenames
                //$file->setFilenamePrefix($timepoint->getVisitLabel()."-".$this->testName."-");

                //set the the IDs to the handler functions.
                $file->setHandlerArgs(array("CommentID"=>$this->getCommentID(),
                                            "candID"=>$candidate->getCandID(),
                                            "PSCID"=>$candidate->getPSCID(),
                                            "visitLabel"=>$timepoint->getVisitLabel(),
                                            "username"=>$_SESSION['State']->getUsername(),
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
              unset($values['candID'], $values['sessionID'], $values['commentID'], $values['test_name'], $values['page'], $values['fire_away'], $values['subtest'], $values['MAX_FILE_SIZE'], $values['directions_file']);
              $this->_save($values);
          }

          /**
          * isValid checks the validity of the file.
          *
          * @param     string  $file    The full filename including directory.
          *
          * @return    bool    $success		if operation succeeded
          * @access    public
          */
          function isValid(&$file, $args){
               $fp=fopen($file->fileInfo['tmp_name'], "r");
               $contents=fread($fp,filesize($file->fileInfo['tmp_name']));
               fclose($fp);

               $lines=explode("\n",$contents);

               $i = 0;
               $size = count($lines);
               while(!preg_match("/\[directions\s*\=\s*25\]/", $lines[$i++])){
                  if($i > $size){
                     echo("<font color='red'>Improper format: Can't find entry with 25 directions.</font><BR>");
                     return false;
                  }
               }
               if(!preg_match("/CoordinateSystem\s*=\s*.+/", $lines[$i++])){
                  echo("<font color='red'>Improper format: Can't find coordinate system.</font><BR>");
                  return false;
               }
               if(!preg_match("/Normalisation\s*=\s*.+/", $lines[$i++])){
                   echo("<font color='red'>Improper format: Can't find normalization.</font><BR>");
                   return false;
                }
               
               for($j = 0; $j < 25; $j++){
                 if(!preg_match("/Vector\[{$j}\]\s*=\s*\(\s*(\-?[\d\.]+)\s*,\s*(\-?[\d\.]+)\s*,\s*(\-?[\d\.]+)\s*\)/", $lines[$i++])){
                   echo("<font color='red'>Improper format: Can't find entry for vector {$j}.</font><BR>");
                   return false;
                 }
               }               
              return true;
          }

          /**
          * importFile imports the vineland file into the database.
          *
          * @param     object       $file    A reference to the file object (passed automatically by callFileHandler)
          * @param     assoc_array  $args    The arguments passed to the function they must be:
          *   -
          *
          * @return    bool    $success		if operation succeeded
          * @access    public
          */
          function importFile(&$file, $args){
              $fp=fopen($file->fileInfo['tmp_name'], "r");
              $contents=fread($fp,filesize($file->fileInfo['tmp_name']));
              fclose($fp);

              $values=array(
                  'UserID'    =>$args['username'],
                  'File_type' =>'directions',
                  'File_name' =>$file->getDestinationFilename(),
                  'Data_dir'  =>$file->getDestinationDirectory()
              );


              //Cycle through the lines and extract the data
              $lines=explode("\n",$contents);
              
              $i = 0;
              $size = count($lines);
              while(!preg_match("/\[directions\s*\=\s*25\]/", $lines[$i++]) && $i < $size);
              $result = preg_split("/\s*\=\s*/", $lines[$i++]);
              $values["coordinate_system"] = trim($result[1]);
              $result = preg_split("/\s*\=\s*/", $lines[$i++]);
              $values["normalization"] = trim($result[1]);
              
              for($j = 0; $j < 25; $j++){
                $matches = array();
                if(preg_match("/Vector\[{$j}\]\s*=\s*\(\s*(\-?[\d\.]+)\s*,\s*(\-?[\d\.]+)\s*,\s*(\-?[\d\.]+)\s*\)/", $lines[$i++], $matches)){
                  $values["vector{$j}_x"] = $matches[1];
                  $values["vector{$j}_y"] = $matches[2];
                  $values["vector{$j}_z"] = $matches[3];
                  
                  $vector_x = number_format($values["vector{$j}_x"], 5);
                  $vector_y = number_format($values["vector{$j}_y"], 5);
                  $vector_z = number_format($values["vector{$j}_z"], 5);
                  
                  $this->localDefaults["vector{$j}"] = "({$vector_x}, {$vector_y}, {$vector_z})";
                }else{
                  return false;
                }
              }
                          
              $db=& Database::singleton();

              $result = $db->update($this->testName, $values, array('CommentID'=>$args['CommentID']));
              return true;
          }

          function formatDate($date){
             if(empty($date)){
                return null;
             }
             $dateBits = explode('/', $date);
             return sprintf("%04d-%02d-%02d", $dateBits[2], $dateBits[0], $dateBits[1]); 
          }

          /**
          * getTargetDirectory retrieves info about where the file should be stored.
          *
          * The returned directory is ADDED to the baseUploadDirectory proprety.  It should have a trailing slash.
          *
          * @param     string  $file    The full filename including directory.
          *
          * @return    bool    $success		if operation succeeded
          * @access    public
          */
          function getTargetDirectory(&$file, $args){
              $output=$args['candID']."/";
              return $output;
          }
}
?>

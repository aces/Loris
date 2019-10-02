<?php
/**
 * This file contains the NDB_BVL_Instrument_mri_parameter_form
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  Initial_MRI
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
/**
 * Creates the form elements for the mri_parameter_form instrument
 *
 * @category Instrument
 * @package  Initial_MRI
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_BVL_Instrument_mri_parameter_form extends NDB_BVL_Instrument
{
    use LegacyInstrumentTrait;

    var $ValidityEnabled  = false;
    var $ValidityRequired = false;
    var $_doubleDataEntryDiffIgnoreColumns = array(
        'CommentID',
        'UserID',
        'Testdate',
        'Window_Difference',
        'Candidate_Age',
        'Data_entry_completion_status',
    );

    /**
     * Sets up basic data, such as the LorisForm object, and so on.
     *
     * @param string $commentID the CommentID identifying the data to load
     * @param string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType = 'XIN';
        $this->form     = new LorisForm('mri_parameter_form_form');
        $this->page     = $page;

        // set the object properties
        $this->testName  = 'mri_parameter_form'; // test_names.Test_name
        $this->table     = 'mri_parameter_form';
        $this->commentID = $commentID; // data keyed by commentID

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any LorisForm date elements must be listed here
        $this->dateTimeFields = array(
            "Date_taken",
            "scan_date",
        );

        //The array of selects with multiple answers allowed
        //Any LorisForm multiple selects must be listed here
        //$this->_selectMultipleElements = array();

        // required fields for data entry completion status
        $this->_requiredElements = array(
            'Examiner',
            'CommentID',
        );

        $config            = NDB_Config::singleton();
        $this->dateOptions = array(
            'language'         => 'en',
            'format'           => 'YMd',
            'minYear'          => $config->getSetting('startYear'),
            'maxYear'          => $config->getSetting('endYear'),
            'addEmptyOption'   => true,
            'emptyOptionValue' => null,
        );
        // setup the form
        $this->_setupForm();
    }

    /**
     * Method to build the LorisForm object into a paged form
     *
     * @return void
     * @access private
     */
    function _setupForm()
    {
        //determine page to display
        if (preg_match(
            "/mri_parameter_form(_page[0-9]+)/",
            $this->page,
            $matches
        )) {
            call_user_func(array($this, $matches[1]));
        } else {
            $this->_main();
        }

        $this->form->addFormRule(array(&$this, 'XINValidate'));
    }

    /**
     * Generates the main page of the form.
     *
     * @return void
     * @access private
     */
    function _main()
    {
        // display test name
        $this->addHeader("MRI Parameter Form");

        $this->_addMetadataFields();
    }
    /**
     * Page 1
     *
     * @throws DatabaseException
     *
     * @return void
     */
    function _page1()
    {
        // Header
        $this->addHeader("MRI Parameter Form");
        $this->addBasicText(
            'mri_dataset_name',
            'MRI Dataset Name:'
        );

        $typesOfData = array(
            null                => '',
            'participant'       => 'Participant',
            'human_phantom'     => 'Human Phantom',
            'geometric_phantom' => 'Geometric Phantom',
        );

        $this->addSelect(
            'type_of_data',
            'Type of Data:',
            $typesOfData
        );
        // Get Name and MRI Alias from sites table for select options

        $query    = "SELECT Name, CenterID FROM psc";
        $db       = Database::singleton();
        $sitesRaw = $db->pselect($query, array());
        $sites    = array(null => '');
        foreach ($sitesRaw as $i) {
            $sites[$i['CenterID']] = $i['Name'];
        }
        $this->addSelect(
            'site',
            'MRI Site Name:',
            $sites
        );

        $this->addLabel("Total Duration of Session");
        $this->addNumericElement(
            'total_duration_hours',
            $this->indent . $this->indent . 'Hours:'
        );

        $this->addNumericElement(
            'total_duration_minutes',
            $this->indent . $this->indent . 'Minutes:'
        );

        $this->addBasicText(
            'mri_operator_name',
            'MRI Operator Name:'
        );

        $scanDateOptions           = $this->dateOptions;
        $scanDateOptions['format'] = 'dMY';

        $this->addBasicDate(
            'scan_date',
            "Scan Date:",
            $scanDateOptions
        );

        $acquiredOptions = array(
            null      => '',
            'yes'     => 'Yes',
            'partial' => 'Partial',
            'no'      => 'No',
        );
        $scanTypes = array(
            '3d_t1w'   => '3D-T1w',
            '2d_flair' => 'FLAIR',
        );

        $group[] = $this->createLabel('Sequences');
        $group[] = $this->createLabel('Acquired?');
        $group[] = $this->createLabel('Number of attempts');
        $group[] = $this->createLabel(
            'Comments (e.g. subject woke up, repeated series #, motion, name of '.
            'additional add-on acquisition if applicable)'
        );

        $group[] = $this->createLabel("Number of directions (DTI only)");

        $this->addGroup(
            $group,
            null,
            null,
            $this->_GUIDelimiter,
            false
        );
        unset($group);
        foreach ($scanTypes as $k => $v) {
            $group[] = $this->createLabel($v);
            $group[] = $this->createSelect(
                $k."_Scan_Done",
                "",
                $acquiredOptions
            );
            $group[] = $this->createText(
                $k."_number_attempts",
                ''
            );
            $group[] = $this->createTextArea(
                $k.'_comments',
                ''
            );

            $this->XINRegisterRule(
                $k.'_comments',
                array($k.'_Scan_Done{@}!={@}yes'),
                'Please provide comments as to why the scan was either not '.
                'or partially acquired.',
                $k.'_group'
            );

            $this->addGroup(
                $group,
                $k.'_group',
                null,
                $this->_GUIDelimiter,
                false
            );

            unset($group);

            $this->XINRegisterRule(
                $k.'_Scan_Done',
                array($k.'_Scan_Done{@}=={@}'),
                'Required.',
                $k.'_group'
            );
            $this->XINRegisterRule(
                $k.'_number_attempts',
                array($k.'_number_attempts{@}=={@}'),
                'Please enter number of attempts for this sequence',
                $k.'_group'
            );

        }
        $this->form->addFormRule(array(&$this, 'validateNumerics'));
    }

    /**
     * Validates numeric elements
     *
     * @param array $values The values
     *
     * @return array
     */
    function validateNumerics($values)
    {
        $errors = array();
        $offset = 0 - strlen('_number_attempts');

        foreach ($values as $k => $v) {
            if (substr($k, $offset) == '_number_attempts'
                && !is_numeric($v) && !empty($v)
            ) {
                $id = substr($k, 0, strlen($k) + $offset);
                $errors[$id . "_group"]
                    = "Please enter a numeric value for number of attempts.";
            }
        }
        if (!empty($errors)) {
            return $errors;
        } else{
            return true;
        }
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
    function _saveValues(array $values): void
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
     * @return    bool    $success              if operation succeeded
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
     * @return    bool    $success              if operation succeeded
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
     * The returned directory is ADDED to the baseUploadDirectory property.  It should have a trailing slash.
     *
     * @param     string  $file    The full filename including directory.
     *
     * @return    bool    $success              if operation succeeded
     * @access    public
     */
    function getTargetDirectory(&$file, $args){
        $output=$args['candID']."/";
        return $output;
    }
}
?>


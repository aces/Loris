<?php
require_once 'NDB_Page.class.inc';
require_once "PEAR.php";
require_once "HTML/QuickForm.php";
include_once ('HTML/QuickForm/Renderer/Default.php');

/**
 * Base class for all NeuroDB behavioural instruments
 *
 * Throws PEAR errors. Also requires PEAR HTML_Quickform.
 *
 * @package behavioural 
 * @access public
 */
class NDB_BVL_Instrument extends NDB_Page
{
    // {{{ properties

    /**
    * HTML_Quickform object
    *
    * @access private
    */
    var $form;

    /**
    * test name (short name), equivalent to test_names.Test_name
    *
    * @access private
    */
    var $testName;

    /**
    * instrument instance CommentID
    *
    * @access private
    */
    var $commentID;

    /**
    * database table containing data referenced by $this->commentID
    *
    * @access private
    */
    var $table;

    /**
    * cache location for the date of administration
    *
    * @access private
    */
    var $dateOfAdministration;

    /**
    * additional form defaults - should only be used for quickform
    * static elements!
    *
    * @access private
    */
    var $localDefaults = array('emptyCell'=>'&nbsp;');

    /**
    * string to separate the group elements
    * @access private
    */
    var $_GUIDelimiter = "</td>\n<td>";

    /**
    * commonly used level of indentation
    * @access private
    */
	var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

	/**
    * array of required fields to check
    * @access private
    */
    var $_requiredElements = array();

    /**
    * array of date fields to be processed into QuickForm dates
    * NOTE: When abstracting the _saveValues() method in the child <instrument> class, add only the dates from the current page to the array using the instruments switch($page) otherwise you'll end up overwriting (NULLing) all other dates in the table that appear on other pages (if they are listed in the array of date fields) - note by Dario
    */
    var $dateTimeFields = array();


    /**
     * Array of column names to be ignored by the double data entry conflict detector.
     */
    var $_doubleDataEntryDiffIgnoreColumns = array('CommentID', 'UserID', 'Testdate', 'Window_Difference', 'Candidate_Age');

    /**
     * Whether the "Validity" field is shown as a flag for an instrument
     * or not.
     * @access private
     */
    var $ValidityEnabled = true;
    /**
     * Whether the "Validity" field is required before flagging an instrument
     * as complete or not.
     * @access private
     */
    var $ValidityRequired = true;


    // }}}
    // {{{ factory()

    /**
    * factory generates a new instrument instance of type
    * $instrument, and runs the setup() method on that new
    * instrument.
    *
    * @param string $instrument  the name of the instrument to use
    * @param string $commentID   the CommentID identifying the data to
    * load
    * @param string $page        if a multipage form, the page to show
    * @return object             the new object of $instrument type
    * @throws PEAR:error
    * @access public
    */
    function factory($instrument, $commentID, $page, $guarantee_exists = true)
    {
        $class = "NDB_BVL_Instrument_$instrument";
        
        // Make sure the instrument class has been included/required!
        $config =& NDB_Config::singleton();
        $base = $config->getSetting('base');

        // The conflict resolver doesn't care if the instrument exists or not, it
        // just tries to load, score, and save. If it doesn't exist, for instance
        // in the case of figs_year3_relatives, we shouldn't require because it 
        // isn't necessarily an error.
        if(!file_exists($base."project/instruments/$class.class.inc") && $guarantee_exists==false) {
            return;
        }
        if(file_exists($base."project/instruments/$instrument.linst") || $instrument=='instrument_preview') {
            //print "Using Loris Instrument Format\n";
            if($instrument == 'instrument_preview') {
                require_once 'NDB_BVL_Instrument_instrument_preview.class.inc';
                $obj = new NDB_BVL_Instrument_instrument_preview();
                $obj->preview = true;
            } else {
                $obj = new NDB_BVL_Instrument();
            }
            //$obj->form = new HTML_Quickform('test_form');
            $obj->commentID = $commentID;
            $obj->page= $page;
            $obj->loadInstrumentFile($base . "project/instruments/$instrument.linst");
            if(file_exists($base."project/instruments/$instrument.rules")) {
                $obj->loadInstrumentRules($base . "project/instruments/$instrument.rules");
            }
        } else {
            require_once($base."project/instruments/$class.class.inc");
            // Now go ahead and instantiate it
            $obj = new $class;
            $success = $obj->setup($commentID, $page);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }
        
        $access = $obj->_hasAccess();
        if (Utility::isErrorX($access)) {
            return PEAR::raiseError("NDB_Instrument::factory(): ".$access->getMessage());
        }

        // check that user has access
        if ($access == false) {
            return PEAR::raiseError("You do not have access to this page.");
        }

        return $obj;
    }

    
    /**
     * Checks if the user has permissions to view the instrument.
     * 
     * Relies on <instrumentPermissions> settings in the config.xml file.
     *
     * This follows a permissive scheme.
     * If the instrument is not listed in the instrumentPermissions section, access is granted.
     * If the user has ANY of the permissions listed in the config.xml file for the instrument, access is granted.
     * 
     * Future improvement: call this function from display() rather than from factory()?
     *
     * @return bool
     * @access private
     */
    function _hasAccess()
    {
        //get config
        $config =& NDB_Config::singleton();
        $instrumentPermissions = $config->getSetting("instrumentPermissions");

        //check if instrumentPermissions are being used.
        if ($instrumentPermissions['useInstrumentPermissions'] == false) {
            //instrument permissions not used...
            return true; //default
        }
        else { //check if user has instrument's permissions
            $user =& User::singleton();
            if(Utility::isErrorX($user)) {
              return PEAR::raiseError("User Error: ".$user->getMessage());
            }

            //is the instrument listed at all in instrumentPermissions?
            $instrumentListed = false;
            foreach($instrumentPermissions["instrument"] as $instrument) {
                if ($instrument["Test_name"] == $this->testName) {
                    $instrumentListed = true;
                    $instrumentPerms = Utility::asArray($instrument["permission"]);
                }
            }
            
            //no permissions defined
            if (!$instrumentListed) {
                return true;
            }

            //check if user possesses ANY of the required permissions
            foreach ($instrumentPerms as $instrumentPerm) {
                if($user->hasPermission($instrumentPerm))
                    return true;
            }
            
            //no user permissions match required instrument permissions
            return PEAR::raiseError("You do not have access to this page.");
        }
    }
    
    // }}}
    // abstract methods (to be redefined by child classes)
    // {{{ setup()

    /**
    * sets up basic data, such as the HTML_Quickform object, and so on.
    *
    * @param string $commentID  the CommentID identifying the data to load
    * @param string $page       if a multipage form, the page to show
    * @return void
    * @access public
    * @abstract
    */
    function setup($commentID, $page)
    { 
       $this->_setupPage(null, $page, null, $commentID, 'test_form'); 
    /**       
     //   $this->form = new HTML_Quickform('test_form');
       // $this->page = $page;            // page label (number or
        // string - used by
        // user-defined child classes)

        // set the object properties
        $this->testName = "";           // test_names.Test_name
        $this->table = '';              // name of table containing
        // data keyed by commentID
       // $this->commentID = $commentID;

        // required fields for data entry completion status
        $this->_requiredElements = array();    */ 
    }

    // }}}
    // {{{ score()

    /**
    * method to compute scores - by default a null method, but any
    * instrument with a scoring algorithm to implement can override
    * it.
    *
    * @return void
    * @access public
    * @abstract
    */
    function score() {
        $config = NDB_Config::singleton();
        $base = $config->getSetting('base');
        $scorer = $base . "project/instruments/" . $this->testName . ".score";
        if(file_exists($scorer)) {
            exec($scorer . " " . escapeshellarg($this->getCommentID()), $output, $retVal);
            if($retVal != 0) {
                print "Error running scoring algorithm";
            }
        }
    }

    // }}}
    // {{{ display()

    /**
    * method to display the form - usually not overridden as it
    * includes all the base code that any instrument will require.
    *
    * @return void
    * @access public
    */
    function display()
    {
        // ALWAYS INCLUDE THESE!
        $this->addHidden('candID', $_REQUEST["candID"]);
        $this->addHidden('sessionID', $_REQUEST["sessionID"]);
        $this->addHidden('commentID', $this->getCommentID());
        $this->addHidden('test_name', $this->testName);
        $this->addHidden('page', $this->page);
        $this->addHidden('subtest', $this->page);
        
        if(!$this->form->isFrozen()) {
            $buttons[] = $this->form->createElement('submit', 'fire_away', 'Save Data', 'class=button');
            //$buttons[] = $this->form->createElement('reset', null, 'Reset');
            $this->addGroup($buttons, null, null, "&nbsp;");
        }
        
 
        // get saved data to pre-populate form

        $db =& Database::singleton();
        if($this->preview !== true) {
            $defaults = $db->pselect("SELECT * FROM $this->table WHERE CommentID=:CID", array('CID' => $this->getCommentID()));
            if($this->isError($defaults)) {
                return $this->raiseError('Could not get default values for form');
            }
            // set the defaults (call private method _setDefaultsArray
            // which could be overridden if necessary)
            $defaults = $this->_setDefaultsArray($defaults[0]);

            // merge in the localDefaults property so that simple
            // additions to the defaults array no longer requires
            // overriding the _setDefaultsArray method
            $defaults = array_merge($defaults, $this->localDefaults);
        } else {
            $defaults = $this->localDefaults;
        }
        $this->form->setDefaults($defaults);

        
        // display the HTML_Quickform object
        // return $this->form->toHTML();
        
        $renderer = new HTML_QuickForm_Renderer_Default();
        $renderer->setFormTemplate("<form{attributes}><table class=\"instrument\">{content}</table></form>");
        $renderer->setElementTemplate("<tr><td class=\"lab\"><!-- BEGIN required --><span style=\"color: #ff0000\">*</span><!-- END required -->{label}</td><td class=\"ele\"><!-- BEGIN error --><span style=\"color: #ff0000\">{error}</span><br /><!-- END error -->{element}</td></tr>");
        $renderer->setElementTemplate("<tr><td class=\"lab\"><i>{label}</i></td><td class=\"ele\">\t<i>{element}</i></td></tr>", "static");
        $renderer->setHeaderTemplate("<tr><th colspan=\"2\"><br><b>{header}</b></th></tr>");
        $this->form->accept($renderer);
        return $renderer->toHtml();
    }
    
    // }}}
    // {{{ _setDefaultsArray()
    
    /**
     * accepts an array usable as input to HTML_Quickform::setDefaults()
     * and does any necessary preprocessing on that array.
     *
     * @param array $defaults    the array to be passed on to
     * HTML_Quickform::setDefaults()
     * @return array             the processed array ready for setDefaults()
     * @access private
     */
    function _setDefaultsArray($defaults)
    {
        //Convert date/time fields into quickform date/timestamps
        if(empty($this->dateTimeFields)){
            $this->dateTimeFields=array("Date_taken");
        }
        foreach($this->dateTimeFields as $field){
            $defaults[$field]=$this->_getQuickformDate($defaults[$field]);
        }
        
        // Windows don't apply to probands, but otherwise if it's outside of the window highlight
        // it as an error
        if($defaults['Window_Difference'] != 0 && strrpos($this->testName, '_proband') === FALSE) {
            $defaults['Candidate_Age'] = '<span class="error">' . $defaults['Candidate_Age'] . '</span>'; //if($defaults['Window_Difference'] != 0) {
        }
        //Convert select multiple elements into a quickform array
        if(!empty($this->_selectMultipleElements)){
            foreach($this->_selectMultipleElements AS $elname){
                if(stristr($defaults[$elname], "{@}")){
                    $defaults[$elname]=explode("{@}",$defaults[$elname]);
                }
            }
        }
        
        // return the defaults array ready for $form->setDefaults
        return $defaults;
    }

    // }}}
    // {{{ save()
    
    /**
     * attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return void
     * @access public
     */
    function save()
    {
        if($this->form->validate()) {
            $this->form->process(array(&$this, '_saveValues'), true);
            $scoreResult = $this->score();
            
            // determine the data entry completion status, and store that in the database
            $dataEntryCompletionStatus = $this->_determineDataEntryCompletionStatus();
            if(Utility::isErrorX($dataEntryCompletionStatus)) print "Could not determine DECS: ".$dataEntryCompletionStatus->getMessage()."<br>\n";
            $success = $this->_setDataEntryCompletionStatus($dataEntryCompletionStatus);
            if(Utility::isErrorX($success)) print "Could not set DECS: ".$success->getMessage()."<br>\n";
            
        } else {
            $submittedData = $this->form->getSubmitValues();
            
           
            if(count($submittedData)) {
                
                // the form WAS submitted but validate() failed...
                // main error message
                 print "<p><font color='red'>A data entry error has been detected so this data <b>WAS NOT SAVED</b></font></p>\n";
                 //print all the field error messages in one block
                foreach(array_keys($submittedData) AS $key) {
                    $error = $this->form->getElementError($key);
                    if(!empty($error)) {
                        $element = $this->form->getElement($key);
                        if(method_exists($element, "getLabel")){
                            print "<font color='red'>".$element->getLabel().": $error</font><br>\n";
                        }
                    }
                }
            }
        }
        
        if($this->isError($scoreResult)) {
            // since this error is not capture in main.php - temp display
            print "<font color='red'>Encountered error while scoring the instrument:" . $scoreResult->getMessage() . "</font><br>\n";
            print "This error will not prevent data from being saved, unless the data entry error is also displayed.<BR>Please inform DCC of this error<br>\n";
            return PEAR::raiseError($scoreResult->getMessage());
        }
    }
    
    function _saveCandidateAge(&$values) {
        if(!empty($values['Date_taken'])) {
            $DB = Database::singleton();
            $age = $this->getCandidateAge($values['Date_taken']);
            if(!Utility::isErrorX($age)) {
                $agedays = $age['year']*365 + $age['mon']*30 + $age['day'];
                $agemonths = $age['year']*12 + $age['mon'] + ($age['day']/30);
                // 1 Decimal.
                $agemonths = (round($agemonths*10) / 10.0);
                $config = NDB_Config::singleton();

                $timepoint = TimePoint::singleton($this->getSessionID());
                $windowDifferenceType = $timepoint->getWindowDifferenceType();

                if(!empty($age)) {
                    $query_params = array('TN' => $this->testName, 'CID' => $this->getCommentID());
                    $validage = $DB->pselectOne("SELECT MAX($agedays BETWEEN AgeMinDays AND AgeMaxDays) FROM test_battery tb JOIN flag f USING(Test_name) JOIN session s ON (s.ID=f.SessionID)  WHERE tb.Active='Y' and tb.Test_name=:TN AND tb.SubprojectID=s.SubprojectID and f.CommentID=:CID", $querY_params);
                    $values['Candidate_Age'] = $agemonths;
                    $values['Window_Difference'] = 0;

                    // Age isn't valid, so find out how far out it is

                    if($validage == 0) {
                        $Windows = $DB->pselect("SELECT AgeMinDays, AgeMaxDays FROM test_battery tb 
                            JOIN flag f USING(Test_name) 
                            JOIN session s ON (s.ID=f.SessionID)  
                            WHERE tb.Active='Y' and tb.Test_name=:TN 
                            AND tb.SubprojectID=s.SubprojectID and f.CommentID=:CID", $query_params);
                        foreach ($Windows as $window) {
                            if($agedays < $window['AgeMinDays']) {
                                $delta = $window['AgeMinDays'] - $agedays;
                                if(abs($delta) < abs($values['Window_Difference']) || $values['Window_Difference'] == 0) {
                                    $values['Window_Difference'] = 0-abs($delta);
                                }
                                if($agedays > $window['AgeMaxDays']) {
                                    $delta = $agedays - $window['AgeMaxDays'];
                                    if(abs($delta) < abs($values['Window_Difference']) || $values['Window_Difference'] == 0) {
                                        $values['Window_Difference'] = abs($delta);
                                    }
                                }
                            }
                        }
                    } elseif($windowDifferenceType === 'permitted' || $windowDifferenceType === 'optimal') {
                        if($windowDifferenceType === 'permitted') {
                            $window = $DB->pselectRow('SELECT WindowMinDays as Min, WindowMaxDays as Max FROM Visit_Windows WHERE UPPER(Visit_label)=UPPER(:VL)', array('VL' => $timepoint->getVisitLabel()));
                        } elseif($windowDifferenceType === 'optimal') {
                            $window = $DB->pselectRow('SELECT OptimumMinDays as Min, OptimumMaxDays as Max FROM Visit_Windows WHERE UPPER(Visit_label)=UPPER(:VL)', array('VL' => $timepoint->getVisitLabel()));
                        }

                        if($agedays < $window['Min'] ) {
                            $values['Window_Difference'] = $window['Min'] - $agedays;
                        }
                        if($agedays > $window['Max'] ) {
                            $values['Window_Difference'] = $agedays - $window['Max'];
                        }
                    } else {
                        // disabled, do nothing
                    }
                }
            }
        }
    }
    function _nullStatus(&$values) {
        //Remove the values of all fields who have had statuses assigned
        foreach(array_keys($values) AS $field){
            if(substr($field, -7)=="_status"){
                if(!empty($values[$field])){
                    $baseField=substr($field,0,(strlen($field)-7));
                    $values[$baseField]="";
                }
            }
        }
    }
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
        //Convet date/timestamps into database format
        if(empty($this->dateTimeFields)){
            $this->dateTimeFields=array("Date_taken");
        }
        

        //Convert date/time fields into database dates/times
        if (is_array($this->dateTimeFields) && count($this->dateTimeFields) > 0) {
            foreach($this->dateTimeFields as $field){
                if(isset($values[$field])) {  //Stops it from wiping dates already saved on other pages.
                    $values[$field]=$this->_getDatabaseDate($values[$field]);
                }
            }
        }
        
        //if(strrpos($this->testName, "_proband") === FALSE) {
            $this->_saveCandidateAge($values);
        //}
        //Convert select multiple elements into database storable values
        if(!empty($this->_selectMultipleElements)){
            foreach($this->_selectMultipleElements AS $elname){
                if(isset($values[$elname]) && is_array($values[$elname])){
                    $values[$elname]=implode("{@}",$values[$elname]);
                }
            }
        }
        
        //XIN specific functionality
        if($this->formType=="XIN"){
            $this->_nullStatus($values);
        }
        
        // do not alter this when overwriting the method
        unset($values['candID'], $values['sessionID'], $values['commentID'], $values['test_name'], $values['page'], $values['fire_away'], $values['subtest']);
        $this->_save($values);
    }
    
    // }}}
    // {{{ _save()
    
    /**
     * uses the array generated by _saveValues() and runs the
     * Database::update() call.
     *
     * @param array $values       the array generated by _saveValues()
     * @return void
     * @access private
     */
    function _save($values)
    {
        // clear any fields starting with __
        foreach(array_keys($values) AS $key) {
            if(strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }
        $db =& Database::singleton();
        $result = $db->update($this->table, $values, array('CommentID'=>$this->getCommentID()));
        if($this->isError($result)) {
            print "Error saving data: ".$result->getMessage()."<br>\n";
            return $this->raiseError('Could not save to database' . $result->getMessage());
        }
    }
    
    // }}}
    // {{{ _addMetadataFields()
    
    /**
     * adds metadata fields (such as Examiner and Date_taken) to the
     * current form
     *
     * @return void
     * @access private
     */
    function _addMetadataFields()
    {
        $config =& NDB_Config::singleton();
        $dateOptions = array(
                             'language' => 'en',
                             'format'   => 'YMd',
                             'minYear'  => $config->getSetting('startYear'),
                             'maxYear'  => $config->getSetting('endYear'),
                             'addEmptyOption' => true,
                             'emptyOptionValue' => null
                             );
        $this->dateOptions = $dateOptions;

        $this->addBasicDate('Date_taken', 'Date of Administration', $dateOptions);
        
        if(strrpos($this->testName, '_proband') === FALSE) {
            $this->addScoreColumn('Candidate_Age', 'Candidate Age (Months)', 'Please enter date of administration and press Save');
            $this->addScoreColumn('Window_Difference', 'Window Difference (+/- Days)', 'Please enter date of administration and press Save');
        } else {
            $this->addScoreColumn('Candidate_Age', 'Proband Age (Months)', 'Please enter date of administration and press Save');
            //$this->addScoreColumn('Window_Difference', 'Window Difference (+/- Days)', 'Please enter date of administration and press Save');
        }
        $examiners = $this->_getExaminerNames();
        $this->addSelect('Examiner', 'Examiner', $examiners);
        
        //$this->form->addElement('text', 'Examiner', 'Examiner');
        
        $this->addGroupRule('Date_taken', 'Date of Administration is required', 'required');
        
        $this->form->registerRule('checkdate', 'callback', '_checkDateTaken');
        $this->form->registerRule('checkdatefuture', 'callback', '_checkDateTakenFuture');
        $this->form->addRule('Date_taken', 'Date of Administration is invalid', 'checkdate');
        $this->form->addRule('Date_taken', 'Date of Administration is in the future', 'checkdatefuture');
        
        $this->addRule('Examiner', 'Examiner is required', 'required');
    }
    
    // }}}
    //
    // Process the Config file. This results in:
    //     1. $CertificationEnabled being true or false,
    //     2. $CertificationProjects being a list of projects which
    //     use ceritification and,
    //     3. $CertificationInstruments being a list of instruments
    //     that use certification.
    // This is put in a different function so that instruments that
    // override getExaminerNames() can still easily get the config
    // settings and don't need to parse the config file themselves.
    function _getCertificationConfig() {
        $config =& NDB_Config::singleton();
        $CertificationConfig = $config->getSetting("Certification");
        $CertificationEnabled = $CertificationConfig['EnableCertification'];
        if($CertificationEnabled) {
            $CertificationProjects = array();
            foreach($CertificationConfig['CertificationProjects'] as $key => $projID) {
                $CertificationProjects[] = $projID;
            }
            $CertificationInstruments = array();
            foreach(Utility::toArray($CertificationConfig['CertificationInstruments']) as $instrument) {
                foreach(Utility::toArray($instrument['test']) as $test) {
                    $CertificationInstruments[] = $test['@']['value'];
                }
            }
        }
        return array($CertificationEnabled, $CertificationProjects, $CertificationInstruments);
    }


    // 
    // {{{
    /**
     * gets the list of examiners for the current instrument site
     *
     * @return array
     * @access private
     */
    function _getExaminerNames()
    {
        $db =& Database::singleton();

        $centerID = $db->pselectOne("SELECT session.CenterID FROM session, flag WHERE session.ID=flag.SessionID and flag.CommentID=:cmnt_id", array('cmnt_id'=>$this->getCommentID()));

        //get examiner certifications for profiles part of IBIS2
        $project = $db->pselectOne("SELECT ProjectID from candidate where CandID =:cnd_id", array('cnd_id'=>$_REQUEST["candID"]));

        list($CertificationEnabled, $CertificationProjects, $CertificationInstruments) = $this->_getCertificationConfig();
        if ($CertificationEnabled && in_array($project, $CertificationProjects)
            && in_array($this->testName, $CertificationInstruments)) {
            $test_id = $db->pselectOne("SELECT ID from test_names where Test_name =:tst_name", array('tst_name'=>$this->testName));
            $results = $db->pselect("SELECT certification.examinerID, full_name FROM certification JOIN examiners ON certification.examinerID = examiners.examinerID WHERE testID =:tid AND pass =:cert_id AND centerID =:cid ORDER BY full_name",array('tid'=>$test_id,'cert_id'=>'certified','cid'=>$centerID));
            if($db->isError($results)) {
                return $this->raiseError("Could not get examiner names: ".$results->getMessage());
            }
        } else {
            $results = $db->pselect("SELECT examinerID, full_name FROM examiners WHERE centerID=:centID ORDER BY full_name", array('centID' => $centerID));
            if($db->isError($results)) {
                return $this->raiseError("Could not get examiner names: ".$results->getMessage());
            }
        }
        
        $examiners = array(''=>'');
        if(is_array($results) && !empty($results)) {
            foreach($results AS $row) {
                $examiners[$row['examinerID']] = $row['full_name'];
            }
        }
        return $examiners;
    }

    // }}}
    // {{{ getFullName()
    
    /**
     * looks up the full name for the current instrument
     *
     * @return string        the full name of the instrument
     * @access public
     */
    function getFullName()
    {
        $db =& Database::singleton();

        $success = $db->pselectOne("SELECT Full_name FROM test_names WHERE Test_name=:TN", array('TN' => $this->testName));
        return $success;
    }

    // }}}
    // {{{ getCommentID()
    
    /**
     * gets the current object instance CommentID
     *
     * @return string          the CommentID
     * @access public
     */
    function getCommentID()
    {
        return $this->commentID;
    }
    
    // }}}
    // {{{ freeze()
    
    /**
     * freezes the current form
     *
     * @return void
     * @access public
     */
    function freeze()
    {
        $this->form->freeze();
    }
    
    // }}}
    // {{{ getDateOfAdministration()
    
    /**
     * gets the date of administration of an instrument instance - caches to reduce DB hits
     *
     * @return mixed    $dateOfAdministration the date of administration from the DB, in the format "YYYY-MM-DD"
     * @access private
     */
    function getDateOfAdministration()
    {
        $db =& Database::singleton();
        $doa = $db->pselectOne("SELECT Date_taken FROM $this->table WHERE CommentID=:CID", array('CID' => $this->getCommentID()));
        if($this->isError($doa)) {
            return $this->raiseError("Could not get date of administration from $this->table");
        } else {
            $this->dateOfAdministration = $doa;
        }
        
        return $this->dateOfAdministration;
    }
    
    // }}}
    // {{{ getSubtestList()

    /**
     * gets a list of subtests of the current instrument
     *
     * @return array
     * @throws PEAR::Error
     */
    function getSubtestList()
    {
        // get a database connection
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) return $db;
        
        $query = "SELECT Subtest_name AS Name, Description FROM instrument_subtests WHERE Test_name=:TN ORDER BY Order_number";
        $results = $db->pselect($query, array('TN' => $this->testName));
        if(Utility::isErrorX($results)) return $results;
        
        return $results;
    }
    
    // }}}
    // {{{ setRequired()
    
    /**
     * marks an element in the quickform object as being required (for
     * use with the requiredIf rule)
     *
     * @params string   $elementName     the element to add to the required list
     * @return void
     */
    function setRequired($elementName)
    {
        if(!in_array($elementName, $this->form->_required)) {
            $this->form->_required[] = $elementName;
        }
    }
    
    // }}}
    // {{{ _getDatabaseDate()
    
    /**
     * Convert a quickform date or timestamp into a database acceptable (and storable) date or time
     *
     * @param array    $formDateValue  the quickform date/timestamp array
     * @return  string  $databaseValue   the date or timestamp from the database
     * @access private
     */
    function _getDatabaseDate($formDateValue){
        if(!empty($formDateValue)){
            // check if it's already formatted correctly
            if(is_string($formDateValue) && preg_match("/^[\d]{4}-[\d]{2}-[\d]{2}$/", $formDateValue)) {
                return $formDateValue;
            }
            if(count($formDateValue)==2){
                $databaseValue = "$formDateValue[H]:$formDateValue[i]";  //handle time (HH:MM:SS)
            } else {
                $databaseValue = "$formDateValue[Y]-$formDateValue[M]-$formDateValue[d]";  //handle date (YYYY/MM/DD)
            }
        }
        return $databaseValue;
    }
    
    // }}}
    // {{{ _getQuickformDate()
    
    /**
     * Convert a database date or timestamp into a QuickForm acceptable date or time
     *
     * @param string  $databaseValue        the date or timestamp from the database
     * @return array   $formDateValue       the quickform date/timestamp array
     * @access private
     */
    function _getQuickformDate($databaseValue){
        if(!empty($databaseValue)){
            if(strstr($databaseValue,":")){
                $formDateValue=explode(":",$databaseValue);
                $formDateValue=array("H"=>$formDateValue[0],"i"=>$formDateValue[1]);  //handle time
            } else {
                // split mysql Date_taken field into array
                $formDateValue = explode('-', $databaseValue);
                $formDateValue = array('Y'=>$formDateValue[0], 'M'=>$formDateValue[1], 'd'=>$formDateValue[2]);  //handle date
            }
        }
        return $formDateValue;
    }
    
    // }}}
    // {{{ XINValidate()
    
    function XINValidate($elements){
        $this->XINDebug=false;  //Turn this on to see rules debuggin output

        $errors=array();
        foreach($elements AS $elname=>$elvalue) {
            //If the element is a group (and thus elvalue is an array) trigger the Null Value default rule if ANY of the values in the group are empty.
            $flag=true;
            if(is_array($elvalue)) {
                foreach($elvalue AS $val){
                    if ($val==""){
                        $flag=false;
                    }
                }
            }

            // Run any rules that are dependent on the value of the current question, ie if XINRegister was called as
            // $this->XINRegisterRule("q1", "q1{@}<={@}3", "Must be less than or equal to 3")
            // These differ from 'required' rules in that they're run even if the value isn't empty
            // Currently, this only supports simple, one value comparisons (though XINRegister can be called multiple
            // times and each needs to be enforced independently), because the logic in XINRunElementRules is confusing
            // and modifying it could potentially break existing XINRules.
            // DINRunElementRules only runs a single rule, and returns false if it's violated. It's much simpler than 
            // XINRules but should be expanded later to support more complex logic.
            // - Dave
            if($this->InstrumentType === 'LINST') {
                if(!empty($this->XINRules[$elname])) {
                    $registered_rules = $this->XINRules[$elname];
                    if($this->XINDebug){echo "<p><b>$elname</b><br> ";} //debugging code
                    foreach($registered_rules as $registered) {

                        $rules = $registered['rules'];

                        foreach($rules as $rule) {
                            //If this is an OR rule using two different controllers explode it at the pipe.  ex: q_1{@}=={@}yes|q_2{@}=={@}yes
                            if(stristr(substr($rule, strpos($rule,"|")),"{@}")){
                                $rules_array=explode("|",$rule);
                            } else {  //Otherwise its a regular rule.  ex: q_1{@}=={@}yes
                                $rules_array[]=$rule;
                            }
                            foreach($rules_array as $rule) {
                                $rule_array = explode("{@}", $rule);
                                if($rule_array[0] == $elname) {
                                    $result=$this->DINRunElementRules($elname, $elements, $registered);
                                    if($result == false){
                                        $el=$registered['group']!="" ? $registered['group'] : $elname;
                                        $errors[$el]=$registered['message'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            //If the answer is empty (or its a group and one of answers in the group is empty) then run the rules
            if($elvalue=="" || $flag==false){
                if($this->XINDebug){echo "<p><b>$elname</b><br> ";} //debugging code
                if(!empty($this->XINRules[$elname])){
                    if($this->InstrumentType === 'LINST') {
                        $registered_rules = $this->XINRules[$elname];
                        foreach($registered_rules as $registered_rule) {
                            $result=$this->XINRunElementRules($elname, $elements, $registered_rule);
                            if(is_array($result)) {
                                $errors+=$result;
                            }
                        }
                    } else {
                        $result=$this->XINRunElementRules($elname, $elements, $this->XINRules[$elname]);
                        if(is_array($result)){
                            $errors+=$result;
                        }
                    }
                } else if(substr($elname,-7)!="_status" && !in_array($elname,array("page","subtest"))){
                    $errors[$elname]="Required.";
                    if($this->XINDebug){echo "Required by default";}
                } else {
                    if($this->XINDebug){echo "Status' not required by default";}
                }
            }
        }
        if(!empty($errors)){
            return $errors;
        }
        return true;
    }
    
    // Run registered rules for $elname
    // Returns true if the element passes, false if the rule fails
    function DINRunElementRules($elname, $elements, $registered) {
        foreach($registered['rules'] AS $rule){  //Loop through the assigned rules (which is the array of formatted statements passed in XINRegisterRule)
            $split = explode('{@}', $rule);
            $userval = $elements[$elname];
            $operator = $split[1];
            $comparevalue = $split[2];
            // Special case for if the rule was registered as "q{@}=={@}NEVER_REQUIRED"
            if($comparevalue == 'NEVER_REQUIRED' && $operator == '==') {
                return true;
            }
            $compareFunction = create_function('$a, $b', "return \$a $operator \$b;"); //(\$a $operator \$b);");

            if(!($compareFunction($comparevalue, $userval)) ) {
                return false;
            }
        }
        // Nothing that was compared failed
        return true;
    }
    // }}}
    // {{{ XINRegisterRule()

    /**
    * Attaches a user defined rule (conditions) to a form element (grouped or not).
    *
    * @param string $elname Name of element registering the rule
    * @param array  $rules  Array of rules to apply in an AND fashion.  Rules are written in rose ({@}) format (ie. array('q_8{@}=={@}1_yes','q_8_a_status{@}=={@}').  ORs may be written within the same array value.
    * @param string $message    Message to print upon rule violation
    * @param string $group  Empty if a non-grouped element is registering the rule.  Otherwise, name of the group registering the rule.    
    */
    function XINRegisterRule($elname, $rules, $message="", $group=""){
        // I'm not sure if these are logically the same. I think they should be, but
        // there was a bug introduced by the LINST changes to XINRules to old instruments
        // so I'm making sure that the old code is followed exactly with this if block.
        // After everything's working, review this to see if we can get rid of one of
        // the if statement and use the same logic for "old" instruments and "new"
        // instruments
        //  -- Dave
        if($this->InstrumentType === 'LINST') {
            if(!is_array($rules)){
                $rules_array[]=$rules;
            } else {
                $rules_array=$rules;
            }
            $rule = array ('message' => $message, 'group' => $group, 'rules' => array());

            foreach($rules_array AS $rule_cmd){
                $rule['rules'][]=$rule_cmd;
            }
            $this->XINRules[$elname][] = $rule;
            return true;
        } else {
            if(!is_array($rules)){
                $rules_array[]=$rules;
            } else {
                $rules_array=$rules;
            }
            $this->XINRules[$elname]['message']=$message;
            $this->XINRules[$elname]['group']=$group;

            foreach($rules_array AS $rule){
                $this->XINRules[$elname]['rules'][]=$rule;
            }
            return true;
        }
    }

    // }}}
    // {{{ XINRunElementRules()
    
    //Run the rules and see if the required flag need be raised.  
    //Assumes all conditions are met and then checks each of them, any condition not met will invalidate the rule, 
    //meaning the answer is valid.
    //DONT TOUCH THIS, EVER.
    function XINRunElementRules($elname, $elements, $rules){
        $is_required=true; //Conditions for the rule to be true, and thus the element to be required.
        foreach($rules['rules'] AS $rule){  //Loop through the assigned rules (which is the array of formatted statements passed in XINRegisterRule)
            //If this is an OR rule using two different controllers explode it at the pipe.  ex: q_1{@}=={@}yes|q_2{@}=={@}yes
            if(stristr(substr($rule, strpos($rule,"|")),"{@}")){
                $rules_array=explode("|",$rule);
            } else {  //Otherwise its a regular rule.  ex: q_1{@}=={@}yes
                $rules_array[]=$rule;
            }
            
            //Loop through the rules (will only be one rule if this is not an OR)
            $or_conditions=array();
            for($i=0;$i<count($rules_array);$i++){ 
                $rule=explode("{@}",$rules_array[$i]);
                //Some rules compare against multiple values, handle this here.
                if(stristr($rule[2],"|")){  //ex: q_1{@}=={@}yes|no
                    $values=explode("|",$rule[2]);
                } else {  //ex: q_1{@}=={@}yes
                    $values=array($rule[2]);
                }
                //Test the condition
                if($this->XINDebug){echo "$rule[0] ";} //debugging code
                
                //Handle select multiples who's controllre values are arrays.
                
                //explicitly cast the controller value as an array
                if(!is_array($elements[$rule[0]])){ 
                    $elements[$rule[0]]=array($elements[$rule[0]]);
                }
                //Foreach controller value run the rule.
                $or_conditions=false;
                foreach($elements[$rule[0]] as $controller_value){
                    if($this->XINRunRuleFunction($controller_value, $values, $rule[1])){
                        $or_conditions=true; //If any of the OR rules is true
                    }
                }
            }
            //If NONE of the or_conditions were true the field is NOT required.
            if($or_conditions==false){
                $is_required=false;
            }
        }
        //If all of the conditions were true then print the error message
        if($is_required==true){
            $el=$rules['group']!="" ? $rules['group'] : $elname;
            $errors[$el]=$rules['message'];
        }
        return $errors;
    }
    
    function XINRunRuleFunction($controller, $values, $operator){
        $is_required=true;
        //Loop through the conditions to test against (for most rules it will only be one value)
        //If all of the conditions are true (ie: all conditions are met to pop a required rule)
        $valFlag=array();
        foreach($values AS $value){
            $compareFunction = create_function('$a, $b', "return (\$a $operator \$b);");
            if($this->XINDebug){echo "'$controller' $operator '$value'<br>";} //debugging code
            if(!$compareFunction($controller, $value)) {
                $valFlag[]=false;  //IF one of the conditions is not met then this rule does not need to be run.
            }
        }
        //For conditions
        if(count($valFlag)==count($values)){
            $is_required=false;
        }
        return $is_required;
    }

    // }}}
    // {{{ getFieldValue()
  
     //Get a the value of $field from the instrument table.  Used specifically by electronic instruments to check if file is already uploaded.
    function getFieldValue($field)
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) return PEAR::raiseError("Could not connect to database: ".$DB->getMessage()."<br>\n");

        $query = "SELECT $field FROM $this->table WHERE CommentID = :CID";
        $fieldValue = $DB->pselectOne($query, array('CID' => $this->getCommentID()));

        if (!empty($fieldValue)) {
            return $fieldValue;
        }
        return false;
    }

    // }}}
    // {{{ getSessionID()

    /**
     * gets the sessionID for the timepoint to which this instrument pertains
     * @return int  the sessionID
     * @access public
     */
    function getSessionID()
    {
        $db =& Database::singleton();
        $query = "SELECT SessionID FROM flag WHERE CommentID = :CID";
        $fieldValue = $db->pselectOne($query, array('CID' => $this->getCommentID()));
        
        if (!empty($fieldValue) && !$db->isError($fieldValue)) {
            return $fieldValue;
        }
        return false;
    }

    // }}}
    // {{{ _determineDataEntryCompletionStatus()

    /**
    * determines what the data entry status flag should be set to
    * @return string   either 'Complete' or 'Incomplete'
    * @access private
    */
    function _determineDataEntryCompletionStatus()
    {
        // don't bother checking anything if the required elements array is empty
        if(empty($this->_requiredElements)) return 'Complete';

        $db =& Database::singleton();
        if(Utility::isErrorX($db)) return PEAR::raiseError("Could not connect to database: ".$db->getMessage()."<br>\n");

        $query = "SELECT ".join(',', $this->_requiredElements)." FROM $this->table WHERE CommentID=:CID";
        $dataFields = $db->pselectRow($query, array('CID' => $this->getCommentID()));
        if(Utility::isErrorX($success)) return PEAR::raiseError("Could not select required elements from database: ".$success->getMessage()."<br>\n");
        foreach($dataFields as $field) {
            // this shouldn't be just empty() b/c 0 is a valid value for some required fields
            if(is_null($field) || $field === "") return 'Incomplete';
        }
        return 'Complete';
    }

    // }}}
    // {{{ getDataEntryCompletionStatus()

    /**
    * gets the data entry completion status
    * @return string   either 'Complete' or 'Incomplete'
    * @access public
    */
    function getDataEntryCompletionStatus()
    {
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) return PEAR::raiseError("Could not connect to database: ".$db->getMessage()."<br>\n");

        $query = "SELECT Data_entry_completion_status FROM $this->table WHERE CommentID=:CID";
        return $db->pselectOne($query, array('CID' => $this->getCommentID()));
    }

    // }}}
    // {{{ _setDataEntryCompletionStatus()

    /**
    * sets the data entry completion status
    * @params string   $status     the status - either 'Complete' or 'Incomplete'
    * @access private
    * @return void
    */
    function _setDataEntryCompletionStatus($status)
    {
        if(!in_array($status, array('Complete', 'Incomplete'))) return PEAR::raiseError("Invalid status passed to _setDataEntryCompletionStatus - '$status' should have been either 'Complete' or 'Incomplete'<br>\n");

        $db =& Database::singleton();
        if(Utility::isErrorX($db)) return PEAR::raiseError("Could not connect to database: ".$db->getMessage()."<br>\n");

        $success = $db->update($this->table,
        array('Data_entry_completion_status'=>$status),
        array('CommentID'=>$this->getCommentID())
        );

        if(Utility::isErrorX($success)) return PEAR::raiseError("Could not update status: ".$success->getMessage()."<br>\n");
    }
    // }}}

    /**
    * Wrapper to auto-create a simple Yes, No, Null, Not Answered type of question
    * @param    string    $field    The database field in which the response will be stored
    * @param    string    $label    The question text to display
    * @param    array    $rules    {@} delimited rules
    * @param    string    $rule_message    rule message to display
    */
    function addYesNoElement($field, $label, $rules=array(), $rule_message='This field is required.'){
        $this->addSelect($field, $label, array(NULL=>'', 'yes'=>'Yes', 'no'=>'No','not_answered'=>'Not Answered'));
        if (!empty($rules)) {
            $this->XINRegisterRule($field, $rules, $rule_message);        
        }
    }
    
    /**
    * Wrapper to create a text field with an accompanying status field.
    * @param    string    $field    The database field in which the response will be stored
    * @param    string    $label    The question text to display
    * @param    array    $rules    rules with values and comparisson operators {@} seperated.  Example: array('q_40{@}=={@}1_yes','q_40_b{@}=={@}1_yes')
    * @param    string    $rule_message    rule message to display
    * @param    array   $refusals   options in the refusal select (ie. Refusal, Unknown, Not Answered).
    */
    function addTextElement($field, $label, $rules=array(), $rule_message='This field is required.', $refusals=array(''=>'', 'not_answered'=>'Not Answered')){
        $group[]=&$this->createText($field);
        $group[]=&$this->createSelect($field."_status", "", $refusals);
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array=array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }
     
    /**
     * Wrapper to create a text area field for questions that require Refused and Don't know options
     */
     
    function addTextAreaElementRD($field, $label, $rules=array(), $rule_message='You must specify or select from the drop-down'){
        $group[]=&$this->form->createElement("textarea", $field, null, array('cols'=>25, 'rows'=>4));
        $group[]=&$this->createSelect($field."_status", "", array(NULL=>'',"88_refused"=>"88 Refused", "99_do_not_know"=>"99 Do not know", 'not_answered'=>'Not Answered'));
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array=array_merge(array($field.'_status{@}=={@}'),$rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }
    
    /**
    * Wrapper to create a text area field, with an accompanying status field.
    * @param    string    $field    The database field in which the response will be stored
    * @param    string    $label    The question text to display
    * @param    array    $rules    {@} delimited rules
    * @param    string    $rule_message    rule message to display upon rule violation
    */
    

    function addTextAreaElement($field, $label, $rules=array(), $rule_message='This field is required.'){
        $group[]=&$this->form->createElement("textarea", $field, null, array('cols'=>25, 'rows'=>4));
        $group[]=&$this->createSelect($field."_status", "", array(NULL=>'', 'not_answered'=>'Not Answered'));
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array=array_merge(array($field.'_status{@}=={@}'),$rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }
    
    /**
    * Wrapper to create an Hour/Minute field, with an accompanying status field.
    * @param     string    $field    Name given to the HTML QuickForm Element being created
    * @param     string    $label    The question text to display
    * @param     array    $rules    Additional rules to apply to the element being added,{@} delimited
    * @param     string    $rule_message    message to display upon rule violation.
    */
    function addHourMinElement($field, $label, $rules=array(), $rule_message="You are required to select a status if you want to leave this time blank.") {
        $group[]=&$this->createDate($field, null, array('language'=>'en', 'format'=>'H:i', 'addEmptyOption'=>true));
        $group[]=&$this->createSelect($field . "_status", "", array(NULL=>'', "dnk"=>"DNK", "refusal"=>"Refusal", 'not_answered'=>'Not Answered'));
        $this->addGroup($group, $field . "_group", $label, null, false);
        $this->XINRegisterRule($field, array_merge($rules, array($field . '_status{@}=={@}')), $rule_message, $field . '_group');
        unset($group);
    }

    /**
    * Adds a date group with a status box and appropriate rule
    * Note: $this->dateOptions must be defined by the subclass calling this wrapper function
    * @param $name   Name prepended to the HTMLQuickform element
    * @param $label Element label
    */
    function addDateElement($name, $label, $options = null){
        if($options === null) {
            $options = $this->dateOptions;
        }
        $group [] = $this->createDate($name . "_date", null, $this->dateOptions);
        $this->dateTimeFields[] = $name . "_date"; //add to array of dates and times.
        $group [] = $this->createSelect($name . "_date_status", null, array(NULL=>"", 'not_answered'=>"Not Answered"));
        $this->addGroup($group, $name . "_date_group", $label, $this->_GUIDelimiter, FALSE);
        unset($group);
        $this->XINRegisterRule($name . "_date", array($name . "_date_status{@}=={@}"), "A Date, or Not Answered is required.", $name . "_date_group");
    }

    /** 
    * Wrapper with a user-created date group, a status box and appropriate rule
    */
    function addCustomDateElement($name, $label, $dateArray){
        $group [] = $this->createDate($name . "_date", null, $dateArray);
        $this->dateTimeFields[] = $name . "_date"; //add to array of dates and times.
        $group [] = $this->createSelect($name . "_date_status", null, array(NULL=>"", '88_refused'=>"88 Refused", '99_do_not_know'=>"99 Do not know", 'not_answered'=>"Not Answered"));
        $this->addGroup($group, $name . "_date_group", $label, $this->_GUIDelimiter, FALSE);
        unset($group);
        $this->XINRegisterRule($name . "_date", array($name . "_date_status{@}=={@}"), "You must specify or select from the drop-down", $name . "_date_group");
        $this->XINRegisterRule($name . "_date_status", array($name . "_date{@}=={@}"), "You must specify or select from the drop-down", $name . "_date_group");

    }



    /**
    * Wrapper to create a field that only accepts a number, with an accompanying status field.
    * @param    string    $field    The database field in which the response will be stored
    * @param    string    $label    The question text to display
    */
    function addNumericElement($field, $label, $options = null) {
        $group [] = $this->createText($field, $label);
        $group [] = $this->createSelect($field . "_status", null, array(NULL=>"", 'not_answered'=>"Not Answered"));
        $this->addGroup($group, $field . "_group", $label, null, false);
        unset($group);
        $this->addGroupRule($field . "_group", array(array(array("Numbers only, please", 'numeric'))));
        $this->XINRegisterRule($field, array($field . '_status{@}=={@}'), 'This field is required', $field . '_group');
        $status_rule = $field . '_status{@}=={@}';
        if(is_array($options)) {
            if($options['min']) {
                $this->XINRegisterRule($field, array($field . '{@}<{@}' . $options['min']), "Must be greater than $options[min]", $field . '_group');
            }
            if($options['max']) {
                $this->XINRegisterRule($field, array($field . '{@}>{@}' . $options['max']), "Must be less than $options[max]", $field . '_group');
            }

        }
    }

    /**
    * Wrapper to create a field that only accepts a number, for questions that require refused and don't know options
    *
    */
    
    function addNumericElementRD($field, $label) {
        $group [] = $this->createText($field, $label);
        $group [] = $this->createSelect($field . "_status", null, array(NULL=>"", "88_refused"=>"88 Refused", "99_do_not_know"=>"99 Do not know", 'not_answered'=>"Not Answered"));    
        $this->addGroup($group, $field . "_group", $label, null, false);
        unset($group);
        $this->addGroupRule($field . "_group", array(array(array("Numbers only, please", 'numeric'))));
        $this->XINRegisterRule($field, array($field . '_status{@}=={@}'), 'This field is required', $field . '_group');
    }


    /**
    * nulls all scores for the record identified by CommentID
    * @param array list of scoring fields to null
    * @see $this->getCommentID()
    * @return mixed
    * @throws PEAR::error
    */
    function _nullScores($scoreCols)
    {
        $db=& Database::singleton();
        if (Utility::isErrorX($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage()."\n");
        }
        
        // set the scoring cols to NULL
        foreach ($scoreCols as $key => $val) {
            // Some Instruments use an associative array for
            // $scoreCols of the form column => description, others 
            // use a non-associative array. So if the key is numeric,
            // and we need to make sure we use the column name
            if(is_numeric($key))
                $scores[$val]=null; //null array
            else 
                $scores[$key]=null;

        }
        
        // update the scores
        $success = $db->update($this->table,$scores,array('CommentID'=>$this->getCommentID()));
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("DB Error, fail null the scores:\n".$success->getMessage()."\n");
        }
        return;
    }

    // Computes the difference between two instances of an instrument
    function diff($otherInstrument) {
        // Load this instance data
        $thisData = NDB_BVL_Instrument::loadInstanceData($this);
        
        // Load other instance data
        $otherData = NDB_BVL_Instrument::loadInstanceData($otherInstrument);
        
        // Create the return object data structure
        $diff = array();

        // Loop over this instance data
        foreach($thisData AS $key=>$value) {
            if(!in_array($key, $this->_doubleDataEntryDiffIgnoreColumns)) {
                if($otherData[$key] != $value) {
                    $diff[] = array('TableName'=>$this->table, 'ExtraKeyColumn'=>null, 'ExtraKey1'=>' ', 'ExtraKey2'=>' ', 'FieldName'=>$key, 'CommentId1'=>$this->getCommentID(), 'Value1'=>$value, 'CommentId2'=>$otherInstrument->getCommentID(), 'Value2'=>$otherData[$key]);
                }
            }
        }
        
        // Return the diffs
        return $diff;
    }
    
    function loadInstanceData($instrumentInstance) {
        $db =& Database::singleton();
        $defaults = $db->pselect("SELECT * FROM $instrumentInstance->table WHERE CommentID=:CID", 
            array('CID' => $instrumentInstance->getCommentID()));
        if($instrumentInstance->isError($defaults)) {
            return $instrumentInstance->raiseError('Could not get default values for form');
        }
        
        return $defaults[0];
    }

    // The Date_taken can be manually passed in. This is the case when
    // calculating the age while updating the Date_taken in _saveValues, 
    //since we want to use the new value, not the old value
    function getCandidateAge($Date_taken=FALSE) {
        $db =& Database::singleton();
        $CommentID = $this->getCommentID();
        if(strrpos($this->testName, "_proband") !== FALSE) {
            $dates = $db->pselectRow("SELECT i.Date_taken, c.ProbandDoB as DoB FROM $this->testName i JOIN flag f USING (CommentID) JOIN session s ON (f.SessionID=s.ID) JOIN candidate c USING (CandID) WHERE f.CommentID=:CID", array('CID' => $CommentID));
        } else {
            $dates = $db->pselectRow("SELECT i.Date_taken, c.DoB FROM $this->testName i JOIN flag f USING (CommentID) JOIN session s ON (f.SessionID=s.ID) JOIN candidate c USING (CandID) WHERE f.CommentID=:CID", array('CID' => $CommentID));
        }

        if($Date_taken==FALSE) {
            $age = Utility::calculateAge($dates['DoB'], $dates['Date_taken']);
        } else {
            $age = Utility::calculateAge($dates['DoB'], $Date_taken);
        }
        if(!empty($age)) {
            return $age;
        }
        return;
    }

    function clearInstrument() {
        $config = NDB_Config::singleton();
        $dbconfig = $config->getSetting('database');
        $db = Database::singleton();
        $columns = $db->pselect("select COLUMN_NAME FROM information_schema.columns WHERE TABLE_NAME=:table AND TABLE_SCHEMA=:db", array('table' => $this->table, 'db' => $dbconfig['database'] ));
        $values = array();
        foreach ($columns as $row) {
            if($row['COLUMN_NAME'] == 'CommentID' || $row['COLUMN_NAME'] == 'UserID') {
                continue;
            }
            $values[$row['COLUMN_NAME']] = NULL;
        }
        $db->update($this->table, $values, array('CommentID' => $this->commentID));
        $prepQ = $db->prepare("DELETE FROM conflicts_unresolved WHERE (CommentId1=:CID OR CommentId2=:CID)");
        $db->execute($prepQ, array('CID' => $this->commentID));
    }

    function loadInstrumentFile($filename, $base64 = false) {
        if(file_exists($filename) || $base64 === true) {
            $this->InstrumentType = 'LINST';
            $db = Database::singleton();
            $this->dateTimeFields = array("Date_taken");
            $this->form = new HTML_Quickform('test_form');
            $this->formType='XIN';
            $this->form->addFormRule(array(&$this,'XINValidate'));
            $fp = fopen($filename, "r");
            // Add elements is only true if we're parsing the current page, otherwise
            // we don't.. but even on other pages, we need to parse the whole file for
            // table{@} and other meta elements
            $addElements = true;
            if($_REQUEST['subtest']) {
                $currentPage = $_REQUEST['subtest'];
                $addElements = false;
            } else {
                $currentPage = 'top';
                $addElements = true;
            }

            $parsingPage = 'top';

            while(($line = fgets($fp, 4096)) !== false) {
                $pieces = split("{@}", $line);

                $type = $pieces[0];
                if(strpos($pieces[1], "_status") !== FALSE) {
                    continue;
                }
                if($pieces[1] == 'Date_taken' 
                    || $pieces[1] == "Candidate_Age"
                    || $pieces[1] == "Window_Difference"
                    || $pieces[1] == "Examiner"
                    ) {
                    continue;
                }
                switch($type) {
                    case 'page':
                        $parsingPage = trim($pieces[2]);
                        $pageName = $db->pselectOne("SELECT Subtest_name FROM instrument_subtests WHERE Test_name=:testinst AND Description=:parsing", array("testinst" => $this->testName, "parsing" => $parsingPage));
                        if($currentPage == $pageName) {
                            $addElements = true;
                        } else {
                            $addElements = false;
                        }
                        break;
                    case 'table':
                        $this->testName = trim($pieces[1]);
                        $this->table = trim($pieces[1]);
                        break;
                    case 'title':
                        if($addElements) {
                            $this->form->addElement('header', 'instrument_title', $pieces[1]);
                            $this->_addMetadataFields();
                        }
                        break;
                    case 'text':
                        if($addElements) {
                            $this->addTextElement($pieces[1], $pieces[2]);
                        }
                        break;
                    case 'textarea':
                        $this->_doubleDataEntryDiffIgnoreColumns[] = $pieces[1];
                        if($addElements) {
                            $this->addTextAreaElement($pieces[1], $pieces[2]);
                        }
                        break;
                    case 'date':
                        if(strpos($pieces[1], "_date") !== FALSE) {
                            $pieces[1] = substr($pieces[1], 0, strpos($pieces[1], "_date"));
                        }
                        if($addElements) {
                            if($pieces[3] == 1900 && $pieces[4] == 2100) {
                                $dateOptions = null;
                            } else {
                                $dateOptions = array(
                                     'language' => 'en',
                                     'format'   => 'YMd',
                                     'minYear'  => $pieces[3],
                                     'maxYear'  => $pieces[4],
                                     'addEmptyOption' => true,
                                     'emptyOptionValue' => null
                                );
                            }

                            $this->addDateElement($pieces[1], $pieces[2], $dateOptions);
                        }
                        break;
                    case 'numeric':
                        if($addElements) {
                            $this->addNumericElement($pieces[1], $pieces[2]);
                        }
                        break;

                    case 'selectmultiple':
                        $type = 'multiple';
                        // fall through and also execute select code below
                    case 'select':

                        $options = split("{-}", trim($pieces[3]));
                        $opt = array();
                        foreach($options as $o) {
                            $arr = explode("=>", $o);
                            $key = $arr[0];
                            $val = $arr[1];
                            if($key[0] == "'" && $key[strlen($key)-1] == "'") {
                                $key = substr($key, 1, -1);
                            } else if($key == 'NULL') {
                                $key ='';
                            }
                            if($val[0] == "'" && $val[strlen($val)-1] == "'") {
                                $val= substr($val, 1, -1);
                            } 
                            $opt[$key] = $val;
                        }

                        if($addElements) {
                            if($type == 'multiple') {
                                $this->form->addElement('select', $pieces[1], $pieces[2], $opt, "multiple");
                            } else {
                                $this->form->addElement('select', $pieces[1], $pieces[2], $opt);
                            }
                        }
                        break;
                    case 'header':
                        if($addElements) {
                            $this->form->addElement('header', null, "$pieces[2]");
                        }
                        break;
                    case 'static':
                        $this->_doubleDataEntryDiffIgnoreColumns[] = $pieces[1];
                        if($addElements) {
                            $this->form->addElement('static', $pieces[1], $pieces[2]);
                        }
                        break;
                    default: 
                        //print $line . "<br />";
                        break;
                }
            }
            fclose($fp);
        }

    }
    function loadInstrumentRules($filename, $base64 = false) {
        if(file_exists($filename) || $base64 === true) {
            $fp = fopen($filename, "r");
            while(($line = fgets($fp, 4096)) !== false) {
                // Rules Uses {-} as delimiter, unlike linst files, because {@} is part of the rules themselves
                $pieces = split("{-}", trim($line));
                $question = $pieces[0];
                $message = $pieces[1];
                $rules = array_slice($pieces, 2);
                $this->XINRegisterRule($question, $rules, $message);
            }
            fclose($fp);
        }
    }
} //end class NDB_BVL_Instrument
function _checkDateTakenFuture($dateElement) {
    $checked = checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
    if($checked === false) {
        return false;
    }
    $formatted = date_create();
    $formatted->setDate($dateElement['Y'], $dateElement['M'], $dateElement['d']);
    $now = date_create(); #getdate(); #date("Y-m-d", getdate());
    $diff = date_diff($formatted, $now);
    return ($diff->format("%r") === '');
}
// {{{ _checkDateTaken()
function _checkDateTaken($dateElement) {
    // if all three elements are empty, return true b/c it'll save the NULL in date field
    if (empty($dateElement['M']) && empty($dateElement['d']) && empty($dateElement['Y'])) {
        return true;
    }
    // otherwise, if any of the three elements are empty, return false b/c date entry has been attempted
    elseif (empty($dateElement['M']) || empty($dateElement['d']) || empty($dateElement['Y'])) {
        return false;
    }
    // else, check the date
    else {
        $checked = checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
        return $checked;/*
        if(version_compare(phpversion(), '5.3.0', '>=')) {
            if($checked === false) {
                return false;
            }
        } else {
            return $checked;
        } */
    }
}
/// _checkDate. This is used by create timepoint and start timepoint pages, 
// so it probably shouldn't be in the instrument class.
function _checkDate($dateElement) {
    // if all three elements are empty, return true b/c it'll save the NULL in date field
    if (empty($dateElement['M']) && empty($dateElement['d']) && empty($dateElement['Y'])) {
        return true;
    }
    // otherwise, if any of the three elements are empty, return false b/c date entry has been attempted
    elseif (empty($dateElement['M']) || empty($dateElement['d']) || empty($dateElement['Y'])) {
        return false;
    }
    return checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
}
// }}}
?>

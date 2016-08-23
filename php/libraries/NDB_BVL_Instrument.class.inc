<?php
/**
 * This file contains the base class for instruments in Loris
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Base class for all NeuroDB behavioural instruments
 *
 * Throws PEAR errors. Also requires PEAR HTML_Quickform.
 *
 * @category Main
 * @package  Behavioural
 * @author   Unknown <example@example.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_BVL_Instrument extends NDB_Page
{

    /**
     * HTML_Quickform object
     *
     * @access private
     */
    var $form;

    /**
     * Test name (short name), equivalent to test_names.Test_name
     *
     * @access private
     */
    var $testName;

    /**
     * Instrument instance CommentID
     *
     * @access private
     */
    var $commentID;

    /**
     * Database table containing data referenced by $this->commentID
     *
     * @access private
     */
    var $table;

    /**
     * Cache location for the date of administration
     *
     * @access private
     */
    var $dateOfAdministration;

    /**
     * Additional form defaults - should only be used for quickform
     * static elements!
     *
     * @access private
     */
    var $localDefaults = array('emptyCell' => '&nbsp;');

    /**
     * String to separate the group elements
     *
     * @access private
     */
    var $_GUIDelimiter = "</td>\n<td>";

    /**
     * Commonly used level of indentation
     *
     * @access private
     */
    var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

    /**
     * Array of required fields to check
     *
     * @access private
     */
    var $_requiredElements = array();

    /**
     * Array of date fields to be processed into QuickForm dates
     * NOTE: When abstracting the _saveValues() method in the child <instrument>
     * class, add only the dates from the current page to the array using the
     * instruments switch($page) otherwise you'll end up overwriting (NULLing)
     * all other dates in the table that appear on other pages (if they are
     * listed in the array of date fields) - note by Dario
     */
    var $dateTimeFields = array();

    /**
     * Array of date fields that contain only month year fields in frontend with
     * a static value for the date
     */
    var $monthYearFields = array();
    /**
     * Array of column names to be ignored by the double data entry conflict
     * detector.
     */
    var $_doubleDataEntryDiffIgnoreColumns
        = array(
           'CommentID',
           'UserID',
           'Testdate',
           'Window_Difference',
           'Candidate_Age',
           'Data_entry_completion_status',
          );

    /**
     * Whether the "Validity" field is shown as a flag for an instrument
     * or not.
     *
     * @access private
     */
    var $ValidityEnabled = true;

    /**
     * Whether the "Validity" field is required before flagging an instrument
     * as complete or not.
     *
     * @access private
     */
    var $ValidityRequired = true;

    /**
     * True if the instrument page is being loaded by a script
     * such as the quickform_parser where all elements should be added to form,
     * ignoring age-dependent or other conditional display logic in the form.
     * To be called from within individual instrument forms.
     */
    var $displayAllFields = false;

    /**
     * True if the page is being previewed from the instrument builder,
     * and not really loaded.
     */
    var $preview = false;

    var $WrapperTextElements           = array();
    var $WrapperNumericElements        = array();
    var $WrapperDateWithStatusElements = array();
    /**
     * Factory generates a new instrument instance of type
     * $instrument, and runs the setup() method on that new
     * instrument.
     *
     * @param string  $instrument       The name of the instrument to use
     * @param string  $commentID        The CommentID identifying the data to load
     *                                  load
     * @param string  $page             If a multipage form, the page to show
     * @param boolean $guarantee_exists If true the factory will throw an
     *                                  error if the file does not exist, otherwise
     *                                  will silently return if the instrument is
     *                                  missing.
     *
     * @return object the new object of $instrument type
     * @access public
     */
    static function factory($instrument, $commentID, $page, $guarantee_exists = true)
    {
        $class = "NDB_BVL_Instrument_$instrument";

        // Make sure the instrument class has been included/required!
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();
        $base    = $config->getSetting('base');

        // The conflict resolver doesn't care if the instrument exists or not, it
        // just tries to load, score, and save. If it doesn't exist, for instance
        // in the case of figs_year3_relatives, we shouldn't require because it
        // isn't necessarily an error.
        if (!file_exists($base."project/instruments/$class.class.inc")
            && !file_exists($base."project/instruments/$instrument.linst")
            && $guarantee_exists==false
        ) {
            return;
        }
        if (file_exists($base."project/instruments/$instrument.linst")
            || $instrument=='instrument_preview'
        ) {
            if ($instrument == 'instrument_preview') {
                include_once 'NDB_BVL_Instrument_instrument_preview.class.inc';
                $obj          = new NDB_BVL_Instrument_instrument_preview();
                $obj->preview = true;
            } else {
                include_once 'NDB_BVL_Instrument_LINST.class.inc';
                $obj = new \Loris\Behavioural\NDB_BVL_Instrument_LINST();
            }
        } else {
            if (!class_exists($class)
                && ($guarantee_exists === true
                && !file_exists($base."project/instruments/$class.class.inc"))
            ) {
                throw new Exception("Instrument does not exist");
            }
            if (!class_exists($class)) {
                include_once $base."project/instruments/$class.class.inc";
            }
            // Now go ahead and instantiate it
            $obj = new $class;
            // Now go ahead and instantiate it
        }

        // if a script is loading this form without a commentID, display all fields
        if (!isset($commentID)) {
            $obj->displayAllFields = true;
        }

        // Sets up page variables such as $this->commentID and $this->form
        $success = $obj->setup($commentID, $page);

        // Adds all of the form element and form rules to the page after
        // having instantiated the form above
        $obj->loadInstrumentFile(
            $base . "project/instruments/$instrument.linst"
        );
        // Add rules only if they exist.
        if (file_exists($base."project/instruments/$instrument.rules")) {
            $obj->loadInstrumentRules(
                $base . "project/instruments/$instrument.rules"
            );
        }

        $access = $obj->_hasAccess();

        // check that user has access
        if ($access == false) {
            throw new Exception(
                "You do not have access to this page.",
                403
            );
        }

        return $obj;
    }


    /**
     * Checks if the user has permissions to view the instrument.
     *
     * Relies on <instrumentPermissions> settings in the config.xml file.
     *
     * This follows a permissive scheme.
     * If the instrument is not listed in the instrumentPermissions section,
     * access is granted.
     * If the user has ANY of the permissions listed in the config.xml file for
     * the instrument, access is granted.
     *
     * Future improvement: call this function from display() rather than from
     * factory()?
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
        if (!is_array($instrumentPermissions)) {
            //instrument permissions not used...
            return true; //default
        } else if (!array_key_exists(
            'useInstrumentPermissions',
            $instrumentPermissions
        )) {
            //instrument permissions not used...
            return true; //default
        } else if ($instrumentPermissions['useInstrumentPermissions'] == false) {
            //instrument permissions not used...
            return true; //default
        } else { //check if user has instrument's permissions
            $user =& User::singleton();

            //is the instrument listed at all in instrumentPermissions?
            $instrumentListed = false;
            foreach ($instrumentPermissions["instrument"] as $instrument) {
                if ($instrument["Test_name"] == $this->testName) {
                    $instrumentListed = true;
                    $instrumentPerms  = Utility::asArray($instrument["permission"]);
                }
            }

            //no permissions defined
            if (!$instrumentListed) {
                return true;
            }

            //check if user possesses ANY of the required permissions
            foreach ($instrumentPerms as $instrumentPerm) {
                if ($user->hasPermission($instrumentPerm)) {
                    return true;
                }
            }

            //no user permissions match required instrument permissions
            throw new Exception("You do not have access to this page.", 403);
        }
    }

    /**
     * Sets up basic data, such as the HTML_Quickform object, and so on.
     *
     * @param string $commentID The CommentID identifying the data to load
     * @param string $page      If a multipage form, the page to show
     *
     * @return   void
     * @access   public
     * @abstract
     */
    function setup($commentID, $page)
    {
        $this->_setupPage(null, $page, null, $commentID, 'test_form');
    }

    /**
     * Method to compute scores - by default will run a script named
     * after the testName in the instrument directory if it exists,
     * but any instrument with a scoring algorithm to implement can override
     * it in PHP.
     *
     * @return void
     * @access public
     */
    function score()
    {
        $config = NDB_Config::singleton();
        $base   = $config->getSetting('base');
        $scorer = $base . "project/instruments/" . $this->testName . ".score";

        if (file_exists($scorer)) {
            exec(
                $scorer . " " . escapeshellarg($this->getCommentID()),
                $output,
                $retVal
            );
            if ($retVal != 0) {
                print "Error running scoring algorithm";
            }
        }
    }



    /**
     * Method to display the form - usually not overridden as it
     * includes all the base code that any instrument will require.
     *
     * @return void
     * @access public
     */
    function display()
    {
        // ALWAYS INCLUDE THESE!

        if (isset($_REQUEST['key'])) {
            $this->DataEntryType = 'DirectEntry';
        } else {
            $this->DataEntryType = 'normal';
            // These are required for Save Data to work properly, but not when it's
            // a direct data entry page
            $this->addHidden(
                'candID',
                isset($_REQUEST["candID"]) ? $_REQUEST['candID'] : ''
            );
            $this->addHidden(
                'sessionID',
                isset($_REQUEST["sessionID"]) ? $_REQUEST['sessionID'] : ''
            );
        }
        $this->addHidden('commentID', $this->getCommentID());
        $this->addHidden('test_name', $this->testName);
        $this->addHidden('page', $this->page);
        $this->addHidden('subtest', $this->page);

        // Don't show save button for Direct Data entry type,
        // because that's part of the DirectEntry template
        // and has Save/Continue and go back buttons
        if (!$this->form->isFrozen() && $this->DataEntryType === 'normal') {
            $buttons[] = $this->form->createElement(
                'submit',
                'fire_away',
                'Save Data',
                'class=button'
            );
            //$buttons[] = $this->form->createElement('reset', null, 'Reset');
            $this->addGroup($buttons, null, null, "&nbsp;");
        }

        // get saved data to pre-populate form
        $db = Database::singleton();
        if ($this->preview !== true) {
            $defaults = $db->pselect(
                "SELECT * FROM $this->table WHERE CommentID=:CID",
                array('CID' => $this->getCommentID())
            );
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

        if ($this->DataEntryType == 'DirectEntry') {
            if (isset($this->testName)) {
                $renderer->setFormTemplate(
                    "<form{attributes}>
                        <table id=\"instrument_" . $this->testName . "\"
                          class=\"instrument\">
                            {content}
                        </table>
                        </form>"
                );
            } else {
                $renderer->setFormTemplate(
                    "<form{attributes}>
                        <table class=\"instrument\">{content}</table>
                    </form>"
                );
            }

            $renderer->setElementTemplate(
                "<tr>
                    <td class=\"lab\">
                        <!-- BEGIN required -->
                        <span style=\"color: #ff0000\">*</span>
                        <!-- END required -->{label}
                    </td>
                    <td class=\"ele\">
                    <!-- BEGIN error -->
                    <span style=\"color: #ff0000\">{error}</span>
                    <br />
                    <!-- END error -->{element}
                    </td>
                </tr>"
            );
            $renderer->setElementTemplate(
                "<tr>
                    <td class=\"lab\">
                    <i>{label}</i>
                    </td>
                    <td class=\"ele\">\t<i>{element}</i></td>
                </tr>",
                "static"
            );
            $renderer->setHeaderTemplate(
                "<tr>
                    <th colspan=\"2\"><br><b>{header}</b></th>
                 </tr>"
            );

            // Any static element with the fieldname of "lorisSubHeader" will
            // be shown with a colspan of 2 so that we can have instructions/labels
            // in the direct data entry instruments that span into the column for
            // data entry.
            $renderer->setElementTemplate(
                "<tr>
                    <td colspan=\"2\"><br>{label}</td>
                </tr>",
                'lorisSubHeader'
            );
            $this->form->accept($renderer);
            $html = $renderer->toHtml();
        } elseif (isset($_REQUEST['json']) == 'true') {
            // Mostly here for debugging. Realisticly, the JSON
            // representation will be retrieved through the API,
            // not the display function.
            return $this->toJSON();
        } else {
            $smarty   = new Smarty_neurodb;
            $renderer = new HTML_QuickForm_Renderer_Array($smarty);

            $this->form->accept($renderer);

            $formArray = $renderer->toArray();

            $smarty->assign('form', $formArray);
            $html = $smarty->fetch("instrument_html.tpl");
        }

        return $html;
    }

    /**
     * Accepts an array usable as input to HTML_Quickform::setDefaults()
     * and does any necessary preprocessing on that array.
     *
     * @param array $defaults the array to be passed on to
     *                        HTML_Quickform::setDefaults()
     *
     * @return array the processed array ready for setDefaults()
     * @access private
     */
    function _setDefaultsArray($defaults)
    {
        //Convert date/time fields into quickform date/timestamps
        if (empty($this->dateTimeFields)) {
            $this->dateTimeFields = array("Date_taken");
        }
        foreach ($this->dateTimeFields as $field) {
            $defaults[$field] = $this->_getQuickformDate($defaults[$field]);
        }
        foreach ($this->monthYearFields as $field) {
            $defaults[$field] = $this->_getQuickformDate($defaults[$field]);
        }

        if (isset($defaults['Window_Difference'])
            && $defaults['Window_Difference'] != 0
        ) {
            $defaults['Candidate_Age']
                = '<span class="error">' . $defaults['Candidate_Age'] . '</span>';
        }
        //Convert select multiple elements into a quickform array
        if (!empty($this->_selectMultipleElements)) {
            foreach ($this->_selectMultipleElements AS $elname) {
                if (isset($defaults[$elname])
                    && stristr($defaults[$elname], "{@}")
                ) {
                    $defaults[$elname] = explode("{@}", $defaults[$elname]);
                }
            }
        }

        // return the defaults array ready for $form->setDefaults
        return $defaults;
    }

    /**
     * Attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return false if failure to save data
     * @access public
     */
    function save()
    {
        $scoreResult = '';
        if ($this->form->validate()) {
            $this->form->process(array(&$this, '_saveValues'), true);
            $scoreResult = $this->score();

            // determine the data entry completion status, and store that in
            // the database
            $dataEntryCompletionStatus
                = $this->_determineDataEntryCompletionStatus();
            $success = $this->_setDataEntryCompletionStatus(
                $dataEntryCompletionStatus
            );
        } else {
            $submittedData = $this->form->getSubmitValues();

            if (count($submittedData)) {

                // the form WAS submitted but validate() failed...
                // main error message
                $this->form->addElement('static', 'mainError');
                $this->form->setElementError(
                    'mainError',
                    "<p>
                    <font color='red'>
                        A data entry error has been detected so this data
                        <b>WAS NOT SAVED</b>
                    </font>
                    </p>\n"
                );
                //print all the field error messages in one block
                foreach (array_keys($submittedData) AS $key) {
                    $error = $this->form->getElementError($key);
                    if (!empty($error)) {
                        // FIXME: Why is this here? The body of this if
                        // statement does nothing.. -- Dave
                        $element = $this->form->getElement($key);
                        if (method_exists($element, "getLabel")) {
                            // print "<font color='red'>"
                            // .$element->getLabel()
                            // .": $error</font><br>\n";
                        }
                    }
                }
                return false;
            }
        }

        return true;
    }

    /**
     * This handles the saving of the Candidate_Age and Window_Difference columns
     * to the database when the save function is called with a Date_taken.
     *
     * @param array $values A reference to the values saved from QuickForm that
     *                       will be passed to update. This will be modified to
     *                       have Candidate_Age and Window_Difference if the
     *                       Date_taken field is included.
     *
     * @return none, but as a side-effect modifies array that was passed.
     */
    function _saveCandidateAge(&$values)
    {
        if (!empty($values['Date_taken'])) {
            $DB  = Database::singleton();
            $age = $this->getCandidateAge($values['Date_taken']);
            if (empty($age)) {
                throw new LorisException("Candidate age could not be found.");
            }
            $agedays   = $age['year']*365 + $age['mon']*30 + $age['day'];
            $agemonths = $age['year']*12 + $age['mon'] + ($age['day']/30);
            // 1 Decimal.
            $agemonths = (round($agemonths*10) / 10.0);
            if (!empty($age)) {
                $query_params = array(
                                 'TN'  => $this->testName,
                                 'CID' => $this->getCommentID(),
                                );

                $validage = $DB->pselectOne(
                    "SELECT MAX($agedays BETWEEN AgeMinDays AND AgeMaxDays)
                        FROM test_battery tb
                            JOIN flag f USING(Test_name)
                            JOIN session s ON (s.ID=f.SessionID)
                        WHERE tb.Active='Y'
                            AND tb.Test_name=:TN
                            AND tb.SubprojectID=s.SubprojectID
                            AND f.CommentID=:CID",
                    $query_params
                );
                $values['Candidate_Age']     = $agemonths;
                $values['Window_Difference'] = 0;

                // Age isn't valid, so find out how far out it is

                if ($validage == 0) {
                    $Windows = $DB->pselect(
                        "SELECT AgeMinDays, AgeMaxDays
                        FROM test_battery tb
                            JOIN flag f USING(Test_name)
                            JOIN session s ON (s.ID=f.SessionID)
                        WHERE tb.Active='Y' AND tb.Test_name=:TN
                            AND tb.SubprojectID=s.SubprojectID
                            AND f.CommentID=:CID",
                        $query_params
                    );
                    foreach ($Windows as $window) {
                        if ($agedays < $window['AgeMinDays']) {
                            $delta = $window['AgeMinDays'] - $agedays;
                            if (abs($delta) < abs($values['Window_Difference'])
                                || $values['Window_Difference'] == 0
                            ) {
                                $values['Window_Difference'] = 0-abs($delta);
                            }
                        }
                        if ($agedays > $window['AgeMaxDays']) {
                            $delta = $agedays - $window['AgeMaxDays'];
                            if (abs($delta) < abs($values['Window_Difference'])
                                || $values['Window_Difference'] == 0
                            ) {
                                $values['Window_Difference'] = abs($delta);
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * This removes all the value of any field which has its accompagning
     * _status field set.
     *
     * @param array $values A reference to the array which will be passed
     *                       to $DB->update().
     *
     * @return none, but as a side-effect modifies &$values array
     */
    function _nullStatus(&$values)
    {
        //Remove the values of all fields who have had statuses assigned
        foreach (array_keys($values) AS $field) {
            if (substr($field, -7)=="_status") {
                if (!empty($values[$field])) {
                    $baseField          = substr($field, 0, (strlen($field)-7));
                    $values[$baseField] = "";
                }
            }
        }
    }

    /**
     * Preprocesses the array of values to be saved into the database
     * (such as to rearrange date fields or process uploaded files)
     *
     * @param array $values the array of values ready to be passed to
     *                      an Database::update call as the set array
     *
     * @return void
     */
    function _saveValues($values)
    {
        //Convet date/timestamps into database format
        if (empty($this->dateTimeFields)) {
            $this->dateTimeFields = array("Date_taken");
        }

        //Convert date/time fields into database dates/times
        if (is_array($this->dateTimeFields) && count($this->dateTimeFields) > 0) {
            foreach ($this->dateTimeFields as $field) {
                if (isset($values[$field])) {
                    //Stops it from wiping dates already saved on other pages.
                    $values[$field] = $this->_getDatabaseDate($values[$field]);
                }
            }
        }

        //Convert date/time fields into database dates/times
        if (is_array($this->monthYearFields)
            && count($this->monthYearFields) > 0
        ) {
            foreach ($this->monthYearFields as $field) {
                //Stops it from wiping dates already saved on other pages.
                if (isset($values[$field])) {
                    $values[$field]['d'] = 15;
                    $values[$field]      = $this->_getDatabaseDate($values[$field]);
                }
            }
        }

        if (strrpos($this->testName, "_proband") === false) {
            $this->_saveCandidateAge($values);
        }

        //Convert select multiple elements into database storable values
        if (!empty($this->_selectMultipleElements)) {
            foreach ($this->_selectMultipleElements AS $elname) {
                if (isset($values[$elname]) && is_array($values[$elname])) {
                    $values[$elname] = implode("{@}", $values[$elname]);
                }
            }
        }

        //XIN specific functionality
        if ($this->formType=="XIN") {
            $this->_nullStatus($values);
        }

        // do not alter this when overwriting the method
        unset(
            $values['candID'],
            $values['sessionID'],
            $values['commentID'],
            $values['test_name'],
            $values['page'],
            $values['fire_away'],
            $values['subtest']
        );
        // nor these -- these ones are for direct data entry
        unset($values['key'], $values['nextpage'], $values['pageNum']);
        $this->_save($values);
    }


    /**
     * Uses the array generated by _saveValues() and runs the
     * Database::update() call.
     *
     * @param array $values the array generated by _saveValues()
     *
     * @return void
     */
    function _save($values)
    {
        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
            if (array_key_exists($key, $this->WrapperNumericElements)) {
                Utility::nullifyEmpty($values, $key);
            }
        }
        $db     =& Database::singleton();
        $result = $db->update(
            $this->table,
            $values,
            array('CommentID' => $this->getCommentID())
        );
    }


    /**
     * Adds metadata fields (such as Examiner and Date_taken) to the
     * current form
     *
     * @return void
     * @access private
     */
    function _addMetadataFields()
    {
        $config      =& NDB_Config::singleton();
        $dateOptions = array(
                        'language'         => 'en',
                        'format'           => 'YMd',
                        'minYear'          => $config->getSetting('startYear'),
                        'maxYear'          => $config->getSetting('endYear'),
                        'addEmptyOption'   => true,
                        'emptyOptionValue' => null,
                       );

        $this->dateOptions = $dateOptions;

        $this->addBasicDate('Date_taken', 'Date of Administration', $dateOptions);

        if (strrpos($this->testName, '_proband') === false) {
            $this->addScoreColumn(
                'Candidate_Age',
                'Candidate Age (Months)',
                'Please enter date of administration and press Save'
            );
            $this->addScoreColumn(
                'Window_Difference',
                'Window Difference (+/- Days)',
                'Please enter date of administration and press Save'
            );
        }
        $examiners = $this->_getExaminerNames();
        $this->addSelect('Examiner', 'Examiner', $examiners);

        $this->addGroupRule(
            'Date_taken',
            'Date of Administration is required',
            'required'
        );

        $this->form->registerRule('checkdate', 'callback', '_checkDateTaken');
        $this->addRule(
            'Date_taken',
            'Date of Administration is invalid',
            'checkdate'
        );

        $this->addRule('Examiner', 'Examiner is required', 'required');
    }

    /**
     * Process the Config file. This results in:
     *     1. $CertificationEnabled being true or false,
     *     2. $CertificationProjects being a list of projects which
     *        use ceritification and,
     *     3. $CertificationInstruments being a list of instruments
     *        that use certification.
     * This is put in a different function so that instruments that
     * override getExaminerNames() can still easily get the config
     * settings and don't need to parse the config file themselves.
     *
     * @return three element array.
     */
    function _getCertificationConfig()
    {
        $config =& NDB_Config::singleton();

        $CertificationConfig      = $config->getSetting("Certification");
        $CertificationEnabled     = $CertificationConfig['EnableCertification'];
        $CertificationProjects    = array();
        $CertificationInstruments = array();

        if ($CertificationEnabled) {
            foreach (
                Utility::toArray($CertificationConfig['CertificationProjects'])
                AS $key => $value
            ) {
                if (is_array($value['CertificationProject'])) {
                    $value = $value['CertificationProject'];
                }
                foreach ($value as $k=>$projID) {
                    $CertificationProjects[$projID] = $projID;
                }
            }
            foreach (
                Utility::toArray($CertificationConfig['CertificationInstruments'])
                AS $instrument
            ) {
                foreach (Utility::toArray($instrument['test']) as $test) {
                    $CertificationInstruments[] = $test['@']['value'];
                }
            }
        }
        return array(
                $CertificationEnabled,
                $CertificationProjects,
                $CertificationInstruments,
               );
    }


    /**
     * Gets the list of examiners for the site of the current instrument
     *
     * @return array
     */
    function _getExaminerNames()
    {
        $db =& Database::singleton();

        $centerID = $db->pselectOne(
            "SELECT session.CenterID FROM session, flag
            WHERE session.ID=flag.SessionID AND flag.CommentID=:cmnt_id",
            array('cmnt_id' => $this->getCommentID())
        );
        if (is_array($centerID)) {
            $centerID = null;
        }

        //get examiner certifications for profiles part of IBIS2
        $candID  = isset($_REQUEST['candID']) ? $_REQUEST['candID'] : '';
        $project = $db->pselectOne(
            "SELECT ProjectID from candidate where CandID =:cnd_id",
            array('cnd_id' => $candID)
        );

        list(
            $CertificationEnabled,
            $CertificationProjects,
            $CertificationInstruments
            ) = $this->_getCertificationConfig();
        if ($CertificationEnabled && in_array($project, $CertificationProjects)
            && in_array($this->testName, $CertificationInstruments)
        ) {
            $test_id = $db->pselectOne(
                "SELECT ID FROM test_names WHERE Test_name=:tst_name",
                array('tst_name' => $this->testName)
            );
            $results = $db->pselect(
                "SELECT certification.examinerID, full_name
                 FROM certification
                     JOIN examiners
                         ON (certification.examinerID = examiners.examinerID)
                 WHERE testID =:tid
                    AND pass =:cert_id
                    AND centerID =:cid
                 ORDER BY full_name",
                array(
                 'tid'     => $test_id,
                 'cert_id' => 'certified',
                 'cid'     => $centerID,
                )
            );
        } else {
            $results = $db->pselect(
                "SELECT examinerID, full_name
                     FROM examiners
                 WHERE centerID=:centID
                     ORDER BY full_name",
                array('centID' => $centerID)
            );
        }

        $examiners = array('' => '');
        if (is_array($results) && !empty($results)) {
            foreach ($results AS $row) {
                $examiners[$row['examinerID']] = $row['full_name'];
            }
        }
        return $examiners;
    }


    /**
     * Looks up the full name for the current instrument
     *
     * @return string the full name of the instrument
     */
    function getFullName()
    {
        $db =& Database::singleton();

        $success = $db->pselectOne(
            "SELECT Full_name FROM test_names WHERE Test_name=:TN",
            array('TN' => $this->testName)
        );
        return $success;
    }


    /**
     * Gets the current object instance CommentID
     *
     * @return string          the CommentID
     * @access public
     */
    function getCommentID()
    {
        return $this->commentID;
    }


    /**
     * Freezes the current form
     *
     * @return void
     * @access public
     */
    function freeze()
    {
        if ($_REQUEST['json'] === 'true') {
            return;
        }
        $this->form->freeze();
    }


    /**
     * Gets the date of administration of an instrument instance.
     * Caches to reduce DB hits
     *
     * @return mixed $dateOfAdministration the date of administration from
     *         the DB, in the format "YYYY-MM-DD"
     */
    function getDateOfAdministration()
    {
        $db  =& Database::singleton();
        $doa = $db->pselectOne(
            "SELECT Date_taken FROM $this->table WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );
        $this->dateOfAdministration = $doa;

        return $this->dateOfAdministration;
    }


    /**
     * Gets a list of subtests of the current instrument
     *
     * @return array
     */
    function getSubtestList()
    {
        // get a database connection
        $db =& Database::singleton();

        $query = "SELECT Subtest_name AS Name, Description
            FROM instrument_subtests
            WHERE Test_name=:TN
                ORDER BY Order_number";

        $results = $db->pselect($query, array('TN' => $this->testName));

        return $results;
    }


    /**
     * Marks an element in the quickform object as being required (for
     * use with the requiredIf rule)
     *
     * @param string $elementName the element to add to the required list
     *
     * @return void
     */
    function setRequired($elementName)
    {
        if (!in_array($elementName, $this->form->_required)) {
            $this->form->_required[] = $elementName;
        }
    }


    /**
     * Convert a quickform date or timestamp into a database acceptable
     * (and storable) date or time
     *
     * @param array $formDateValue the quickform date/timestamp array
     *
     * @return string the date or timestamp from the database
     * @access private
     */
    function _getDatabaseDate($formDateValue)
    {
        if (!empty($formDateValue)) {

            $databaseValue = "";

            if (array_key_exists("Y", $formDateValue)
                || array_key_exists("M", $formDateValue)
                || array_key_exists("d", $formDateValue)
            ) {

                if (array_key_exists("Y", $formDateValue)) {
                    $yearString = $formDateValue[Y];
                } else {
                    $yearString = "0001";
                }

                if (array_key_exists("M", $formDateValue)) {
                    $monthString = $formDateValue[M];
                } else {
                    $monthString = "01";
                }

                if (array_key_exists("d", $formDateValue)) {
                    $dayString = $formDateValue[d];
                } else {
                    $dayString = "01";
                }

                $databaseValue = $yearString . "-" . $monthString . "-" . $dayString;

            } elseif (array_key_exists("H", $formDateValue)
                || array_key_exists("i", $formDateValue)
            ) {
                if (array_key_exists("H", $formDateValue)) {
                    $hourString = $formDateValue[H];
                } else {
                    $hourString = "01";
                }
                if (array_key_exists("i", $formDateValue)) {
                    $minuteString = $formDateValue[i];
                } else {
                    $minuteString = "01";
                }

                $databaseValue = $hourString . ":" . $minuteString;

            }
        }
        return $databaseValue;
    }


    /**
     * Convert a database date or timestamp into a QuickForm acceptable date or time
     *
     * @param string $databaseValue the date or timestamp from the database
     *
     * @return array the quickform date/timestamp array
     */
    function _getQuickformDate($databaseValue)
    {
        $formDateValue = null;
        if (!empty($databaseValue)) {
            if (strstr($databaseValue, ":")) {
                //handle time
                $formDateValue = explode(":", $databaseValue);
                $formDateValue = array(
                                  "H" => $formDateValue[0],
                                  "i" => $formDateValue[1],
                                 );
            } else {
                //handle date
                // split mysql Date_taken field into array
                $formDateValue = explode('-', $databaseValue);
                $formDateValue = array(
                                  'Y' => $formDateValue[0],
                                  'M' => $formDateValue[1],
                                  'd' => $formDateValue[2],
                                 );
            }
        }
        return $formDateValue;
    }


    /**
     * This runs the XIN rules on all the elements on the current page to ensure
     * that no rules were violated.
     *
     * @param array $elements The value of all the elements on the current page
     *                        to validate.
     *
     * @return associative array of errors (fieldname => errormessage) or true
     *         if no errors.
     */
    function XINValidate($elements)
    {
        unset($elements['key'], $elements['pageNum'], $elements['nextpage']);
        $this->XINDebug = false;  //Turn this on to see rules debuggin output

        $errors = array();
        foreach ($elements AS $elname => $elvalue) {
            //If the element is a group (and thus elvalue is an array)
            //trigger the Null Value default rule if ANY of the values
            //in the group are empty.
            $flag = true;
            if (is_array($elvalue)) {
                foreach ($elvalue AS $val) {
                    if ($val == "") {
                        $flag = false;
                    }
                }
            }

            //If the answer is empty (or its a group and one of answers in the
            //group is empty) then run the rules
            if ($elvalue=="" || $flag==false) {
                if ($this->XINDebug) {
                    //debugging code
                    echo "<p><b>$elname</b><br> ";
                }
                if (!empty($this->XINRules[$elname])) {
                    $result = $this->XINRunElementRules(
                        $elname,
                        $elements,
                        $this->XINRules[$elname]
                    );
                    if (is_array($result)) {
                        $errors += $result;
                    }
                } else if (substr($elname, -7) != "_status"
                    && !in_array($elname, array("page", "subtest"))
                ) {
                    $errors[$elname] = "Required.";
                    if ($this->XINDebug) {
                        echo "Required by default";
                    }
                } else {
                    if ($this->XINDebug) {
                        echo "Status' not required by default";
                    }
                }
            }
        }

        if (!empty($errors)) {
            return $errors;
        }
        return true;
    }

    /**
     * Attaches a user defined rule (conditions) to a form element (grouped or not).
     *
     * @param string $elname  Name of element registering the rule
     * @param array  $rules   Array of rules to apply in an AND fashion.
     *                        Rules are written in rose ({@}) format
     *                        (ie. array('q_8{@}=={@}1_yes','q_8_a_status{@}=={@}').
     *                        ORs may be written within the same array value.
     * @param string $message Message to print upon rule violation
     * @param string $group   Empty if a non-grouped element is registering the rule.
     *                        Otherwise, name of the group registering the rule.
     *
     * @return none
     */
    function XINRegisterRule($elname, $rules, $message="", $group="")
    {
        if (!is_array($rules)) {
            $rules_array[] = $rules;
        } else {
            $rules_array = $rules;
        }
        $this->XINRules[$elname]['message'] = $message;
        $this->XINRules[$elname]['group']   = $group;

        foreach ($rules_array AS $rule) {
            $this->XINRules[$elname]['rules'][] = $rule;
        }
        return true;
    }


    /**
     * Run XIN rules on element
     *
     * Run the rules and see if the required flag need be raised.
     * Assumes all conditions are met and then checks each of them,
     * any condition not met will invalidate the rule, meaning the answer
     * is valid.
     *
     * **** DONT TOUCH THIS, EVER. ****
     *
     * @param string   $elname   The name of the element being validated
     * @param elements $elements Array of values submitted on current page.
     * @param array    $rules    Array of rules that have been registered.
     *
     * @return associative array of errors (fieldname => error message)
     */
    function XINRunElementRules($elname, $elements, $rules)
    {
        $errors = array();

        //Conditions for the rule to be true, and thus the element to be required.
        $is_required = true;

        foreach ($rules['rules'] AS $rule) {
            //Loop through the assigned rules (which is the array of formatted
            //statements passed in XINRegisterRule)
            //If this is an OR rule using two different controllers explode it
            //at the pipe.  ex: q_1{@}=={@}yes|q_2{@}=={@}yes
            if (stristr(substr($rule, strpos($rule, "|")), "{@}")) {
                $rules_array = explode("|", $rule);
            } else {  //Otherwise its a regular rule.  ex: q_1{@}=={@}yes
                $rules_array[] = $rule;
            }

            //Loop through the rules (will only be one rule if this is not an OR)
            $or_conditions = array();
            for ($i = 0; $i < count($rules_array); $i++) {
                $rule = explode("{@}", $rules_array[$i]);
                //Some rules compare against multiple values, handle this here.
                if (stristr($rule[2], "|")) {  //ex: q_1{@}=={@}yes|no
                    $values = explode("|", $rule[2]);
                } else {  //ex: q_1{@}=={@}yes
                    $values = array($rule[2]);
                }

                //Test the condition
                if ($this->XINDebug) {
                    //debugging code
                    echo "$rule[0] ";
                }

                //Handle select multiples who's controllre values are arrays.

                //explicitly cast the controller value as an array
                if (!is_array($elements[$rule[0]])) {
                    $elements[$rule[0]] = array($elements[$rule[0]]);
                }
                //Foreach controller value run the rule.
                $or_conditions = false;
                foreach ($elements[$rule[0]] as $controller_value) {
                    $ElementResult = $this->XINRunRuleFunction(
                        $controller_value,
                        $values,
                        $rule[1]
                    );

                    if ($ElementResult) {
                        $or_conditions = true; //If any of the OR rules is true
                    }
                }
            }

            //If NONE of the or_conditions were true the field is NOT required.
            if ($or_conditions == false) {
                $is_required = false;
            }
        }
        //If all of the conditions were true then print the error message
        if ($is_required == true) {
            $el          = $rules['group'] != "" ? $rules['group'] : $elname;
            $errors[$el] = $rules['message'];
        }
        return $errors;
    }

    /**
     * Run a XIN rule on an individual element
     *
     * @param string $controller The element which affects the validity of this
     *                           element
     * @param array  $values     Array of values which will invalidate the rule.
     * @param string $operator   The operator which is used to compare the rule.
     *
     * @return boolean true if element should be required, false otherwise.
     */
    function XINRunRuleFunction($controller, $values, $operator)
    {
        $is_required = true;
        //Loop through the conditions to test against (for most rules it
        //will only be one value)
        //If all of the conditions are true (ie: all conditions are met
        //to pop a required rule)
        $valFlag = array();
        foreach ($values AS $value) {
            $compareFunction = create_function(
                '$a, $b',
                "return (\$a $operator \$b);"
            );
            if ($this->XINDebug) {
                //debugging code
                echo "'$controller' $operator '$value'<br>";
            }
            if (!$compareFunction($controller, $value)) {
                // IF one of the conditions is not  met then this rule
                // does not need to be run.
                $valFlag[] = false;
            }
        }
        //For conditions
        if (count($valFlag) == count($values)) {
            $is_required = false;
        }
        return $is_required;
    }


    /**
     * Get a the value of $field from the instrument table.
     * Used specifically by electronic instruments to check if file
     * is already uploaded.
     *
     * @param string $field The field to get from this instrument
     *
     * @return The value of the field, or false if it's empty.
     */
    function getFieldValue($field)
    {
        $DB =& Database::singleton();

        $query      = "SELECT $field FROM $this->table WHERE CommentID = :CID";
        $fieldValue = $DB->pselectOne($query, array('CID' => $this->getCommentID()));

        if (!empty($fieldValue)) {
            return $fieldValue;
        }
        return false;
    }


    /**
     * Gets the sessionID for the timepoint to which this instrument pertains
     *
     * @return Integer The sessionID
     */
    function getSessionID()
    {
        $db =& Database::singleton();

        $query      = "SELECT SessionID FROM flag WHERE CommentID = :CID";
        $fieldValue = $db->pselectOne($query, array('CID' => $this->getCommentID()));

        if (!empty($fieldValue)) {
            return $fieldValue;
        }
        return false;
    }


    /**
     * Determines what the data entry status flag should be set to
     *
     * @return string  Either 'Complete' or 'Incomplete'
     */
    function _determineDataEntryCompletionStatus()
    {
        // don't bother checking anything if the required elements array is empty
        if (empty($this->_requiredElements)) {
            return 'Complete';
        }

        $db =& Database::singleton();

        $query = "SELECT " . join(',', $this->_requiredElements)
            . " FROM $this->table WHERE CommentID=:CID";

        $dataFields = $db->pselectRow(
            $query,
            array('CID' => $this->getCommentID())
        );
        foreach ($dataFields as $field) {
            // this shouldn't be just empty() b/c 0 is a valid
            // value for some required fields
            if (is_null($field) || $field === "") {
                return 'Incomplete';
            }
        }
        return 'Complete';
    }


    /**
     * Gets the data entry completion status for this instrument
     *
     * @return string Either 'Complete' or 'Incomplete'
     */
    function getDataEntryCompletionStatus()
    {
        $db =& Database::singleton();

        $query = "SELECT Data_entry_completion_status
            FROM $this->table WHERE CommentID=:CID";
        return $db->pselectOne($query, array('CID' => $this->getCommentID()));
    }


    /**
     * Sets the data entry completion status
     *
     * @param string $status The status - either 'Complete'
     *                       or 'Incomplete'
     *
     * @return none
     */
    function _setDataEntryCompletionStatus($status)
    {
        if (!in_array($status, array('Complete', 'Incomplete'))) {
            throw new Exception(
                "Invalid status passed to _setDataEntryCompletionStatus - "
                . "'$status' should have been either "
                . "'Complete' or 'Incomplete'<br>\n"
            );
        }

        $db =& Database::singleton();

        $success = $db->update(
            $this->table,
            array('Data_entry_completion_status' => $status),
            array('CommentID' => $this->getCommentID())
        );
    }

    /**
     * Wrapper to auto-create a simple Yes, No, Null, Not Answered type
     * of question
     *
     * @param string $field        The database field in which the response
     *                             will be stored
     * @param string $label        The question text to display
     * @param array  $rules        {@} delimited rules
     * @param string $rule_message rule message to display
     *
     * @return none
     */
    function addYesNoElement(
        $field,
        $label,
        $rules=array(),
        $rule_message='This field is required.'
    ) {
        $this->addSelect(
            $field,
            $label,
            array(
             null           => '',
             'yes'          => 'Yes',
             'no'           => 'No',
             'not_answered' => 'Not Answered',
            )
        );

        if (!empty($rules)) {
            $this->XINRegisterRule($field, $rules, $rule_message);
        }
    }

    /**
     * Wrapper to create a text field with an accompanying status field.
     *
     * @param string $field        The database field in which the response
     *                             will be stored
     * @param string $label        The question text to display
     * @param array  $rules        rules with values and comparisson operators
     *                             {@} seperated.
     *                             Example: array(
     *                                 'q_40{@}=={@}1_yes',
     *                                 'q_40_b{@}=={@}1_yes'
     *                                 )
     * @param string $rule_message rule message to display
     * @param array  $refusals     options in the refusal select (ie. Refusal,
     *                             Unknown, Not Answered).
     *
     * @return none
     */
    function addTextElement(
        $field,
        $label,
        $rules=array(),
        $rule_message='This field is required.',
        $refusals = array(
                     ''             => '',
                     'not_answered' => 'Not Answered',
                    )
    ) {
        $group[] = $this->createText($field, $label);
        $this->WrapperTextElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field."_status",
            "",
            $refusals,
            array('class' => 'form-control input-sm not-answered')
        );

        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array = array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }

    /**
     * Wrapper to create a text area field for questions that require
     * Refused and Don't know options
     *
     * @param string $field        The database name for this field
     * @param string $label        The question text
     * @param array  $rules        XINRules for this question
     * @param string $rule_message The error message if rules are violated
     *
     * @return none
     * @note   This was only ever used by the EARLI instrument and should be moved
     *       out of the NDB_BVL_Instrument into an EARLI base class.
     */
    function addTextAreaElementRD($field,
        $label,
        $rules=array(),
        $rule_message='You must specify or select from the drop-down'
    ) {
        $group[] =& $this->form->createElement(
            "textarea",
            $field,
            null,
            array(
             'cols' => 25,
             'rows' => 4,
            )
        );
        $group[] =& $this->createSelect(
            $field."_status",
            "",
            array(
             null             => '',
             "88_refused"     => "88 Refused",
             "99_do_not_know" => "99 Do not know",
             'not_answered'   => 'Not Answered',
            )
        );

        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array = array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule($field, $rules_array, $rule_message, $field.'_group');
    }

    /**
     * Wrapper to create a text area field, with an accompanying status field.
     *
     * @param string $field        The database field in which the response
     *                             will be stored
     * @param string $label        The question text to display
     * @param array  $rules        {@} delimited rules
     * @param string $rule_message rule message to display upon rule violation
     *
     * @return none
     */
    function addTextAreaElement(
        $field,
        $label,
        $rules=array(),
        $rule_message='This field is required.'
    ) {
        $group[] = $this->form->createElement(
            "textarea",
            $field,
            $label,
            array(
             'cols'  => 25,
             'rows'  => 4,
             'class' => 'form-control',
            )
        );
        $this->WrapperTextElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field."_status",
            "",
            array(
             null           => '',
             'not_answered' => 'Not Answered',
            ),
            array('class' => 'form-control input-sm not-answered')
        );
        $this->addGroup($group, $field.'_group', $label, null, false);
        unset($group);
        $rules_array = array_merge(array($field.'_status{@}=={@}'), $rules);
        $this->XINRegisterRule(
            $field,
            $rules_array,
            $rule_message,
            $field.'_group'
        );
    }

    /**
     * Wrapper to create an Hour/Minute field, with an accompanying status field.
     *
     * @param string $field        Name given to the HTML QuickForm Element
     *                             being created
     * @param string $label        The question text to display
     * @param array  $rules        Additional rules to apply to the element
     *                             being added,{@} delimited
     * @param string $rule_message Message to display upon rule violation.
     *
     * @return none
     * @note   only used by EARLI? What is "dnk"? This should be cleaned up to use
     */
    function addHourMinElement(
        $field,
        $label,
        $rules = array(),
        $rule_message = null
    ) {
        if ($rule_message === null) {
            $rule_message = "You are required to select a status "
                . "if you want to leave this time blank.";
        }

        $group[] =& $this->createDate(
            $field,
            null,
            array(
             'language'       => 'en',
             'format'         => 'H:i',
             'addEmptyOption' => true,
            )
        );
        $group[] =& $this->createSelect(
            $field . "_status",
            "",
            array(
             null           => '',
             "dnk"          => "DNK",
             "refusal"      => "Refusal",
             'not_answered' => 'Not Answered',
            )
        );
        $this->addGroup($group, $field . "_group", $label, null, false);
        $this->XINRegisterRule(
            $field,
            array_merge($rules, array($field . '_status{@}=={@}')),
            $rule_message,
            $field . '_group'
        );
        unset($group);
    }

    /**
     * Adds a date group with a status box and appropriate rule
     * Note: $this->dateOptions must be defined by the subclass calling this
     * wrapper function
     *
     * @param string $name    Name prepended to the HTMLQuickform element
     * @param string $label   Element label
     * @param array  $options optional override of class's dateOptions
     *
     * @return none
     */
    function addDateElement($name, $label, $options = null)
    {

        if ($options === null) {
            $options = $this->dateOptions;
        }

        $group[] = $this->createDate(
            $name . "_date",
            $label,
            $options,
            array(
             'class' => 'form-control input-sm '.$name."_date",
             'style' => 'max-width:33%; display:inline-block;',
            )
        );
        $this->WrapperDateWithStatusElements[$name . "_date"] = $group[0];
        if (!in_array($name . "_date", $this->dateTimeFields)) {
            $this->dateTimeFields[] = $name . "_date";
        }

        $group[] = $this->createSelect(
            $name . "_date_status",
            null,
            array(
             null           => "",
             'not_answered' => "Not Answered",
            ),
            array('class' => 'form-control input-sm not-answered')
        );

        $this->addGroup(
            $group,
            $name . "_date_group",
            $label,
            $this->_GUIDelimiter,
            false
        );

        unset($group);
        $this->XINRegisterRule(
            $name . "_date",
            array($name . "_date_status{@}=={@}"),
            "A Date, or Not Answered is required.",
            $name . "_date_group"
        );
    }

    /**
     * Wrapper to create a month year date field
     *
     * This is only used in instruments and not in NDB_Page because
     * special logic is needed in the _saveValues to deal with the
     * monthYear fields.
     *
     * @param string $field   Name of the field
     * @param string $label   Element label
     * @param array  $options optional override of class's dateOptions
     *
     * @return none
     */
    function addMonthYear($field, $label, $options=array())
    {
        if (is_array($options)) {
            $options['format'] = 'YM';
        }
        $this->form->addElement('date', $field, $label, $options);
        $this->monthYearFields[] = $field;
    }


    /**
     * Wrapper with a user-created date group, a status box and appropriate rule
     *
     * @param string $name      The database name to add to the form
     * @param string $label     The question text
     * @param array  $dateArray QuickForm date options to use
     *
     * @return none
     * @note   This was only ever used by the EARLI instrument and should be moved
     *       out of the NDB_BVL_Instrument into an EARLI base class.
     */
    function addCustomDateElement($name, $label, $dateArray)
    {
        $group[] = $this->createDate($name . "_date", null, $dateArray);
        $this->dateTimeFields[] = $name . "_date"; //add to array of dates and times.
        $group[] = $this->createSelect(
            $name . "_date_status",
            null,
            array(
             null             => "",
             '88_refused'     => "88 Refused",
             '99_do_not_know' => "99 Do not know",
             'not_answered'   => "Not Answered",
            )
        );
        $this->addGroup(
            $group,
            $name . "_date_group",
            $label,
            $this->_GUIDelimiter,
            false
        );
        unset($group);
        $this->XINRegisterRule(
            $name . "_date",
            array($name . "_date_status{@}=={@}"),
            "You must specify or select from the drop-down",
            $name . "_date_group"
        );
        $this->XINRegisterRule(
            $name . "_date_status",
            array($name . "_date{@}=={@}"),
            "You must specify or select from the drop-down",
            $name . "_date_group"
        );

    }



    /**
     * Wrapper to create a field that only accepts a number, with an
     * accompanying status field.
     *
     * @param string  $field   The database field in which the response
     *                         will be stored
     * @param string  $label   The question text to display
     * @param unknown $options Does not appear to be used?
     *
     * @return none
     */
    function addNumericElement($field, $label, $options = null)
    {
        $group[] = $this->createText($field, $label);
        $this->WrapperNumericElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field . "_status",
            null,
            array(
             null           => "",
             'not_answered' => "Not Answered",
            ),
            array('class' => 'form-control input-sm not-answered')
        );
        $this->addGroup($group, $field . "_group", $label, null, false);
        unset($group);
        $this->addGroupRule(
            $field . "_group",
            array(array(array("Value must be numeric.", 'numeric')))
        );
        $this->XINRegisterRule(
            $field,
            array($field . '_status{@}=={@}'),
            'This field is required',
            $field . '_group'
        );
    }

    /**
     * Wrapper to create a field that only accepts a number, for questions that
     * require refused and don't know options
     *
     * @param string $field The database name to add
     * @param string $label The user friendly label to display
     *
     * @return none
     */
    function addNumericElementRD($field, $label)
    {
        $group[] = $this->createText($field, $label);
        $group[] = $this->createSelect(
            $field . "_status",
            null,
            array(
             null             => "",
             "88_refused"     => "88 Refused",
             "99_do_not_know" => "99 Do not know",
             'not_answered'   => "Not Answered",
            ),
            array('class' => 'form-control input-sm not-answered')
        );
        $this->addGroup($group, $field . "_group", $label, null, false);
        unset($group);
        $this->addGroupRule(
            $field . "_group",
            array(array(array("Numbers only, please", 'numeric')))
        );
        $this->XINRegisterRule(
            $field,
            array($field . '_status{@}=={@}'),
            'This field is required',
            $field . '_group'
        );
    }


    /**
     * Nulls all scores for the record identified by CommentID. This should
     * be done at the start of any scoring run to ensure that old data is
     * nulled before the current score run, in case a change in the data
     * affected which scores are calculated so that the old (incorrect) data
     * doesn't remain.
     *
     * @param array $scoreCols list of scoring fields to null
     *
     * @return none
     */
    function _nullScores($scoreCols)
    {
        $db =& Database::singleton();

        // set the scoring cols to NULL
        foreach ($scoreCols as $key => $val) {
            // Some Instruments use an associative array for
            // $scoreCols of the form column => description, others
            // use a non-associative array. So if the key is numeric,
            // and we need to make sure we use the column name
            if (is_numeric($key)) {
                $scores[$val] = null; //null array
            } else {
                $scores[$key] = null;
            }

        }

        // update the scores
        $success = $db->update(
            $this->table,
            $scores,
            array('CommentID' => $this->getCommentID())
        );

        return;
    }

    /**
     * Computes the difference between two instances of this instrument.
     *
     * @param NDB_BVL_Instrument $otherInstrument The instrument to compare
     *                                            the currently instantiated
     *                                            instrument again.
     *
     * @return array The keys which are not shared between the passed instrument
     *         and the current one.
     */
    function diff($otherInstrument)
    {
        // Load this instance data
        $thisData = NDB_BVL_Instrument::loadInstanceData($this);

        // Load other instance data
        $otherData = NDB_BVL_Instrument::loadInstanceData($otherInstrument);

        // Create the return object data structure
        $diff = array();

        // Loop over this instance data
        foreach ($thisData AS $key=>$value) {
            if (!in_array($key, $this->_doubleDataEntryDiffIgnoreColumns)) {
                if ($otherData[$key] != $value) {
                    $diff[] = array(
                               'TableName'      => $this->table,
                               'ExtraKeyColumn' => null,
                               'ExtraKey1'      => ' ',
                               'ExtraKey2'      => ' ',
                               'FieldName'      => $key,
                               'CommentId1'     => $this->getCommentID(),
                               'Value1'         => $value,
                               'CommentId2'     => $otherInstrument->getCommentID(),
                               'Value2'         => $otherData[$key],
                              );
                }
            }
        }

        // Return the diffs
        return $diff;
    }

    /**
     * Gets the data from an instrument out of the database and returns it
     * as an array.
     *
     * @param NDB_BVL_Instrument $instrumentInstance The object whose data is
     *                                               to be retrieved.
     *
     * @return Array containing the data for each field in this instrument
     */
    static function loadInstanceData($instrumentInstance)
    {
        $db       =& Database::singleton();
        $defaults = $db->pselect(
            "SELECT * FROM $instrumentInstance->table WHERE CommentID=:CID",
            array('CID' => $instrumentInstance->getCommentID())
        );
        return $defaults[0];
    }

    /**
     * Calculates the candidate's age at the time of this instrument.
     * If Date_taken was based in, it will calculate the age as of
     * the date passed as a parameter (this is used, for instance, in
     * _saveValues when we want to calculate the age based on the new
     * value and not based on the age saved in the database), otherwise
     * it will calculate based on the date saved into the Date_taken
     * field from the database.
     *
     * @param array $Date_taken (optional) The date that the age is to
     *                          be calculated based on.
     *
     * @return The age of the candidate in an array containing years, months
     *         and days.
     */
    function getCandidateAge($Date_taken = false)
    {
        $db        =& Database::singleton();
        $CommentID = $this->getCommentID();

        $dates = $db->pselectRow(
            "SELECT i.Date_taken, c.DoB FROM $this->testName i
            JOIN flag f USING (CommentID)
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            array('CID' => $CommentID)
        );

        if ($Date_taken == false) {
            $age = Utility::calculateAge($dates['DoB'], $dates['Date_taken']);
        } else {
            $age = Utility::calculateAge($dates['DoB'], $Date_taken);
        }
        if (!empty($age)) {
            return $age; //$age['year'] + ($age['mon'] / 12) + ($age['day'] / 30);
        }
        return;
    }

    /**
     * Get the candidates PSCID.
     *
     * @return The candidate's PSCID.
     */
    function getPSCID()
    {
        $db        =& Database::singleton();
        $CommentID = $this->getCommentID();

        $pscid = $db->pselectOne(
            "SELECT c.PSCID FROM $this->testName i
            JOIN flag f USING (CommentID)
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            array('CID' => $CommentID)
        );
        return $pscid;
    }

    /**
     * Clears all the data saved into this instrument instance
     *
     * @return none
     */
    function clearInstrument()
    {
        $config   = NDB_Config::singleton();
        $db       = Database::singleton();
        $dbconfig = $config->getSetting('database');
        $columns  = $db->pselect(
            "SELECT COLUMN_NAME FROM information_schema.columns
            WHERE TABLE_NAME=:table AND TABLE_SCHEMA=:db",
            array(
             'table' => $this->table,
             'db'    => $dbconfig['database'],
            )
        );

        $values = array();
        foreach ($columns as $row) {
            if ($row['COLUMN_NAME'] == 'CommentID'
                || $row['COLUMN_NAME'] == 'UserID'
            ) {
                continue;
            }
            $values[$row['COLUMN_NAME']] = null;
        }
        $db->update($this->table, $values, array('CommentID' => $this->commentID));
        $prepQ = $db->prepare(
            "DELETE FROM conflicts_unresolved
             WHERE (CommentId1=:CID OR CommentId2=:CID)"
        );
        $db->execute($prepQ, array('CID' => $this->commentID));
    }

    /**
     * Parses a file that isn't written in PHP and loads it into a format
     * that LORIS understands.
     *
     * This is intended to be overridden by a subclass of NDB_BVL_Instrument
     * to add support for other file formats.
     *
     * @param string  $filename The filename to be loaded, or a base64 encoded
     *                          string.
     * @param boolean $base64   If true, read the filename as a base64 encoded
     *                          string of the file content, used for preview.
     *
     * @return none
     */
    function loadInstrumentFile($filename, $base64 = false)
    {
    }

    /**
     * Load the rules for an instrument from the file system.
     *
     * This is intended to be overridden by a subclass of NDB_BVL_Instrument
     * to add support for other file formats.
     *
     * @param string $filename Either the path to a file, or a base64 encoded
     *                         string which can be interpreted as a file by
     *                         PHP and fopen()
     * @param bool   $base64   If true, the "filename" is really a base64 encoded
     *                         data URL, so we shouldn't check that the file exists
     *                         on the filesystem. (Used by preview)
     *
     * @return none
     */
    function loadInstrumentRules($filename, $base64 = false)
    {
    }

    /**
     * Renders the HTML for the control panel for this instrument.
     *
     * @return string The HTML for the control panel
     */
    function getControlPanel()
    {
        if (!empty($_REQUEST['commentID'])) {
            // make the control panel object for the current instrument
            $controlPanel = new NDB_BVL_InstrumentStatus_ControlPanel;
            $success      = $controlPanel->select($_REQUEST['commentID']);

            $config = NDB_Config::singleton();
            $paths  = $config->getSetting('paths');
            if (empty($subtest)) {
                // check if the file/class exists
                $BasePath = $paths['base'] . 'project/instruments/';
                $TestName = $this->testName;
                if (file_exists(
                    $BasePath
                    . "NDB_BVL_Instrument_$TestName.class.inc"
                )
                    || file_exists($BasePath . "$TestName.linst")
                ) {
                    // save possible changes from the control panel...
                    $success = $controlPanel->save();
                }

                // display the control panel
                $html = $controlPanel->display();
                return $html;

            }
        }
    }

    /**
     * Function that displays the html the fetch feedback panel.
     *
     * @param candidateID $candID    The candidate ID for the panel.
     * @param timepointID $sessionID The session ID for the panel.
     *
     * @return string
     */
    function getFeedbackPanel($candID, $sessionID)
    {

        $commentID = $this->getCommentID();

        if (!empty($commentID)) {
            $feedbackPanel = new BVL_Feedback_Panel(
                $candID,
                $sessionID,
                $commentID
            );

            return $feedbackPanel->display();
        }
    }

    /**
     * Return the HTML for the review section of the survey module
     * By default, this will show every question from the parameter_type
     * table for this instrument, but it can be overridden/customized by
     * a instrument if that isn't the desired behaviour.
     *
     * @return string The HTML to be inserted into the review section of
     *                the final page of the survey module for this instrument.
     */
    function getReview()
    {
        $DB = Database::singleton();

        $smarty   = new Smarty_neurodb();
        $tpl_data = array();

        $tpl_data['questions'] = $DB->pselect(
            "SELECT Description as question,
            SourceField FROM parameter_type
            WHERE SourceFrom=:TN AND
            SourceField NOT IN ('Validity', 'Administration')",
            array('TN' => $this->testName)
        );

        $Responses = $DB->pselectRow(
            "SELECT * FROM " . $this->testName . " WHERE CommentID=:CID",
            array('CID' => $this->getCommentID())
        );

        foreach ($tpl_data['questions'] as &$row) {
            if (isset($Responses[$row['SourceField']])) {
                $row['response'] = $Responses[$row['SourceField']];
            }
        }

        $smarty->assign($tpl_data);
        $html = $smarty->fetch("directentry_review.tpl");
        return $html;
    }


    /**
     * Parse the HTML generated by smarty for the current element to
     * extract information that is not directly extractable by the
     * smarty array renderer, but is still needed in order to render
     * the instrument as JSON.
     *
     * @param array $element The current element that came from smarty
     *
     * @return array of the element in format understood by instrument_json.tpl
     */
    function _toJSONParseSmarty(&$element)
    {
        /* Hacks to get data that QuickForm_Renderer_Array doesn't provide
         * an easy way to get */
        if ($element['type'] === 'select') {
            // Parse the HTML to get the options from the select
            $html = new DOMDocument();
            $html->loadHTML($element['html']);

            $element['options'] = array();

            $selectEl = $html->getElementsByTagName("select")->item(0);

            if ($selectEl->getAttribute("multiple") == 'multiple') {
                $element['Multiselect'] = true;
            }

            foreach ($html->getElementsByTagName("option") as $option) {
                if ($option->getAttribute("value") === 'not_answered') {
                    $element['RequireResponse'] = true;
                } else {
                    $element['options'][$option->getAttribute("value")]
                        = $option->textContent;
                }
            }
        } else if ($element['type'] === "date") {
            if (get_class($this->form) === 'LorisForm') {
                $element['options'] = array(
                                       'mindate'         => "1990-01-01",
                                       'maxdate'         => "2000-12-31",
                                       'RequireResponse' => false,
                                      );
                //$element['RequireResponse'] = false;
            } else {
                $html = new DOMDocument();
                $html->loadHTML($element['html']);
                // Parse the HTML to get the min and max date
                $selects = $html->getElementsByTagName("select");
                if ($selects->length > 0) {
                    // Old school QuickForm style. This should be removed
                    // after QuickForm is retired.
                    $year = $selects->item(0);

                    // If Item 0 is blank, item 1 is the minimum,
                    $minYear = $year->childNodes->item(0)->textContent;

                    // PHP's trim function doesn't support UTF-8's 0xC2A0 (&nbsp;),
                    // which seems to be how loadHTML parses spaces. Trim whitespace
                    // and then specifically trim that character before checking if
                    // the year is empty, and if it's empty use the next option in
                    // the dropdown (which should be non-empty)
                    $minYear = trim($minYear);
                    $minYear = trim($minYear, chr(0xC2).chr(0xA0));
                    if (empty($minYear)) {
                        $minYear = $year->childNodes->item(1)->textContent;
                    }
                    // the last item is the maximum year
                    $maxYear = $year->lastChild->textContent;

                    $element['options'] = array(
                                           'mindate' => $minYear . "-01-01",
                                           'maxdate' => $maxYear . "-12-31",
                                          );

                }
            }
            if (isset($this->WrapperDateWithStatusElements[$element['name']])) {
                $element['NoResponse'] = false;
            } else {
                $element['NoResponse'] = true;
            }

        }
        return $element;
    }

    /**
     * Parses and element that came from HTML_QuickForm_Renderer_Array
     * and converts it to a format useable by instrument_json.tpl
     *
     * @param string $element   The element from the QuickForm array renderer
     * @param array  $formArray The currently existing form that was converted
     *                          to instrument_json.tpl format.
     *
     * @return none, but side-effect modified $formArray to populate the element
     *         with the appropriate format needed for JSON serialization.
     */
    function _toJSONParsePageElement(&$element, &$formArray)
    {
        $name = isset($element['name']) ? $element['name'] : '';
        if ($element['type'] === 'group') {
            $elementName = str_replace("_group", '', $name);
            if (isset($this->WrapperTextElements[$elementName])) {
                // Convert text elements created by wrapper into
                // the native type.
                $mapFunc = function (&$el) use ($name, $elementName) {
                    if ($el['name'] === $name) {
                        $el['name'] = $elementName;
                        $elObj      = $this->WrapperTextElements[$elementName];
                        if ((is_array($elObj)
                            && $elObj['type'] === 'textarea')
                            || (!is_array($elObj) && $elObj->_type == 'textarea')
                        ) {
                            $el['type'] = 'textarea';
                        } else {
                            $el['type'] = 'text';
                        }
                    }
                };
                array_map($mapFunc, $formArray['elements']);
                $element['label'] = $element['elements'][0]['label'];
            }

            if (isset($this->WrapperNumericElements[$elementName])) {
                $mapFunc = function (&$el) use ($name, $elementName) {
                    if ($el['name'] === $name) {
                        $el['name'] = $elementName;
                        $el['type'] = 'numeric';
                    }
                };
                array_map($mapFunc, $formArray['elements']);
                $element['label'] = $element['elements'][0]['label'];
            }

            if (isset($this->WrapperDateWithStatusElements[$elementName])) {
                // Convert date elements created by wrapper into
                // the native type.
                $mapFunc = function (&$el) use ($name, $elementName) {

                    if ($el['name'] === $name) {
                        $el['name'] = $elementName;
                        $el['type'] = 'date';
                        if (isset($el['elements'][0]['label'])) {
                            $el['label'] = $el['elements'][0]['label'];
                        }
                        //unset($el['elements']);
                        //unset($el['delimiter']);
                        //$label = $el['label'];
                        //$el = $this->_toJSONParseSmarty($el['elements'][0]);
                        //$el['label'] = $label;
                        //$el = $this->_toJSONParseSmarty($el);
                    }
                };
                array_map($mapFunc, $formArray['elements']);
                $element['label'] = $element['elements'][0]['label'];
            }
            unset($formArray['elements'][$name]);
        }
        if (strpos($name, "_status") === false) {
            $this->_toJSONParseSmarty($element);
        } else {
            unset($formArray['elements'][$name]);
        }
    }

    /**
     * Uses smarty to parse the current instrument page into a format
     * that can be converted to JSON
     *
     * @return array of elements on the current page
     */
    function _toJSONParsePage()
    {

        if (get_class($this->form) === 'LorisForm') {
            $formArray = $this->form->toElementArray();
        } else {
            $smarty   = new Smarty_neurodb;
            $renderer = new HTML_QuickForm_Renderer_Array($smarty);

            $this->form->accept($renderer);

            $formArray = $renderer->toArray();
        }

        if (isset($formArray['elements'])) {
            foreach ($formArray['elements'] as &$element) {
                $this->_toJSONParsePageElement($element, $formArray);
            }
        }

        if (isset($formArray['sections'])) {
            foreach ($formArray['sections'] as &$section) {
                if (isset($section['elements'])) {
                    foreach ($section['elements'] as &$element) {
                        $this->_toJSONParsePageElement($element, $section);
                    }
                } else {
                    $this->_toJSONParsePageElement($element, $section);
                }
            }
        }
        return $formArray;

    }
    /**
     * Returns a JSON representation of the currently instantiated
     * instrument.
     *
     * The format of the JSON representation is specified in the
     * docs/API/InstrumentFormat documentation.
     *
     * @return string containing valid JSON
     */
    function toJSON()
    {
        $smarty = new Smarty_neurodb;
        //$renderer = new HTML_QuickForm_Renderer_Array($smarty);

        $subtests = $this->getSubtestList();
        foreach ($subtests as $subtest) {
            if (get_class($this->form) === 'LorisForm') {
                $this->form->addPageBreak(
                    $subtest['Name'],
                    $subtest['Description'],
                    array()
                );
            }
            $this->page = $subtest['Name'];
            $this->_setupForm();
        }
        $formArray = $this->_toJSONParsePage();

        $smarty->assign('form', $formArray);
        $smarty->assign('testname', $this->testName);
        $smarty->assign('fullname', $this->getFullName());
        $html = $smarty->fetch("instrument_json.tpl");

        return json_encode(json_decode($html));
    }

    /**
     * Determines whether data entry should be allowed for this instrument
     * or not.
     *
     * @return boolean true if data entry is permitted
     */
    function determineDataEntryAllowed()
    {
        $DB    = Database::singleton();
        $entry = $DB->pselectOne(
            "SELECT Data_entry FROM flag WHERE CommentID=:CID",
            array('CID' => $this->getCommentId())
        );

        if ($entry === 'Complete') {
            return false;
        }
        return true;
    }

    /**
     * Validate whether the values submitted are valid
     *
     * @param array $values an array of values submitted
     *
     * @return boolean true if values are valid
     */
    function validate($values)
    {
        return $this->determineDataEntryAllowed();
    }
}

/**
 * Checks that the Date_taken element is a valid date
 *
 * @param array $dateElement The date element in QuickForm array format.
 *
 * @return True if the date is invalid, false if it's valid.
 */
function _checkDateTaken($dateElement)
{
    // if all three elements are empty,
    // return true b/c it'll save the NULL in date field
    if (empty($dateElement['M'])
        && empty($dateElement['d'])
        && empty($dateElement['Y'])
    ) {
        return true;
    } elseif (empty($dateElement['M'])
        || empty($dateElement['d'])
        || empty($dateElement['Y'])
    ) {
        // otherwise, if any of the three elements are empty,
        // return false b/c date entry has been attempted
        return false;
    } else {
        // else, check the date
        $checked = checkdate(
            $dateElement['M'],
            $dateElement['d'],
            $dateElement['Y']
        );
        if (version_compare(phpversion(), '5.3.0', '>=')) {
            if ($checked === false) {
                return false;
            }
            $formatted = date_create();
            $formatted->setDate(
                $dateElement['Y'],
                $dateElement['M'],
                $dateElement['d']
            );

            $now  = date_create();
            $diff = date_diff($formatted, $now);
            return ($diff->format("%r") === '');
        } else {
            return $checked;
        }
    }
}

/**
 * QuickForm rule to check that a date is valid.
 * This is used by create timepoint and start timepoint pages,
 * so it probably shouldn't be in the instrument class.
 *
 * @param array $dateElement The date element in QuickForm array format.
 *
 * @return True if the date is invalid, false if it's valid.
 */
function _checkDate($dateElement)
{
    if (empty($dateElement['M'])
        && empty($dateElement['d'])
        && empty($dateElement['Y'])
    ) {
        // if all three elements are empty, return true b/c it'll
        // save the NULL in date field
        return true;
    } elseif (empty($dateElement['M'])
        || empty($dateElement['d'])
        || empty($dateElement['Y'])
    ) {
        // otherwise, if any of the three elements are empty, return
        // false b/c date entry has been attempted
        return false;
    }
    return checkdate($dateElement['M'], $dateElement['d'], $dateElement['Y']);
}

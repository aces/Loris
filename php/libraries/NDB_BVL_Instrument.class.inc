<?php
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

use \LORIS\StudyEntities\Candidate\CandID;
use \LORIS\Data\Dictionary\DictionaryItem;

/**
 * Base class for all LORIS behavioural instruments.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class NDB_BVL_Instrument extends NDB_Page
{
    protected const ERROR_CERTIFICATION_BAD_FORMATTING
        = 'Certification settings are not formatted correctly in the '
        . 'configuration file. Cannot continue.';
    /**
     * Determines whether this instrument should load data in
     * JSON format from the "Data" column of the flag table, or
     * from the traditional SQL tables.
     */
    protected $jsonData = false;

    /**
     * The form object for this instrument.
     *
     * @var LorisForm
     */
    public $form;

    /**
     * Variable defining the type of form in use
     *
     * Note: this seems to always be defined as 'XIN'
     *
     * @var string
     */
    public $formType;

    /**
     * Array holding the date format
     *
     * @var array
     */
    public $dateOptions;

    /**
     * Type of instrument. Can be 'normal' or 'DirectEntry'
     *
     * @var string
     */
    public $DataEntryType;

    /**
     * Array holding XIN rules
     *
     * @var array
     */
    public $XINRules;

    /**
     * Boolean enabling/disabling debugging statements for XIN rules
     *
     * @var boolean
     */
    public $XINDebug;

    /**
     * A flag determining whether the ControlPanel changed
     * the Data_entry flag status on this page load.
     */
    private $_DataEntryChanged;

    /**
     * Test name (short name), equivalent to test_names.Test_name
     */
    public $testName;

    /**
     * Instrument instance CommentID
     *
     * @access public
     */
    public $commentID;

    /**
     * The data associated with the commentID for this instrument
     *
     * @var ?array
     */
    protected $instanceData = null;

    /**
     * Database table containing data referenced by $this->commentID
     *
     * @access public
     */
    public $table;

    /**
     * Cache location for the date of administration
     *
     * @access public
     */
    public $dateOfAdministration;

    /**
     * Additional form defaults - should only be used for lorisform
     * static elements!
     *
     * @access public
     */
    public $localDefaults = ['emptyCell' => '&nbsp;'];

    /**
     * String to separate the group elements
     */
    var $_GUIDelimiter = "</td>\n<td>";

    /**
     * Commonly used level of indentation
     *
     * @access public
     */
    public $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

    /**
     * Array of required fields to check
     *
     * @access public
     */
    var $_requiredElements = [];

    /**
     * Array of column names to be ignored by the double data entry conflict
     * detector.
     *
     * @access public
     */
    var $_doubleDataEntryDiffIgnoreColumns
        = [
            'CommentID',
            'UserID',
            'Testdate',
            'Window_Difference',
            'Candidate_Age',
        ];

    /**
     * Whether the "Validity" field is shown as a flag for an instrument
     * or not.
     *
     * @access public
     */
    public $ValidityEnabled = true;

    /**
     * Whether the "Validity" field is required before flagging an instrument
     * as complete or not.
     *
     * @access public
     */
    public $ValidityRequired = true;

    /**
     * True if the instrument page is being loaded by a script
     * such as the lorisform_parser where all elements should be added to form,
     * ignoring age-dependent or other conditional display logic in the form.
     * To be called from within individual instrument forms.
     */
    public $displayAllFields = false;

    public $WrapperTextElements           = [];
    public $WrapperNumericElements        = [];
    public $WrapperDateWithStatusElements = [];

    /**
     * True if the instrument is administered after the candidate's death.
     * This is used to determine which candidate age should be displayed as
     * part of metadata fields. (Either Candidate Age or Candidate Age at Death).
     * To be called from within individual instrument forms.
     *
     * @var    bool
     * @access protected
     */
    protected $postMortem = false;

    /**
     * True if the page is being previewed from the instrument builder,
     * and not really loaded. only applies to LINST instrument.
     */
    public $preview = false;

    /**
     * Array containing all multiselect elements in an instrument.
     */
    protected $selectMultipleElements = [];

    /**
     * Factory generates a new instrument instance of type
     * $instrument, and runs the setup() method on that new
     * instrument.
     *
     * @param \LORIS\LorisInstance $loris            The LORIS instance with the
     *                                               instrument
     * @param string               $instrument       The name of the instrument to
     *                                               use
     * @param string               $commentID        The CommentID identifying the
     *                                               data to load
     * @param string               $page             If a multipage form, the page to
     *                                               show
     * @param boolean              $guarantee_exists If true the factory will throw
     *                                               an error if the file does not
     *                                               exist, otherwise will silently
     *                                               return if the instrument is
     *                                               missing.
     *
     * @return object|null the new object of $instrument type
     * @access public
     * @throws NotFound
     * @throws Exception
     */
    public static function factory(
        \LORIS\LORISInstance $loris,
        string $instrument,
        string $commentID = '',
        string $page = '',
        bool $guarantee_exists = true
    ) {
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
            return null;
        }
        if (file_exists($base."project/instruments/$instrument.linst")
        ) {
            include_once 'NDB_BVL_Instrument_LINST.class.inc';
            $obj = new \Loris\Behavioural\NDB_BVL_Instrument_LINST(
                // The module directory we use for instruments is arbitrary,
                // since it isn't a real module, but it's required for the page
                // constructor.
                $loris,
                $loris->getModule("instruments"),
                $page,
                $commentID,
                $commentID,
            );
        } else {
            if (!class_exists($class)
                && ($guarantee_exists === true
                && !file_exists($base."project/instruments/$class.class.inc"))
            ) {
                throw new NotFound("Instrument does not exist");
            }
            if (!class_exists($class)) {
                include_once $base."project/instruments/$class.class.inc";
            }

            // Now go ahead and instantiate it
            $obj = new $class(
                $loris,
                $loris->getModule("instruments"),
                $page,
                $commentID,
                $commentID,
                'test_form'
            );
        }

        // if a script is loading this form without a commentID, display all fields
        if (!isset($commentID)) {
            $obj->displayAllFields = true;
        }

        // Set page name to testName
        $obj->name = $instrument;
        // Sets up page variables such as $this->commentID and $this->form
        $obj->setup($commentID, $page);

        if (!empty($commentID)) {
            $obj->setupCandidateInfoTables();
        }
        if (file_exists($base."project/instruments/$instrument.meta")) {
            $obj->loadInstrumentMetadata(
                $base . "project/instruments/$instrument.meta"
            );
        }
        // Set DataEntryType to normal or DirectEntry
        if (isset($_REQUEST['key'])) {
            $obj->DataEntryType = 'DirectEntry';
        } else {
            $obj->DataEntryType = 'normal';
        }
        // Adds all of the form element and form rules to the page after
        // having instantiated the form above
        $obj->loadInstrumentFile(
            $base . "project/instruments/$instrument.linst"
        );
        // Add rules only if they exist.
        $obj->loadInstrumentRules(
            $base . "project/instruments/$instrument.rules"
        );

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
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        $DB = $this->loris->getDatabaseConnection();

        $instrumentPermissions = $DB->pselectCol(
            "SELECT code FROM testnames_permissions_rel rel
                LEFT JOIN test_names ON (test_names.ID=rel.TestID)
                LEFT JOIN permissions ON (permissions.permID=rel.PermID)
              WHERE test_names.Test_name=:tn",
            ['tn' => $this->testName]
        );
        if (empty($instrumentPermissions)) {
            // no permissions configured for this instrument
            return true;
        }
        return $user->hasAnyPermission($instrumentPermissions);
    }

    /**
     * Sets up basic data.
     *
     * @param string|null $commentID The CommentID identifying the data to load
     * @param string|null $page      If a multipage form, the page to show
     *
     * @return   void
     * @access   public
     * @abstract
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->commentID = $commentID;
        $this->page      = $page;
    }

    /**
     * Gets data for candidate and timepoint to display the tables at the top of the
     * page. This info is then set in the tpl_data array.
     *
     * @return void
     */
    function setupCandidateInfoTables(): void
    {
        try {
            $timePoint = \TimePoint::singleton($this->getSessionID());
        } catch (Exception $e) {
            throw new LorisException($e->getMessage());
        }

        try {
            $candidate = \Candidate::singleton($timePoint->getCandID());
        } catch (Exception $e) {
            throw new LorisException($e->getMessage());
        }

        $this->tpl_data['candidate'] = $candidate->getData();
        $this->tpl_data['timePoint'] = $timePoint->getData();
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
    function score(): void
    {
        $config = NDB_Config::singleton();
        $base   = $config->getSetting('base');
        $scorer = $base . "project/instruments/" . $this->testName . ".score";
        $this->logger->debug("Running scoring script $scorer");
        if (file_exists($scorer)) {
            if (is_executable($scorer) === false) {
                $this->logger->critical(
                    "Scoring script $scorer exists but is not executable"
                );
                throw new \ConfigurationException(
                    "Scoring script not executable"
                );
            }
            $output = [];
            exec(
                escapeshellarg($scorer) . " " . escapeshellarg(
                    $this->getCommentID()
                ),
                $output,
                $retVal
            );
            if ($retVal != 0) {
                $this->logger->warning(
                    "An error occurred while running the scoring
                    algorithm of instrument ".$this->testName."."
                );
            }
        }
    }



    /**
     * Method to display the form for an instrument
     *
     * @return string
     * @access public
     */
    function display(): string
    {
        // ALWAYS INCLUDE THESE!

        if ($this->DataEntryType === 'normal') {
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
            $buttons   = [];
            $buttons[] = $this->form->createElement(
                'submit',
                'fire_away',
                'Save Data',
                ['class' => 'button']
            );
            //$buttons[] = $this->form->createElement('reset', null, 'Reset');
            $this->addGroup($buttons, '', '', "&nbsp;");
        }

        $defaults = $this->getInstanceData();

        // set the defaults (call private method _setDefaultsArray
        // which could be overridden if necessary)
        $defaults = $this->_setDefaultsArray($defaults ?? []);

        // merge in the localDefaults property so that simple
        // additions to the defaults array no longer requires
        // overriding the _setDefaultsArray method
        $defaults = array_merge($defaults, $this->localDefaults);

        $this->form->setDefaults($defaults);

        if ($this->DataEntryType == 'DirectEntry') {
            $smarty = new Smarty_NeuroDB;

            $formArray = $this->form->toElementArray();
            if (isset($this->testName)) {
                $formArray['tableID'] = "instrument_$this->testName";
            } else {
                $formArray['tableID'] = "instrument";
            }

            $smarty->assign('form', $formArray);
            $html = $smarty->fetch("directentry_form.tpl");
        } elseif (isset($_REQUEST['json']) == 'true') {
            // Mostly here for debugging. Realisticly, the JSON
            // representation will be retrieved through the API,
            // not the display function.
            return $this->toJSON();
        } else {
            $smarty    = new Smarty_NeuroDB;
            $formArray = $this->form->toElementArray();

            $smarty->assign('form', $formArray);
            $smarty->assign($this->tpl_data);
            $html = $smarty->fetch("instrument_html.tpl");
        }

        return $html;
    }

    /**
     * Accepts an array of existing values and sets them as defaults on the
     * instrument
     *
     * @param array $defaults the array of default values
     *
     * @return array the processed array ready for setDefaults()
     * @access private
     */
    function _setDefaultsArray(array $defaults): array
    {
        if (isset($defaults['Window_Difference'])
            && $defaults['Window_Difference'] != 0
        ) {
            $defaults['Candidate_Age']
                = $defaults['Candidate_Age'] . " (Age out of range)";
        }
        //Convert select multiple elements into a lorisform array
        if (!empty($this->selectMultipleElements)) {
            foreach ($this->selectMultipleElements AS $elname) {
                if (isset($defaults[$elname])) {
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
     * @return bool false if failure to save data
     * @access public
     */
    function save(): bool
    {
        if ($this->form->validate()) {
            $this->form->process([&$this, '_saveValues'], true);
            $this->score();
            $this->updateRequiredElementsCompletedFlag();
            $this->propagateData();
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

                return false;
            }
        }

        return true;
    }

    /**
     * This checks the current status of and instrument's data entry and updates
     * it accordingly in the database
     *
     * @return void
     */
    public function updateRequiredElementsCompletedFlag(): void
    {
        // determine the required elements completed flag, and store that in
        // the database
        $requiredElementsCompletedFlag
            = $this->_determineRequiredElementsCompletedFlag();
        $this->_setRequiredElementsCompletedFlag(
            $requiredElementsCompletedFlag
        );
    }

    /**
     * This handles the saving of the Candidate_Age and Window_Difference columns
     * to the database when the save function is called with a Date_taken.
     *
     * @param array $values A reference to the values saved from the form that
     *                      will be passed to update. This will be modified to
     *                      have Candidate_Age and Window_Difference if the
     *                      Date_taken field is included.
     *
     * @return void (but as a side-effect modifies array that was passed.)
     */
    function _saveCandidateAge(array &$values): void
    {
        if (!empty($values['Date_taken'])) {
            $DB  = $this->loris->getDatabaseConnection();
            $age = $this->getCandidateAge($values['Date_taken']);
            if (empty($age)) {
                throw new LorisException("Candidate age could not be found.");
            }

            $agedays   = $this->calculateAgeDays($age);
            $agemonths = $this->calculateAgeMonths($age);

            if (!empty($age)) {
                $query_params = [
                    'TN'  => $this->testName,
                    'CID' => $this->getCommentID(),
                ];

                $validage = $DB->pselectOne(
                    "SELECT MAX($agedays BETWEEN AgeMinDays AND AgeMaxDays)
                        FROM test_battery tb
                            JOIN test_names tn USING(Test_name)
                            JOIN flag f ON (f.TestID=tn.ID)
                            JOIN session s ON (s.ID=f.SessionID)
                        WHERE tb.Active='Y'
                            AND tb.Test_name=:TN
                            AND tb.CohortID=s.CohortID
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
                            JOIN test_names tn USING(Test_name)
                            JOIN flag f ON (f.TestID=tn.ID)
                            JOIN session s ON (s.ID=f.SessionID)
                        WHERE tb.Active='Y' AND tb.Test_name=:TN
                            AND tb.CohortID=s.CohortID
                            AND f.CommentID=:CID",
                        $query_params
                    );
                    foreach ($Windows as $window) {
                        if ($agedays < $window['AgeMinDays']) {
                            $delta = intval($window['AgeMinDays']) - $agedays;
                            if (abs($delta) < abs($values['Window_Difference'])
                                || $values['Window_Difference'] == 0
                            ) {
                                $values['Window_Difference'] = 0-abs($delta);
                            }
                        }
                        if ($agedays > $window['AgeMaxDays']) {
                            $delta = $agedays - intval($window['AgeMaxDays']);
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
     * Calculate age in months given and array with years months and days
     *
     * @param array $age containing the years, months and days of the age
     *
     * @return float
     */
    function calculateAgeMonths(array $age): float
    {
        $months = $age['year']*12 + $age['mon'] + ($age['day']/30);
        // 1 Decimal.
        $months = (round($months*10) / 10.0);
        return $months;
    }

    /**
     * Calculate age in days given and array with years months and days
     *
     * @param array $age containing the years, months and days of the age
     *
     * @return int
     */
    function calculateAgeDays(array $age): int
    {
        $days = $age['year']*365 + $age['mon']*30 + $age['day'];
        return $days;
    }

    /**
     * This removes all the value of any field which has its accompagning
     * _status field set.
     *
     * @param array $values A reference to the array which will be passed
     *                      to $DB->update().
     *
     * @return void (but as a side-effect modifies &$values array)
     */
    function _nullStatus(array &$values): void
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
    function _saveValues(array $values): void
    {
        if (strrpos($this->testName, "_proband") === false) {
            $this->_saveCandidateAge($values);
        }

        // Save UserID, the data entry personnel, into flag Data and
        // instrument table
        $user = \NDB_Factory::singleton()->user();
        if (! $user instanceof \LORIS\AnonymousUser) {
            // Add UserID to $values
            $values['UserID'] = $user->getUsername();
        }

        //Convert select multiple elements into database storable values
        if (!empty($this->selectMultipleElements)) {
            foreach ($this->selectMultipleElements AS $elname) {
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
    function _save(array $values): void
    {
        $db = $this->loris->getDatabaseConnection();

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
            $values = Utility::nullifyEmpty($values, $key);
        }

        if ($this->jsonData !== true && !empty($values)) {
            // If the instrument is saving as JSON into the Data column, the
            // table may not exist, so don't try and update it.
            $db->update(
                $this->table,
                $values,
                ['CommentID' => $this->getCommentID()]
            );
        }

        // Extract the old data and merge it with what was submitted so that we
        // don't overwrite data from other pages.
        $oldData = $db->pselectOne(
            "SELECT id.Data FROM flag f
                    JOIN instrument_data id ON (id.ID=f.DataID)
                WHERE CommentID=:cid",
            ['cid' => $this->getCommentID()]
        );

        // (The PDO driver seems to return null as "null" for JSON column types)
        if (!empty($oldData) && $oldData !== "null") {
            $oldData = json_decode($oldData, true);
        } else {
            $oldData = [];
        }
        $newData = array_merge($oldData ?? [], $values);

        // If there's already a row with the same data, re-use the DataID.
        // Otherwise, insert it, then update the DataID on flag.
        $jsonencoded = json_encode($newData);
        $newDataID   = $db->pselectOne(
            "SELECT ID FROM instrument_data WHERE Data=:json",
            [ 'json' => $jsonencoded]
        );
        if ($newDataID === null) {
            $db->unsafeInsert(
                "instrument_data",
                ['Data' => $jsonencoded],
            );
            $newDataID = $db->getLastInsertId();
        }
        assert($newDataID !== null);
        $db->update(
            "flag",
            ["DataID" => $newDataID],
            ['CommentID' => $this->getCommentID()],
        );

        $this->instanceData = $newData;
    }

    /**
     * Adds metadata fields (such as Examiner and Date_taken) to the
     * current form
     *
     * @return void
     * @access private
     */
    function _addMetadataFields(): void
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $dateOptions = [
            'language'         => 'en',
            'format'           => 'YMd',
            'minYear'          => $config->getSetting('startYear'),
            'maxYear'          => $config->getSetting('endYear'),
            'addEmptyOption'   => true,
            'emptyOptionValue' => null,
        ];

        $this->dateOptions = $dateOptions;

        $this->addBasicDate('Date_taken', 'Date of Administration', $dateOptions);

        if (strrpos($this->testName ?? '', '_proband') === false) {
            if (!$this->postMortem) {
                $this->addScoreColumn(
                    'Candidate_Age',
                    'Candidate Age (Months)'
                );
            } else {
                $this->addScoreColumn(
                    'Candidate_Age',
                    'Candidate Age at Death (Months)'
                );
            }
            $this->addScoreColumn(
                'Window_Difference',
                'Window Difference (+/- Days)'
            );
        }
        $examiners = $this->_getExaminerNames();
        $this->addSelect('Examiner', 'Examiner', $examiners);

        $this->addRule(
            'Date_taken',
            'Date of Administration is required',
            'required'
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
     * @return array
     * @throws \ConfigurationException
     */
    function _getCertificationConfig(): array
    {
        $config = \NDB_Config::singleton();

        $CertificationConfig      = $config->getSetting("Certification");
        $CertificationEnabled     = $CertificationConfig['EnableCertification'];
        $CertificationProjects    = [];
        $CertificationInstruments = [];

        if ($CertificationEnabled) {
            // Throw exception if config file is formatted incorrectly.
            if (!is_array(
                $CertificationConfig['CertificationProjects']
            )
                || !is_array(
                    $CertificationConfig['CertificationInstruments']
                )
            ) {
                throw new \ConfigurationException(
                    self::ERROR_CERTIFICATION_BAD_FORMATTING
                );
            }
            foreach (
                Utility::associativeToNumericArray(
                    $CertificationConfig['CertificationProjects']
                )
                as $value
            ) {
                if (is_array($value['CertificationProject'])) {
                    $value = $value['CertificationProject'];
                }
                foreach ($value as $projID) {
                    $CertificationProjects[$projID] = $projID;
                }
            }
            foreach (
                Utility::associativeToNumericArray(
                    $CertificationConfig['CertificationInstruments']
                )
                as $instrument
            ) {
                foreach (
                    Utility::associativeToNumericArray($instrument['test'])
                    as $test
                ) {
                    $CertificationInstruments[] = $test['@']['value'];
                }
            }
        }
        return [
            $CertificationEnabled,
            $CertificationProjects,
            $CertificationInstruments,
        ];
    }


    /**
     * Gets the list of examiners for the site of the current instrument
     *
     * @return array
     */
    function _getExaminerNames(): array
    {
        if (empty($this->getCommentID())) {
            return [];
        }

        $db = $this->loris->getDatabaseConnection();

        $centerID = $db->pselectOne(
            "SELECT session.CenterID FROM session, flag
            WHERE session.ID=flag.SessionID AND flag.CommentID=:cmnt_id",
            ['cmnt_id' => $this->getCommentID()]
        );
        if (is_array($centerID)) {
            $centerID = null;
        }

        $candID    = $_REQUEST['candID'] ?? '';
        $sessionID = $this->getSessionID();

        $project = $db->pselectOne(
            "SELECT ProjectID from session where CandID =:cnd_id AND ID=:sid",
            [
                'cnd_id' => $candID,
                'sid'    => $sessionID,
            ]
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
                ['tst_name' => $this->testName]
            );
            $results = $db->pselectWithIndexKey(
                "SELECT c.examinerID, e.full_name, u.Email
                 FROM certification c
                     JOIN examiners e
                         ON (c.examinerID = e.examinerID)
                     JOIN examiners_psc_rel epr
                         ON (epr.examinerID=e.examinerID)
                     LEFT JOIN users u ON u.ID=e.userID
                 WHERE c.testID =:tid
                    AND c.pass =:cert_id
                    AND epr.centerID =:cid
                 ORDER BY full_name",
                [
                    'tid'     => $test_id,
                    'cert_id' => 'certified',
                    'cid'     => $centerID,
                ],
                'examinerID'
            );
        } else {
            $results = $db->pselectWithIndexKey(
                "SELECT e.examinerID, e.full_name, u.Email
                     FROM examiners e
                         JOIN examiners_psc_rel epr
                             ON (epr.examinerID=e.examinerID)
                     LEFT JOIN users u ON u.ID=e.userID
                 WHERE epr.centerID=:centID
                     ORDER BY full_name",
                ['centID' => $centerID],
                'examinerID'
            );
        }
        $examiners = [
            '' => ''
        ];
        if (is_array($results) && !empty($results)) {
            foreach ($results AS $eid => $row) {
                $name = $row['full_name'];
                if (in_array($name, $examiners)) {
                    // If name already in examiners, set first case of name
                    // with email (if exists)
                    $duplicateID    = array_search($name, $examiners);
                    $duplicateEmail = $results[$duplicateID]['Email'];
                    $emailString    = empty($duplicateEmail) ? "" :
                        " ({$duplicateEmail})";
                    $examiners[$duplicateID] = $name . $emailString;
                    // Set new case of name with email as well
                    $emailString     = empty($row['Email']) ? "" :
                        " ({$row['Email']})";
                    $examiners[$eid] = $name . $emailString;
                } else {
                    $examiners[$eid] = $name;
                }
            }
        }
        return $examiners;
    }


    /**
     * Return the full, human readable name for the
     * current instrument.
     *
     * @return ?string the full name of the instrument
     */
    abstract public function getFullName(): ?string;

    /**
     * Gets the current object instance CommentID
     *
     * @return string|null          the CommentID of this instrument.
     * @access public
     */
    function getCommentID(): ?string
    {
        return $this->commentID;
    }


    /**
     * Freezes the current form
     *
     * @return void
     * @access public
     */
    function freeze(): void
    {
        if (isset($_REQUEST['json']) && $_REQUEST['json'] === 'true') {
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
        $this->dateOfAdministration = $this->getFieldValue('Date_taken');

        return $this->dateOfAdministration;
    }


    /**
     * Returns a list of subtests of the current instrument.
     * The returned array should be a list of rows where each
     * row has a key for "Name" (the subpage name) and "Description"
     * (the human readable name)
     *
     * @return array
     */
    abstract function getSubtestList(): array;

    /**
     * This runs the XIN rules on all the elements on the current page to ensure
     * that no rules were violated.
     *
     * @param array $elements The value of all the elements on the current page
     *                        to validate.
     *
     * @return array|true associative array of errors (fieldname => errormessage)
     *         or true if no errors.
     */
    function XINValidate(array $elements)
    {
        unset($elements['key'], $elements['pageNum'], $elements['nextpage']);
        $this->XINDebug = false;  //Turn this on to see rules debuggin output

        $errors = [];
        foreach ($elements AS $elname => $elvalue) {
            //If the element is a group (and thus elvalue is an array)
            //trigger the Null Value default rule if ANY of the values
            //in the group are empty.
            $flag = true;
            if (is_array($elvalue)) {
                foreach ($elvalue AS $val) {
                    if ($val === "") {
                        $flag = false;
                    }
                }
            }

            //If the answer is empty (or its a group and one of answers in the
            //group is empty) then run the rules
            if ($elvalue==="" || $flag==false) {
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
                    && !in_array($elname, ["page", "subtest"])
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
     * @return void
     */
    function XINRegisterRule(
        string $elname,
        array $rules,
        string $message="",
        string $group=""
    ): void {
        $this->XINRules[$elname]['message'] = $message;
        $this->XINRules[$elname]['group']   = $group;

        foreach ($rules AS $rule) {
            $this->XINRules[$elname]['rules'][] = $rule;
        }
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
     * @param string $elname   The name of the element being validated
     * @param array  $elements Array of values submitted on current page.
     * @param array  $rules    Array of rules that have been registered.
     *
     * @return array of errors (fieldname => error message)
     */
    function XINRunElementRules(
        string $elname,
        array $elements,
        array $rules
    ): array {
        $errors = [];
        //Conditions for the rule to be true, thus the element to be required.
        $rule_outcomes = [];
        $rules_array   = [];

        foreach ($rules['rules'] AS $rule) {
            //Loop through the assigned rules (which is the array of formatted
            //statements passed in XINRegisterRule)
            //If this is an OR rule using two different controllers explode it
            //at the pipe.  ex: q_1{@}=={@}yes|q_2{@}=={@}yes
            $isInterfieldOr = false;
            if (substr_count($rule, '{@}') > 2 && strstr($rule, '|')) {
                $rules_array    = explode("|", $rule);
                $isInterfieldOr = true;
            } else {  //Otherwise its a regular rule.  ex: q_1{@}=={@}yes
                $rules_array[] = $rule;
            }
            //Loop through the rules (will only be one rule if this is not an OR)
            $or_conditions = false;
            $numRules      = count($rules_array);
            for ($i = 0; $i < $numRules; $i++) {
                $rule = explode("{@}", $rules_array[$i]);
                //Some rules compare against multiple values, handle this here.
                if (stristr($rule[2], "|")) {  //ex: q_1{@}=={@}yes|no
                    $values = explode("|", $rule[2]);
                } else {  //ex: q_1{@}=={@}yes
                    $values = [$rule[2]];
                }

                //Test the condition
                if ($this->XINDebug) {
                    //debugging code
                    echo "$rule[0] ";
                }

                //Handle select multiples who's controller values are arrays.

                //explicitly cast the controller value as an array
                if (!is_array($elements[$rule[0]])) {
                    $elements[$rule[0]] = [$elements[$rule[0]]];
                }
                //Foreach controller value run the rule.
                foreach ($elements[$rule[0]] as $controller_value) {
                    $ElementResult = $this->XINRunRuleFunction(
                        $controller_value,
                        $values,
                        $rule[1]
                    );

                    if ($ElementResult) {
                        $or_conditions = true; //If any of the OR rules is true
                    } else if (!$isInterfieldOr) {
                        $or_conditions = false;
                    }
                }
            }
            //If NONE of the or_conditions were true the field is NOT required.
            if ($or_conditions == false) {
                $rule_outcomes[] = false;
            } else {
                $rule_outcomes[] = true;
            }
        }
        //If all of the conditions were true then print the error message
        if (!in_array(false, $rule_outcomes)) {
            $el          = $rules['group'] != "" ? $rules['group'] : $elname;
            $errors[$el] = $rules['message'];
        }
        return $errors;
    }

    /**
     * Run a XIN rule on an individual element
     *
     * @param ?string $controller The element which affects the validity of this
     *                            element
     * @param array   $values     Array of values which will invalidate the rule.
     * @param string  $operator   The operator which is used to compare the rule.
     *
     * @return boolean true if element should be required, false otherwise.
     */
    function XINRunRuleFunction(
        ?string $controller,
        array $values,
        string $operator
    ): bool {
        $is_required = true;
        //Loop through the conditions to test against (for most rules it
        //will only be one value)
        //If all of the conditions are true (ie: all conditions are met
        //to pop a required rule)
        $valFlag = [];
        foreach ($values AS $value) {
            switch ($operator) {
            case '==':
                if ($controller != $value) {
                    $valFlag[] = false;
                }
                break;
            case '!=':
                if ($controller == $value) {
                    $valFlag[] = false;
                }
                break;
            default:
                throw new \LorisException(
                    "Unsupported operator ($operator) for XIN Rule."
                    . " If this used to work, please file a bug report."
                );
            }
            if ($this->XINDebug) {
                //debugging code
                echo "'$controller' $operator '$value'<br>";
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
     *
     * @param string $field The field to get from this instrument
     *
     * @return string The value of the field, or false if it's empty.
     */
    function getFieldValue(string $field)
    {
        $allValues  = $this->getInstanceData();
        $dictionary = $this->getDataDictionary();

        foreach ($dictionary as $item) {
            if ($field === $item->fieldname) {
                return $allValues[$field];
            }
        }
        throw new \OutOfBoundsException(
            "Invalid field $field for instrument $this->testName"
        );
    }

    /**
     * Gets the value of a field $field for this instrument for a
     * DictionaryItem that was retrieved from getDataDictionary.
     *
     * This differs from getFieldValue in that getFieldValue takes
     * a string and validates that it is in the dictionary in O(n)
     * time while getDictionaryValue assumes the DictionaryItem
     * exists and returns the value in O(1) time.
     *
     * @param DictionaryItem $field The field to get from this instrument

     * @return mixed
     */
    function getDictionaryValue(DictionaryItem $field)
    {
        $allValues = $this->getInstanceData();
        $fieldName = substr($field->getName(), strlen($this->testName)+1);

        return $allValues[$fieldName] ?? '';
    }

    private ?SessionID $sessionID;
    /**
     * Gets the sessionID for the timepoint to which this instrument pertains
     *
     * @return ?SessionID The sessionID
     */
    function getSessionID(): ?SessionID
    {
        if (empty($this->sessionID)) {
            $query  = "SELECT SessionID FROM flag WHERE CommentID = :CID";
            $result = \NDB_Factory::singleton()->database()->pselectOne(
                $query,
                [
                    'CID' => $this->getCommentID(),
                ]
            );
            if (empty($result)) {
                return null;
            }
            $this->sessionID = new SessionID($result);
        }
        return $this->sessionID;
    }

    private ?string $visitLabel = null;
    /**
     * Gets the VisitLabel for the timepoint for this instrument.
     *
     * @return string The visit label
     */
    function getVisitLabel(): string
    {
        if ($this->visitLabel === null) {
            $this->visitLabel = \TimePoint::singleton(
                $this->getSessionID()
            )->getVisitLabel();
        }
        return $this->visitLabel;
    }

    /**
     * Gets the cohortID for the timepoint for this instrument.
     *
     * @return int|null The cohortID
     */
    function getCohortID(): ?int
    {
        $sessionID = $this->getSessionID();
        if (!is_null($sessionID)) {
            $timepoint = \TimePoint::singleton($sessionID);
            $cohortID  = $timepoint->getCohortID();
            return $cohortID;
        }
        return null;
    }

    /**
     * Determines what percentage of the data entry has been completed, based on the
     * number of fields in $_requiredElements having data
     *
     * @return int the data entry completion percentage
     */
    function determineDataEntryCompletionProgress(): int
    {
        // don't bother checking anything if the required elements array is empty
        if (empty($this->_requiredElements)) {
            return 100;
        }
        $allData       = $this->getInstanceData();
        $unanswered    = 0;
        $totalElements = count($this->_requiredElements);
        foreach ($this->_requiredElements as $field) {
            // consider status field if not_answered chosen as an answer
            $statusField = $field . '_status';
            // field shouldn't be just empty() b/c 0 is a valid
            // value for some required fields
            if (((($allData[$field] ?? null) === null)
                || (($allData[$field] ?? "") === ""))
                && empty($allData[$statusField])
            ) {
                $unanswered++;
            }
        }
        if ($unanswered == 0) {
            return 100;
        } else if ($unanswered == $totalElements) {
            return 0;
        }

        return (int)round((($totalElements-$unanswered)/$totalElements)*100);
    }

    /**
     * Determines what the required elements completed flag should be set to
     *
     * @return string  Either 'Y' or 'N'
     */
    function _determineRequiredElementsCompletedFlag(): string
    {
        // don't bother checking anything if the required elements array is empty
        if (empty($this->_requiredElements)) {
            return 'Y';
        }

        $allData = $this->getInstanceData();
        foreach ($this->_requiredElements as $field) {
            // consider status field if not_answered chosen as an answer
            $statusField = $field . '_status';
            // field shouldn't be just empty() b/c 0 is a valid
            // value for some required fields
            if ((is_null($allData[$field] ?? null) || $allData[$field] === "")
                && empty($allData[$statusField])
            ) {
                return 'N';
            }
        }

        return 'Y';
    }


    /**
     * Gets the data entry completion status for this instrument
     *
     * @return string Either 'Y' or 'N'
     */
    function getRequiredElementsCompletedFlag(): string
    {
        $db     = $this->loris->getDatabaseConnection();
        $status = $db->pselectOne(
            "SELECT Required_elements_completed FROM flag WHERE CommentID=:CID",
            ['CID' => $this->getCommentID()]
        );
        if ($status !== 'Y' && $status !== 'N') {
            throw new LorisException(
                "Invalid Data entry completion status encountered"
            );
        }
        return $status;
    }


    /**
     * Sets the data entry completion status
     *
     * @param string $status The status - either 'Y'
     *                       or 'N'
     *
     * @return void
     */
    function _setRequiredElementsCompletedFlag(string $status): void
    {
        if (!in_array($status, ['Y', 'N'], true)) {
            throw new InvalidArgumentException(
                "Invalid status passed to _setRequiredElementsCompleted - "
                . "'$status' should have been either "
                . "'Y' or 'N'<br>\n"
            );
        }
        $DB = $this->loris->getDatabaseConnection();
        $DB->update(
            "flag",
            ["Required_elements_completed" => $status],
            ['CommentID' => $this->getCommentID()]
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
     * @return void
     */
    function addYesNoElement(
        string $field,
        string $label,
        array $rules=[],
        string $rule_message='This field is required.'
    ): void {
        $this->addSelect(
            $field,
            $label,
            [
                ''             => '',
                'yes'          => 'Yes',
                'no'           => 'No',
                'not_answered' => 'Not Answered',
            ]
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
     *                             'q_40{@}=={@}1_yes',
     *                             'q_40_b{@}=={@}1_yes'
     *                             )
     * @param string $rule_message rule message to display
     * @param array  $refusals     options in the refusal select (ie. Refusal,
     *                             Unknown, Not Answered).
     *
     * @return void
     */
    function addTextElement(
        string $field,
        string $label,
        array $rules=[],
        string $rule_message='This field is required.',
        array $refusals = [
            ''             => '',
            'not_answered' => 'Not Answered',
        ]
    ): void {
        $group   = [];
        $group[] = $this->createText($field, $label);
        $this->WrapperTextElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field."_status",
            "",
            $refusals,
            ['class' => 'form-control input-sm not-answered']
        );

        $this->addGroup($group, $field.'_group', $label, '');
        unset($group);
        $rules_array = array_merge([$field.'_status{@}=={@}'], $rules);
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
     * @return void
     * @note   This was only ever used by the EARLI instrument and should be moved
     *       out of the NDB_BVL_Instrument into an EARLI base class.
     */
    function addTextAreaElementRD(string $field,
        string $label,
        array $rules=[],
        string $rule_message='You must specify or select from the drop-down'
    ): void {
        $group   = [];
        $group[] = $this->form->createElement(
            "textarea",
            $field,
            '',
            [],
            [
                'cols' => 25,
                'rows' => 4,
            ]
        );
        $group[] = $this->createSelect(
            $field."_status",
            "",
            [
                ''               => '',
                "88_refused"     => "88 Refused",
                "99_do_not_know" => "99 Do not know",
                'not_answered'   => 'Not Answered',
            ]
        );

        $this->addGroup($group, $field.'_group', $label, '');
        unset($group);
        $rules_array = array_merge([$field.'_status{@}=={@}'], $rules);
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
     * @return void
     */
    function addTextAreaElement(
        string $field,
        string $label,
        array $rules=[],
        string $rule_message='This field is required.'
    ): void {
        $group   = [];
        $group[] = $this->form->createElement(
            "textarea",
            $field,
            $label,
            [],
            [
                'cols'  => 25,
                'rows'  => 4,
                'class' => 'form-control',
            ]
        );
        $this->WrapperTextElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field."_status",
            "",
            [
                ''             => '',
                'not_answered' => 'Not Answered',
            ],
            ['class' => 'form-control input-sm not-answered']
        );
        $this->addGroup($group, $field.'_group', $label, '');
        unset($group);
        $rules_array = array_merge([$field.'_status{@}=={@}'], $rules);
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
     * @param string      $field        Name given to the HTML form Element
     *                                  being created
     * @param string      $label        The question text to display
     * @param array       $rules        Additional rules to apply to the element
     *                                  being added,{@} delimited
     * @param string|null $rule_message Message to display upon rule violation.
     *
     * @return void
     * @note   only used by EARLI? What is "dnk"? This should be cleaned up to use
     */
    function addHourMinElement(
        string $field,
        string $label,
        array $rules = [],
        ?string $rule_message = null
    ): void {
        if ($rule_message === null) {
            $rule_message = "You are required to select a status "
                . "if you want to leave this time blank.";
        }

        $group   = [];
        $group[] = $this->form->createElement(
            "time",
            $field,
            '',
        );

        $group[] = $this->createSelect(
            $field . "_status",
            "",
            [
                ''             => null,
                "dnk"          => "DNK",
                "refusal"      => "Refusal",
                'not_answered' => 'Not Answered',
            ]
        );
        $this->addGroup($group, $field . "_group", $label, '');
        $this->XINRegisterRule(
            $field,
            array_merge($rules, [$field . '_status{@}=={@}']),
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
     * @param string $name    Name prepended to the form element
     * @param string $label   Element label
     * @param array  $options optional override of class's dateOptions
     *
     * @return void
     */
    function addDateElement(
        string $name,
        string $label,
        array $options = []
    ): void {

        if (empty($options)) {
            $options = $this->dateOptions;
        }

        $group   = [];
        $group[] = $this->createDate(
            $name . "_date",
            $label,
            $options,
            [
                'class' => 'form-control input-sm '.$name."_date",
                'style' => 'max-width:33%; display:inline-block;',
            ]
        );
        $this->WrapperDateWithStatusElements[$name . "_date"] = $group[0];

        $group[] = $this->createSelect(
            $name . "_date_status",
            '',
            [
                ''             => '',
                'not_answered' => "Not Answered",
            ],
            ['class' => 'form-control input-sm not-answered']
        );

        $this->addGroup(
            $group,
            $name . "_date_group",
            $label,
            $this->_GUIDelimiter,
        );

        unset($group);
        $this->XINRegisterRule(
            $name . "_date",
            [$name . "_date_status{@}=={@}"],
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
     * @return void
     */
    function addMonthYear(string $field, string $label, array $options=[]): void
    {
        if (is_array($options)) {
            $options['format'] = 'YM';
        }
        $this->form->addElement('date', $field, $label, $options);
    }


    /**
     * Wrapper with a user-created date group, a status box and appropriate rule
     *
     * @param string $name      The database name to add to the form
     * @param string $label     The question text
     * @param array  $dateArray Date options to use
     *
     * @return void
     * @note   This was only ever used by the EARLI instrument and should be
     *       moved out of the NDB_BVL_Instrument into an EARLI base class.
     */
    function addCustomDateElement(
        string $name,
        string $label,
        array $dateArray
    ): void {
        $group   = [];
        $group[] = $this->createDate($name . "_date", '', $dateArray);
        //add to array of dates and times.
        $group[] = $this->createSelect(
            $name . "_date_status",
            '',
            [
                ''               => '',
                '88_refused'     => "88 Refused",
                '99_do_not_know' => "99 Do not know",
                'not_answered'   => "Not Answered",
            ]
        );
        $this->addGroup(
            $group,
            $name . "_date_group",
            $label,
            $this->_GUIDelimiter,
        );
        unset($group);
        $this->XINRegisterRule(
            $name . "_date",
            [$name . "_date_status{@}=={@}"],
            "You must specify or select from the drop-down",
            $name . "_date_group"
        );
        $this->XINRegisterRule(
            $name . "_date_status",
            [$name . "_date{@}=={@}"],
            "You must specify or select from the drop-down",
            $name . "_date_group"
        );

    }



    /**
     * Wrapper to create a field that only accepts a number, with an
     * accompanying status field.
     *
     * @param string $field The database field in which the response
     *                      will be stored
     * @param string $label The question text to display
     *
     * @return void
     */
    function addNumericElement(
        string $field,
        string $label
    ): void {
        $group   = [];
        $group[] = $this->createText($field, $label);
        $this->WrapperNumericElements[$field] = $group[0];
        $group[] = $this->createSelect(
            $field . "_status",
            '',
            [
                ''             => '',
                'not_answered' => "Not Answered",
            ],
            ['class' => 'form-control input-sm not-answered']
        );
        $this->addGroup($group, $field . "_group", $label, '');
        unset($group);
        $this->addGroupRule(
            $field . "_group",
            [[["Value must be numeric.", 'numeric']]]
        );
        $this->XINRegisterRule(
            $field,
            [$field . '_status{@}=={@}'],
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
     * @return void
     */
    function addNumericElementRD(string $field, string $label): void
    {
        $group   = [];
        $group[] = $this->createText($field, $label);
        $group[] = $this->createSelect(
            $field . "_status",
            '',
            [
                ''               => '',
                "88_refused"     => "88 Refused",
                "99_do_not_know" => "99 Do not know",
                'not_answered'   => "Not Answered",
            ],
            ['class' => 'form-control input-sm not-answered']
        );
        $this->addGroup($group, $field . "_group", $label, '');
        unset($group);
        $this->addGroupRule(
            $field . "_group",
            [[["Numbers only, please", 'numeric']]]
        );
        $this->XINRegisterRule(
            $field,
            [$field . '_status{@}=={@}'],
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
     * @return void
     */
    function _nullScores(array $scoreCols): void
    {
        // set the scoring cols to NULL
        $scores = [];
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

        $this->_save($scores);
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
    function diff(NDB_BVL_Instrument $otherInstrument): array
    {
        // Load this instance data
        $thisData = $this->getInstanceData();

        // Load other instance data
        $otherData = $otherInstrument->getInstanceData();

        // Create the return object data structure
        $diff = [];

        // Loop over this instance data
        foreach ($thisData AS $key=>$value) {
            if (!in_array($key, $this->_doubleDataEntryDiffIgnoreColumns)) {
                if ($otherData[$key] != $value) {
                    $diff[] = [
                        'TestName'       => $this->testName,
                        'ExtraKeyColumn' => null,
                        'ExtraKey1'      => ' ',
                        'ExtraKey2'      => ' ',
                        'FieldName'      => $key,
                        'CommentId1'     => $this->getCommentID(),
                        'Value1'         => $value,
                        'CommentId2'     => $otherInstrument->getCommentID(),
                        'Value2'         => $otherData[$key],
                    ];
                }
            }
        }

        // Return the diffs
        return $diff;
    }


    /**
     * Get the default instance data which consists of all field names
     * in the dictionary and a null value.
     *
     * @return array
     */
    protected function defaultInstanceData()
    {
        $val        = [];
        $dictionary = $this->getDataDictionary();

        foreach ($dictionary as $item) {
            $val[$item->fieldname] = null;
        }
        return $val;
    }

    /**
     * Gets the data from an instrument out of the database and returns it
     * as an array.
     *
     * @return array containing the data for each field in this instrument
     */
    public function getInstanceData(): array
    {
        if ($this->instanceData !== null) {
            return $this->instanceData;
        }

        $db = $this->loris->getDatabaseConnection();

        if ($this->jsonData) {
            $jsondata = $db->pselectOne(
                "SELECT id.Data FROM flag f
                        JOIN instrument_data id ON (id.ID=f.DataID)
                    WHERE CommentID=:CID",
                ['CID' => $this->getCommentID()]
            );

            $this->instanceData = json_decode(
                $jsondata ?? '',
                true
            ) ?? $this->defaultInstanceData();
        } else {
            $defaults = $db->pselectRow(
                "SELECT * FROM $this->table WHERE CommentID=:CID",
                ['CID' => $this->getCommentID()]
            );
            // This is only included because it's the primary key. JSON
            // data does not include it. Unset so that the two types are
            // consistent. Places that need the commentID should be using
            // NDB_BVL_Instrument->getCommentID()
            unset($defaults['CommentID']);

            $this->instanceData = $defaults ?? $this->defaultInstanceData();
        }
        return $this->instanceData;
    }

    /**
     * Gets the data from an instrument out of the database and returns it
     * as an array.
     *
     * @param NDB_BVL_Instrument $instrumentInstance The object whose data is
     *                                               to be retrieved.
     *
     * @return array containing the data for each field in this instrument
     *
     * @deprecated use $instrumentInstance->getInstanceData() instead
     */
    static function loadInstanceData(NDB_BVL_Instrument $instrumentInstance): array
    {
        error_log(
            'Warning: loadInstanceData($inst) is deprecated and will be removed'
            . ' in a future version of LORIS. Use $inst->getInstanceData() instead.'
        );
        $db = \NDB_Factory::singleton()->database();

        if ($instrumentInstance->jsonData) {
            $jsondata = $db->pselectOne(
                "SELECT Data FROM flag WHERE CommentID=:CID",
                ['CID' => $instrumentInstance->getCommentID()]
            );
            return json_decode($jsondata, true) ?? [];
        } else {
            $defaults = $db->pselectRow(
                "SELECT * FROM $instrumentInstance->table WHERE CommentID=:CID",
                ['CID' => $instrumentInstance->getCommentID()]
            );
            return $defaults ?? [];
        }
    }

    /**
     * Loads multiple instruments representing multiple commentIDs from the
     * database in bulk. This function must be called on an instrument instantiated
     * as \NDB_BVL_Instrument::factory('instrumentname') without a comment ID, and
     * will return an array of copies of the instrument type with the data for
     * the given commentIDs loaded.
     *
     * @param $commentIDs ?string[]                   A list of commentIDs to load
     *                    in bulk. If null, load all
     *                    CommentIDs for this instrument
     * @param ?\LORIS\Data\Query\QueryTerm $condition  A single QueryTerm that
     *                                                 matched instances must
     *                                                 meet to be loaded
     *
     * @return Generator<\NDB_BVL_Instrument>
     */
    function bulkLoadInstanceData(
        ?iterable $commentIDs,
        ?\LORIS\Data\Query\QueryTerm $condition = null,
    ): iterable {
        if ($this->commentID !== null && $this->commentID !== '') {
            throw new \LogicException(
                "Must bulk load from instrument loaded without commentID"
            );
        }
        $db = $this->loris->getNewDatabaseConnection();
        $db->setBuffering(false);

        $prepValues = [];

        if ($commentIDs !== null) {
            $db->run(
                "CREATE TEMPORARY TABLE load_comment_ids(
			CommentID varchar(255) CHARACTER SET utf8mb3 NOT NULL,
			PRIMARY KEY(CommentID)
			-- FOREIGN KEY (CommentID) REFERENCES flag(CommentID)
		);"
            ); // temporary tables can't have foreign keys
            foreach ($commentIDs as $commentID) {
                $prepValues[] = $commentID;
                if (count($prepValues) > 500) {
                    $db->run(
                        "INSERT INTO load_comment_ids (CommentID) VALUES ('"
                        . join("'), ('", $prepValues)
                        . "');"
                    );
                    $prepValues = [];
                }
            }
            if (count($prepValues) > 0) {
                $db->run(
                    "INSERT INTO load_comment_ids (CommentID) VALUES ('"
                    . join("'), ('", $prepValues)
                    . "');"
                );
            }
        }

        $params = [];
        if ($this->jsonData) {
            $conditions   = ['tn.test_name=:tn'];
            $params['tn'] = $this->testName;
            if ($commentIDs !== null) {
                $conditions[] = "CommentID IN 
			    (SELECT CommentID FROM load_comment_ids)";
            }
            if ($condition !== null) {
                $conditions[] = 'JSON_VALUE(Data, "$.'
                . substr(
                    $condition->dictionary->getName(),
                    strlen($this->testName)+1
                )
                . '") '
                . \LORIS\Data\Query\SQLQueryEngine::sqlOperator($condition->criteria)
                . ' '
                . \LORIS\Data\Query\SQLQueryEngine::sqlValue(
                    $condition->dictionary,
                    $condition->criteria,
                    $params
                )
                . ' ';
            }
            $where = 'WHERE ' . join(' AND ', $conditions);
            $query = "SELECT CandID,
		    	SessionID,
                        CommentID,
                        session.Visit_Label as VisitLabel,
                        Data
                    FROM flag
                        JOIN session ON (session.ID=flag.SessionID)
                        JOIN instrument_data ON (flag.DataID=instrument_data.ID)
			JOIN test_names tn ON (tn.ID=flag.TestID)
			$where";

            $jsondata = $db->pselect($query, $params);
            foreach ($jsondata as $row) {
                    $newinst = clone $this;

                $newinst->candID           = new CandID($row['CandID']);
                    $newinst->commentID    = $row['CommentID'];
                    $newinst->visitLabel   = $row['VisitLabel'];
                    $newinst->sessionID    = new SessionID($row['SessionID']);
                    $newinst->instanceData = json_decode(
                        $row['Data'] ?? '{}',
                        true,
                    ) ?? $this->defaultInstanceData();
                    yield $newinst;
            }
            return;
        } else {
            $conditions   = ['tn.test_name=:tn'];
            $params['tn'] = $this->testName;
            if ($commentIDs !== null) {
                $conditions[] = "t.CommentID IN
			    (SELECT CommentID FROM load_comment_ids)";
            }
            if ($condition !== null) {
                $conditions[] = 't.'
                . substr(
                    $condition->dictionary->getName(),
                    strlen($this->testName)+1
                )
                . ' '
                . \LORIS\Data\Query\SQLQueryEngine::sqlOperator(
                    $condition->criteria
                )
                . ' '
                . \LORIS\Data\Query\SQLQueryEngine::sqlValue(
                    $condition->dictionary,
                    $condition->criteria,
                    $params
                )
                . ' ';
            }
            $where = 'WHERE ' . join(' AND ', $conditions);
            $query = "SELECT 
		    session.CandID as CandID,
		    t.CommentID as CommentID,
                    session.Visit_Label as VisitLabel,
                    session.ID as SessionID, t.*
                 FROM $this->table t
                    JOIN flag f ON (t.CommentID=f.CommentID)
		    JOIN test_names tn ON (tn.ID=f.TestID)
                    JOIN session ON (f.SessionID=session.ID)
		 $where";
            $data  = $db->pselect($query, $params);
            foreach ($data as $row) {
                    $newinst = clone $this;

                $newinst->candID         = new CandID($row['CandID']);
                    $newinst->commentID  = $row['CommentID'];
                    $newinst->visitLabel = $row['VisitLabel'];
                    $newinst->sessionID  = new SessionID($row['SessionID']);
                    unset($row['CommentID'], $row['VisitLabel'], $row['SessionID']);

                    $newinst->instanceData = $row;

                    yield $newinst;
            }
            return;
        }
    }

    /**
     * Calls all functions which propagate data to other sources.
     *
     * @return void
     */
    function propagateData()
    {
        if (strpos($this->getCommentID(), "DDE") === false) {
            $this->propagateLatestDiagnosisData();
        }
    }

    /**
     * Checks if current instrument contains a diagnosis track
     * and determines whether it is the latest diagnosis. If so,
     * it propagates the data to the LatestDiagnosis field in the
     * candidate table.
     *
     * @return void
     */
    function propagateLatestDiagnosisData()
    {
        // if the instrument is not part of a configured Dx Tracjectory; return
        $dxEvolutionID = $this->getConfiguredDiagnosisTrajectory();
        if (is_null($dxEvolutionID)) {
            return;
        }

        // Update candidate's diagnosis evolution
        $this->updateCandidateDiagnosisEvolution($dxEvolutionID);
    }

    /**
     * Determines whether this instrument is part of a configured
     * diagnosis trajectory.
     *
     * @return string|null The DxEvolutionID of this instrument's configured
     *                      diagnosis trajectory.
     */
    function getConfiguredDiagnosisTrajectory()
    {
        $DB        = $this->loris->getDatabaseConnection();
        $timepoint = \TimePoint::singleton($this->getSessionID());

        // Check if there is a diagnosis trajectory defined
        // for this instrument with current session's visit & project
        $dxEvolutionID = $DB->pselectOne(
            "SELECT DxEvolutionID FROM diagnosis_evolution
            WHERE instrumentName=:tn 
            AND ProjectID=:pid 
            AND visitLabel=:vl",
            [
                'tn'  => $this->testName,
                'pid' => $timepoint->getProjectID(),
                'vl'  => $this->getVisitLabel()
            ]
        );

        return $dxEvolutionID ?? null;
    }

    /**
     * Determines whether the candidate's latest diagnosis should be updated.
     * If so, it returns an array containing the source and new diagnosis.
     *
     * @param string $dxEvolutionID The ID of configured Diagnsosis Trajectory
     *                              for this instrument & session.
     *
     * @return void
     */
    function updateCandidateDiagnosisEvolution(string $dxEvolutionID) : void
    {
        $DB        = $this->loris->getDatabaseConnection();
        $timepoint = \TimePoint::singleton($this->getSessionID());

        // Get the fields that correspond to a configured diagnosis
        $sourceFields = $DB->pselectOne(
            "SELECT sourceField 
            FROM diagnosis_evolution
            WHERE DxEvolutionID=:dxEvID",
            ['dxEvID' => $dxEvolutionID]
        );

        $this->instanceData = null;
        $instrumentData     = $this->getInstanceData();
        $sourceFields       = explode(",", $sourceFields);

        $diagnosis = [];
        foreach ($sourceFields as $fieldName) {
            // None of the diagnosis components should be empty
            // If so, the latest diagnosis should not be updated.
            if (!isset($instrumentData[$fieldName])) {
                continue;
            }
            $diagnosis[$fieldName] = $instrumentData[$fieldName];
        }

        if (!empty($diagnosis)) {
            $confirmed = $timepoint->getVisitStatus() === 'Pass' ? 'Y' : 'N';

            $set = [
                'CandID'        => $this->getCandID()->__toString(),
                'DxEvolutionID' => $dxEvolutionID,
                'Diagnosis'     => json_encode($diagnosis),
                'Confirmed'     => $confirmed
            ];

            // Diagnosis is formatted as JSON and ensures that this is safe.
            // If we use the safe wrapper, HTML encoding the quotation marks
            // will make it invalid JSON.
            $DB->unsafeInsertOnDuplicateUpdate(
                'candidate_diagnosis_evolution_rel',
                $set
            );
        }
    }

    /**
     * Calculates the candidate's age at the time of this instrument.
     * If Date_taken is passed, this function  will calculate the age as of
     * the value of that argument. This is used, for instance, in
     * _saveValues when we want to calculate the age based on the new
     * value and not based on the age saved in the database. Otherwise
     * the date will be calculated based on the value of the Date_taken
     * field in the database.
     *
     * @param ?string $date (optional) The date that the age is to
     *                      be calculated based on.
     *
     * @return array The age of the candidate in an array containing years, months
     *         and days.
     */
    function getCandidateAge(?string $date = null): array
    {
        $dates     = [
            'Date_taken' => $this->getFieldValue('Date_taken'),
            'DoB'        => $this->getDoB(),
            'DoD'        => $this->getDoD(),
        ];
        $dateTaken = empty($date) ? $dates['Date_taken'] : $date;

        if (empty($dates['DoD']) || $dates['DoD'] > $dateTaken) {
            $age = Utility::calculateAge($dates['DoB'], $dateTaken);
        } else {
            $age = Utility::calculateAge($dates['DoB'], $dates['DoD']);
        }
        //Format: array with keys 'year', 'mon', 'day'
        return $age;
    }

    /**
     * Get the candidates DOB.
     *
     * @return ?string The candidate's DOB.
     */
    function getDoB(): ?string
    {
        $db        = $this->loris->getDatabaseConnection();
        $CommentID = $this->getCommentID();

        $dob = $db->pselectOne(
            "SELECT c.DoB FROM flag f
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            ['CID' => $CommentID]
        );
        return $dob;
    }

    /**
     * Get the candidates DOD.
     *
     * @return ?string The candidate's DOD.
     */
    function getDoD(): ?string
    {
        $db        = $this->loris->getDatabaseConnection();
        $CommentID = $this->getCommentID();
        $dod       = $db->pselectOne(
            "SELECT c.DoD FROM flag f
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            ['CID' => $CommentID]
        );
        return $dod ?? null;
    }

    /**
     * Get the candidates PSCID.
     *
     * @return string|null The candidate's PSCID.
     */
    function getPSCID(): ?string
    {
        $db        = $this->loris->getDatabaseConnection();
        $CommentID = $this->getCommentID();

        $pscid = $db->pselectOne(
            "SELECT c.PSCID FROM flag f
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            ['CID' => $CommentID]
        );
        return $pscid;
    }

    protected ?CandID $candID = null;
    /**
     * Get the candidate's CandID
     *
     * @return ?CandID The candidate's CandID
     */
    function getCandID() : ?CandID
    {
        if ($this->candID !== null) {
            return $this->candID;
        }

        $db        = $this->loris->getDatabaseConnection();
        $CommentID = $this->getCommentID();

        $candIDVal = $db->pselectOne(
            "SELECT c.CandID FROM flag f
            JOIN session s ON (f.SessionID=s.ID)
            JOIN candidate c USING (CandID)
            WHERE f.CommentID=:CID",
            ['CID' => $CommentID]
        );
        if ($candIDVal === null) {
            return null;
        }
        $this->candID = new CandID(strval($candIDVal));
        return $this->candID;
    }

    /**
     * Clears all the data saved into this instrument instance
     *
     * @return void
     */
    function clearInstrument(): void
    {
        $config   = NDB_Config::singleton();
        $db       = $this->loris->getDatabaseConnection();
        $dbconfig = $config->getSetting('database');

        if (!$this->jsonData) {
            $columns = $db->pselect(
                "SELECT COLUMN_NAME FROM information_schema.columns
            WHERE TABLE_NAME=:table AND TABLE_SCHEMA=:db",
                [
                    'table' => $this->table,
                    'db'    => $dbconfig['database'],
                ]
            );

            $values = [];
            foreach ($columns as $row) {
                switch ($row['COLUMN_NAME']) {
                case 'CommentID':
                case 'ID':
                case 'SessionID':
                case 'UserID':
                case 'Test_name':
                    continue 2;
                default:
                    $values[$row['COLUMN_NAME']] = null;
                }
            }
            $db->update($this->table, $values, ['CommentID' => $this->commentID]);
        }

        // Clear data out of the flag table's Data column
        $db->update('flag', ['DataID'=>null], ['CommentID' => $this->commentID]);
        $this->_setRequiredElementsCompletedFlag('N');

        $prepQ = $db->prepare(
            "DELETE FROM conflicts_unresolved
             WHERE (CommentId1=:CID OR CommentId2=:CID)"
        );
        $db->execute(
            $prepQ,
            ['CID' => $this->commentID],
            ['nofetch' => "true"]
        );
    }

    /**
     * Loads the metadata of an instrument and sets the proper variables
     * in the instrument class accordingly
     *
     * This is intended to be overridden by a subclass of NDB_BVL_Instrument
     * to add support for other file formats.
     *
     * @param string $filename The filename to be loaded
     *
     * @return void
     */
    function loadInstrumentMetadata(string $filename): void
    {
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
     * @return void
     */
    function loadInstrumentFile(string $filename, bool $base64 = false): void
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
     * @return void
     */
    function loadInstrumentRules(string $filename, bool $base64 = false): void
    {
    }

    /**
     * Renders the HTML for the control panel for this instrument.
     *
     * @return string The HTML for the control panel
     */
    function getControlPanel(): string
    {
        $sessionID = $this->getSessionID();
        $timepoint = \TimePoint::singleton($sessionID);
        $candID    = $timepoint->getCandID();
        if (!empty($_REQUEST['commentID'])) {
            // make the control panel object for the current instrument
            $controlPanel = new NDB_BVL_InstrumentStatus_ControlPanel(
                $this->loris,
                $this->testName,
                $this->getCommentID() ?? '',
                $candID,
                $sessionID,
                $this->page ?? ''
            );
            $this->addHidden('test_name', $this->testName);
            $this->addHidden('page', $this->page);
            $this->addHidden('subtest', $this->page);

            $config = NDB_Config::singleton();
            $paths  = $config->getSetting('paths');

            $this->_DataEntryChanged = false;

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
                $originalstatus = $controlPanel->getDataEntryStatus();
                $controlPanel->save();

                if ($controlPanel->getDataEntryStatus() !== $originalstatus) {
                    $this->_DataEntryChanged = true;
                }
            }

            // display the control panel
            $html = $controlPanel->display();
            return $html;
        }
    }

    /**
     * Function that displays the html the fetch feedback panel.
     *
     * @param CandID    $candID    The candidate ID for the panel.
     * @param SessionID $sessionID The session ID for the panel.
     *
     * @return string
     */
    function getFeedbackPanel(CandID $candID, SessionID $sessionID): string
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
    function getReview(): string
    {
        $DB = NDB_Factory::singleton()->database();

        $smarty   = new Smarty_NeuroDB();
        $tpl_data = [];

        $tpl_data['questions'] = iterator_to_array(
            $DB->pselect(
                "SELECT Description as question,
            SourceField FROM parameter_type
            WHERE SourceFrom=:TN AND
            SourceField NOT IN ('Validity', 'Administration')",
                ['TN' => $this->testName]
            )
        );

        $Responses = $this->getInstanceData();

        foreach ($tpl_data['questions'] as $key => &$row) {
            $isStatusField = $row['SourceField']
                === $tpl_data['questions'][$key-1]['SourceField']."_status";
            if (isset($Responses[$row['SourceField']])) {
                // Consider status fields
                if ($isStatusField) {
                    // The current row is the status field of the previous one
                    // remove row and set the answer to whichever is answered
                    $tpl_data['questions'][$key-1]['response']
                        = $Responses[$row['SourceField']];
                    unset($tpl_data['questions'][$key]);
                    continue;
                }
                $row['response'] = $Responses[$row['SourceField']];
            } elseif ($isStatusField) {
                // incase it's a status field AND its empty, unset it
                unset($tpl_data['questions'][$key]);
            }
        }

        $smarty->assign($tpl_data);
        return $smarty->fetch("directentry_review.tpl");
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
    function _toJSONParseSmarty(array &$element): array
    {
        /* Hacks to get data that QuickForm_Renderer_Array doesn't provide
         * an easy way to get
         *
         * TODO: are these hacks still valid ?
         * */
        if ($element['type'] === 'select') {
            // Parse the HTML to get the options from the select
            $html = new DOMDocument();
            $html->loadHTML($element['html']);

            $element['options'] = [];

            $selectEl = $html->getElementsByTagName("select")->item(0);

            // getElementsByTagName returns DOMNodeList, but
            // getAttribute only exists on the DOMElement type
            // (which extends DOMNode)
            if ($selectEl instanceof \DOMElement
                && $selectEl->getAttribute("multiple") == 'multiple'
            ) {
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
            $element['options'] = [
                'mindate'         => "1990-01-01",
                'maxdate'         => "2000-12-31",
                'RequireResponse' => false,
            ];

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
     * @param array $element   The element from the QuickForm array renderer
     * @param array $formArray The currently existing form that was converted
     *                         to instrument_json.tpl format.
     *
     * @return void (but side-effect modified $formArray to populate the element
     *         with the appropriate format needed for JSON serialization.)
     */
    function _toJSONParsePageElement(array $element, array &$formArray): void
    {
        $name = isset($element['name']) ? $element['name'] : '';
        if ($element['type'] === 'group') {
            $elementName = str_replace("_group", '', $name);
            if (isset($this->WrapperTextElements[$elementName])) {
                // Convert text elements created by wrapper into
                // the native type.
                $mapFunc = function (&$el) use ($name, $elementName) : void {
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
                $mapFunc = function (&$el) use ($name, $elementName) : void {
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
                $mapFunc = function (&$el) use ($name, $elementName) : void {

                    if ($el['name'] === $name) {
                        $el['name'] = $elementName;
                        $el['type'] = 'date';
                        if (isset($el['elements'][0]['label'])) {
                            $el['label'] = $el['elements'][0]['label'];
                        }
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
    function _toJSONParsePage(): array
    {
        $formArray = $this->form->toElementArray();

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
    function toJSON(): string
    {
        $smarty = new Smarty_NeuroDB;

        $subtests = $this->getSubtestList();
        foreach ($subtests as $subtest) {
            $this->form->addPageBreak(
                $subtest['Name'],
                $subtest['Description'],
                []
            );
            $this->page = $subtest['Name'];
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
    function determineDataEntryAllowed(): bool
    {
        $DB    = $this->loris->getDatabaseConnection();
        $entry = $DB->pselectOne(
            "SELECT Data_entry FROM flag WHERE CommentID=:CID",
            ['CID' => $this->getCommentId()]
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
    function validate(array $values): bool
    {
        return $this->determineDataEntryAllowed();
    }

    /**
     * Gets the flags of that instrument
     *
     * @return \InstrumentFlags
     */
    public function getFlags(): \InstrumentFlags
    {
        $row = \NDB_Factory::singleton()->database()->pselectRow(
            'SELECT
               Data_entry as dataentry,
               Administration as administration,
               Validity as validity
             FROM
               flag
             WHERE CommentID = :v_commentid',
            ['v_commentid' => $this->getCommentId()]
        );

        $dataentry      = $row['dataentry'] ?? null;
        $administration = $row['administration'] ?? null;
        $validity       = $row['validity'] ?? null;

        return new \InstrumentFlags(
            $dataentry,
            $administration,
            $validity
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $visitlabel = $this->getVisitLabel();
        $sessionid  = $this->getSessionID();
        $timepoint  = \TimePoint::singleton($sessionid);
        $candid     = $timepoint->getCandID();
        $pscid      = $this->getPSCID();
        $instrument = $this->testName;

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Access Profile',
                '/candidate_list'
            ),
            new \LORIS\Breadcrumb(
                "Candidate Profile $candid / $pscid",
                "/$candid"
            ),
            new \LORIS\Breadcrumb(
                "TimePoint $visitlabel Details",
                "/instrument_list/?candID=$candid&sessionID=$sessionid"
            ),
            new \LORIS\Breadcrumb(
                $this->getFullName(),
                "/instruments/$instrument/".
                "?commentID=$this->commentID&sessionID=$sessionid&candID=$candid"
            )
        );
    }
    /**
     * Returns true if this instrument saves its data in JSON format to
     * the flag column, rather than directly in MySQL tables.
     *
     * @return bool true if data is saved in the flag table
     */
    public function usesJSONData() : bool
    {
        return $this->jsonData;
    }

    /**
     * Override of page process in order to refresh after control panel change
     *
     * @param ServerRequestInterface  $request The PSR7 request being processed.
     * @param RequestHandlerInterface $handler The handler to handle the request
     *                                         after processing the middleware.
     *
     * @return ResponseInterface the PSR15 response that was generated by the
     * middleware*
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        // The parent middleware needs to be called in order for
        // the instrument control panel to saved, which triggers
        // $this->_DataEntryChanged being set appropriately.
        $response = parent::process($request, $handler);

        if ($this->_DataEntryChanged) {
            $sessionID = $request->getQueryParams()["sessionID"];
            $candID    = $request->getQueryParams()["candID"];

            $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();

            $url = $baseURL . "/instruments/" .
                urlencode($this->testName) .
                '?commentID=' . urlencode($this->getCommentID()) .
                '&candID=' . urlencode($candID) .
                '&sessionID=' . urlencode($sessionID);
            return (new \LORIS\Http\Response())
                ->withStatus(303)
                ->withHeader("Location", $url);
        }
        return $response;
    }

    /**
     * A form extends the basic page handler to
     *  (1) call save() on a POST request
     *  (2) disable form if data entry is complete
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $req     = $request->getParsedBody();
        $success = false;
        if (isset($req['ClearInstrument'])) {
            $success = true;
        }
        if ($request->getMethod() === "POST" && !isset($req['ClearInstrument'])) {
            $success = $this->save();
        }

        // Disable form if data entry is complete
        $user      = $request->getAttribute("user");
        $sessionID = $this->getSessionID();
        if ($sessionID !== null) {
            $timepoint = \Timepoint::singleton($sessionID);
        }

        // create an instrument status object
        $status = new \NDB_BVL_InstrumentStatus($this->loris);
        $status->select($this->commentID);

        // freeze the form to prevent data entry
        // IF (1) Instrument is set to complete
        // OR (2) The user does NOT have `data_entry` permission
        // OR (3) The user does NOT have access to the timepoint
        //        at which the instrument is instantiated
        // AND (4) The instrument is NOT in preview mode
        // AND (5) the instrument is NOT a direct entry
        if (($status->getDataEntryStatus() == 'Complete')
            || !$user->hasPermission('data_entry')
            || (isset($timepoint) && !$user->hasCenter($timepoint->getCenterID()))
            && $this->preview !== true
            && $this->DataEntryType !== 'DirectEntry'
        ) {
            $this->freeze();
        }

        if ($success) {
            $sessionID = $request->getQueryParams()["sessionID"];
            $candID    = $request->getQueryParams()["candID"];
            $baseURL   = \NDB_Factory::singleton()->settings()->getBaseURL();
            $pageURL   = !empty($this->page) ? urlencode($this->page) ."/" : "";
            $url       = $baseURL . "/instruments/" .
                urlencode($this->testName) . "/" .
                $pageURL .
                '?commentID=' . urlencode($this->getCommentID()) .
                '&candID=' . urlencode($candID) .
                '&sessionID=' . urlencode($sessionID);
            return (new \LORIS\Http\Response())
                ->withStatus(303)
                ->withHeader("Location", $url);
        }

        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }

    /**
     * Return the data dictionary for this instrument.
     * LorisForm based instruments can use the trait `\LorisFormDictionaryImpl`
     * in order to implement this function.
     *
     * @return iterable
     */
    abstract public function getDataDictionary() : iterable;

    /**
     * Static function returning a full list of instruments defined in the database.
     * Only instantiable instruments are returned in the format
     * test_name => Instrument object.
     *
     * Note: An error_log entry is logged if an instrument is in the database but
     * can not be instantiated. this check should eventually be replaced with an
     * exception.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getInstrumentsList(\LORIS\LorisInstance $loris) : array
    {
        $DB          = $loris->getDatabaseConnection();
        $instruments = $DB->pselectCol("SELECT Test_name FROM test_names", []);

        $instrumentList = [];
        foreach ($instruments as $inst) {
            try {
                $instrumentList[$inst] = NDB_BVL_Instrument::factory(
                    $loris,
                    $inst,
                    "",
                    ""
                );
            } catch (Exception $e) {
                error_log(
                    "Instrument $inst does not seem to be a valid instrument."
                );
            }
        }
        return $instrumentList;
    }

    /**
     * Static function returning list of all test_names available in the database as
     * an associative array with format $testName => $fullName. Only Names of
     * instruments which are instantiable are returned, invalid instruments will not
     * appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getInstrumentNamesList(\LORIS\LorisInstance $loris) : array
    {
        $instrumentsList = self::getInstrumentsList($loris);

        $instrumentNames = [];
        foreach ($instrumentsList as $testName => $instrument) {
            $fullName = $instrument->getFullName();
            $instrumentNames[$testName] =$fullName;
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }

    /**
     * Static function returning list of all test_names with Double Data Entry
     * configuration enabled in the database. The list is returned as an associative
     * array with format $testName => $fullName. Only Names of instruments which are
     * instantiable are returned, invalid instruments will not appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getDDEInstrumentNamesList(\LORIS\LorisInstance $loris) : array
    {
        $config = $loris->getConfiguration();

        $instrumentNamesList = self::getInstrumentNamesList($loris);

        $doubleDataEntryInstruments = $config->getSetting(
            'DoubleDataEntryInstruments'
        );

        $instrumentNames = [];
        foreach ($instrumentNamesList as $testName => $fullName) {
            if (in_array($testName, $doubleDataEntryInstruments, true)) {
                $instrumentNames[$testName] = $fullName;
            }
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }

    /**
     * Static function returning list of all test_names with Direct Data Entry
     * configuration enabled in the database. The list is returned as an associative
     * array with format $testName => $fullName. Only Names of instruments which are
     * instantiable are returned, invalid instruments will not appear in this list.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to get the DDE from
     *
     * @return array
     * @throws DatabaseException
     */
    static function getDirectEntryInstrumentNamesList(
        \LORIS\LorisInstance $loris
    ) : array {
        $DB = $loris->getDatabaseConnection();

        $instrumentNamesList = self::getInstrumentNamesList($loris);

        $directEntryInstruments = $DB->pselectCol(
            "SELECT Test_name FROM test_names WHERE IsDirectEntry=true",
            []
        );

        $instrumentNames = [];
        foreach ($instrumentNamesList as $testName => $fullName) {
            if (in_array($testName, $directEntryInstruments, true)) {
                $instrumentNames[$testName] = $fullName;
            }
        }

        // sort array by instrument name for modules that rely on ordering
        asort($instrumentNames, SORT_STRING | SORT_FLAG_CASE | SORT_NATURAL);

        return $instrumentNames;
    }

    /**
     * Gets the current instrument instance selectMultipleElements
     *
     * @return array the select multiple elements of this instrument.
     * @access public
     */
    public function getSelectMultipleElements(): array
    {
        return $this->selectMultipleElements;
    }
}

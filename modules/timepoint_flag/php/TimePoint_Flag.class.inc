<?php
/**
*
* This class provides methods to 'flag' any data records in the schema.
* Structure:
* Data is overlayed by flags. Flags are defined in the parameter_timepoint_flag table. 
* A flag has a set of triggers, tests defined for a db field. Triggers are defined in the parameter_timepoint_flag_triggers table.
* A flag may also have a set of review fields that are looked up and displayed in the GUI to provide additional info about the flag. The review fields are defined in the parameter_timepoint_flag_review_fields table. Te review fields are not used/evaluated to trigger flags.
*
* A flag is represented by a record in the parameter_timepoint_flag_session table. It is raised when one or more of it's triggers return TRUE for their tests. Each flag/record has a type,category, and a status (NULL/ON/OFF). Default status is always NULL and it can updated from the web GUI. A comment is required when setting the status to OFF to enforce user to provide a reason for disabling the flag.
*
* Modules,menus,tools:
* Flags are triggered by a cmd-line tool and updateds via the web GUI's menu_filter class, both of which are written separately for each project. 
* This class provides methods needed to evaluate, trigger, and update flag records in the system.
* There are three 'classes' of methods
* @package timepoint_flag
*/

/**
* CONSTANTS
*/
// Trigger tests positive
if (!defined('TIMEPOINT_FLAG_TRIGGER')) {
    define('TIMEPOINT_FLAG_TRIGGER', 1);
}
// Trigger tests negative
if (!defined('TIMEPOINT_FLAG_NULL')) {
    define('TIMEPOINT_FLAG_NULL', null);
}
// Missing data (trigger's underlying instrument is NOT NA)
if (!defined('TIMEPOINT_FLAG_MISSING_DATA')) {
    define('TIMEPOINT_FLAG_MISSING_DATA', 'DERR');
}
// Missing instrument (trigger's underlying instrument is NA)
if (!defined('TIMEPOINT_FLAG_NA_INSTRUMENT')) {
    define('TIMEPOINT_FLAG_NA_INSTRUMENT', 'MI');
}
if (!defined('TIMEPOINT_FLAG_NULL_STATUS')) {
    define('TIMEPOINT_FLAG_NULL_STATUS', 'NULLme');
}

Class TimePoint_Flag extends TimePoint
{
    // array of flags w/ elements Name and Type
    var $flagList = array();

    // list of instruments assigned to a timepoint
    var $timepointBattery = array();
    
    // list of instruments used for the flag
    var $listOfInstruments = array();

    // list of NA instruments used by the flag
    var $listOfNonAdministeredInstrumentsForTimepoint = array();

    // list of flag's triggers, keyed by Flag name
    var $listOfTriggers = array();

    // list of flag types
    var $flagTypes = array();
    
    // list of all active bvl instruments for project
    var $projectBvlInstruments = array();

    static function &singleton($sessionID)
    {
        // instantiate new TimePoint_Flag object
        static $flagList;

        if(!isset($flagList[$sessionID])) {

            // create timepointFlag object
            $flagList[$sessionID] = new TimePoint_Flag();

            // setup data in the TimePoint class
            $success = $flagList[$sessionID]->select($sessionID);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }

        return $flagList[$sessionID];
    }

    // general methods to set the list of flags, etc.

    /**
    * sets the [@link $this->flagTypes] property
    * @throws PEAR error
    * @return void
    */
    function setFlagTypes()
    {
        // DB Object
        $db =& Database::singleton();

        $query = "SELECT TypeID, Name FROM parameter_timepoint_flag_type";

        $result = array();
        $db->select($query, $result);

        // there must be at least on registered type
        if (count($result) == 0) {
            return PEAR::raiseError("Timepoint_Flag::setFlagTypes(): no types in the database\n");
        }

        foreach ($result as $record) {
            $list[$record['TypeID']] = $record['Name'];
        }

        $this->flagTypes = $list;
    }

    /**
    * returns an array of flag types, keyed by TypeID
    * @throws PEAR error
    * @return array list of types keyed by typeID
    */
    function getFlagTypes()
    {
        if (count($this->flagTypes) == 0) {
            $list = $this->setFlagTypes();
            if (Utility::isErrorX($list)) {
                return PEAR::raiseError($list->getMessage());
            }
        }
        return $this->flagTypes;
    }


    /**
    * returns an inverse array of @link $this->flagTypes ; array Name=>TypeID
    * @throws PEAR error
    * @return array list of type IDs keyed by type name
    */
    function getFlagTypeIDs()
    {
        if (count($this->flagTypes) == 0) {
            $list = $this->setFlagTypes();
            if (Utility::isErrorX($list)) {
                return PEAR::raiseError($list->getMessage());
            }
        }

        foreach ($this->flagTypes as $typeID=>$typeName) {
            $list[$typeName] = $typeID;
        }

        return $list;
    }

    /**
    * return the hex code of the type color defined in default.conf
    * @return string color hex code
    * @access public
    * @static
    */
    function getTypeColor($type)
    {
        $smarty = new Smarty_neurodb;
        $smarty->ConfigLoad('default.conf', 'timepoint_flag');
        return $smarty->getConfigVars($type);
    }

    /**
    * sets the [@link $this->flagList] property, array w/ Name and Type elements
    * @throws PEAR error
    * @return void
    */
    function setListOfFlags()
    {
        // new DB Object
        $db =& Database::singleton();

        // get the timepoint subprojectid to query only the flags that belong to the subproject
        // the method was inherited from the parent class
        $subproject = $this->getSubprojectID();

        // select only the flags that have a valid type
        $query = "SELECT f.Flag_name FROM parameter_timepoint_flag as f, parameter_timepoint_flag_type as ft WHERE f.TypeID = ft.TypeID AND f.Active='Y'";
        if (!empty($subproject)) $query .= " AND SubprojectID  = '$subproject'";
        $query .= " ORDER BY f.ID";

        $result = array();
        $db->select($query, $result);
        if(Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::setListOfFlags(): failed to set the list of flags:\n" . $result->getMessage());
        }

        if (count($result) == 0) {
            return PEAR::raiseError("Timepoint_Flag::setListOfFlags(): no flags are available!\n");
        }

        foreach ($result as $record) {
            $list[] = $record['Flag_name'];
        }

        //set the property
        $this->flagList = $list;
    }

    /**
    * retrieves the list of flags
    * @return array list of flags w/ Name and Type elements
    * @throws PEAR error
    */
    function getListOfFlags()
    {
        if (count($this->flagList) == 0) {
            $success = $this->setListOfFlags();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }

        return $this->flagList;
    }

    /**
    * returns full record for the flag from the flag and type table
    * @param string name of the flag
    * @return array
    * @throws PEAR::error
    * @static
    */
    function getFlagMetadata($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $query = "SELECT f.Flag_name, f.TypeID, f.Description, ft.Name as Type, f.SubprojectID FROM parameter_timepoint_flag as f, parameter_timepoint_flag_type as ft WHERE f.TypeID = ft.TypeID AND f.Flag_name = '$flagName'";

        $db->selectRow($query, $result);

        if(Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagMetadata(): failed to get flag metadata:\n" . $result->getMessage());
        }

        if (count($result) == 0) {
            return PEAR::raiseError("Timepoint_Flag::getFlagMetadata(): no data available for flag ($flagName)\n");
        }

        return $result;
    }

    /**
    * returns the flag's type
    * @param string flag name
    * @return string flag type
    * @access public
    * @static
    */
    function getFlagType($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $query = "SELECT ft.Name as Type FROM parameter_timepoint_flag as f, parameter_timepoint_flag_type as ft WHERE f.TypeID = ft.TypeID AND f.Flag_name = '$flagName'";

        $result = $db->selectOne($query);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagType(): " . $result->getMessage());
        }

        return $result;
    }
    
    /**
    * returns the flag's description
    * @param string flag name
    * @return string flag description
    * @access public
    * @static
    */
    function getFlagDescription($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $query = "SELECT Description FROM parameter_timepoint_flag WHERE Flag_name = '$flagName'";

        $result = $db->selectOne($query);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagDescription(): " . $result->getMessage());
        }

        return $result;
    }
    
    /**
    * returns the flag's subproject
    * @param string flag name
    * @return string flag subproject
    * @access public
    * @static
    */
    function getFlagSubproject($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $query = "SELECT SubProjectID FROM parameter_timepoint_flag WHERE Flag_name = '$flagName'";

        $result = $db->selectOne($query);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagSubproject(): " . $result->getMessage());
        }

        return $result;
    }

    /**
    * Sets a listOfTriggers property, an array triggers' meta-data keyed by the flag name
    *
    * @param  string name of the flag
    * @return void
    * @throws PEAR::raiseError
    */
    function setFlagTriggers($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        // get the list of records(triggers for the flag) from the delt table
        $query = "SELECT Trigger_name, Source, Table_name, Field_name, Conditional_operator, Value FROM parameter_timepoint_flag_trigger WHERE Flag_name = '$flagName' AND Active = 'Y'";

        $db->select($query, $result);

        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::setFlagTriggers(): DBError, failed to get triggers for the flag ($flagName):\n" . $result->getMessage()."\n");
        }

        $this->listOfTriggers[$flagName]= $result;
    }

    /**
    * Sets the list of trigger values for the flag
    * @param  string name of the flag
    * @return array list of flag's triggers
    * @throws PEAR::raiseError
    */
    function getFlagTriggers($flagName)
    {
        if (empty($flagName)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagTriggers(): missing flag name to get the flag triggers!\n");
        }

        if (count($this->listOfTriggers[$flagName]) == 0) {
            $success = $this->setFlagTriggers($flagName);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError($success->getMessage());
            }
        }
        return $this->listOfTriggers[$flagName];
    }

    /**
    * returns the list of ALL instruments/sources used to evaluate the flags
    * @return array list of instruments
    * @throws PEAR error
    */
    function setListOfSources()
    {
        // DB Object
        $db =& Database::singleton();

        //get the list
        $query = "SELECT DISTINCT Source FROM parameter_timepoint_flag_trigger WHERE Flag_name <> '0_missing_instruments'";

        $db->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::setListOfSourcesForFlag(): failed to get list of sources:\n".$result->getMessage());
        }

        $list = array();
        foreach ($result as $record) {
            $list[] = $record['Source'];
        }

        // assign to property
        $this->listOfInstruments = $list;
    }

    /**
    * returns the list of ALL instruments/sources used for the flag
    * @return array list of instruments for the flag
    * @throws PEAR error
    */
    function getListOfSources()
    {
        if (count($this->listOfInstruments) == 0) {
            $listTests = $this->setListOfSources();
            if (Utility::isErrorX($listTests)) {
                return PEAR::raiseError($listTests->getMessage());
            }
        }
        return $this->listOfInstruments;
    }

    
    
    
    
    

    // METHODS to evaluate and create the flags,
    // used by the cmd-line tools

    
    
    
    
        // BEHAVIORAL - related methods
    /**
    * sets a list of all active bvl instruments in project, registered in test_battery table
    * @return array list of instruments
    * @throws PEAR error
    */
    function setProjectBvlInstruments() {
        
        // DB Object
        $db =& Database::singleton();

        // get the full list of bvl instruments in the project
        $query = "SELECT DISTINCT Test_name from test_battery WHERE Active='Y'";
        $db->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getListOfBvlInstrumentsForProject(): Failed to get the list of bvl instruments for the project\n".$result->getMessage());
        }

        $list = array();
        foreach ($result as $record) {
            $list[] = $record['Test_name'];
        }

        $this->projectBvlInstruments = $list;
    }
    
    /**
    * returns the list of all active bvl instruments in project
    * @return array list of instruments
    * @throws PEAR error
    */
    function getProjectBvlInstruments()
    {
        if (count($this->projectBvlInstruments) == 0) {
            $listTests = $this->setProjectBvlInstruments();
            if (Utility::isErrorX($listTests)) {
                return PEAR::raiseError($listTests->getMessage());
            }
        }
        return $this->projectBvlInstruments;
    }

    /**
    * returns the list of instruments in a timepoint battery
    * @return void
    * @throws PEAR error
    */
    function setTimepointBvlBattery()
    {
        // DB Object
        $db =& Database::singleton();

        //get the list
        $query = "SELECT DISTINCT Test_name FROM flag WHERE SessionID = '".$this->getSessionID()."'";

        $db->select($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::setTimepointBattery(): failed to get list of instruments used for timepoint (".$this->getSessionID().":\n".$result->getMessage());
        }

        $list = array();
        foreach ($result as $record) {
            $list[] = $record['Test_name'];
        }

        // assign to property
        $this->timepointBattery = $list;
    }

    /**
    * returns the list of instruments in a timepoint battery
    * @return array list of instruments
    * @throws PEAR error
    */
    function getTimepointBvlBattery()
    {
        if (count($this->timepointBattery) == 0) {
            $listTests = $this->setTimepointBvlBattery();
            if (Utility::isErrorX($listTests)) {
                return PEAR::raiseError($listTests->getMessage());
            }
        }
        return $this->timepointBattery;
    }

    /**
    * sets the list of NA instruments for the timepoint
    * @throws PEAR error
    * @return void
    */
    function setListOfNonAdministeredInstrumentsForTimePoint()
    {
        // new DB Object
        $db =& Database::singleton();

        $query = "SELECT Test_name as Instrument FROM flag WHERE SessionID = '".$this->getSessionID()."' AND Data_entry = 'Complete' AND Administration = 'None'";
        $db->select($query, $result);

        if(Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::setListOfNonAdministeredInstrumentsForTimePoint(): failed to get the list of NA instruments:\n" . $result->getMessage());
        }

        foreach ($result as $record) {
            $flagList[] = $record['Instrument'];
        }

        //set the property
        $this->listOfNonAdministeredInstrumentsForTimepoint = $flagList;
    }

    /**
    * returns the list of NA instrumetns
    * @return array list of NA instruments
    * @throws PEARR error
    */
    function getListOfNonAdministeredInstrumentsForTimePoint()
    {
        if (count($this->listOfNonAdministeredInstrumentsForTimepoint) == 0) {
            $listTests = $this->setListOfNonAdministeredInstrumentsForTimePoint();
            if (Utility::isErrorX($listTests)) {
                return PEAR::raiseError($listTests->getMessage());
            }
        }

        return $this->listOfNonAdministeredInstrumentsForTimepoint;
    }

    /*
    * returns the list of Na instruments as a string (entries separated by "','")
    * this is useful if you want to include the list in the WHERE consition of a query (eg. WHERE Test_name NOT IN ($list))
    * @return string list of NA instruments
    * @throws PEAR error
    */
    function getListOfNonAdministeredInstrumentsForTimePointAsString()
    {
        $listTests = $this->getListOfNonAdministeredInstrumentsForTimePoint();
        // pass the error
        if (Utility::isErrorX($listTests)) {
            return PEAR::raiseError($listTests->getMessage());
        }

        return join("','", $listTests);
    }

    
    
    
    
    // METHODS TO evaluate FLAGS AND GET VALUES FOR TRIGGERS

    
    

    /**
    * wraps the [@link $this->evaluateFlag()] and tests all flag for the timepoint
    * @throws PEAR error
    * @return void
    */
    function evaluateTimepointFlags()
    {
        // get the list of flags
        $flagList = $this->getListOfFlags();
        if (Utility::isErrorX($flagList)) {
            PEAR::raiseError("Error, failed to get the list of flags:\n".$flagList->getMessage());
        }

        // loop the list and evaluate individual flags
        foreach ($flagList as $currentFlag) {

            $status = $this->evaluateFlag($currentFlag);
            if (Utility::isErrorX($status)) {
                return PEAR::raiseError("Timepoint_Flag::evaluateTimepointFlags(): failed to evaluate flag ($currentFlag):\n".$status->getMessage());
            }

            // add the flag to the array of timepoint's flags
            if (!empty($status)) $listOfFlags[$currentFlag] = $status;
        }
        return $listOfFlags;
    }

    /**
    * Evaluates the flag's triggers values against the benchmark, returns flag status (typeID) as a class constant
    * @param string name of the flag
    * @return mixed typeid of the flag if triggered or a constant TimePoing_Flag::TIMEPOINT_FLAG_NA_INSTRUMENT|TimePoing_Flag::TIMEPOINT_FLAG_NULL
    * @throws PEAR error
    */
    function evaluateFlag($flagName)
    {
        /**
        * EVALUATE THE FLAG
        */
        // get the list of triggers that tested positive
        $flagPositiveTriggers = $this->evaluateFlagTriggers($flagName);
        if (Utility::isErrorX($flagPositiveTriggers)) {
            return PEAR::raiseError("Timepoint_Flag::evaluateFlag(): failed to get the list of positive triggers for flag ($flagName): \n".$flagPositiveTriggers->getMessage());
        }

        // default flag status, will remain such in case no triggers have tested positive
        $flagStatus = TIMEPOINT_FLAG_NULL;

        // run the flag evaluation test in case at least one of the triggers tested positive
        // check if the instrument is NA
        // PRECENDENCE RULES; Positive trigger (administered instrument); Missing Data; NA instrument; no flag
        foreach ($flagPositiveTriggers as $triggerName=>$triggerStatus) {

            // trigger the flag, stop the loop
            if ($triggerStatus == TIMEPOINT_FLAG_TRIGGER) {
                $flagStatus = TIMEPOINT_FLAG_TRIGGER;
                break;
            }

            // set as missing data
            if ($flagPositiveTriggers[$triggerName]==TIMEPOINT_FLAG_MISSING_DATA) {
                $flagStatus = TIMEPOINT_FLAG_MISSING_DATA;
            }
                
            // NEW: ignore this setting since for all flags except the flag "0_missing_instruments" which was created to be triggered in case of NA instruments...
            if ($flagName=='0_missing_instruments' && $triggerStatus == TIMEPOINT_FLAG_NA_INSTRUMENT) {
                $flagStatus = TIMEPOINT_FLAG_NA_INSTRUMENT;
            }
        }
        
        // return the flag status, see CONSTANTS
        return $flagStatus;
    }

    /**
    * returns an array of triggers that tested positive
    * @return array list of triggers w/ values that tested positive
    * @param string flag name
    * @throws PEAR error
    */
    function evaluateFlagTriggers($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $list = array();
        
        // get the full list of bvl instruments in the project
        $bvlInstruments = $this->getProjectBvlInstruments();
        if (Utility::isErrorX($bvlInstruments)) {
        	return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): ".$bvlInstruments->getMessage());
        }
                
        // get the BVL battery and list of NA bvl tests as a string to be able to evaluate BVL flags
        $bvlBattery = $this->getTimepointBvlBattery();
        if (Utility::isErrorX($bvlBattery)) {
            return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): ".$bvlBattery->getMessage());
        }
        
        $listOfNAInstruments = $this->getListOfNonAdministeredInstrumentsForTimePoint();
        if (Utility::isErrorX($listOfNAInstruments)) {
            return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): ".$listOfNAInstruments->getMessage());
        }

        // get the list of triggers for the flag and their records from the trigger table
        $flagTriggers = $this->getFlagTriggers($flagName);
        if (Utility::isErrorX($flagTriggers)) {
            return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): failed to evaluate triggers for flag ($flagName): \n".$flagTriggers->getMessage());
        }

        //loop the result set and check if any value corresponds to the record
        foreach ($flagTriggers as $currentTrigger) {

            // map to local vars - easier to read the $query string
            $triggerName = $currentTrigger['Trigger_name'];
//            $table = $currentTrigger['Table_name'];
            $source = $currentTrigger['Source'];
            $field = $currentTrigger['Field_name'];
            $operator = $currentTrigger['Conditional_operator'];
            $value = $currentTrigger['Value'];

            // if the trigger's source is a bvl instrument
            if (in_array($source, $bvlInstruments)) {

                // if a source is a bvl instrument but not part of the timepoint's battery, skip to next
                if (!in_array($source, $bvlBattery)) continue;

                // if the trigger's instrument is part of teimpoint's battery but is marked as Not Administered, assign constant and skip to next
                // NOTE: trigger cannot raise a flag if it's trigger based on the NA Instrument
                if (is_array($listOfNAInstruments) && count($listOfNAInstruments)>0 && in_array($source, $this->getListOfNonAdministeredInstrumentsForTimePoint())) {
                    // assign NA status to the current trigger if the Source is part of the exclusionary instruments
                    if (in_array($source, $this->getListOfSources())) {
                        $list[$triggerName]=TIMEPOINT_FLAG_NA_INSTRUMENT;
                    }
                    continue;
                }
            }

            // lookup field value for the current trigger
            $triggerValue = $this->getTriggerValue($flagName, $triggerName);
            if (Utility::isErrorX($triggerValue)) {
                return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): failed to get trigger value ($triggerName) for flag ($flagName) \n " . $triggerValue->getMessage());
            }

            // if NULL/no value was returned
            if (is_null($triggerValue) || $triggerValue=='') {
                // return Missing Data contant for the trigger
                $list[$triggerName]=TIMEPOINT_FLAG_MISSING_DATA;
                continue;
            }

            // if a value was returned
            // run the query to test the trigger's returned value vs. the condition
            if (is_numeric($triggerValue)) $valueToTest = $triggerValue;
            else $valueToTest = "'".addslashes($triggerValue)."'";
            if (!is_numeric($value)) $value = "'".$value."'";
            $query = "SELECT ($valueToTest $operator $value) as Test";
            $record =array();
            $db->selectRow($query, $record);
            if (Utility::isErrorX($record)) {
                return PEAR::raiseError("Timepoint_Flag::evaluateFlagTriggers(): failed to get test the field [$field: ".$triggerValue."] vs. value [$value] using [$operator] for trigger ($triggerName) and flag ($flagName):\n" . $record->getMessage()."\n$query\n");
            }
            // assign the trigger is tested positive (1)
            if ($record['Test']==1) { 
                $list[$triggerName]=TIMEPOINT_FLAG_TRIGGER;
            }
        }
        
        //return the list
        return $list;
    }


    
    
    
    
    
    
    
    // METHODS to work with existing flags - DB records

    
    
    
    
    
    /**
    * return the values of all fields underlying triggers w/o evaluating them
    * @param stirng name of flag
    * @throws PEAR error
    * @return array list of triggers w/ values, keyed by trigger name
    *
    */
    function getFlagTriggersFieldValues($flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $sessionID = $this->getSessionID();

        // get the list of triggers for the flag and their records from the trigger table
        $flagTriggers = $this->getFlagTriggers($flagName);
        if (Utility::isErrorX($flagTriggers)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagTriggersFieldValues(): failed to get trigger values for flag ($flagName): \n".$flagTriggers->getMessage());
        }

        //loop the result set and check if any value corresponds to the record
        $record = array();
        foreach ($flagTriggers as $currentTrigger) {

            // map to local vars - easier to read the $query string
            $trigger = $currentTrigger['Trigger_name'];
            $table = $currentTrigger['Table_name'];
            $testName = $currentTrigger['Source'];
            $field = $currentTrigger['Field_name'];

            // query the table: $table to see if there is at least one record satisfying the exclusion criteria
            $query = "SELECT $field as Value FROM flag as f LEFT JOIN $table as t USING (CommentID) WHERE Test_name = '$testName' AND f.SessionID = '$sessionID'";
            // include only completed and administered instruments
            $query .= " AND f.Data_entry = 'Complete'";
            if ($flagName=='0_missing_instruments') $query .= " AND f.Administration = 'None'";
            else $query .= " AND f.Administration <> 'None'";
            $db->selectRow($query, $fieldValue);

            if (Utility::isErrorX($fieldValue)) {
                return PEAR::raiseError("Timepoint_Flag::getFlagTriggersFieldValues(): failed to get field value for trigger ($trigger) flag ($flagName):\n" . $fieldValue->getMessage()."\n$query\n");
            }

            // set the Value element to the actual field value
            $record[$trigger] = $fieldValue["Value"];
        }

        //return the list
        return $record;
    }

    /**
    * return a value of a trigger
    * @param string name of flag
    * @param string name of the trigger the value of which we need
    * @throws PEAR error
    * @return mixed value, null, numeric, string
    *
    */
    function getTriggerValue($flagName, $triggerName)
    {
        $sessionID = $this->getSessionID();

        $record = array();

        // DB Object
        $db =& Database::singleton();

        // get the the trigger's metadata
        $query = "SELECT Source, Table_name, Field_name FROM parameter_timepoint_flag_trigger WHERE Flag_name = '$flagName' AND Trigger_name  = '$triggerName'";
        $db->selectRow($query, $record);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getTriggerValue(): failed to get trigger data for flag ($flagName) trigger ($triggerName):\n" . $result->getMessage()."\n");
        }

        // map to local vars - easier to read the $query string
        $table = $record['Table_name'];
        $testName = $record['Source'];
        $field = $record['Field_name'];

        // query the table: $table to see if there is at least one record satisfying the exclusion criteria
        $query = "SELECT $field as Value FROM flag as f LEFT JOIN $table as t USING (CommentID) WHERE f.Test_name = '$testName' AND f.SessionID = '$sessionID'";
        $db->selectRow($query, $fieldValue);
        if (Utility::isErrorX($fieldValue)) {
            return PEAR::raiseError("Timepoint_Flag::getTriggerValue(): failed to get field value for trigger ($triggerName) flag ($flagName):\n" . $fieldValue->getMessage()."\n$query\n");
        }

        //return the list
        return $fieldValue['Value'];
    }

    /**
    * return the values of all fields underlying triggers w/o evaluating them
    * @param stirng name of flag
    * @throws PEAR error
    * @return array list of triggers w/ values, keyed by trigger name
    *
    */
    function getFlagReviewFieldsValues($flagName)
    {
        $sessionID = $this->getSessionID();

        $record = array();
        $result = array();

        // DB Object
        $db =& Database::singleton();

        $query = "SELECT * FROM parameter_timepoint_flag_review_fields WHERE Flag_name = '$flagName'";

        $db->select($query, $result);

        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getFlagReviewFieldsValues(): failed to get the list of review fields for flag ($flagName):\n" . $result->getMessage()."\n$query\n");
        }

        if (count($result) == 0) {
            // stop processing
            return true;
        }

        foreach ($result as $record) {

            // map to local vars - easier to read the $query string
            $fieldLabel = $record['Label'];
            $table = $record['Table_name'];
            $testName = $record['Source'];
            $field = $record['Field_name'];

            // query the table: $table to see if there is at least one record satisfying the exclusion criteria
            $query = "SELECT $field as Value FROM flag as f LEFT JOIN $table as t USING (CommentID) WHERE f.Test_name = '$testName' AND f.SessionID = '$sessionID'";
            // include only completed and administered instruments
            $query .= " AND f.Data_entry = 'Complete' AND f.Administration <> 'None'";

            $db->selectRow($query, $fieldValue);

            if (Utility::isErrorX($fieldValue)) {
                return PEAR::raiseError("Timepoint_Flag::getFlagReviewFieldsValues(): failed to get review field value ($fieldLabel) flag ($flagName):\n" . $fieldValue->getMessage()."\n$query\n");
            }

            // return the array of fields values
            $fieldArray[$fieldLabel] = trim($fieldValue["Value"], "\t\n\r\x0B");
        }

        return $fieldArray;
    }



    /**
    * insert a new flag record
    * flag table parameter_timepoint_flag_session
    * @param string name of the flag
    * @param string flag type ID
    * @throws PEAR Error
    * @return mixed true if OK
    */
    function insertFlag($flagName, $typeID)
    {
        // DB Object
        $db =& Database::singleton();

        $sessionID = $this->getSessionID();

        // prepape the array of fields to insert (default Flag_status = ON)
        $setArray = array("SessionID"=>$sessionID, 'Flag_name'=>$flagName, 'TypeID'=>$typeID);

        // insert the record
        $success = $db->insert('parameter_timepoint_flag_session', $setArray);

        // pass the error
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Timepoint_Flag::insertFlag(): Timepoint_flag::insertFlag failed to insert flag ($flagName):\n".$success->getMessage());
        }
        return true;
    }

    /**
    * updates a flag record in the parameter_exclusion_session table
    * if the flag was raised, and if there is no record in the tables insert new, otherwise update w/ new value
    * if the was turned OFF, and the value is changed, than turn the flag back ON so that new value could be reviewed
    * @param string flagName, name of the flag
    * @param string userID, system user
    * @param string flagStatus, ON/OFF
    * @param string comment, comment for the flag
    * @param string pending, flag to mark if there's an issue (Y/N)
    * @param string pendingComment, comment for the issue
    * @throws PEAR Error
    * @return mixed
    */
    function updateFlag($flagName, $userID, $flagStatus=null, $comment = null, $pending=null, $pendingComment=null)
    {
        $sessionID = $this->getSessionID();

        // timestamp of the current update
        $today = date("Y-m-d H:i:s");

        // DB Object
        $db =& Database::singleton();

        // set of fields to update
        $setArray = array("UserID"=>$userID, "Last_change"=>$today);
        if (!empty($flagStatus)) {
            if ($flagStatus==TIMEPOINT_FLAG_NULL_STATUS) $setArray = array_merge($setArray, array("Flag_status"=>null));
            else $setArray = array_merge($setArray, array("Flag_status"=>"$flagStatus"));
        }
        if (!empty($comment)) $setArray = array_merge($setArray, array("Comment"=>$comment));
        if (!empty($pending)) $setArray = array_merge($setArray, array("Pending_issue"=>$pending));
        if (!empty($pendingComment)) $setArray = array_merge($setArray, array("Comment_pending"=>$pendingComment));

        // where constraint
        $whereArray = array("Flag_name"=>$flagName, "SessionID"=>$sessionID);

        // update the record
        $success = $db->update('parameter_timepoint_flag_session', $setArray, $whereArray);

        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Timepoint_Flag::updateFlag(): failed to update flag record ($flagName): \n".$success->getMessage());
        }

        return true;
    }

    /**
    * returns the flag record from the table parameter_timepoint_flag_session, if any
    * can be use statically, just supply SessionID and FlagName
    * @param string name of flag
    * @param int sessionID
    * @return array flag details
    * @throws PEAR error
    * @param string flag name
    * @static
    */
    function getFlag($sessionID, $flagName)
    {
        if (empty($sessionID) || empty($flagName)) {
            return PEAR::raiseError("Timepoint_flag::getFlag(): both sessionID and flagName arguments have to be specified!\n");
        }

        // DB Object
        $db =& Database::singleton();

        $query = "SELECT
         fs.SessionID, f.Flag_name, f.Flag_label, ft.TypeID, ft.Name as Type_name, 
         fs.Flag_status, fs.Comment, fs.Pending_issue, fs.Comment_pending, u.Real_name as User, fs.Last_change
         FROM
         parameter_timepoint_flag as f,
         parameter_timepoint_flag_type as ft,
         parameter_timepoint_flag_session as fs
         LEFT JOIN users as u USING (UserID)
         WHERE
         fs.TypeID = ft.TypeID
         AND fs.Flag_name = '$flagName'
         AND fs.SessionID = '$sessionID'";

        $result = array();
        $db->selectRow($query, $result);

        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_flag::getFlag(): Error, failed to get flag session data for ($flagName):\n".$result->getMessage());
        }

        return $result;
    }

    /**
    * wraps the [@link $this->getFlag()] and gets the flag data for the timepoint
    * @return array list of flag records from parameter_timepoint_flag_session table
    * @throws PEAR error
    * @see $this->getListOfFlags()
    */
    function getTimepointFlags()
    {
        // loop the list of flags
        foreach ($this->getListOfFlags() as $currentFlag) {

            // get the data for the current flag
            $flagData = $this->getFlag($this->getSessionID(), $currentFlag);
            if (Utility::isErrorX($flagData)) {
                return PEAR::raiseError("Timepoint_flag::getTimepointFlags(): Failed to get flag data for timepoint [".$this->getSessionID()."], flag  [".$currentFlag."]\n".$flagData->getMessage());
            }

            // add only the raised flag
            if (is_array($flagData) && count($flagData) > 0) {
                $list[] = $flagData;
            }
        }

        return $list;
    }

    /**
    * returns true if the flag is raised for the timepoint
    * @param int sessionID 
    * @param string flag name 
    * @eturn bool
    * @throws PEAR::Error
    */
    function timepointFlagExists($sessionID, $flagName)
    {
        // DB Object
        $db =& Database::singleton();

        $query  = "SELECT count(*) as count from parameter_timepoint_flag_session WHERE SessionID = '$sessionID' AND Flag_name = '$flagName'";
        $db->selectRow($query, $record);
        if (Utility::isErrorX($record)) {
            return PEAR::raiseError ("TimePoint_flag::timepointFlagExists(): failed to get record from db: ".$record->getMessage()."\n");
        }
        
        if ($record['count'] > 0) return true;
        else return false;
    }

    /**
    * return name of the  max type of the Active (Flag_status<>OFF) flag
    * @return string name of the max flag type
    */
    function getMaxFlagForTimepoint()
    {
        // DB Object
        $db =& Database::singleton();

        $sessionID = $this->getSessionID();

        // select max of all flags that were not turned off
        $query = "SELECT pt.Name from parameter_timepoint_flag_session as ps, parameter_timepoint_flag_type as pt WHERE pt.TypeID=ps.TypeID AND (ps.Flag_status <> 'OFF' OR ps.Flag_status is null) AND ps.SessionID='".$sessionID."' ORDER BY pt.TypeID DESC LIMIT 1";
        $result=array();
        $db->selectRow($query, $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("Timepoint_Flag::getMaxFlagForTimepoint(): failed to get list of instruments used for the timepoint ($sessionID):\n".$result->getMessage());
        }

        return $result['Name'];
    }

    function showConstant($name) {
        return constant($name);
    }

}
?>

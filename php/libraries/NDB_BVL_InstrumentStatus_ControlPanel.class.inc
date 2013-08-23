<?php
/**
 * Behavioural instrument status control panel class
 *
 * This class provides the management GUI for the status flags
 * of instruments in the NeuroDB framework.
 * @package behavioural  
 * @access public
 */
class NDB_BVL_InstrumentStatus_ControlPanel extends NDB_BVL_InstrumentStatus
{
    /**
     * generates the HTML to display the set of buttons for the instrument status flags
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function display()
    {
        if(empty($this->_commentID)) {
            return PEAR::raiseError("No instrument instance selected");
        }
        $this->tpl_data['candID'] = isset($_REQUEST['candID']) ? $_REQUEST['candID'] : '';
        $this->tpl_data['sessionID'] = $_REQUEST['sessionID'];
        $this->tpl_data['commentID'] = $_REQUEST['commentID'];
        $this->tpl_data['test_name'] = $_REQUEST['test_name'];
        if(isset($_REQUEST['subtest'])) {
            $this->tpl_data['subtest'] = $_REQUEST['subtest'];
        } else {
            $this->tpl_data['subtest'] = '';
        }

        // get the files path
        $config =& NDB_Config::singleton();
        $base = $config->getSetting('base');

        // the instrument exists
        if (file_exists($base."project/instruments/NDB_BVL_Instrument_".$_REQUEST['test_name'].".class.inc")
                || file_exists($base."project/instruments/".$_REQUEST['test_name'].".linst")
            ) {
            // include the instrument's class, if it's an old school instrument.
            if (file_exists($base."project/instruments/NDB_BVL_Instrument_".$_REQUEST['test_name'].".class.inc"))  {
                require_once $base."project/instruments/NDB_BVL_Instrument_".$_REQUEST['test_name'].".class.inc";
            }

            // create an instance of the instrument

            $instrument =& NDB_BVL_Instrument::factory($_REQUEST['test_name'], $_REQUEST['commentID'], $this->tpl_data['subtest']);
            $this->_instrument =& $instrument;
            if (Utility::isErrorX($instrument)) {
                return PEAR::raiseError($instrument->getMessage());
            }
     
            $this->ValidityEnabled = $instrument->ValidityEnabled;
            $this->ValidityRequired = $instrument->ValidityRequired;
            // generate the subtest list
            $list = $instrument->getSubtestList();
            if (Utility::isErrorX($list)) {
                return PEAR::raiseError($list->getMessage());
            } else {
                $this->tpl_data['subtests'] = $list;
            }
        }

        if (empty($_REQUEST['subtest'])) {
            $hasAccess = $this->_hasAccess();
            if (Utility::isErrorX($hasAccess)) {
                return PEAR::raiseError("Instrument Status CP::_displayDataEntry: ".$hasAccess->getMessage());
            }

            if($this->getDataEntryStatus() == null && $hasAccess) {
                $success = $this->setDataEntryStatus('In Progress');
                if(Utility::isErrorX($success)) {
                    return PEAR::raiseError("InstrumentStatus_ControlPanel: ".$success->getMessage());
                }
            }

            // generate the administration flag buttons
            $this->tpl_data['access']['administration'] = $this->_displayAdministration();
            if (Utility::isErrorX($this->tpl_data['access']['administration'])) {
                return PEAR::raiseError("InstrumentStatus_ControlPanel: ".$this->tpl_data['access']['administration']->getMessage());
            }

            // generate the data entry flag buttons
            $this->tpl_data['access']['data_entry'] = $this->_displayDataEntry();
            if (Utility::isErrorX($this->tpl_data['access']['data_entry'])) {
                return PEAR::raiseError("InstrumentStatus_ControlPanel: ".$this->tpl_data['access']['data_entry']->getMessage());
            }

            // generate the validity flag buttons
            if($this->ValidityEnabled == true) {
                $this->tpl_data['access']['validity'] = $this->_displayValidity();
                if (Utility::isErrorX($this->tpl_data['access']['validity'])) {
                    return PEAR::raiseError("InstrumentStatus_ControlPanel: ".$this->tpl_data['access']['validity']->getMessage());
                }
            }

            /*
            // generate the exclusion flag buttons
            $this->tpl_data['access']['exclusion'] = $this->_displayExclusion();
            if (Utility::isErrorX($this->tpl_data['access']['exclusion'])) {
                return PEAR::raiseError("InstrumentStatus_ControlPanel: ".$this->tpl_data['access']['exclusion']->getMessage());
            }
            */
        }

        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("instrumentstatus_controlpanel.tpl");
        return $html;
    }


    /**
     * saves changes to the flags based on interaction with the control panel
     * @return void
     * @access public
     * @throws PEAR_Error
     */
    function save()
    {
        $hasAccess = $this->_hasAccess();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument Status CP::_displayAdministration: ".$hasAccess->getMessage());
        }
        // don't do anything if the instrument is locked
        if (!$hasAccess) {
            return false;
        }
        
        // get control panel selections from _REQUEST
        $possibleFlags = array('setDataEntry', 'setAdministration', 'setValidity');
        $flagsToSave = array_intersect($possibleFlags, array_keys($_REQUEST));

        // make sure there are at least one flag to save
        if (is_array($flagsToSave) && count($flagsToSave) > 0) {
            foreach ($flagsToSave AS $flagToSave) {
                $method = $flagToSave . "Status";
                $success = $this->$method($_REQUEST[$flagToSave]);
                if (Utility::isErrorX($success)) {
                    return PEAR::raiseError("Could not save flag: ".$success->getMessage());
                }
            }
        }

        return true;
    }

    /**
     * generates the HTML to display the set of buttons for the data entry flag
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function _displayDataEntry()
    {
        $hasAccess = $this->_hasAccess();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument Status CP::_displayDataEntry: ".$hasAccess->getMessage());
        }

        // loop through the options
        $i = 0;
        foreach($this->_dataEntryOptions AS $option) {
            // skip the null case
            if (is_null($option)) continue;

            $this->tpl_data['data_entry'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if($this->getDataEntryStatus() == $option) {
                $this->tpl_data['data_entry'][$i]['icon'] = 'selected';
            }
            // make the option a link unless this field is locked
            // the field is locked if the Administration flag has not
            // been set or the instrument is locked
            elseif ($hasAccess && $this->getAdministrationStatus()) {
                $showLink = true;
                $Validity = $this->getValidityStatus();
                if($Validity == NULL
                    && $this->_instrument->ValidityRequired == true && $this->getAdministrationStatus() != 'None') {
                    $showLink = false;
                }

                if($option == 'In Progress') {
                    $showLink = true;
                }
                elseif($option == 'Complete' && $this->getAdministrationStatus() == 'All') {
                    // run the data entry logic test
                    $testName = Utility::getTestNameByCommentID($this->_commentID);
                    if(Utility::isErrorX($testName)) {
                        return PEAR::raiseError("Could not get test name: ".$testName->getMessage());
                    }
                    
                    if(isset($this->_instrument)) {
                        if($showLink == true) {
                            $showLink = $this->_instrument->getDataEntryCompletionStatus() == 'Complete';
                        }
                    }
                }

                if($showLink) {
                    // construct the URL
                    $this->tpl_data['data_entry'][$i]['showlink'] = true;
                }
            } else {
                $this->tpl_data['data_entry'][$i]['icon'] = 'locked';
            }
            $i++;
        }
        return $hasAccess;
    }

    /**
     * generates the HTML to display the set of buttons for the administration flag
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function _displayAdministration()
    {
        $hasAccess = $this->_hasAccess();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument Status CP::_displayAdministration: ".$hasAccess->getMessage());
        }

        $dataEntry = $this->getDataEntryStatus();

        // loop through the options
        $i = 0;
        foreach ($this->_administrationOptions AS $option) {
            // skip the null case
            if (is_null($option)) continue;

            $this->tpl_data['administration'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if ($this->getAdministrationStatus() == $option) {
                $this->tpl_data['administration'][$i]['icon'] = 'selected';
            }
            // make the option a link unless this field is locked
            // the field is locked if the Data_entry flag has been set 
            // or the instrument is locked
            elseif ($hasAccess && $dataEntry != 'Complete' && $dataEntry != 'Not Complete') {
                // construct the URL
                $this->tpl_data['administration'][$i]['showlink'] = true;
            } else {
                // block the button
                $this->tpl_data['administration'][$i]['icon'] = 'locked';
            }
            $i++;
        }

        return $hasAccess;
    }

    /**
     * generates the HTML to display the set of buttons for the validity flag
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function _displayValidity()
    {
        $hasAccess = $this->_hasAccess();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument Status CP::_displayValidity: ".$hasAccess->getMessage());
        }

        $validityStatus = $this->getValidityStatus();
        $data_entry_status = $this->getDataEntryStatus();

        // loop through the options
        $i = 0;
        foreach($this->_validityOptions AS $option) {
            // skip the null case
            if(is_null($option)) continue;

            $this->tpl_data['validity'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if($validityStatus == $option) {
               $this->tpl_data['validity'][$i]['icon'] = 'selected';
            }
            if($data_entry_status == 'Complete') {
               $this->tpl_data['validity'][$i]['showLink'] = false;
            } else {
               $this->tpl_data['validity'][$i]['showLink'] = true;
            }
            $i++;
        }

        return $hasAccess;
    }

    /**
     * generates the HTML to display the set of buttons for the exclusion flag
     * @return string
     * @access public
     * @throws PEAR::Error
     */
    function _displayExclusion()
    {
        $hasAccess = $this->_hasAccess();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument Status CP::_displayExclusion: ".$hasAccess->getMessage());
        }

        $exclusionStatus = $this->getExclusionStatus();

        // loop through the options
        $i = 0;
        foreach($this->_exclusionOptions AS $option) {
            // skip the null case
            if(is_null($option)) continue;

            $this->tpl_data['exclusion'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if($exclusionStatus == $option) {
                $this->tpl_data['exclusion'][$i]['icon'] = 'selected';
            }
            $i++;
        }

        return $hasAccess;
    }
    
    /**
     * determines if the current instrument statuses should be locked due to being sent to dcc unless there exists feedback
     *
     * @return boolean
     * @throws PEAR_Error
     * @access private
     */
    function _hasAccess()
    {
        // get user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // make a timepoint object
        $timePoint =& TimePoint::singleton($this->getSessionID());
        if (Utility::isErrorX($timePoint)) {
            return PEAR::raiseError('Could not select timepoint: '.$timePoint->getMessage());
        }

        // make sure user belongs to same site as timepoint
        if (!$user->hasPermission('data_entry') || $user->getData('CenterID') != $timePoint->getData('CenterID')) {
            return false;
        }

        // make a feedback object
        $feedback =& NDB_BVL_Feedback::singleton($user->getData('UserID'), null, null, $this->_commentID);
        if (Utility::isErrorX($feedback)) {
            return PEAR::raiseError('Could not select feedback: '.$feedback->getMessage());
        }
        
        // find out the current worst feedback thread status
        $maxThreadStatus = $feedback->getMaxThreadStatus(false);
        if(Utility::isErrorX($maxThreadStatus)) {
            return PEAR::raiseError('Could not get max feedback thread status: '.$maxThreadStatus->getMessage());
        }
        
        // statuses are locked if the timepoint is submitted and there is no open feedback
        return (!$timePoint->isSubmitted() || $maxThreadStatus == 'opened');
    }
}
?>

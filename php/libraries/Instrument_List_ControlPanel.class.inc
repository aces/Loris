<?php
require_once "NDB_BVL_Battery.class.inc";
/**
 * Time Point status control panel class
 *
 * This class provides the management GUI for the status flags
 * (session table) of a time point in the NeuroDB framework.
 * @package behavioural
 * @access public
 */

Class Instrument_List_ControlPanel extends TimePoint
{
    function Instrument_List_ControlPanel($sessionID){
    	$this->select($sessionID);
    }
 
    /**
     * generates the HTML to display the set of buttons for the timepoint status flags
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function display()
    {
        $this->tpl_data['candID'] = $this->getData('CandID');
        $this->tpl_data['sessionID'] = $this->getData('SessionID');

        // start next stage
        $this->tpl_data['access']['next_stage'] = $this->_displayStartNextStage();
        if (Utility::isErrorX($this->tpl_data['access']['next_stage'])) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$this->tpl_data['access']['next_stage']->getMessage());
        }
                
        // generate the time point status buttons
        $this->tpl_data['access']['status'] = $this->_displayStatus();
        if (Utility::isErrorX($this->tpl_data['access']['status'])) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$this->tpl_data['access']['status']->getMessage());
        }
        // send to DCC
        $this->tpl_data['access']['send_to_dcc'] = $this->_displaySendToDCC();
        if(!$this->tpl_data['access']['send_to_dcc']){
        	$this->tpl_data['access']['send_to_dcc_status_message']=$this->_getSendToDCCStatusMessage();
        }
        if (Utility::isErrorX($this->tpl_data['access']['send_to_dcc'])) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$this->tpl_data['access']['send_to_dcc']->getMessage());
        }

        // BVLQC - get permission and set the tpl element
        $user =& User::singleton();
        $this->tpl_data['access']['bvl_qc'] = $user->hasPermission('bvl_feedback');
        if (isset($this->tpl_data['access']['bvl_qc_type']) && Utility::isErrorX($this->tpl_data['access']['bvl_qc_type'])) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$this->tpl_data['access']['bvl_qc_type']->getMessage());
        }
        
        // BVLQCType
        $success = $this->_displayBVLQCType();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$success->getMessage());
        }
        // BVLQCStatus
        $success = $this->_displayBVLQCStatus();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("Instrument_List_ControlPanel: ".$success->getMessage());
        }
        
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("instrument_list_controlpanel.tpl");
        return $html;
   }

    /**
     * saves changes to the session table based on interaction with the control panel
     * @return void
     * @access public
     * @throws PEAR_Error
     */
    function save()
    {
        $currentStage = $this->getData('Current_stage');
        $currentStatus = $this->getData($currentStage);
        
        // update the status of the current stage
        if (!empty($_REQUEST['setStageUpdate'])
            && $this->_hasAccess_Status()
            && in_array($_REQUEST['setStageUpdate'], $this->_statusOptions)
            && in_array($currentStage, $this->_dynamicStageOptions))
        {
            $this->setData($currentStage, $_REQUEST['setStageUpdate']);
            return;
        }

        // submit to dcc (a.k.a., finalize)
        if (isset($_REQUEST['setSubmitted']) && $_REQUEST['setSubmitted'] == 'Y'
            && $this->_hasAccess_SendToDCC()
            && in_array($currentStage, array('Visit', 'Screening'))
            && $currentStatus != 'In Progress')
        {

            // trigger timepoint flags
            require_once "TimePoint_Flag.class.inc";
            $config =& NDB_Config::singleton();
            $study = $config->getSetting('study');
            $sessionID = $this->getData('SessionID');
            if ($study['timepointFlagCheck_send2dcc'] && $this->getVisitStatus()=='Pass') {
                // object instance
                $timepointFlagObject =& TimePoint_Flag::singleton($sessionID);
                // flag types
                $flagTypeIDs = $timepointFlagObject->getFlagTypeIDs();
                // evaluate the flags for the timepoint
                $flagList = $timepointFlagObject->evaluateTimepointFlags();
                // loop the list and trigger all flags expect the data entry errors
                foreach ($flagList as $flagName=>$flagStatus) {
                    // check if the flag exists, i.e. previously triggered
                    if ($timepointFlagObject->timepointFlagExists($this->getData('SessionID'), $flagName)) continue;
                    // raise flags - except missing data flags - INSERT into DB
                    if ($flagStatus != $timepointFlagObject->showConstant('TIMEPOINT_FLAG_MISSING_DATA')) {
                        // get type
                        $flagType = $timepointFlagObject->getFlagType($flagName);
                        // assign status according to type
                        if ($flagStatus == $timepointFlagObject->showConstant('TIMEPOINT_FLAG_NA_INSTRUMENT')) $newFlagTypeID = $flagTypeIDs[$flagStatus];
                        else $newFlagTypeID = $flagTypeIDs[$flagType];
                        $timepointFlagObject->insertFlag($flagName, $newFlagTypeID);
                    }
                }
                unset($flagList);
                unset($constantsArray);
                unset($flagTypeIDs);
                unset($flagName);
                unset($flagStatus);
                unset($timepointFlagObject);
            }
            
            // Send to DCC - set Submitted to Y
            $this->setData('Submitted', $_REQUEST['setSubmitted']);
            // move to next stage (approval or the bin)
            if($currentStatus == 'Pass') $nextStage = 'Approval';
            else $nextStage = 'Recycling Bin';
            $this->startStage($nextStage);
            
            if ($nextStage = 'Recycling Bin'){ 
                
                $battery = new NDB_BVL_Battery();
                if(Utility::isErrorX($battery)) {
                    return PEAR::raiseError("Battery Error: ".$battery->getMessage());
                }
                
                // set the SessionID for the battery
                $success = $battery->selectBattery($this->getData('SessionID'));
                if(Utility::isErrorX($success)) {
                    return PEAR::raiseError("Battery Error (".$this->getData('SessionID')."): ".$success->getMessage());
                }

                // get the list of instruments
                $batteryList = $battery->getBatteryVerbose();
                if (Utility::isErrorX($batteryList)) {
                    return PEAR::raiseError("Instrument List CP::_displayStatus: " . $batteryList->getMessage());
                }
                
                // Get the list of DDE instruments
                $config =& NDB_Config::singleton();
                $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
                
                // clear the unresolved conflicts for all the instruments
                foreach ($batteryList as $instrument) {
                    
                    // If the instrument requires double data entry, check that DDE is also done
                    if(in_array($instrument['Test_name'], $ddeInstruments)) {
                        ConflictDetector::clearConflictsForInstance($instrument['CommentID']);
                    }
                }
                
            }
            
            return;
        }
        
        // un-submit to dcc
        if (isset($_REQUEST['setSubmitted']) && $_REQUEST['setSubmitted'] == 'N'
            && $this->_hasAccess_SendToDCC()
            && !in_array($currentStage, array(null, 'Not Started', 'Visit', 'Screening')))
            {
                $this->setData('Submitted', $_REQUEST['setSubmitted']);
                
                // revert from approval (or the bin)
                if($currentStage == 'Approval') {
                    $this->setData(array('Approval'=>NULL, 'Date_approval'=>NULL));
                }
                $previousStage = $this->_determinePreviousStage();
                $this->startStage($previousStage);
                  
                $battery = new NDB_BVL_Battery();
                if(Utility::isErrorX($battery)) {
                    return PEAR::raiseError("Battery Error: ".$battery->getMessage());
                }
                
                // set the SessionID for the battery
                $success = $battery->selectBattery($this->getData('SessionID'));
                if(Utility::isErrorX($success)) {
                    return PEAR::raiseError("Battery Error (".$this->getData('SessionID')."): ".$success->getMessage());
                }
                
                // get the list of instruments
                $batteryList = $battery->getBatteryVerbose();
                if (Utility::isErrorX($batteryList)) {
                    return PEAR::raiseError("Instrument List CP::_displayStatus: " . $batteryList->getMessage());
                }
                
                // Get the list of DDE instruments
                $config =& NDB_Config::singleton();
                $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
                
                // detect conflicts for all the instruments
  
                foreach ($batteryList as $instrument) {
                    
                    // If the instrument requires double data entry, detect conflicts
                    if(in_array($instrument['Test_name'], $ddeInstruments)) {
                        // ConflictDetector::clearConflictsForInstance($instrument['CommentID']);
                        ConflictDetector::clearConflictsForInstance($instrument['CommentID']);
                        $diff=ConflictDetector::detectConflictsForCommentIds($instrument['Test_name'], $instrument['CommentID'], $instrument['DDECommentID']);
                        ConflictDetector::recordUnresolvedConflicts($diff);

                    }
                }
                
                return;
            }
        
        // set the BVLQC flag
        $user =& User::singleton();
        if (isset($_REQUEST['setBVLQCStatus']) && $user->hasPermission('bvl_feedback')) {
            $this->setData('BVLQCStatus', $_REQUEST['setBVLQCStatus']);
            return;
        }
        if (isset($_REQUEST['setBVLQCType']) && $user->hasPermission('bvl_feedback')) {
            $this->setData('BVLQCType', $_REQUEST['setBVLQCType']);
            return;
        }
    }
    
    function _determinePreviousStage()
    {
        // outcome stage is the last stage (approval || visit || screening || not started, in that order) with a non-null status
        if($this->getData('Approval') != NULL) {
            return  'Approval';
        } elseif($this->getData('Visit') != NULL) {
            return  'Visit';
        } elseif($this->getData('Screening') != NULL) {
            return  'Screening';
        }
        return  'Not Started';
    }


    /**
     * generates the HTML to display the set of buttons for the Time Point status update 
     * @return string
     * @access private
     * @throws PEAR_Error
     */
    function _displayStatus()
    {
        $currentStage = $this->getCurrentStage();
        $currentStatus = $this->getCurrentStatus();

        $this->tpl_data['current_stage'] = $currentStage;
        $this->tpl_data['current_status'] = $currentStatus;

        // if the time point hasn't been not started, do not display status options
        if (!$this->isStudyStageDynamic($currentStage)) {
            return false;
        }

        // new DB Object
        $db =& Database::singleton();
        if(Utility::isErrorX($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
            
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError('User Error: '.$user->getMessage());
        }

        $hasAccess = $this->_hasAccess_Status();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument List CP::_displayStatus: ".$hasAccess->getMessage());
        }

        // check that all the instruments' Data Entry is market Complete
        $battery = new NDB_BVL_Battery;
        if(Utility::isErrorX($battery)) {
            return PEAR::raiseError("Battery Error: ".$battery->getMessage());
        }

        // set the SessionID for the battery
        $success = $battery->selectBattery($_REQUEST['sessionID']);
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("Battery Error (".$_REQUEST['sessionID']."): ".$success->getMessage());
        }

        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();
        if (Utility::isErrorX($batteryList)) {
            return PEAR::raiseError("Instrument List CP::_displayStatus: " . $batteryList->getMessage());
        }
           
        // Get the list of DDE instruments
        $config =& NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');

        // loop the list and check the Data Entry status
        $ddeConflictDetected=false;
        foreach ($batteryList as $instrument) {
            $status = new NDB_BVL_InstrumentStatus();
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                break;
            }

            // If the instrument requires double data entry, check that DDE is also done
            if(in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new NDB_BVL_InstrumentStatus();
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    break;
                }

                // Pretend data entry is not complete if there are conflicts
                if(ConflictDetector::isInstrumentInstanceInConflictState($instrument['CommentID'])) {
                    $ddeConflictDetected=true;
                    break;
                }
            }
        }

        // loop through the options
        $i = 0;
        foreach($this->_statusOptions AS $option) {
            // skip the null case and do not show Withdrawal option for Approval stage
            if (is_null($option) || ($option == 'Withdrawal' && $currentStage == 'Approval')) continue;

            $this->tpl_data['status'][$i]['label'] = $option;

            // highlight the current option if it's the current status
            if($currentStatus == $option) {
                $this->tpl_data['status'][$i]['icon'] = 'selected';
            }
            // if the current stage is dynamic AND the Timepoint is not sent to DCC (all PSC users can press buttons)
            // OR if the stage is dynamic (Approval), the Timepoint IS submitted and the user can QC behavioral data
            elseif (in_array($currentStage, $this->_dynamicStageOptions)
                    && (!$this->isSubmitted() || ($this->isSubmitted() && $hasAccess))) {
                
                if ($option == 'In Progress') {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } elseif ($option == 'Pass' && $dataEntry == 'Complete' && !$ddeConflictDetected) {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } elseif (($option == 'Failure' || $option == 'Withdrawal') && $dataEntry == 'Complete') {
                    $this->tpl_data['status'][$i]['showlink'] = true;
                } else {
                    $this->tpl_data['status'][$i]['icon'] = 'locked';
                }
                
            } else {
                $this->tpl_data['status'][$i]['icon'] = 'locked';
            }
            $i++;
        }

        return $hasAccess;
    }

    function _hasAccess_Status()
    {
        // get user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        
        // disable the button for all these users
        $currentStage = $this->getCurrentStage();
        if($currentStage == "Approval"){
            return ($user->hasPermission('bvl_feedback'));
        }
        
        return ($user->hasPermission('data_entry') && $user->getData('CenterID') == $this->getData('CenterID'));
    }

    function _displayBVLQCType()
    {
    	// get the current bvlqc type
    	$qcStatus = $this->getBVLQCStatus();
		foreach($this->bvlQcTypes as $type){
			$isSelected=$type == $this->getBVLQCType();
			$type=strtolower($type);
			if($type==null){$type="none";}
            if($isSelected){
            	$this->tpl_data['bvl_qc_type_'.$type]['icon'] = 'selected';
            }
            //If a BVLQC status is not selected, and this type is not already chosen, show the link.
            if(!$isSelected && empty($qcStatus)){ 
            	$this->tpl_data['bvl_qc_type_'.$type]['showlink']=true;
            }
        }
    }
    
    /**
     * generates the HTML to display the set of buttons for the Time Point status update
     * @return string
     * @access private
     * @throws PEAR_Error
     */
    function _displayBVLQCStatus()
    {
    	// get the current bvlqc type
    	$qcType = $this->getBVLQCType();
    	
		foreach($this->bvlQcStatuses as $status){
			$isSelected=$status == $this->getBVLQCStatus();
			$status=strtolower($status);
			if($status==null){$status="none";}
            if($isSelected){
            	$this->tpl_data['bvl_qc_status_'.$status]['icon'] = 'selected';
            }
            //If a BVLQC type is selected, and this status is not already chosen, show the link.
            if(!empty($qcType) && !$isSelected){ 
            	$this->tpl_data['bvl_qc_status_'.$status]['showlink']=true;
            }
        }
    }

    /**
     * generates the HTML to display the set of buttons for the Time Point status update 
     * @return string
     * @access private
     * @throws PEAR_Error
     */
    function _displaySendToDCC()
    {
        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        
        $hasAccess = $this->_hasAccess_SendToDCC();
        if (Utility::isErrorX($hasAccess)) {
            return PEAR::raiseError("Instrument List CP::_displaySendToDCC: ".$hasAccess->getMessage());
        }

        // This is a toggle button.
        if ($this->getData('Submitted')=='Y') {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'N';
        } elseif (isset($study['timepointFlagCheck_send2dcc']) && 
            $study['timepointFlagCheck_send2dcc'] && $this->getVisitStatus()=='Pass') {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Check';
        } else {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Y';
        }

        if ($this->isSubmitted()) {
            $this->tpl_data['send_to_dcc']['icon'] = 'selected';
            $this->tpl_data['send_to_dcc']['reverse'] = 'Reverse Send To DCC';
        }

        $battery = new NDB_BVL_Battery();
        if(Utility::isErrorX($battery)) {
            return PEAR::raiseError("Battery Error: ".$battery->getMessage());
        }
        
        // set the SessionID for the battery
        $success = $battery->selectBattery($this->getData('SessionID'));
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("Battery Error (".$this->getData('SessionID')."): ".$success->getMessage());
        }
        
        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();
        if (Utility::isErrorX($batteryList)) {
            return PEAR::raiseError("Instrument List CP::_displayStatus: " . $batteryList->getMessage());
        }
        
        // Get the list of DDE instruments
        $config =& NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        
        // clear the unresolved conflicts for all the instruments
        $allDataEntryComplete=true;
        foreach ($batteryList as $instrument) {
            
            $status = new NDB_BVL_InstrumentStatus();
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                $allDataEntryComplete=false;
                break;
            }
            
            // If the instrument requires double data entry, check that DDE is also done
            if(in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new NDB_BVL_InstrumentStatus();
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    $allDataEntryComplete=false;
                    break;
                }
            }
        }
        
        if ($this->getData('Submitted')=='Y') {
            return $hasAccess;
        }
        return ($hasAccess && $allDataEntryComplete);
    }
    
    /*
    * returns the reason why the user cannot send to dcc.
    */
    function _getSendToDCCStatusMessage(){
    	// create user object
        $user =& User::singleton();
        $config =& NDB_Config::singleton();
        
        // get the value of the session.Scan_done field
        $scanDone = $this->getData('Scan_done');
        
    	if(!$user->hasPermission('send_to_dcc')){
        	return "User does not have permission to send to DCC";
        }
        if($user->getData('CenterID') != $this->getData('CenterID')){
        	return "Users must belong to the same site as the candidate to submit to DCC.";
        }
        if($this->getData('Submitted')!='N'){
        	return "This timepoint has already been sent to DCC.  Try refreshing your page.";
        }
        if(!in_array($this->getData('Current_stage'), array('Screening', 'Visit'))){
        	return "This stage is not a Screening or Visit stage.  Only Screening or Visit stages can be sent to DCC.";
        }
        if(in_array($this->getData($this->getData('Current_stage')), array(null, 'In Progress'))){
        	return "The status of this stage is either In Progress or has not been set.";
        }
        if($config->getSetting("useScanDone")==="false" || ($this->getData('Current_stage') != 'Screening' && empty($scanDone))){
        	return "The Scan done field must be entered for the Visit stage";
        }
        
        $battery = new NDB_BVL_Battery();
        if(Utility::isErrorX($battery)) {
            return PEAR::raiseError("Battery Error: ".$battery->getMessage());
        }
        
        // set the SessionID for the battery
        $success = $battery->selectBattery($this->getData('SessionID'));
        if(Utility::isErrorX($success)) {
            return PEAR::raiseError("Battery Error (".$this->getData('SessionID')."): ".$success->getMessage());
        }
        
        // get the list of instruments
        $batteryList = $battery->getBatteryVerbose();
        if (Utility::isErrorX($batteryList)) {
            return PEAR::raiseError("Instrument List CP::_displayStatus: " . $batteryList->getMessage());
        }
        
        // Get the list of DDE instruments
        $config =& NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        
        // clear the unresolved conflicts for all the instruments
        $allDataEntryComplete=true;
        foreach ($batteryList as $instrument) {
            
            $status = new NDB_BVL_InstrumentStatus();
            $status->select($instrument['CommentID']);
            $dataEntry = $status->getDataEntryStatus();
            if ($dataEntry != 'Complete') {
                $allDataEntryComplete=false;
                break;
            }
            
            // If the instrument requires double data entry, check that DDE is also done
            if(in_array($instrument['Test_name'], $ddeInstruments)) {
                $status = new NDB_BVL_InstrumentStatus();
                $status->select($instrument['DDECommentID']);
                $dataEntry = $status->getDataEntryStatus();
                if ($dataEntry != 'Complete') {
                    $allDataEntryComplete=false;
                    break;
                }
            }
        }
        if(!$allDataEntryComplete) {
            return "All instruments must have data entry marked as complete.";
                }
    }
    
    
    function _hasAccess_SendToDCC()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
		$config =& NDB_Config::singleton();
		
        // get the value of the session.Scan_done field
        $scanDone = $this->getData('Scan_done');
		
        // make the option available is the Stage/Status is Sendable to DCC
        // or if its Superuser and option was Sent (to unsend i.e. set to N)
        
        if ($user->hasPermission('unsend_to_dcc') && $this->getData('Submitted')=='Y') {
            return true;
        } elseif ($user->hasPermission('send_to_dcc')
                  && $user->getData('CenterID') == $this->getData('CenterID')
                  && $this->getData('Submitted')=='N' 
                  && in_array($this->getData('Current_stage'), array('Screening', 'Visit'))
                  && !in_array($this->getData($this->getData('Current_stage')), array(null, 'In Progress'))
                  && ($config->getSetting("useScanDone")==="false" || ($this->getData('Current_stage') == 'Screening' || !empty($scanDone))))
        {
            return true;
        }
        return false;
    }

    function _displayStartNextStage()
    {
        $this->tpl_data['next_stage'] = $this->getNextStage();

		 // create user object
        $user =& User::singleton();

        // check user permissions
    	if (!$user->hasPermission('data_entry') || $user->getData('CenterID') != $this->getData('CenterID')) {
            return false;
        }
		return $this->isStartable();
    }

}
?>

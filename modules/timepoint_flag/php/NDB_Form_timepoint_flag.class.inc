<?php
require_once "NDB_Form.class.inc";
require_once "TimePoint_Flag.class.inc";

/**
 * Candidate Parameter form
 * @package main
 */
class NDB_Form_timepoint_flag extends NDB_Form
{
    
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
		$config =& NDB_Config::singleton();
        $timepoint =& TimePoint_Flag::singleton($this->identifier);
        if (Utility::isErrorX($timepoint)) {
            return PEAR::raiseError("Error, failed to create a form for this timepoint ($this->identifier):\n".$timepoint->getMessage());
        }
        
        // get the value of the session.Scan_done field
        $scanDone = $timepoint->getData('Scan_done');

        // make the option available is the Stage/Status is Sendable to DCC
        // or if its Superuser and option was Sent (to unsend i.e. set to N)
        
        if ($user->hasPermission('unsend_to_dcc') && $timepoint->getData('Submitted')=='Y') {
            return true;
        } elseif ($user->hasPermission('send_to_dcc')
                  && $user->getData('CenterID') == $timepoint->getData('CenterID')
                  && $timepoint->getData('Submitted')=='N' 
                  && in_array($timepoint->getData('Current_stage'), array('Screening', 'Visit'))
                  && !in_array($timepoint->getData($timepoint->getData('Current_stage')), array(null, 'In Progress'))
                  && ($config->getSetting("useScanDone")==="false" || ($timepoint->getData('Current_stage') == 'Screening' || !empty($scanDone))))
        {
            return true;
        }
        return false;
    }

    function check_timepoint_flag()
    {
        $db =& Database::singleton();
        $sessionID = $this->identifier;
        
        $timepointFlagObject =& TimePoint_Flag::singleton($sessionID);

        // send basic timepoint data to the template
        $this->tpl_data['candID'] = $timepointFlagObject->getData('CandID');
        $this->tpl_data['sessionID'] = $sessionID;
        $this->tpl_data['timepointLabel'] = $timepointFlagObject->getData('Visit_label');

        // evaluate the flags for the timepoint and get the list of triggered flags and their statuses
        // flag statuses are captured as constants TIMEPOINT_FLAG_TRIGGER, TIMEPOINT_FLAG_NA_INSTRUMENT, TIMEPOINT_FLAG_NULL
        $flagList = array();
        $flagList = $timepointFlagObject->evaluateTimepointFlags();
        if (Utility::isErrorX($flagList)) {
            return PEAR::raiseError("Error, failed to evaluate flags for timepoint ($this->identifier):\n". $flagList->getMessage());
        }
        
        
        // if there are no flags, show the buttons to send the timepoint to DCC
        if (count($flagList)==0) {
            $this->tpl_data['send_to_dcc']['set_submitted']='Y';
            return true;
        }

        $newFlagTriggered=0;
        foreach ($flagList as $flagName=>$flagStatus) {

            // check if the flag exists, i.e. previously triggered
            $flagExists = $timepointFlagObject->timepointFlagExists($sessionID, $flagName);
            if (Utility::isErrorX($flagExists)) {
                return PEAR::raiseError("Error:\n".$flagExists->getMessage());
            }

        	// skip to next flag if it's already in the table
            if ($flagExists && $flagStatus != $timepointFlagObject->showConstant('TIMEPOINT_FLAG_MISSING_DATA')) {
                $data['exists'][]=$flagName;
                continue;
            }
            
            $data[$flagStatus][]=$flagName;
            
            $newFlagTriggered=1;
        } // end foreach flag

        foreach ($data as $key=>$val) {
        
            switch ($key) {
                case "exists":
                $message= "Previously triggered";
                case "DERR":
                $message= "Data Entry Error";
                case "MI":
                $message= "Missing Instrument";
                case "1":
                $message= "New Flag";
            }
        
            foreach ($val as $key1=>$flag) {
                if ($key != 'MI') {
                    $this->addScoreColumn($key.$flag, "FLAG : ".$flag);
                    $this->tpl_data["elements_list_$key"][]=$key.$flag;
                }
            }
            
            // add the list of triggers for each flag - except for existing ones
            if ($key != 'exists') {
                $flagPositiveTriggers = $timepointFlagObject->evaluateFlagTriggers($flag);
                if (is_array($flagPositiveTriggers)) {
                    foreach ($flagPositiveTriggers as $triggerName=>$triggerStatus) {
                        $this->addScoreColumn($key.$flag.$triggerName,$triggerName);
                        $this->tpl_data["elements_list_$key"][]=$key.$flag.$triggerName;
                    }
                }
            }
        }

        if ($newFlagTriggered==0) {
            $this->tpl_data['send_to_dcc']['set_submitted']='Y';
            return true;
        }
    }
}
?>

<?php
 /**
 * Comments
 * 
 * PHP Version 5
 * 
 *  @category Main
 *  @package  TimePoint_Flag
 *  @author   jharlap <username@example.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @version  GIT: <git_id>
 *  @link     https://www.github.com/aces/Loris-Trunk/
 **/

/**
 *  Candidate Parameter form
 * 
 *  @category Main
 *  @package  Main
 *  @author   jharlap <username@example.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @version  Release: <package_version>
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Form_Timepoint_Flag extends NDB_Form
{

    /**
    * Comment
    * 
    * @return bool
    * 
    */
    function _hasAccess()
    {
        // create user object
        $user   =& User::singleton();
        $config =& NDB_Config::singleton();
        $tp     =& TimePoint_Flag::singleton($this->identifier);
        $cs     = $tp->getData('Current_stage');

        // get the value of the session.Scan_done field
        $scanDone = $tp->getData('Scan_done');

        // make the option available is the Stage/Status is Sendable to DCC
        // or if its Superuser and option was Sent (to unsend i.e. set to N)

        if ($user->hasPermission('unsend_to_dcc')
            && $tp->getData('Submitted')=='Y'
        ) {
            return true;
        } elseif ($user->hasPermission('send_to_dcc')
                  && $user->getData('CenterID') == $tp->getData('CenterID')
                  && $tp->getData('Submitted')=='N'
                  && in_array($cs, array('Screening', 'Visit'))
                  && !in_array($tp->getData($cs), array(null, 'In Progress'))
                  && ($config->getSetting("useScanDone")==="false"
                      || ($tp->getData('Current_stage') == 'Screening'
                      || !empty($scanDone)))
          ) {
            return true;
        }
        return false;
    }

    /**
    * Comment 
    * 
    * @return bool
    * 
    */
    function checkTimepointFlag()
    {
        $db        =& Database::singleton();
        $sessionID = $this->identifier;

        $tpFlagObj =& TimePoint_Flag::singleton($sessionID);

        // send basic timepoint data to the template
        $this->tpl_data['candID']         = $tpFlagObj->getData('CandID');
        $this->tpl_data['sessionID']      = $sessionID;
        $this->tpl_data['timepointLabel'] = $tpFlagObj->getData('Visit_label');

        // evaluate the flags for the timepoint and get the list of triggered flags
        //  and their statuses
        // flag statuses are captured as constants TIMEPOINT_FLAG_TRIGGER,
        //  TIMEPOINT_FLAG_NA_INSTRUMENT, TIMEPOINT_FLAG_NULL
        $flagList = array();
        $flagList = $tpFlagObj->evaluateTimepointFlags();

        // if there are no flags, show the buttons to send the timepoint to DCC
        if (count($flagList)==0) {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Y';
            return true;
        }

        $newFlagTriggered = 0;
        foreach ($flagList as $flagName=>$flagStatus) {

            // check if the flag exists, i.e. previously triggered
            $flagExists = $tpFlagObj->timepointFlagExists($sessionID, $flagName);
            $tpfmd      = $tpFlagObj->showConstant('TIMEPOINT_FLAG_MISSING_DATA');

            // skip to next flag if it's already in the table
            if ($flagExists && $flagStatus != $tpfmd) {
                $data['exists'][] = $flagName;
                continue;
            }

            $data[$flagStatus][] = $flagName;

            $newFlagTriggered = 1;
        } // end foreach flag

        foreach ($data as $key => $val) {

            switch ($key) {
            case "exists":
                $message = "Previously triggered";
            case "DERR":
                $message = "Data Entry Error";
            case "MI":
                $message = "Missing Instrument";
            case "1":
                $message = "New Flag";
            }

            foreach ($val as $key1 => $flag) {
                if ($key != 'MI') {
                    $this->addScoreColumn($key.$flag, "FLAG : ".$flag);
                    $this->tpl_data["elements_list_$key"][] = $key.$flag;
                }
            }

            $kftn = $key.$flag.$triggerName;
            // add the list of triggers for each flag - except for existing ones
            if ($key != 'exists') {
                $flagPositiveTriggers = $tpFlagObj->evaluateFlagTriggers($flag);
                if (is_array($flagPositiveTriggers)) {
                    foreach ($flagPositiveTriggers as $triggerName=>$triggerStatus) {
                        $this->addScoreColumn($key.$flag.$triggerName, $triggerName);
                        $this->tpl_data["elements_list_$key"][] = $kftn;
                    }
                }
            }
        }

        if ($newFlagTriggered == 0) {
            $this->tpl_data['send_to_dcc']['set_submitted'] = 'Y';
            return true;
        }
    }
}
?>

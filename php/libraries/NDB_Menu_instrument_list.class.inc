<?php
require_once 'NDB_Menu.class.inc';

/**
 * The timepoint details menu
 * @package behavioural
 */
class NDB_Menu_instrument_list extends NDB_Menu
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        if (Utility::isErrorX($timePoint)) {
            return PEAR::raiseError("TimePoint Error (".$_REQUEST['sessionID']."): ".$timePoint->getMessage());
        }
        $candID = $timePoint->getCandID();

        $candidate =& Candidate::singleton($candID);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($candID): ".$candidate->getMessage());
        }

        // check user permissions
    	return ($user->hasPermission('access_all_profiles') || $user->getData('CenterID') == $candidate->getData('CenterID') || $user->getData('CenterID') == $timePoint->getData('CenterID'));
    }

    function setup()
    {
        // set template data
        $this->tpl_data['candID'] = $_REQUEST['candID'];
        $this->tpl_data['sessionID'] = $_REQUEST['sessionID'];

        // get behavioral battery for this visit (time point)
        $battery = new NDB_BVL_Battery;
        if (Utility::isErrorX($battery)) {
            return PEAR::raiseError('Battery Error: '.$battery->getMessage());
        }
        $success = $battery->selectBattery($_REQUEST['sessionID']);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError('instrument_list::setup() battery: '.$success->getMessage());
        }

        // get the list of instruments
        $listOfInstruments = $battery->getBatteryVerbose();
        if(Utility::isErrorX($listOfInstruments)) {
            return PEAR::raiseError('instrument_list::setup() instruments: '.$listOfInstruments->getMessage());
        }

        // display list of instruments
        if (!empty($listOfInstruments)) {
            $user =& User::singleton();
            if (Utility::isErrorX($user)) {
                return PEAR::raiseError ("User Error: ".$user->getMessage());
            }
            $username = $user->getData('UserID');

            if ($user->hasPermission('bvl_feedback')) {
                $feedback_select_inactive = 'Y';
            }

            $x = -1;
            foreach($listOfInstruments as $instrument) {
                // print the sub group header row
                if($instrument['Sub_group'] != $prevSubgroup) {
                    $x++;
                    $i = 0;
                    $this->tpl_data['instrument_groups'][$x]['title'] = $instrument['Sub_group'];
                }
                $prevSubgroup = $instrument['Sub_group'];

                // make an instrument status object
                $status = new NDB_BVL_InstrumentStatus;
                $success = $status->select($instrument['CommentID']);
                if(Utility::isErrorX($success)) {
                    return PEAR::raiseError("instrument_list::setup() instrument status: ".$success->getMessage());
                }

                $ddeStatus = new NDB_BVL_InstrumentStatus;
                $success = $ddeStatus->select($instrument['DDECommentID']);
                if(Utility::isErrorX($success)) {
                    return PEAR::raiseError("instrument_list::setup() instrument status: ".$success->getMessage());
                }
		
                $this->tpl_data['instruments'][$x][$i]['fullName'] = $instrument['Full_name'];
                $this->tpl_data['instruments'][$x][$i]['dataEntryStatus'] = $status->getDataEntryStatus();
                $this->tpl_data['instruments'][$x][$i]['administrationStatus'] = $status->getAdministrationStatus();
                $this->tpl_data['instruments'][$x][$i]['testName'] = $instrument['Test_name'];
                $this->tpl_data['instruments'][$x][$i]['commentID'] = $instrument['CommentID'];
                $this->tpl_data['instruments'][$x][$i]['isDdeEnabled'] = NDB_BVL_Battery::isDoubleDataEntryEnabledForInstrument($instrument['Test_name']);
                $this->tpl_data['instruments'][$x][$i]['ddeCommentID'] = $instrument['DDECommentID'];
                $this->tpl_data['instruments'][$x][$i]['ddeDataEntryStatus'] = $ddeStatus->getDataEntryStatus();
                $this->tpl_data['instruments'][$x][$i]['isDirectEntry'] = $instrument['isDirectEntry'];
                		
                // create feedback object for the time point
                $feedback = NDB_BVL_Feedback::singleton($username, null, null, $instrument['CommentID']);
                if (Utility::isErrorX($feedback)) {
                    return PEAR::raiseError("Feedback Error (".$instrument['CommentID']."): ".$feedback->getMessage());
                }
		
                $feedback_status = $feedback->getMaxThreadStatus($feedback_select_inactive);
                if (Utility::isErrorX($feedback_status)) {
                    return PEAR::raiseError("instrument_list::setup() feedback status: ".$feedback_status->getMessage());
                }

                $feedback_count = $feedback->getThreadCount();
                if (Utility::isErrorX($feedback_count)) {
                    return PEAR::raiseError("instrument_list::setup() feedback count: ".$feedback_count->getMessage());
                }

                $this->tpl_data['instruments'][$x][$i]['feedbackCount'] = (empty($feedback_count)) ? $feedback_status : $feedback_count;
                if(!empty($feedback_status)){
                    $this->tpl_data['instruments'][$x][$i]['feedbackStatus'] = $feedback_status;
                    if($feedback_count > 0) $this->tpl_data['instruments'][$x][$i]['feedbackColor'] =
                        $feedback->getThreadColor($feedback_status);
                } else {
                    $this->tpl_data['instruments'][$x][$i]['feedbackStatus'] = "-";
                }

                $i++;
            }
        }

        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        if (Utility::isErrorX($timePoint)) {
            return PEAR::raiseError("TimePoint Error (".$_REQUEST['sessionID']."): ".$timePoint->getMessage());
        }
        $candID = $timePoint->getCandID();

        $candidate =& Candidate::singleton($candID);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($candID): ".$candidate->getMessage());
        }

        $this->tpl_data['display'] = array_merge($candidate->getData(), $timePoint->getData());
    }
}
?>

<?php
/**
 * The timepoint details menu
 * @package behavioural
 */
class NDB_Menu_Filter_instrument_list extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();

        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        $candID = $timePoint->getCandID();

        $candidate =& Candidate::singleton($candID);

        // check user permissions
    	return ($user->hasPermission('access_all_profiles') || $user->getData('CenterID') == $candidate->getData('CenterID') || $user->getData('CenterID') == $timePoint->getData('CenterID'));
    }

    function getControlPanel() {
        $controlPanel = new Instrument_List_ControlPanel($_REQUEST['sessionID']);
        // save possible changes from the control panel...
        $success = $controlPanel->save();

        // display the control panel
        $html = $controlPanel->display();
        // I don't know why this is here, but it
        // was in main.php, so moved it to be safe.
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        $timePoint->select($_REQUEST['sessionID']);
        return $html;
    }
    function setup()
    {
        // set template data
        $this->tpl_data['candID'] = $_REQUEST['candID'];
        $this->tpl_data['sessionID'] = $_REQUEST['sessionID'];

        $this->_setupPage(null, null, null, null, 'filter');
        // get behavioral battery for this visit (time point)
        $battery = new NDB_BVL_Battery;
        $success = $battery->selectBattery($_REQUEST['sessionID']);

        $this->tpl_data['stage'] = Utility::getStageUsingCandID($this->tpl_data['candID']);
        $this->tpl_data['subprojectID'] = Utility::getSubprojectIDUsingCandID($this->tpl_data['candID']);

        // get the list of instruments
        $listOfInstruments = $battery->getBatteryVerbose($this->tpl_data['stage'], $this->tpl_data['subprojectID']);

        // display list of instruments
        if (!empty($listOfInstruments)) {
            $user =& User::singleton();
            $username = $user->getData('UserID');

            $feedback_select_inactive = null;
            if ($user->hasPermission('bvl_feedback')) {
                $feedback_select_inactive = 'Y';
            }

            $x = -1;
            $prevSubgroup = null;
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

                $ddeStatus = new NDB_BVL_InstrumentStatus;
                $success = $ddeStatus->select($instrument['DDECommentID']);

                $this->tpl_data['instruments'][$x][$i]['fullName'] = $instrument['Full_name'];
                $this->tpl_data['instruments'][$x][$i]['dataEntryStatus'] = $status->getDataEntryStatus();
                $this->tpl_data['instruments'][$x][$i]['administrationStatus'] = $status->getAdministrationStatus();
                $this->tpl_data['instruments'][$x][$i]['testName'] = $instrument['Test_name'];
                $this->tpl_data['instruments'][$x][$i]['commentID'] = $instrument['CommentID'];
                $this->tpl_data['instruments'][$x][$i]['isDdeEnabled'] = NDB_BVL_Battery::isDoubleDataEntryEnabledForInstrument($instrument['Test_name']);
                $this->tpl_data['instruments'][$x][$i]['ddeCommentID'] = $instrument['DDECommentID'];
                $this->tpl_data['instruments'][$x][$i]['ddeDataEntryStatus'] = $ddeStatus->getDataEntryStatus();
                $this->tpl_data['instruments'][$x][$i]['isDirectEntry'] = $instrument['isDirectEntry'];
                $this->tpl_data['instruments'][$x][$i]['instrumentOrder'] = $instrument['instrument_order'];

                // create feedback object for the time point
                $feedback = NDB_BVL_Feedback::singleton($username, null, null, $instrument['CommentID']);
		
                $feedback_status = $feedback->getMaxThreadStatus($feedback_select_inactive);

                $feedback_count = $feedback->getThreadCount();

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
        $candID = $timePoint->getCandID();

        $candidate =& Candidate::singleton($candID);

        $this->tpl_data['display'] = array_merge($candidate->getData(), $timePoint->getData());
    }
    /**
     * Used by the NDB_caller class when loading a page. 
     * Call the display function of the appropriate modules feedback panel.
     *
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     */

    function getFeedbackPanel($candID, $sessionID)
    {
        $feedbackPanel = new BVL_Feedback_Panel($candID, $sessionID);
        $html =  $feedbackPanel->display();
        return $html;
    }
}
?>

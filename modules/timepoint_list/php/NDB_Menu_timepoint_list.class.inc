<?php
require_once __DIR__ . '/TimePoint_List_ControlPanel.class.inc';
/**
 * The timepoint list menu
 * @package main
 */
class NDB_Menu_timepoint_list extends NDB_Menu
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();

        $candidate =& Candidate::singleton($_REQUEST['candID']);

        // check user permissions
    	if ($user->hasPermission('access_all_profiles') || $user->getData('CenterID') == $candidate->getData('CenterID')) {
            return true;
        }

        // if the candidate.CenterID does not match the users.CenterID
        // then check if any of the timepoints belong to the user's site
        $listOfTimePoints = $candidate->getListOfTimePoints();

        foreach ($listOfTimePoints as $sessionID) {
            // create timepoint object
            $timePoint =& TimePoint::singleton($sessionID);
            // check if at least one timepoint belongs to the user's site
            if ($user->getData('CenterID') == $timePoint->getData('CenterID')) {
                return true;
            }
        }            

        return false;
    }

    function setup()
    {
        // create candidate object
        $candidate =& Candidate::singleton($_REQUEST['candID']);
        $DB =& Database::singleton();

        $numberOfVisits = 0;
        $this->tpl_data['candID'] = $_REQUEST['candID'];
        $this->tpl_data['PSCID'] = $candidate->getPSCID();
        $listOfTimePoints = $candidate->getListOfTimePoints();
    
        if (!empty($listOfTimePoints)) {
            $user =& User::singleton();
            $username = $user->getData('UserID');

            $feedback_select_inactive = null;
            if ($user->hasPermission('bvl_feedback')) {
                $feedback_select_inactive = 'Y';
            }
        
            /*
             * List of visits
             */
            $x = 0;
            foreach ($listOfTimePoints as $currentTimePoint) {
                $timePoint =& TimePoint::singleton($currentTimePoint);
            
                // get the first date of visit in order to
                // turn on the future time points bit if we have a date of visit
                $dateOfVisit = $timePoint->getDateOfVisit();
                if (!empty($dateOfVisit)) {
                    if (empty($firstDateOfVisit)) {
                        $firstDateOfVisit = $dateOfVisit;
                    }
                    $numberOfVisits++;
                }

                // get timepoint data
                $this->tpl_data['timePoints'][$x] = $timePoint->getData();
 
                // get current status and date
                $this->tpl_data['timePoints'][$x]['currentStatus'] = $timePoint->getCurrentStatus();
                $this->tpl_data['timePoints'][$x]['currentDate'] = $timePoint->getCurrentDate();
                

                // get Center Name
		$centerID = $timePoint->getData('CenterID');
		$center = $DB->pselectRow("SELECT CenterID as ID, Alias FROM psc WHERE CenterID =:cid", array('cid' => $centerID));
               $this->tpl_data['timePoints'][$x]['CenterName'] = $center['Alias'];

                // create feedback object for the time point            
                $feedback = NDB_BVL_Feedback::singleton($username, null, $timePoint->getData('SessionID'));

                $feedback_status = $feedback->getMaxThreadStatus($feedback_select_inactive);

                $feedback_count = $feedback->getThreadCount();

                $this->tpl_data['timePoints'][$x]['feedbackCount'] = (empty($feedback_count)) ? $feedback_status : $feedback_count;
                $this->tpl_data['timePoints'][$x]['feedbackStatus'] = $feedback_status;
                $this->tpl_data['timePoints'][$x]['feedbackColor'] = $feedback->getThreadColor($feedback_status);

                if (!in_array($timePoint->getCurrentStage(), array(null, 'Not Started', 'Visit', 'Screening'))) {
                    // for static stages, don't bother showing current status
                    $this->tpl_data['timePoints'][$x]['staticStage'] = true;

                    // get the outcome data
                    $outcomeStage = $this->_determinePreviousStage($currentTimePoint);
                    $getStatusMethod = 'get'.$outcomeStage.'Status';
                    $getDateMethod = 'getDateOf'.$outcomeStage;

                    // set the template data
                    $this->tpl_data['timePoints'][$x]['outcomeStage'] = $outcomeStage;
                    if(method_exists($timePoint, $getStatusMethod)){
                        $this->tpl_data['timePoints'][$x]['outcomeStatus'] = $timePoint->$getStatusMethod();
                    }
                    if(method_exists($timePoint, $getDateMethod)){
                        $this->tpl_data['timePoints'][$x]['outcomeDate'] = $timePoint->$getDateMethod();
                    }
                }
                $x++;
            } // end list

            /*
             * List of future visits
             */
            if (isset($firstDateOfVisit)) {
                $timePoint = TimePoint::singleton($listOfTimePoints[0]);

                $this->tpl_data['SubprojectID'] = $timePoint->getSubprojectID();
				
            } // end list
        }

        $this->tpl_data['actions'] = $this->getActionButtons();
    }

    function _determinePreviousStage($sessionID)
    {
        // create timepoint object
        $timePoint =& TimePoint::singleton($sessionID);

        // outcome stage is the last stage (approval || visit || screening || not started, in that order) with a non-null status
        if($timePoint->getData('Approval') != NULL) {
            return  'Approval';
        } elseif($timePoint->getData('Visit') != NULL) {
            return  'Visit';
        } elseif($timePoint->getData('Screening') != NULL) {
            return  'Screening';
        }
        return  'Not Started';
    }
    /**
     * Used by the NDB_caller class when loading a page. 
     * Call the display function of the appropriate modules feedback panel.
     *
     * @author Evan McIlroy <evanmcilroy@gmail.com>
     */ 
    
    function getFeedbackPanel($candID, $sessionID = null){
        $feedbackPanel = new BVL_Feedback_Panel($candID);
        $html = $feedbackPanel->display();
        return $html;
    }

    function getActionButtons() {
        $controlPanel = new TimePoint_List_ControlPanel($_REQUEST['candID']);
        return $controlPanel->display();
    }

    /**
     * Get dependencies to timepoint_list for image browsing link
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/timepoint_list/js/timepoint_list_helper.js",
            )
        );
    }
}
?>

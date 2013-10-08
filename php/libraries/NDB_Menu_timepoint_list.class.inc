<?php
require_once 'NDB_Menu.class.inc';

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
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $candidate =& Candidate::singleton($_REQUEST['candID']);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error (".$_REQUEST['candID']."): ".$candidate->getMessage());
        }

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
            if(Utility::isErrorX($timePoint)) {
                return PEAR::raiseError("TimePoint Error ($sessionID): ".$timePoint->getMessage());
            }

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
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error (".$_REQUEST['candID']."): ".$candidate->getMessage());
        }

        $numberOfVisits = 0;
        $this->tpl_data['candID'] = $_REQUEST['candID'];
        $this->tpl_data['PSCID'] = $candidate->getPSCID();
        $listOfTimePoints = $candidate->getListOfTimePoints();
    
        if (!empty($listOfTimePoints)) {
            $user =& User::singleton();
            if (Utility::isErrorX($user)) {
                return PEAR::raiseError("User Error: ".$user->getMessage());
            }
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
                if (Utility::isErrorX($timePoint)) {
                    return PEAR::raiseError("TimePoint Error ($currentTimePoint): ".$timePoint->getMessage());
                }
            
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
                
                // create feedback object for the time point            
                $feedback = NDB_BVL_Feedback::singleton($username, null, $timePoint->getData('SessionID'));
                if (Utility::isErrorX($feedback)) {
                    return PEAR::raiseError("Feedback Error (".$timePoint->getData('SessionID')."): ".$feedback->getMessage());
                }

                $feedback_status = $feedback->getMaxThreadStatus($feedback_select_inactive);
                if (Utility::isErrorX($feedback_status)) {
                    return PEAR::raiseError("timepoint_list::setup() feedback status: ".$feedback_status->getMessage());
                }

                $feedback_count = $feedback->getThreadCount();
                if (Utility::isErrorX($feedback_count)) {
                    return PEAR::raiseError("timepoint_list::setup() feedback count: ".$feedback_count->getMessage());
                }

                $this->tpl_data['timePoints'][$x]['feedbackCount'] = (empty($feedback_count)) ? $feedback_status : $feedback_count;
                $this->tpl_data['timePoints'][$x]['feedbackStatus'] = $feedback_status;
                $this->tpl_data['timePoints'][$x]['feedbackColor'] = $feedback->getThreadColor($feedback_status);

                if (!in_array($timePoint->getCurrentStage(), array(null, 'Not Started', 'Visit', 'Screening'))) {
                    // for static stages, don't bother showing current status
                    $this->tpl_data['timePoints'][$x]['staticStage'] = true;

                    // get the outcome data
                    $outcomeStage = $this->_determinePreviousStage($currentTimePoint);
                    if (Utility::isErrorX($outcomeStage)) {
                        return PEAR::raiseError("timepoint_list::setup() outcome stage: ".$outcomeStage->getMessage());
                    }
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
                if (Utility::isErrorX($timePoint)) {
                    return PEAR::raiseError("TimePoint Error ($listOfTimePoints[0]): ".$timePoint->getMessage());
                }

                $this->tpl_data['SubprojectID'] = $timePoint->getSubprojectID();
				
                 $config =& NDB_Config::singleton();
                 $isNIHPD = $config->getSetting('isNIHPD');
                // show future time points
                if ($isNIHPD == "true") {
                	$this->tpl_data['isNIHPD']="true";
                    if($timePoint->getSubprojectID() == 1) {
                        
                        // get the number of visits in the project
                        $study = $config->getSetting('study');
                        
                        // get the current time
                        $this->tpl_data['now'] = time();
                        
                        // split the first date of visit
                        list($year, $month, $day) = explode('-', $firstDateOfVisit);
                        
                        // get the list of future timepoints
                        $x = 0;
                        for ($i = $numberOfVisits; $i <= $study['visits'] - 1; $i++) {
                            $this->tpl_data['visits'][$x]['windowTarget'] = mktime(0, 0, 0, $month, $day, $year + 2 * $i);
                            $this->tpl_data['visits'][$x]['min'] = mktime(0, 0, 0, $month - 6, $day, $year + 2 * $i);
                            $this->tpl_data['visits'][$x]['max'] = mktime(0, 0, 0, $month + 3, $day, $year + 2 * $i);
                            $x++;
                        }
                    }
                }
            } // end list
        }
    }

    function _determinePreviousStage($sessionID)
    {
        // create timepoint object
        $timePoint =& TimePoint::singleton($sessionID);
        if (Utility::isErrorX($timePoint)) {
            return PEAR::raiseError("TimePoint Error ($sessionID): ".$timePoint->getMessage());
        }

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
}
?>

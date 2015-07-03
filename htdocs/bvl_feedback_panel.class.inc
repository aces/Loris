<?php
/**
 * General behavioural feedback panel class. 
 *
 * This class provides the behavioural feedback gui for the timepoint list, instrument 
 * list and individual instruments. 
 *
 * @package Behavioural
 * @author Evan McIlroy <evanmcilroy@gmail.com>
 * @license GNU
 */
class BVL_Feedback_Panel
{

    var $_feedbackThread = '';
    var $_candidate = '';

    function BVL_Feedback_Panel($candID, $sessionID=null, $commentID=null)
    {
        $user =& User::singleton();
        $username = $user->getUsername();
        $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candID, $sessionID, $commentID);
        // if($sessionID == null && $commentID == null){
        //     $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candID);
        // }
        // elseif ($commentID == null){
        //     $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candID, $sessionID);
        // }
        // else{
        //     $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candID);
        // }
        // $this->_candidate = Candidate::Singleton($candID);
    }

    function display(){
        $this->tpl_data['candID'] = $this->_feedbackThread->_feedbackCandidateProfileInfo["CandID"];
        $this->tpl_data['sessionID'] = $this->_feedbackThread->_feedbackCandidateProfileInfo["SessionID"];
        $this->tpl_data['commentID'] = $this->_feedbackThread->_feedbackObjectInfo["CommentID"];
        $this->tpl_data['thread_list'] = $this->_feedbackThreadList;
        $this->tpl_data['feedback_level'] = $this->_feedbackThread->_feedbackLevel;
        $this->tpl_data['feedback_types'] = $this->_feedbackThread->getFeedbackTypes();
        
        $summary = $this->_feedbackThread->getSummaryOfThreads();
        if (PEAR::isError($summary)) {
            $tpl_data['error_message'][] = $summary->getMessage();
        } else {
            if (count($summary) > 0) {
                $this->tpl_data['thread_summary_headers'] = array_keys($summary[0]);
                for ($i=0; $i < count($summary); $i++) {
                    $SI           =& $summary[$i];
                    $summaryIsSet = function (&$arr, $Index) {
                        return isset($arr[$Index]) ? $arr[$Index] : '';
                    };

                    $row = array(
                        'QC_Class'   => $summaryIsSet($SI, 'QC_Class'),
                        'No_Threads' => $summaryIsSet($SI, 'No_Threads'),
                        'Instrument' => $summaryIsSet($SI, 'Instrument'),
                        'CommentID'  => $summaryIsSet($SI, 'CommentID'),
                        'Visit'      => $summaryIsSet($SI, 'Visit'),
                        'SessionID'  => $summaryIsSet($SI, 'SessionID'),
                    );
                    $this->tpl_data['thread_summary_data'][$i] = $row;
                }
            }
        }

        $smarty = new Smarty_neurodb("bvl_feedback_panel");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("bvl_feedback_panel.tpl");
        return $html;
        
    }
}

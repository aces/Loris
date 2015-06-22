<?php
/**
 * Timepoint list behavioural feedback panel class.
 * 
 * This class provides the behavioural feedback GUI for a the 
 * timepoint list of a given candidate. 
 * 
 * @package Behavioural
 * @author  Evan McIlroy <evanmcilroy@gmail.com>
 * @license GNU
 */
class Timepoint_List_FeedbackPanel
{

    var $_feedbackThread = '';
    var $_feedbackThreadList = '';
    var $_candidate = '';
    /*
     * Initilizes the Timepoint_List_FeedbackPanel
     * with a feedbackThread.
     */
    function Timepoint_List_FeedbackPanel($candID)
    {
        $user =& User::singleton();
        $username= $user->getUsername();
        $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username,$candID);
        $this->_feedbackThreadList = $this->_feedbackThread->getThreadList();
        $this->_candidate = Candidate::singleton($candID);
    }
    /**
     *Display function for the Timepoint_List_FeedbackPanel
     *
     * @return Returns the html for the control panel. To be rendered by a smarty
     * template.  
     */
    function display()
    {
        $this->tpl_data['candID'] = $this->_feedbackThread->_feedbackCandidateProfileInfo['CandID'];
        $this->tpl_data['PSCID'] = $this->_candidate->getPSCID();
        $this->tpl_data['thread_list'] = $this->_feedbackThreadList;
        $this->tpl_data['feedback_level'] = $this->_feedbackThread->_feedbackLevel;
        // get the summary of threads
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
        
        $smarty = new Smarty_neurodb("timepoint_list");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("timepoint_list_bvl_feedback_panel.tpl");
        return $html;
    }
}


?>
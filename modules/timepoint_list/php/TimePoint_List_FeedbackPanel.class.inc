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
    var $_feedbackLevel = '';
    var $_feedbackThreadList = '';
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
        $this->tpl_data['thread_list'] = $this->_feedbackThreadList;
        $smarty = new Smarty_neurodb("timepoint_list");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("timepoint_list_bvl_feedback_panel.tpl");
        return $html;
    }
}


?>
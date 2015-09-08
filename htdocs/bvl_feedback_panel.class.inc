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
class BVL_Feedback_Panel extends NDB_Form
{
    var $_feedbackThread = '';

    function BVL_Feedback_Panel($candID, $sessionID=null, $commentID=null)
    {
        $user =& User::singleton();
        $username = $user->getUsername();
        $this->_feedbackThread =& NDB_BVL_Feedback::Singleton($username, $candID, $sessionID, $commentID);
    }

    function hasAccess()
    {

        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return ($user->hasPermission('bvl_feedback'));
    }

    function display(){
        $this->tpl_data['candID'] = $this->_feedbackThread->_feedbackCandidateProfileInfo["CandID"];
        $candidateID =  $this->_feedbackThread->_feedbackCandidateProfileInfo["CandID"];
        $candidateObject = Candidate::singleton($candidateID);
        $this->tpl_data['pscid'] = $candidateObject->getPSCID();
        $this->tpl_data['sessionID'] = $this->_feedbackThread->_feedbackCandidateProfileInfo["SessionID"];
        $this->tpl_data['commentID'] = $this->_feedbackThread->_feedbackObjectInfo["CommentID"];
        $this->tpl_data['thread_list'] = $this->_feedbackThread->getThreadList();
        $this->tpl_data['feedback_level'] = $this->_feedbackThread->_feedbackLevel;
        $this->tpl_data['feedback_types'] = $this->_feedbackThread->getFeedbackTypes();
        $this->tpl_data['feedbacktypes'] = NDB_BVL_Feedback::getFeedbackTypes();

        $summary = $this->_feedbackThread->getSummaryOfThreads();
        if (PEAR::isError($summary)) {
            $tpl_data['error_message'][] = $summary->getMessage();
        }

        else {
            $this->tpl_data['thread_summary_headers'] = json_encode($summary);
        }

        $field_names = Utility::getSourcefields($_REQUEST['test_name']);
        $Fields['Across All Fields'] = 'Across All Fields';
        foreach ($field_names as $field_name) {
            $Fields[$field_name['SourceField']] = $field_name['SourceField'];
        }

        $this->tpl_data['FieldNames'] = json_encode($Fields);

        $smarty = new Smarty_neurodb("bvl_feedback_panel");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("bvl_feedback_panel.tpl");
        return $html;

    }
}

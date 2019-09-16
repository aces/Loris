<?php declare(strict_types=1);
/**
 * General behavioural feedback panel class.
 *
 * This class provides the behavioural feedback gui for the timepoint list,
 * instrument list and individual instruments.
 *
 * PHP version 7
 *
 * @category Behavioural
 * @package  Main
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * BVL_Feedback_Panel Class
 *
 * This class is used by the timepoint list,
 * instrument list, and instrument classes.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Evan McIlroy <evanluc.mcin@gmail.com>
 * @license    @GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 * @link       https://github.com/aces/Loris-Trunk
 */
class BVL_Feedback_Panel
{
    /**
     * The feedback thread that this panel is for
     *
     * @var NDB_BVL_Feedback
     */
    var $_feedbackThread;

    /**
     * Creates the feedback thread for the given combination of candID,
     * sessionID and commentID.
     *
     * @param int         $candID    The candidate ID.
     * @param int|null    $sessionID The session ID for a given visit.
     * @param string|null $commentID The comment ID for a given instrument.
     */
    function __construct(
        int $candID,
        ?int $sessionID=null,
        ?string $commentID=null
    ) {

        $this->_feedbackThread
            = \NDB_BVL_Feedback::singleton(
                \User::singleton()->getUsername(),
                $candID,
                $sessionID,
                $commentID
            );
    }

    /**
     * Function to display the feedback panel at the timepoint list,
     * instrument list or instrument level.
     *
     * @return string The HTML for the appropriate feedback panel.
     * @throws Exception
     */
    function display(): string
    {
        $feedbackProfile = $this->_feedbackThread->_feedbackCandidateProfileInfo;
        $candidateID     = $feedbackProfile["CandID"];

        $this->tpl_data['candID'] = $candidateID;

        $candidateObject         = Candidate::singleton(intval($candidateID));
        $this->tpl_data['pscid'] = $candidateObject->getPSCID();

        $this->tpl_data['sessionID'] = $feedbackProfile["SessionID"] ?? null;

        $feedbackObject = $this->_feedbackThread->_feedbackObjectInfo;
        $this->tpl_data['commentID'] = $feedbackObject["CommentID"] ?? null;

        $this->tpl_data['thread_list']    = $this->_feedbackThread->getThreadList();
        $this->tpl_data['feedback_level'] = $this->_feedbackThread->_feedbackLevel;
        $this->tpl_data['feedback_types']
            = NDB_BVL_Feedback::getFeedbackTypes();
        $this->tpl_data['feedbacktypes']  = NDB_BVL_Feedback::getFeedbackTypes();

        $summary = $this->_feedbackThread->getSummaryOfThreads();
        $this->tpl_data['thread_summary_headers'] = json_encode($summary);

        $field_names = Utility::getSourcefields($_REQUEST['test_name'] ?? '');
        $fields      = array();
        $fields['Across All Fields'] = 'Across All Fields';
        foreach ($field_names as $field_name) {
            $fields[$field_name['SourceField']] = $field_name['SourceField'];
        }

        $this->tpl_data['FieldNames'] = json_encode($fields);

        $smarty = new Smarty_neurodb("bvl_feedback_panel");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("bvl_feedback_panel.tpl");
        return $html;

    }
}

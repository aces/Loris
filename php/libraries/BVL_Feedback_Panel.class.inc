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
use \Loris\StudyEntities\Candidate\CandID;

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
     * @protected NDB_BVL_Feedback
     */
    protected $feedbackThread;

    /**
     * An array containing data that will be passed to the Smarty template.
     *
     * @public array
     */
    public $tpl_data;

    /**
     * Creates the feedback thread for the given combination of candID,
     * sessionID and commentID.
     *
     * @param CandID      $candID    The candidate ID.
     * @param int|null    $sessionID The session ID for a given visit.
     * @param string|null $commentID The comment ID for a given instrument.
     */
    function __construct(
        CandID $candID,
        ?int $sessionID=null,
        ?string $commentID=null
    ) {

        $this->feedbackThread
            = \NDB_BVL_Feedback::singleton(
                \User::singleton()->getUsername(),
                $candID,
                $sessionID,
                $commentID
            );
    }
    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @param string|null $instrument If specified, return fields from this
     *                                test_name
     * @param string|null $commentID  If specified, return fields for this
     *                                commentid
     * @param string|null $name       If specified, return fields for this
     *                                parameter_type name
     *
     * @return  ?array Format: array(
     *              0 => array(
     *                   'SourceField' => value
     *                   'Name'        => name
     *
     *              )
     *         )
     * @note    This should be moved out of the Utility class into whatever
     *       module uses it. (Behavioural Quality Control, BVL_Feedback_panel)
     * @note    Function comment written by Dave, not the author of this function.
     * @cleanup
     */
    static function getSourcefields(
        ?string $instrument = null,
        ?string $commentID = null,
        ?string $name = null
    ): ?array {

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        //get sourcefield using instrument
        $sourcefields = array();
        if (!is_null($instrument)) {
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable='1' AND sourcefrom = :sf
                ORDER BY Name",
                array('sf' => $instrument)
            );
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument   = $DB->pselectOne(
                "SELECT Test_name FROM flag WHERE CommentID = :cid",
                array('cid' => $commentID)
            );
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable = '1' AND sourcefrom = :instrument
                ORDER BY Name",
                array('instrument' => $instrument)
            );
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow(
                "SELECT * FROM parameter_type WHERE Name = :pn",
                array('pn' => $name)
            );
        }
        return $sourcefields;
    }
    /**
     * Function to display the feedback panel at the timepoint list,
     * instrument list or instrument level.
     *
     * @return string The HTML for the appropriate feedback panel.
     * @throws Exception
     * @throws SmartyException
     */
    function display(): string
    {
        $feedbackProfile = $this->feedbackThread->_feedbackCandidateProfileInfo;
        $candidateID     = new CandID($feedbackProfile["CandID"]);

        $this->tpl_data['candID'] = (string) $candidateID;

        $candidateObject         = Candidate::singleton($candidateID);
        $this->tpl_data['pscid'] = $candidateObject->getPSCID();

        $this->tpl_data['sessionID'] = $feedbackProfile["SessionID"] ?? null;

        $feedbackObject = $this->feedbackThread->_feedbackObjectInfo;
        $this->tpl_data['commentID'] = $feedbackObject["CommentID"] ?? null;

        $this->tpl_data['thread_list']    = $this->feedbackThread->getThreadList();
        $this->tpl_data['feedback_level'] = $this->feedbackThread->_feedbackLevel;
        $this->tpl_data['feedback_types']
            = NDB_BVL_Feedback::getFeedbackTypes();
        $this->tpl_data['feedbacktypes']  = NDB_BVL_Feedback::getFeedbackTypes();

        $summary = $this->feedbackThread->getSummaryOfThreads();
        $this->tpl_data['thread_summary_headers'] = json_encode($summary);

        $field_names = BVL_Feedback_Panel::getSourcefields($_REQUEST['test_name'] ?? '');
        $fields      = array();
        $fields['Across All Fields'] = 'Across All Fields';
        foreach ($field_names as $field_name) {
            $fields[$field_name['SourceField']] = $field_name['SourceField'];
        }

        $this->tpl_data['FieldNames'] = json_encode($fields);

        $smarty = new Smarty_NeuroDB("bvl_feedback_panel");
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("bvl_feedback_panel.tpl");
        return $html;

    }
}

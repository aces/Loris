<?php

/**
 * Imaging browser control panel class file
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/
namespace LORIS\imaging_browser;
/**
 * Imaging browser control panel class
 *
 * This class provides the management GUI for the status flags
 * and some links of the imaging browser.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Imaging_Session_ControlPanel
{
    /**
     * Var to store the sessionID.
     */
    var $sessionID;

    /**
     * Sets up the sessionID
     *
     * @param int $sessionID current sessionID
     *
     * @return NULL
     */
    function __construct($sessionID)
    {
        $this->sessionID = $sessionID;
    }

    /**
     * Determine whether the user has permission to view the imaging_browser page
     *
     * @return bool whether the user hass access
     */
    function _hasAccess()
    {
        $user =& \User::singleton();
        return $user->hasPermission('imaging_browser_qc');
    }

    /**
    *  Gets data for the control panel template
    *
    * @return $subjectData array with data for the template
    */
    function getData()
    {
        $DB        = \Database::singleton();
        $timePoint =& \TimePoint::singleton($_REQUEST['sessionID']);

        $subjectData['sessionID'] = $_REQUEST['sessionID'];
        $subjectData['candid']    = $timePoint->getCandID();

        $qresult = $DB->pselectOne(
            "SELECT CommentID FROM flag 
            WHERE Test_name='mri_parameter_form' AND SessionID = :v_sessions_id",
            array('v_sessions_id' => $this->sessionID)
        );
        $subjectData['ParameterFormCommentID'] = (empty($qresult)) ? "" : $qresult;

        $qresult = $DB->pselectOne(
            "SELECT CommentID 
            FROM flag WHERE Test_name='radiology_review' 
            AND SessionID = :v_sessions_id",
            array('v_sessions_id' => $this->sessionID)
        );
        $subjectData['RadiologyReviewCommentID'] = (empty($qresult)) ? "" : $qresult;

        $candidate =& \Candidate::singleton($timePoint->getCandID());

        $params     = array();
        $EntityType = $candidate->getData('Entity_type');
        if ($EntityType == 'Scanner') {
            $ID            = ":PVL";
            $params['PVL'] = $timePoint->getVisitLabel();
        } else {
            $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            $params['PPSCID']  = $candidate->getPSCID();
            $params['PCandID'] = $timePoint->getCandID();
            $params['PVL']     = $timePoint->getVisitLabel();
        }
        $tarchiveIDs = $DB->pselect(
            "SELECT TarchiveID 
            FROM tarchive 
            WHERE PatientName LIKE $ID",
            $params
        );
        $subjectData['tarchiveids'] = $tarchiveIDs;

        $config =& \NDB_Config::singleton();

        //if table is not in database return false to not display in the template
        $this->tpl_data['mri_param_form_table_exists']
            = $DB->tableExists('mri_parameter_form');

        $this->tpl_data['rad_review_table_exists'] = $DB->tableExists(
            'radiology_review'
        );

        $issue_tracker_url = $config->getSetting("issue_tracker_url");
        $this->tpl_data['issue_tracker_url'] = $issue_tracker_url;
        $subjectData['issue_tracker_url']    = $issue_tracker_url;

        $subjectData['has_permission']  = $this->_hasAccess();
        $subjectData['status_options']  = array(
                                           'Unrated' => '',
                                           'Pass'    => 'Pass',
                                           'Fail'    => 'Fail',
                                          );
        $subjectData['pending_options'] = array(
                                           'Y' => 'Yes',
                                           'N' => 'No',
                                          );
        $subjectData['caveat_options']  = array(
                                           'true'  => 'True',
                                           'false' => 'False',
                                          );
        $query    = "SELECT MRIQCStatus, MRIQCPending,".
                    " MRICaveat FROM session WHERE ID=:sid";
        $qcstatus = $DB->pselectRow(
            $query,
            array("sid" => $this->sessionID)
        );

        $subjectData['mriqcstatus']  = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
        $subjectData['mricaveat']    = $qcstatus['MRICaveat'];

        $factory = \NDB_Factory::singleton();
        $subjectData['backURL'] = isset($_REQUEST['backURL']) ?
            $factory->settings()->getBaseURL()
                . "/imaging_browser/" :
            null;

        $NavBar = new MRINavigation($this->sessionID);
        $subjectData['nextTimepoint']['URL'] = $NavBar->nextLink();
        $subjectData['prevTimepoint']['URL'] = $NavBar->prevLink();

        return $subjectData;
    }
    /**
     * Generates the HTML to display the set of buttons
     * for the timepoint status flags
     *
     * @return string
     * @access public
     */
    function display()
    {
        $this->tpl_data['subject'] = $this->getData();

        $smarty = new \Smarty_neurodb("imaging_browser");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("imaging_session_controlpanel.tpl");
        return $html;
    }
}

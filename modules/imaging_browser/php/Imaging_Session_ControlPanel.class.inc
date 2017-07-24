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
        $user =& User::singleton();
        return $user->hasPermission('imaging_browser_qc');
    }

    /**
    *  Gets data for the control panel template
    *
    * @return $subjectData array with data for the template
    */
    function getData()
    {
        $DB        = Database::singleton();
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);

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

        $candidate =& Candidate::singleton($timePoint->getCandID());

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

        $config =& NDB_Config::singleton();

        //if table is not in database return false to not display in the template
        $this->tpl_data['mri_param_form_table_exists']
            = $DB->tableExists('mri_parameter_form');
        $this->tpl_data['rad_review_table_exists']     = $DB->tableExists(
            'radiology_review'
        );
        $this->tpl_data['mantis']       = $config->getSetting('mantis_url');
        $subjectData['mantis']          = $config->getSetting('mantis_url');
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

        $factory = NDB_Factory::singleton();
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

        $smarty = new Smarty_neurodb("imaging_browser");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("imaging_session_controlpanel.tpl");
        return $html;
    }
}

/**
 * MRINavigatoin class
 *
 * This class provides the management of sessions
 * to navigate to the previous and/or next session.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class MRINavigation
{
    /**
    *  Gets the session
    *
    * @param int $sessionID sessionID
    *
    * @return NULL
    */
    function __construct($sessionID = null)
    {
        $this->sessionID           = $sessionID;
        $this->FilteredSessionList = $_SESSION['State']
            ->getProperty('mriSessionsListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search(
            $this->sessionID,
            $this->FilteredSessionList
        );
        $this->urlParams        = $this->_splitURL();
    }
    /**
    * Parses the request into hostname/params, so that it can be
    * reconstructed into a link which has the same parameters
    *
    * @return string $urlParams parameters
    */
    function _splitURL()
    {
        $linkBase      = $_SERVER['REQUEST_URI'];
        $this->bits[0] = substr($linkBase, 0, strpos($linkBase, '?'));
        $this->bits[1] = substr($linkBase, strpos($linkBase, '?')+1);
        parse_str($this->bits[1], $urlParams);
        return $urlParams;
    }
    /**
    * Gets next or previous link
    *
    * @param int $delta offset for the next/prev link
    *
    * @return string $urlParams    parameters
    */
    function _otherLink($delta)
    {
        if (isset($this->FilteredSessionList[$this->currentListIndex+$delta])
        ) {
            $urlParams = $this->urlParams;
            $urlParams['sessionID'] = $this
                ->FilteredSessionList[$this->currentListIndex+$delta];

            $this->bits[1] = http_build_query($urlParams);

            return implode('?', $this->bits);
        }
    }
    /**
    * Sets the offset for the next link and gets the next link
    *
    * @return string $_OtherLink
    */
    function nextLink()
    {
        return $this->_otherLink(1);
    }
    /**
    * Sets the offset for the prev link and gets the prev link
    *
    * @return string $_OtherLink
    */
    function prevLink()
    {
        return $this->_otherLink(-1);
    }
}

?>

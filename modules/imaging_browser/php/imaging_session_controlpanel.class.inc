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
     * @return array ($subjectData) with data for the template
     */
    function getData()
    {
        $DB        = \Database::singleton();
        $config    = \NDB_Config::singleton();
        $timePoint = \TimePoint::singleton($_REQUEST['sessionID']);

        $subjectData = array(
            'sessionID' => $_REQUEST['sessionID'],
            'candid'    => $timePoint->getCandID(),
        );

        $linkedInstruments
            = $config->getSetting('ImagingBrowserLinkedInstruments');
        if (!is_array($linkedInstruments)) {
            $linkedInstruments = array();
        }

        $links = array();
        foreach ($linkedInstruments as $k=>$v) {
            $qresult = $DB->pselectRow(
                "SELECT f.CommentID, tn.Full_name FROM flag f
            JOIN test_names tn ON f.Test_name = tn.Test_name 
            WHERE f.Test_name = :tname AND f.SessionID = :v_sessions_id
            AND f.CommentID NOT LIKE 'DDE_%'",
                array(
                    'tname'         => $v,
                    'v_sessions_id' => $this->sessionID,
                )
            );
            if (is_null($qresult)) {
                throw new \LorisException(
                    'Could not find linked instruments for specified '
                    . 'test name and session ID'
                );
            }
            $links[] = array(
                "FEName"    => $qresult['Full_name'],
                "BEName"    => $v,
                "CommentID" => $qresult['CommentID'],
            );
        }
        $subjectData['links'] = (empty($links)) ? "" : $links;

        $candidate = \Candidate::singleton($timePoint->getCandID());

        /* Note: the if statement below prepares parameters to use in an SQL
        * query. The $ID variable is appended directly to a SQL query string;
        * therefore it should NEVER consist of data that can be supplied in
        * any way by any user.
         */
        $params     = array();
        $ID         = 'NULL';
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

        // To enable DICOM download: Add pair: tarchiveID, ArchiveLocation
        $qresult = $DB->pselect(
            'SELECT TarchiveID, ArchiveLocation, PatientName ' .
            'FROM tarchive ' .
            'WHERE PatientName LIKE ' . $ID,
            $params
        );

        $tarIDToTarLoc = array();
        foreach ($qresult as $v) {
            $tarchiveID = $v['TarchiveID'];
            $tarIDToTarLoc[$tarchiveID]['ArchiveLocation'] = $v['ArchiveLocation'];
            $tarIDToTarLoc[$tarchiveID]['PatientName']     = $v['PatientName'];
        }
        $subjectData['tarchiveIDLoc'] = $tarIDToTarLoc;

        //if table is not in database return false to not display in the template
        $this->tpl_data['mri_param_form_table_exists']
            = $DB->tableExists('mri_parameter_form');

        $this->tpl_data['rad_review_table_exists'] = $DB->tableExists(
            'radiology_review'
        );

        $issue_tracker_url = \NDB_Config::singleton()
            ->getSetting("issue_tracker_url");
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

        $qcstatus = $timePoint->getImagingQC();

        $subjectData['mriqcstatus']  = $qcstatus->getQC();
        $subjectData['mriqcpending'] = $qcstatus->getQCPending();
        $subjectData['mricaveat']    = $qcstatus->getHasCaveat();

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

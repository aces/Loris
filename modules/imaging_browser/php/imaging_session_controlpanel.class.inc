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
    protected array $tpl_data;

    /**
     * Var to store the sessionID.
     */
    var $sessionID;

    /**
     * Sets up the sessionID
     *
     * @param \SessionID $sessionID current sessionID
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
        $DB        = \NDB_Factory::singleton()->database();
        $config    = \NDB_Config::singleton();
        $timePoint = \TimePoint::singleton(
            new \SessionID(strval($_REQUEST['sessionID']))
        );

        $subjectData = [
            'sessionID' => $_REQUEST['sessionID'],
            'candid'    => $timePoint->getCandID(),
        ];

        $linkedInstruments
            = $config->getSetting('ImagingBrowserLinkedInstruments');
        if (!is_array($linkedInstruments)) {
            $linkedInstruments = [];
        }

        $links = [];
        foreach ($linkedInstruments as $v) {
            $qresult = $DB->pselectRow(
                "SELECT f.CommentID, tn.Full_name FROM flag f
            JOIN test_names tn ON f.TestID = tn.ID
            WHERE tn.Test_name = :tname AND f.SessionID = :v_sessions_id
            AND f.CommentID NOT LIKE 'DDE_%'",
                [
                    'tname'         => $v,
                    'v_sessions_id' => $this->sessionID,
                ]
            );
            if (!is_null($qresult)) {
                $links[] = [
                    "FEName"    => $qresult['Full_name'],
                    "BEName"    => $v,
                    "CommentID" => $qresult['CommentID'],
                ];
            }
                   // else 'Could not find linked instruments';
        }
        $subjectData['links'] = $links;

        $candidate = \Candidate::singleton($timePoint->getCandID());

        /* Note: the if statement below prepares parameters to use in an SQL
        * query. The $ID variable is appended directly to a SQL query string;
        * therefore it should NEVER consist of data that can be supplied in
        * any way by any user.
         */
        $params     = [];
        $EntityType = $candidate->getEntityType();
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

        $tarIDToTarLoc = [];
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
        $subjectData['status_options']  = [
            'Unrated' => '',
            'Pass'    => 'Pass',
            'Fail'    => 'Fail',
        ];
        $subjectData['pending_options'] = [
            'Y' => 'Yes',
            'N' => 'No',
        ];
        $subjectData['caveat_options']  = [
            'true'  => 'True',
            'false' => 'False',
        ];

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

        $smarty = new \Smarty_NeuroDB("imaging_browser");

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("imaging_session_controlpanel.tpl");
        return $html;
    }
}

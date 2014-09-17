<?php

/**
 * Imaging browser control panel class file
 *
 * PHP version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
*/

require_once "NDB_BVL_Battery.class.inc";
require_once 'NDB_Form.class.inc';
require_once 'MRIFile.class.inc';
/**
 * Imaging browser control panel class
 *
 * This class provides the management GUI for the status flags
 * and some links of the imaging browser.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */

class Imaging_Session_ControlPanel
{
    /**
     * var to store the sessionID.
     */
    var $sessionID;

    /**
     * Sets up the sessionID 
     *
     * @param int $sessionID current sessionID
     *
     * @return NULL    
     */
    function Imaging_Session_ControlPanel($sessionID) 
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
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission('view_final_radiological_review');
    }

    /**
    *  Gets data for the control panel template
    *
    * @return $subjectData array with data for the template
    */
    function getData() 
    {
        $DB = Database::singleton();
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        if (Utility::isErrorX($timePoint)) {
            print $timePoint->getMessage()."<br>";
        }

        $subjectData['sessionID'] = $_REQUEST['sessionID'];
        $subjectData['candid'] = $timePoint->getCandID();
        $subjectData['ParameterFormCommentID'] = $DB->pselectOne(
            "SELECT CommentID FROM flag 
            WHERE Test_name='mri_parameter_form' AND SessionID=$this->sessionID"
        );
        $subjectData['RadiologyReviewCommentID'] = $DB->pselectOne(
            "SELECT CommentID 
            FROM flag WHERE Test_name='radiology_review' 
            AND SessionID=$this->sessionID"
        );

        $candidate =& Candidate::singleton($timePoint->getCandID());
        if (Utility::isErrorX($candidate)) {
            print $candidate->getMessage()."<br>";
        } else {
            $params = array();
            $EntityType = $candidate->getData('Entity_type');
            if ($EntityType == 'Scanner') {
                $ID = ":PPSCID";
                $params['PPSCID'] = $timePoint->getData('PSCID');
            } else {
                $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
                $params['PPSCID'] = $candidate->getPSCID();
                $params['PCandID'] = $timePoint->getCandID();
                $params['PVL'] = $timePoint->getVisitLabel();
            }
        }
        $tarchiveIDs = $DB->pselect(
            "SELECT TarchiveID 
            FROM tarchive 
            WHERE PatientName LIKE $ID", $params
        );
        $subjectData['tarchiveids'] = $tarchiveIDs;
        
        $config =& NDB_Config::singleton();
        
        $this->tpl_data['mantis'] = $config->getSetting('mantis_url');
        $subjectData['mantis'] = $config->getSetting('mantis_url');
        $subjectData['has_permission'] = $this->_hasAccess();
        $subjectData['status_options'] = array (
            ''=>'', 'Pass'=>'Pass', 'Fail'=>'Fail' 
        );
        $subjectData['pending_options'] = array ('Y' => 'Yes', 'N' => 'No'); 
        
        $qcstatus = $DB->pselectRow(
            "SELECT MRIQCStatus, MRIQCPending 
            FROM session WHERE ID=$this->sessionID"
        );
         
        $subjectData['mriqcstatus'] = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];

        $subjectData['backURL'] = urldecode($_REQUEST['backURL']);
        $NavBar = new MRINavigation($this->sessionID);
        $subjectData['nextTimepoint']['URL'] = $NavBar->nextLink();
        $subjectData['prevTimepoint']['URL'] = $NavBar->prevLink();
        
        return $subjectData;     
    } 
    /**
     * generates the HTML to display the set of buttons 
     * for the timepoint status flags
     * 
     * @return string
     * @access public
     * @throws PEAR_Error
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
 * @license  Loris License
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
    function MRINavigation($sessionID = null) 
    {
        $this->sessionID = $sessionID;
        $this->FilteredSessionList = $_SESSION['State']
            ->getProperty('mriSessionsListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search(
            $this->sessionID, $this->FilteredSessionList
        );
        $this->urlParams = $this->_splitURL();
    }
    /**
    * Parses the request into hostname/params, so that it can be 
    * reconstructed into a link which has the same parameters
    *
    * @return string $urlParams parameters
    */
    function _splitURL() 
    {
        $linkBase = $_SERVER['REQUEST_URI'];
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
    * @return string $urlParams	parameters
    */
    function _otherLink($delta) 
    {
        if (isset($this->FilteredSessionList[$this->currentListIndex+$delta])) {
            $urlParams = $this->urlParams;
            $urlParams['sessionID'] = $this
                ->FilteredSessionList[$this->currentListIndex+$delta];
            $this->bits[1] = Utility::unparse_str($urlParams);
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

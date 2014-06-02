<?php
require_once "NDB_BVL_Battery.class.inc";
require_once 'NDB_Form.class.inc';
require_once 'MRIFile.class.inc';
/**
 * Time Point status control panel class
 *
 * This class provides the management GUI for the status flags
 * (session table) of a time point in the NeuroDB framework.
 * @package behavioural
 * @access public
 */

class Imaging_Session_ControlPanel {

    private $sessionID;
  
    function Imaging_Session_ControlPanel($sessionID) {
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
    */
    function getData() {
       	$DB = Database::singleton();
	    $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
	    if(Utility::isErrorX($timePoint)) {
            print $timePoint->getMessage()."<br>";
        }

        $subjectData['sessionID'] = $_REQUEST['sessionID'];
	    $subjectData['candid'] = $timePoint->getCandID();
	    $subjectData['ParameterFormCommentID'] = $DB->pselectOne(
                "SELECT CommentID FROM flag WHERE Test_name='mri_parameter_form' AND SessionID=$this->sessionID");
	    $subjectData['RadiologyReviewCommentID'] = $DB->pselectOne(
                "SELECT CommentID FROM flag WHERE Test_name='radiology_review' AND SessionID=$this->sessionID");

	    $candidate =& Candidate::singleton($timePoint->getCandID());
        if(Utility::isErrorX($candidate)) {
            print $candidate->getMessage()."<br>";
        } 
	    else {
            $params = array();
            $EntityType = $candidate->getData('Entity_type');
            if($EntityType == 'Scanner') {
                $ID = ":PPSCID";
            	$params['PPSCID'] = $timePoint->getData('PSCID');
            }
            else {
                $ID = "LOWER(CONCAT(:PPSCID, '_', :PCandID, '_', :PVL, '%'))";
            	$params['PPSCID'] = $candidate->getPSCID();
            	$params['PCandID'] = $timePoint->getCandID();
            	$params['PVL'] = $timePoint->getVisitLabel();
            }
        }
	    $tarchiveIDs = $DB->pselect("SELECT TarchiveID FROM tarchive WHERE PatientName LIKE $ID", $params);
	
        $subjectData['tarchiveids'] = $tarchiveIDs;
	
    	$config =& NDB_Config::singleton();
	    $subjectData['mantis'] = $config->getSetting('mantis_url');
 	
        $subjectData['has_permission'] = $this->_hasAccess();
	    $subjectData['status_options'] = array (''=>'', 'Pass'=>'Pass', 'Fail'=>'Fail' );
	    $subjectData['pending_options'] = array ('Y' => 'Yes', 'N' => 'No'); 

        $qcstatus = $DB->pselectRow("SELECT MRIQCStatus, MRIQCPending FROM session WHERE ID=$this->sessionID");
         
        $subjectData['mriqcstatus'] = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
  	
        $subjectData['backURL'] = urldecode($_REQUEST['backURL']);
        $NavBar = new MRINavigation($this->sessionID);
        $subjectData['nextTimepoint']['URL'] = $NavBar->NextLink();
        $subjectData['prevTimepoint']['URL'] = $NavBar->PrevLink();
        
        return $subjectData;     
    } 
    /**
     * generates the HTML to display the set of buttons for the timepoint status flags
     * @return string
     * @access public
     * @throws PEAR_Error
     */
    function display() {
        $this->tpl_data['subject'] = $this->getData();
	
        $smarty = new Smarty_neurodb;
        $smarty->ModuleName = "imaging_browser";

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("imaging_session_controlpanel.tpl");
        return $html;
    }
}
     
class MRINavigation {
    function MRINavigation($sessionID = null) {
    $this->Session = $sessionID;
        $this->FilteredSessionList = $_SESSION['State']->getProperty('mriSessionsListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search($this->Session, $this->FilteredSessionList);
        $this->urlParams = $this->_splitURL();
    }

    function _splitURL() {
        // Parse the request into hostname/params, so that it can be reconstructed into
        // a link which has the same parameters
        $linkBase = $_SERVER['REQUEST_URI'];
        $this->bits[0] = substr($linkBase, 0, strpos($linkBase, '?'));
        $this->bits[1] = substr($linkBase, strpos($linkBase, '?')+1);
        parse_str($this->bits[1], $urlParams);
        return $urlParams;
    }

    function _OtherLink($delta) {
        if(isset($this->FilteredSessionList[$this->currentListIndex+$delta])) {
            $urlParams = $this->urlParams;
            $urlParams['sessionID'] = $this->FilteredSessionList[$this->currentListIndex+$delta];
            $this->bits[1] = Utility::unparse_str($urlParams);
            return implode('?', $this->bits);
        }
    }
    function NextLink() {
        return $this->_OtherLink(1);
    }

     function PrevLink() {
        return $this->_OtherLink(-1);
    }
}
 
?>

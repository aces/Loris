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
        return $user->hasPermission('mri_feedback');
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
      
?>

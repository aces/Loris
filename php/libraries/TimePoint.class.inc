<?php
require_once "PEAR.php";

/**
 * @package main
 */
Class TimePoint
{
    var $_timePointInfo;
    
    var $_stageOptions = array(null, 'Not Started', 'Screening', 'Visit','Approval','Subject','Recycling Bin');

    var $_dynamicStageOptions = array('Screening','Visit', 'Approval');
    
    var $_statusOptions = array(null, 'Pass','Failure','Withdrawal','In Progress');

    var $bvlQcTypes = array(null,'Visual','Hardcopy');
    
    var $bvlQcStatuses = array(null,'Complete');
    
    var $bvlQcExclusionStatuses = array(null,'Excluded','Not Excluded');

    function &singleton($sessionID)
    {
        // instantiate new TimePoint object

        static $timePointList =array();
        if(!isset($timePointList[$sessionID])) {
            $timePointList[$sessionID] = new TimePoint();
            $success = $timePointList[$sessionID]->select($sessionID);
            if(PEAR::isError($success)){
                unset($timePointList[$sessionID]);
                return PEAR::raiseError("Could not instantiate TimePoint object".$success->getMessage());
            }
        }

        return $timePointList[$sessionID];
    }
    
    
    function select($sessionID)
    {
    	$config =& NDB_Config::singleton();
        $useScreening = $config->getSetting('useScreening');
        $screeningIndex = array_search('Screening', $this->_stageOptions);
        if($useScreening != 'true' && $screeningIndex !== FALSE) {
            unset($this->_stageOptions[$screeningIndex]);
            $this->_stageOptions = array_values($this->_stageOptions);
        }
    	
        // make a local reference to the Database object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }

        // get user data from database
        $query = "SELECT s.ID AS SessionID, s.CandID, p.Name AS PSC, s.CenterID, s.VisitNo,s.Visit_label,s.SubprojectID,s.Submitted,s.Current_stage,s.Screening,s.Date_screening,s.Visit,s.Date_visit,s.Approval,s.Date_approval,s.Active, s.registeredBy, s.UserID, u.Real_name, s.Hardcopy_request, s.BVLQCStatus, s.BVLQCType, s.BVLQCExclusion, s.Scan_done FROM session as s left join psc as p using (CenterID) left join users as u on (s.registeredBy=u.UserID) WHERE s.ID ='$sessionID' AND s.Active = 'Y'";
        $db->selectRow($query, $row);
        
        if(PEAR::isError($row)) {
            return PEAR::raiseError("Could not retrieve candidate data from database");
        }

        // store user data in object property
        if(is_array($row) && count($row) > 0) {
            $this->_timePointInfo = $row;
            $subprojectSettings=$config->getSubprojectSettings($row['SubprojectID']);
            $this->_timePointInfo['SubprojectTitle']=$subprojectSettings['title'];
        } else {
            // return error when 0 rows to prevent creation of an empty object
            return PEAR::raiseError("Failed to retrieve data for timepoint ($sessionID)");
        }
        // New feature, older databases might not have the table created,
        // so require a config option to be set
        if($config->getSetting("SupplementalSessionStatus") == true) {

            $query = "SELECT ss.Name, ss.Value FROM session_status ss JOIN session s ON (s.ID=ss.SessionID) WHERE s.ID=:sessionID AND s.Active='Y'";

            $statuses = $db->pselect($query, array(":sessionID" => $sessionID));
            foreach ($statuses as $row) {
                if(!isset( $this->_timePointInfo['status'])) {
                    $this->_timePointInfo['status'] = array();
                }
                $this->_timePointInfo['status'][$row['Name']] = $row['Value'];
            }
            $this->_timePointInfo['WindowInfo'] = $db->pSelectRow("
           SELECT DATEDIFF(s.Date_visit, c.DoB) as AgeDays, DATEDIFF(s.Date_visit, c.DoB) BETWEEN w.OptimumMinDays AND w.OptimumMaxDays as Optimum, (DATEDIFF(s.Date_visit, c.DoB) BETWEEN w.WindowMinDays AND w.WindowMaxDays) as Permitted FROM session s JOIN candidate c USING (CandID) JOIN Visit_Windows w ON (lower(w.Visit_label)=lower(s.Visit_label)) WHERE s.ID=:sessionID",
                array(":sessionID" => $sessionID));

        }

    }

    /**
     * registers a new timepoint into the session table - ONLY CALL STATICALLY
     * @static
     */
    function createNew($candID, $SubprojectID, $nextVisitLabel=null)
    {
        // insert into session set CandID=$candID,
        // SubprojectID=$SubprojectID, VisitNo=nextVisitNumber(),
        // UserID=$State->getUsername(), etc...  NO Date_* are
        // specified here!
        $db =& Database::singleton();

        // select the candidate data
        $query = "SELECT c.PSCID, c.CenterID, IFNULL(max(s.VisitNo)+1, 1) AS nextVisitNo FROM candidate AS c LEFT OUTER JOIN session AS s USING (CandID) WHERE c.CandID=$candID AND (s.Active='Y' OR s.Active is null) GROUP BY c.CandID";
        $db->selectRow($query, $row);
        if(PEAR::isError($row)) {
            return PEAR::raiseError("Could not retrieve existing data for candidate".$row->getMessage());
        }

        // if this is a web hit (thus state exists)
        if(is_object($_SESSION['State'])) {
            // get username from State
            $userID = $_SESSION['State']->getUsername();
        } else {
            // not a web hit, so use the unix username from the environment
            $userID = $_ENV['USER'];
        }

        // generate today's date for the Date registered field
        $today = date("Y-m-d");

        // setup the insert data array
        $insertData = array('CandID'=>$candID,
                            'SubprojectID'=>$SubprojectID,
                            'VisitNo'=> $row['nextVisitNo'],
                            'Visit_label'=> $nextVisitLabel == null ? 'V'.$row['nextVisitNo'] : $nextVisitLabel,
                            'CenterID'=>$row['CenterID'],
                            'Current_stage'=>'Not Started',
                            'Submitted'=>'N',
                            'registeredBy'=>$userID,
                            'UserID'=>$userID,
                            'Date_registered'=>$today,
                            'Date_active'=>$today,
                            );

        // insert the data
        $success = $db->insert('session', $insertData);
        if(PEAR::isError($success)) {
            return PEAR::raiseError("Could not register new timepoint record".$success->getMessage());
        }
    }

    function getData($var = null)
    {
        if (is_null($var)) {
            return $this->_timePointInfo;
        }
        else {
            return $this->_timePointInfo[$var];
        }
    }
    
    function setData($var, $value=null)
    {
        if(!is_array($var)) {
            $setData = array($var=>$value);
        } else {
            $setData = $var;
        }
        
        //$this->_timePointInfo = array_merge($this->_timePointInfo, $setData);
        
        $db =& Database::singleton();
        $db->update('session', $setData, array('ID'=>$this->getData('SessionID')));
        $this->select($this->getData('SessionID'));
    }

    function getCandID()
    {
        return $this->_timePointInfo["CandID"];
    }

    function getSessionID()
    {
        return $this->_timePointInfo["SessionID"];
    }

    function getPSC()
    {
        return $this->_timePointInfo["PSC"];
    }

    function getCenterID()
    {
        return $this->_timePointInfo['CenterID'];
    }

    function getVisitNo()
    {
        return $this->_timePointInfo["VisitNo"];
    }

    function getVisitLabel()
    {
        return $this->_timePointInfo["Visit_label"];
    }

    function getSubprojectID()
    {
        return $this->_timePointInfo["SubprojectID"];
    }

    function getScreeningStatus()
    {
        return $this->_timePointInfo["Screening"];
    }

    function getVisitStatus()
    {
        return $this->_timePointInfo["Visit"];
    }

    function getApprovalStatus()
    {
        return $this->_timePointInfo["Approval"];
    }

    function getDateOfScreening()
    {
        return $this->_timePointInfo["Date_screening"];
    }

    function getDateOfVisit()
    {
        return $this->_timePointInfo["Date_visit"];
    }

    function getDateOfApproval()
    {
        return $this->_timePointInfo["Date_approval"];
    }

    function isSubmitted()
    {
        return $this->_timePointInfo["Submitted"] == 'Y';
    }

    function isActive()
    {
        return $this->_timePointInfo["Active"] == 'Y';
    }

    

    function getScanDone()
    {
        return $this->_timePointInfo["Scan_done"];
    }

    /**
    * returns BVLQC status (Y-hardcopy QC, N-no QC, V-visual QC)
    * @return string
    */
    function getBVLQCStatus()
    {
        return $this->_timePointInfo['BVLQCStatus'];
    }
    /**
    * returns BVLQC exclusion type
    * @return string
    */
    function getBVLQCType()
    {
        return $this->_timePointInfo['BVLQCType'];
    }
    /**
    * returns BVLQC exclusion status
    * @return string
    */
    function getBVLQCExclusion()
    {
        return $this->_timePointInfo['BVLQCExclusion'];
    }
    /**
    * returns the list of BVLQC exclusion statuses
    * @return string
    */
    function getBVLQCExclusionStatusList()
    {
        return $this->bvlQcExclusionStatuses;
    }

    function getCurrentStage()
    {
        return $this->_timePointInfo["Current_stage"];
    }

    function getCurrentStatus()
    {
         $method = 'get'.$this->getCurrentStage().'Status';
         if(method_exists($this, $method)){
             return $this->$method();
         } else {
             return null;
         }
    }

    function getCurrentDate()
    {
        $getDateMethod = "getDateOf".$this->getCurrentStage();
        if(method_exists($this, $getDateMethod)){
            return $this->$getDateMethod();
        } else {
            return false;
        }
    }

    /**
     * defines the next study stage
     * @return string study stage title
     */
    function getNextStage()
    {
        if($this->getData('Current_stage')=='Approval' && $this->getData('Approval') != 'Pass') {

            // if the time point is sent to DCC and the outcome is not Pass
            // then the next stage is Recycling Bin
            return 'Recycling Bin';

        }
        // otherwise just get the next stage in the sequence
        $index=array_search($this->getData('Current_stage'), $this->_stageOptions);
        $nextStageIndex=$index+1;
        
        return $this->_stageOptions[$nextStageIndex];
    }
   
    /**
     * defines a stage as dynamic - that can be assigned a BVL
     * battery, its status updated, and sent to DCC
     * @param string $stage, a study stage, from the field session.Current_stage
     * @return bool
     * @throws PEAR::Error
     * @access public
     */
    function isStudyStageDynamic($stage)
    {
        // if not $stage is passed, evaluate the current stage
        if (empty($stage)) {
            return PEAR::raiseError("Study Stage Not Specified");
        } else {
            return in_array($stage, $this->_dynamicStageOptions);
        }
    }

    /**
     * @throws PEAR:Error
     * @return string current study stage
     */
    function isCurrentStageDynamic()
    {
        $isStageDynamic = $this->isStudyStageDynamic($this->getCurrentStage());
        if (PEAR::isError($isStageDynamic)) {
            // pass the error
            return PEAR::raiseError($isStageDynamic->getMessage());
        }
        return $isStageDynamic;
    }

    /**
     * assert whether the next stage is dynamic or static
     */
    function isNextStageDynamic()
    {
        return $this->isStudyStageDynamic($this->getNextStage());
    }
    
    /**
     * set new stage
     * @todo complete $stage derivation
     * @return void
     * @throws PEAR error
     */ 
    function setCurrentStage()
    {
        $db =& Database::singleton();

        // this class does not handle Subject & Recycling Bin stage at the moment
        if (in_array($this->getCurrentStage(), array('Subject', 'Recycling Bin'))) return;
        
        // if sent to DCC then it either Approval, Subject or Recycling Bin
        if ($this->isSubmitted() && $this->getApprovalStatus() != 'NULL') {

            if ($this->getApprovalStatus() == 'Failure') {
                $newCurrentStage = 'Recycling Bin';
            } else {
                // in all other cases
                $newCurrentStage = 'Approval';
            }
            
        } else {

            // of not sent to DCC get the latest stage
            if($this->getVisitStatus() != NULL) {
                $newCurrentStage = 'Visit';
            } elseif($this->getScreeningStatus() != NULL) {
                $newCurrentStage = 'Screening';
            } else {
                $newCurrentStage = 'Not Started';
            }
        }

        // generate today's date in MySQL format
        $today = date("Y-m-d");

        // update session table
        $update_columns=array("Date_stage_change"=>$today, 
                              'Current_stage'=>$newCurrentStage);

        
        $dbErrors = $db->update('session', $update_columns, array('ID'=>$this->getSessionID()));
        if(PEAR::isError($dbErrors)) {
            return PEAR::raiseError("DB Error: ".$dbErrors->getMessage());
        }
                                           
        // reload TimePoint object
        $success = $this->select($this->getSessionID());
        if(PEAR::isError($success)) {
            return PEAR::raiseError("DB Error: ".$success->getMessage());
        }
    }

    function startNextStage()
    {
        // figure out what the next stage should be
        // start that stage
        // set the date for the new stage
        // set SubprojectID if applicable
        // set scan done if applicable
    }
    
    function startStage($stage)
    {
        $setArray = array('Current_stage'=>$stage, 'Date_stage_change'=>date('Y-m-d'));
        
        if(in_array($stage, $this->_dynamicStageOptions) && $this->getData($stage) == NULL) {
            $setArray[$stage] = 'In Progress';
        }

	if($setArray['Current_stage'] == 'Approval') $setArray['Date_approval'] = date('Y-m-d');
        
        $this->setData($setArray);
    }
    
    /**
     * sends Time Point to DCC
     * also allow "unsend", i.e. sets session.Submit='N' in case it ever becomes necessary
     * @param $status string see session.QCd field options, what is passed here is the label from the bvlQcTypes array
     * @throws PEAR:Error
     * @return void
     * @access public
     * @see $this->bvlQcTypes
     */
    function setBVLQCType($type)
    {
        $db =& Database::singleton();

        if (!in_array($type, $this->bvlQcTypes)) {
            return PEAR::raiseError("You need to specify a valid BVL QC Type");
        }
        
        $setArray = array('BVLQCType'=>$type);
        
        // update session table
        $dbErrors = $db->update('session', $setArray, array('ID'=>$this->getSessionID()));

        if(PEAR::isError($dbErrors)) {
            return PEAR::raiseError("DB Error: ".$dbErrors->getMessage());
        }

        // reload TimePoint object
        $success = $this->select($this->getSessionID());
        if (PEAR::isError($success)) {
            //throw PEAR error
            return PEAR::raiseError($success->getMessage());
        }
    }
    
    function setBVLQCStatus($status)
    {
        $db =& Database::singleton();

        if (!in_array($status, $this->bvlQcStatuses)) {
            return PEAR::raiseError("You need to specify a valid BVL QC Type");
        }

    	// get the current bvlqc type
    	$qcType = $this->getBVLQCType();
    	
        // can't set the status to Complete unless the type is set
        if ($status == 'Complete' && empty($qcType)) {
            return PEAR::raiseError("Cannot complete QC until the type is defined");
        }
        
        $setArray = array('BVLQCStatus'=>$status);
        
        // update session table
        $dbErrors = $db->update('session', $setArray, array('ID'=>$this->getSessionID()));

        if(PEAR::isError($dbErrors)) {
            return PEAR::raiseError("DB Error: ".$dbErrors->getMessage());
        }

        // reload TimePoint object
        $success = $this->select($this->getSessionID());
        if (PEAR::isError($success)) {
            //throw PEAR error
            return PEAR::raiseError($success->getMessage());
        }
    }
    
    function setBVLQCExclusion($status)
    {
        $db =& Database::singleton();

        // check the status
        if (!in_array($status, $this->bvlQcExclusionStatuses)) {
            return PEAR::raiseError("TimePoint::setBVLQCExclusion: You need to specify a valid BVL QC Exclusion Status \n");
        }

        // fields to update
        $setArray = array('BVLQCExclusion'=>$status);
        
        // update session table
        $dbErrors = $db->update('session', $setArray, array('ID'=>$this->getSessionID()));

        if(PEAR::isError($dbErrors)) {
            return PEAR::raiseError("DB Error: ".$dbErrors->getMessage());
        }

        // reload TimePoint object
        $success = $this->select($this->getSessionID());
        if (PEAR::isError($success)) {
            //throw PEAR error
            return PEAR::raiseError($success->getMessage());
        }
        
        return true;
    }
    
    /**
     * Determines whether the next stage for the timepoint is startable.
     * Rules:  User must have permission.
     *         If the stage to be started is a testing stage, then there can be no other timepoints of the same subproject that are in a testing stage (screening or visit).
     *         If the stage to be started is not a testing stage, the the current stage status cannot be "In Progress".
     *
     * @return boolean
     */
    function isStartable(){
    	$config =& NDB_Config::singleton();
        $onlyOneOpenTimepoint = $config->getSetting('onlyOneOpenTimepoint');
        
    	$currentStage = $this->getData('Current_stage');

    	// if we have not yet started, and at least one timepoint is in screening or visit, do not allow the user to start another timepoint
    	if ($currentStage == 'Not Started') {
    		$candidate =& Candidate::singleton($this->getCandID());
    		if (PEAR::isError($candidate)) {
    			return PEAR::raiseError("Candidate Error ($candID): ".$candidate->getMessage());
    		}

    		// when starting screening, make sure that all other started visits were previously submitted to DCC
    		$listOfTimePoints = $candidate->getListOfTimePoints();
    		$currentTimePoint=TimePoint::singleton($_REQUEST['sessionID']);

    		// if there are any timepoints
    		if (is_array($listOfTimePoints)) {
    			foreach ($listOfTimePoints as $sessionID) {
    				// create timepoint object
    				$timepoint = TimePoint::singleton($sessionID);
    				if (PEAR::isError($timepoint)) {
    					return PEAR::raiseError("TimePoint Error ($sessionID): ".$timepoint->getMessage());
    				}

    				// if a timepoint is started and not submitted, return false
    				if ($onlyOneOpenTimepoint=="true" && (in_array($timepoint->getData('Current_stage'), array('Screening', 'Visit')) AND $timepoint->getSubprojectID()==$this->getSubprojectID())) {
    					return false;
    				}
    			}
    		}

    		return true;
    	} elseif ($currentStage == 'Screening' && in_array($this->getData('Screening'), array('Pass', 'Failure'))) {
    		return true;
    	}
    	return false;
    }
    
    /**
     * Returns either EDC or DOB depending on the settings of the subproject that this timepoint belongs to.
     *
     * @return string of the date in YYYY-MM-DD
     */
    function getEffectiveDateOfBirth(){
    	$config=NDB_Config::singleton();
    	$candidate=Candidate::singleton($this->getCandID());
    	$settings=$config->getSubprojectSettings($this->getSubprojectID());
    	if($settings['options']['useEDC']=="true"){
    		return $candidate->getCandidateEDC();
    	}
    	
    	return $candidate->getCandidateDoB();
    }
    
} // end class
?>

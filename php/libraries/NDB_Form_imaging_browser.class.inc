<?php
//require_once 'NDB_Form.class.inc';
require_once 'Imaging_Session_ControlPanel.class.inc';
require_once 'Notify.class.inc';
//require_once 'MRIFile.class.inc';

class NDB_Form_imaging_browser extends NDB_Form
{
    /**
     * var to store the scanner information. 
     * Will be used from the last file.
     */
    private $scanner;
    private $sessionID;

    function view_session() {
        $this->DB = Database::singleton();
      	if(Utility::isErrorX($this->DB)) {
            print "Could not connect to database: ".$DB->getMessage()."<br>\n";
            die();
        }

	$this->sessionID = $_REQUEST['sessionID'];
	
	if (!empty($this->sessionID) && is_numeric($this->sessionID)) {
            if ($this->_hasAccess() && isset($_POST['save_changes'])) {
	        $this->_updateStatus($_POST);
		$this->_updateSelected();
                $this->_updateVisitStatus();
            }
	 
            $NavBar = new MRINavigation($this->sessionID);
	    $this->tpl_data['nextTimepoint']['URL'] = $NavBar->NextLink();
            $this->tpl_data['prevTimepoint']['URL'] = $NavBar->PrevLink();

            $this->setFilesData();

	    $this->tpl_data['headerTable'] = $this->getHeaderTable();
		

	    $this->tpl_data['showFloatJIV'] = True;
    	    $file = $this->DB->pselectOne("SELECT File FROM files f JOIN session s ON (s.ID=f.SessionID) WHERE s.ID=:sid AND FileType='obj'", array('sid' =>$this->sessionID));
	    if(!empty($file)) {
                $this->tpl_data['show3DViewer'] = True;
    	    }
	    
	    $types_q = $this->DB->pselect("SELECT mri_scan_type.Scan_type FROM mri_scan_type", array());
	    $types[''] = '';
            foreach($types_q as $row) {
                $type = $row['Scan_type'];
                $types[$type] = $type;
            }
	    $this->tpl_data['selected_options'] = $types;
	
	    $this->tpl_data['status_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
	    $this->tpl_data['caveat_options'] = array ('' => '&nbsp;', true => 'True', false => 'False');

	    $this->tpl_data['has_permission'] = ($this->_hasAccess()) ? true : false;
   	   
    	}
    }
    private function setFilesData() {
        $extra_where_string = "";
        if(!empty($_REQUEST['selectedOnly'])) {
            $extra_where_string .= " AND sel.Value IS NOT NULL";
        }
        // To better support QC for CIVET output a couple of 
	// additional conditions have been put in...
        if(!empty($_REQUEST['outputType'])) {
            $outputType = urldecode($_REQUEST['outputType']);
            if ($outputType=="processed") { 
	        $extra_where_string .= " AND OutputType != 'native' "; 
            }
            elseif ($outputType=="native") { 
	        $extra_where_string .= " AND OutputType='$outputType'"; 
            }
            elseif ($outputType=="skull_mask") { 
                $extra_where_string .= " AND (OutputType='$outputType' OR  (OutputType='native' AND AcquisitionProtocolID='44') )"; 
            }
            else {
                $extra_where_string .= " AND (OutputType='$outputType' OR OutputType='linreg')";
            }
        }
 	   
	$files = $this->DB->pselect("SELECT files.FileID FROM files LEFT JOIN parameter_file as sel on (files.FileID=sel.FileID AND sel.ParameterTypeID=:selectedTypeID) WHERE SessionID=:SID AND (AcquisitionProtocolID IS NULL OR AcquisitionProtocolID not in (1, 2, 3, 52)) AND PendingStaging=0 $extra_where_string ORDER BY files.OutputType, sel.Value DESC, AcquisitionProtocolID",
                array(
		    'SID' => $this->sessionID,
		    'selectedTypeID' => $this->DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected' LIMIT 1")
            	)
        );
	$this->tpl_data['files'] = array();
        foreach($files as $fileRow) {
            $FileObj = new MRIFile($fileRow['FileID']);
	    
	    if(empty($scannerID)) {
	        $scannerID = $FileObj->getParameter('ScannerID');
                if(!empty($scannerID)) {
		    $query = "SELECT CONCAT_WS(' ', Manufacturer, Model, Serial_number) FROM mri_scanner WHERE ID=:ScanID";
                    $this->scanner = $this->DB->pselectOne($query, array('ScanID' => $scannerID));
		}
            }
            $file = array(
                'FileID'   => $fileRow['FileID'],
            	'Filename' => basename($FileObj->getParameter('File')),
                'CheckPic' => "/mri/jiv/get_file.php?file=pic/" . $FileObj->getParameter('check_pic_filename'),
                'FullFilename' => $FileObj->getParameter('File'),
                'JivFilename' => basename($FileObj->getParameter('File')),
                'JivAddress' => str_replace('_check.jpg', '', $FileObj->getParameter('check_pic_filename')),
                'New' => ($FileObj->getParameter('QCFirstChangeTime') == '') ? 1 : 0,
	        'Pipeline' => $FileObj->getParameter('Pipeline'),
	        'OutputType' => $FileObj->getParameter('OutputType'),
	        'AcquisitionProtocol' => $FileObj->getAcquisitionProtocol(),
	        'CoordinateSpace' => $FileObj->getParameter('CoordinateSpace'),
	        'Algorithm' => $FileObj->getParameter('Algorithm'),
	        'AcquisitionDate' => ((preg_match("/(\d{4})-?(\d{2})-?(\d{2})/", $FileObj->getParameter('acquisition_date'), $acqDate))) ? (mktime(12, 0, 0, $acqDate[2], $acqDate[3], $acqDate[1])) : "",
	        'FileInsertDate' => $FileObj->getParameter('InsertTime'),
	        'SeriesDescription' => $FileObj->getParameter('series_description'),
	        'SeriesNumber' => $FileObj->getParameter('series_number'),
	        'EchoTime' => number_format($FileObj->getParameter('echo_time')*1000, 2),
	        'RepetitionTime' => number_format($FileObj->getParameter('repetition_time')*1000, 2),
	        'SliceThickness' => number_format($FileObj->getParameter('slice_thickness'), 2),
	        'Time' => number_format($FileObj->getParameter('time'), 2),
	        'Comment' => $FileObj->getParameter('Comment'),
	        'ProcessingPipeline' => $FileObj->getParameter('processing:pipeline'),
	        'TotalRejected' => $FileObj->getParameter('processing:total_rejected'),
	        'SlicewiseRejected' => $FileObj->getParameter('processing:slicewise_rejected'),
	        'InterlaceRejected' => $FileObj->getParameter('processing:interlace_rejected'),
	        'IntegradientRejected' => $FileObj->getParameter('processing:integradient_rejected'),
	        'Xstep' => number_format($FileObj->getParameter('xstep'), 2),
	        'Ystep' => number_format($FileObj->getParameter('ystep'), 2),
	        'Zstep' => number_format($FileObj->getParameter('zstep'), 2),
	        'Selected' => $FileObj->getParameter('Selected'),
	        'QCStatus' => $FileObj->getParameter('QCStatus'),
	        'QCDate' => $FileObj->getParameter('QCLastChangeTime'),
	        'Caveat' => $FileObj->getParameter('Caveat'),
	        'SeriesUID' => $FileObj->getParameter('SeriesUID')
            );
	        
            $this->tpl_data['files'][] = $file;
       	}
    }

    function _updateStatus($values) {
      	if (is_array($values['status'])) {
            foreach($values['status'] AS $curFileID => $curStatus) {
                if ($curStatus == 'unrated') $curStatus='';
                $updateSet = array('QCStatus'=>$curStatus, 'QCLastChangeTime'=>time());

                // set first change time, if it's null only
                $params = array('FID' => $curFileID);
                $firstChangeTime = $this->DB->pselectOne("SELECT QCFirstChangeTime FROM files_qcstatus WHERE FileID=:FID", $params);
                if(empty($firstChangeTime)) {
                    $updateSet['QCFirstChangeTime'] = time();
                }

                $QCExists = $this->DB->pselectOne("SELECT 'x' FROM files_qcstatus WHERE FileID=:FID", $params);
                if(!empty($QCExists)) {
                    $updateWhere['FileID'] = $curFileID;
                    $success = $this->DB->update('files_qcstatus', $updateSet, $updateWhere);
                    if(Utility::isErrorX($success)) {
                        die("DB Error: ".$success->getMessage());
                    }
		} 
		else {
                    $file = new MRIFile($curFileID);
                    $updateSet['SeriesUID'] = $file->getParameter('series_instance_uid');
                    $updateSet['EchoTime'] = $file->getParameter('echo_time');
                    $updateSet['FileID'] = $curFileID;
                    $this->DB->insert("files_qcstatus", $updateSet);
                }
            }
        }
	if (is_array($values['caveat'])) {
            $user = User::singleton();
            $timePoint =& TimePoint::singleton($this->sessionID);
            $candid = $timePoint->getCandID();
            $visit_label = $timePoint->getData('Visit_label');

            foreach ($values['caveat'] as $curFileID => $curCaveat) {
                if ($curCaveat === '') {
                    $curCaveat = null;
                }
                $this->DB->update(
                    "files",
                    array('Caveat' => $curCaveat),
                    array('FileID' => $curFileID)
                );

                if($curCaveat == true) {
                    $file = new MRIFile($curFileID);
                    $insertSet['SeriesUID'] = $file->getParameter('series_instance_uid');
                    $insertSet['TarchiveID'] = $file->getParameter('TarchiveSource');
                    $insertSet['MincFile'] = $file->getParameter('File');
                    $insertSet['PatientName'] = $file->getParameter('patient_name');
                    $insertSet['CandID'] = $candid;
                    $insertSet['Visit_label'] = $visit_label;
                    $insertSet['CheckID'] = null;
                    $insertSet['Severity'] = 'warning';
                    $insertSet['Header'] = 'Manual Caveat Set by ' . $user->getUsername();

                    $this->DB->insert("mri_violations_log", $insertSet);
                }
            }
	}
    }

    function _updateSelected() {
       	$selectedTypeID = $this->DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='selected' LIMIT 1");
            // update selected's
        if (is_array($_POST['selectedvol'])) {
            foreach ($_POST['selectedvol'] AS $curFileID => $curSelected) {
                $params = array('FID' => $curFileID, 'STID' => $selectedTypeID);
                $updateWhere = array('FileID' => $curFileID, 'ParameterTypeID'=>$selectedTypeID);

                if ($curSelected == 'Unselected') {
		    if($this->DB->pselectOne("SELECT COUNT(*) FROM parameter_file WHERE FileID=:FID AND ParameterTypeID=:STID", $params) > 0) {
                        $success = $this->DB->delete('parameter_file', $updateWhere);
                    }
                } else {
                    if($this->DB->pselectOne("SELECT COUNT(*) FROM parameter_file WHERE FileID=:FID AND ParameterTypeID=:STID", $params) > 0) {
                        $updateSet = array('Value'=>$curSelected, 'InsertTime'=>time());
                        $success = $this->DB->update('parameter_file', $updateSet, $updateWhere);
                    } else {
                        $insertSet = array('FileID' => $curFileID, 'ParameterTypeID'=>$selectedTypeID, 'Value'=>$curSelected, 'InsertTime'=>time());
                        $success = $this->DB->insert('parameter_file', $insertSet);
                    }
                }
                if(Utility::isErrorX($success)) {
                    die("DB Error: ".$success->getMessage());
                }
            }
	}
    }

    function _updateVisitStatus() {
    	// update visit status
        if (!empty($_POST['visit_status'])) {
            $save_visit_status = $_POST['visit_status'] == 'Unrated' ? '' : $_POST['visit_status'];
            $params = array('SID' => $this->sessionID);
            $old_visit_status = $this->DB->pselectOne("SELECT MRIQCStatus FROM session WHERE ID=:SID", $params);
            $old_pending_status = $this->DB->pselectOne("SELECT MRIQCPending FROM session WHERE ID=:SID", $params);

            $updateSet = array('MRIQCPending'=>$_POST['visit_pending'], 'MRIQCStatus'=>$_POST['visit_status'], 'MRIQCLastChangeTime'=>date("Y-m-d H:i:s"));
            $firstChangeTime = $this->DB->pselectOne("SELECT MRIQCFirstChangeTime FROM session WHERE ID=:SID", $params);
            if(empty($firstChangeTime)) $updateSet['MRIQCFirstChangeTime'] = $updateSet['MRIQCLastChangeTime'];

            $success = $this->DB->update('session', $updateSet, array('ID'=>$this->sessionID));
            if(Utility::isErrorX($success)) {
                die("DB Error: ".$success->getMessage());
            }
	            // sppool a message to the mri qc status rss channel
            if(($save_visit_status != $old_visit_status) || ($old_pending_status != $_POST['visit_pending'])) {
                $timePoint =& TimePoint::singleton($this->sessionID);
                $candid = $timePoint->getCandID();
                $candidate =& Candidate::singleton($timePoint->getCandID());
                $pscid = $candidate->getPSCID();
                $visit_label = $timePoint->getVisitLabel();
                $not_status = ($_POST['visit_pending'] == 'Y' ? 'Pending ' : '') . $_POST['visit_status'];
                $message = "$candid / $pscid $visit_label - MRI QC status changed to $not_status";
                $centerID = $timePoint->getCenterID();

                $notifier = new Notify;
                $notifier->spool('mri qc status', $message, $centerID);
                unset($timePoint, $candid, $candidate, $pscid, $visit_label, $message, $centerID, $notifier, $not_status);
            }
        }
    }


    function getHeaderTable() {
        $tpl_data = array();
        $tpl_data['subject'] = $this->getSubjectData();
	

        if(!empty($_REQUEST['outputType'])) {
            $tpl_data['outputType'] = urldecode($_REQUEST['outputType']);
        }


        $smarty = new Smarty_neurodb;
        $smarty->ModuleName = "imaging_browser";

        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_session_header.tpl");
        return $html;
    }

    function getSubjectData() {
        $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
        if(Utility::isErrorX($timePoint)) {
            print $timePoint->getMessage()."<br>";
        }

        $subjectData['sessionID'] = $_REQUEST['sessionID'];
        $subjectData['SubprojectID'] = $timePoint->getSubprojectID();
        $subjectData['SubprojectTitle'] = $timePoint->getData('SubprojectTitle');
        $subjectData['visitLabel'] = $timePoint->getVisitLabel();
        $subjectData['visitNo'] = $timePoint->getVisitNo();
        $subjectData['site'] = $timePoint->getPSC();
        $qcstatus = $this->DB->pselectRow("SELECT MRIQCStatus, MRIQCPending FROM session WHERE ID=:SID", 
            array('SID' => $_REQUEST['sessionID'])
        );
        $subjectData['mriqcstatus'] = $qcstatus['MRIQCStatus'];
        $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
        $subjectData['candid'] = $timePoint->getCandID();
	$subjectData['scanner'] = $this->scanner;
        $candidate =& Candidate::singleton($timePoint->getCandID());
        if(Utility::isErrorX($candidate)) { 
            print $candidate->getMessage()."<br>";
        } else {
            $subjectData['pscid'] = $candidate->getPSCID();
            $subjectData['dob'] = $candidate->getCandidateDoB();
            $subjectData['edc'] = $candidate->getCandidateEDC();
            $subjectData['gender'] = $candidate->getCandidateGender();

            // This doesn't work. Need to find the proper way to get the TarchiveID. It should be per file, not per 
            // candidate. --Dave
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
            $tarchiveIDs = $this->DB->pselect("SELECT TarchiveID FROM tarchive WHERE PatientName LIKE $ID", $params);
	    
            $subjectData['tarchiveids'] = $tarchiveIDs;
        }

        // Cache the data
        return $subjectData;
    }

    function getControlPanel() {
       	$controlPanel = new Imaging_Session_ControlPanel($_REQUEST['sessionID']);
        return $controlPanel->display();
    }
}

/**
 * Olga: Class to get prev and next sessions. Not tested yet, maybe
 * better to remove to Form_imaging***.class.
 */
class MRINavigation {
    function MRINavigation($sessionID = null) {
        $this->SessionID = $sessionID;
        $this->FilteredSessionList = $_SESSION['State']->getProperty('mriSessionsListed');

        if (!is_array($this->FilteredSessionList)) {
            $this->FilteredSessionList = array();
        }
        $this->currentListIndex = array_search($this->SessionID, $this->FilteredSessionList);
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

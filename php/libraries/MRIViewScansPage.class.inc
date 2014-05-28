<?php

require_once "Database.class.inc";
// This class is the portion of the old mri_browser.php 
// that was used to view a single session's scans, refactored
// into a class/functions and moved into a separate file for easier 
// readability.

// There are still some improvements to be made to it, such as passing
// the values to be saved in a parameter instead of extracting them
// directly from the $_POST array.
class MRIViewScansPage {
    var $SessionID;

    function MRIViewScansPage($sessionID) {
        $this->SessionID = $sessionID;
        $this->DB = Database::singleton();
        if(Utility::isErrorX($this->DB)) {
            print "Could not connect to database: ".$DB->getMessage()."<br>\n";
            die();
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
                } else {
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
            $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
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

    function _updateSelected($selectedTypeID) {
        // update selected's
        if (is_array($_POST['selectedvol'])) {
            foreach ($_POST['selectedvol'] AS $curFileID => $curSelected) {
                $params = array('FID' => $curFileID, 'STID' => $selectedTypeID);
                $updateWhere = array('FileID' => $curFileID, 'ParameterTypeID'=>$selectedTypeID);

                if ($curSelected == 'Unselected') {
                    if($this->DB->pselectOne("SELECT COUNT(*) FROM parameter_file WHERE FileID=:FID AND ParameterTypeID=:STID", $params) > 0) {
                        $success = $DB->delete('parameter_file', $updateWhere);
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
            $params = array('SID' => $_REQUEST['sessionID']);
            $old_visit_status = $this->DB->pselectOne("SELECT MRIQCStatus FROM session WHERE ID=:SID", $params);
            $old_pending_status = $this->DB->pselectOne("SELECT MRIQCPending FROM session WHERE ID=:SID", $params);
            
            $updateSet = array('MRIQCPending'=>$_POST['visit_pending'], 'MRIQCStatus'=>$_POST['visit_status'], 'MRIQCLastChangeTime'=>date("Y-m-d H:i:s"));
            $firstChangeTime = $this->DB->pselectOne("SELECT MRIQCFirstChangeTime FROM session WHERE ID=:SID", $params);
            if(empty($firstChangeTime)) $updateSet['MRIQCFirstChangeTime'] = $updateSet['MRIQCLastChangeTime'];

            $success = $this->DB->update('session', $updateSet, array('ID'=>$_REQUEST['sessionID']));
            if(Utility::isErrorX($success)) {
                die("DB Error: ".$success->getMessage());
            }

            // sppool a message to the mri qc status rss channel
            if(($save_visit_status != $old_visit_status) || ($old_pending_status != $_POST['visit_pending'])) {
                $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
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

    function GetSubjectData() {
        // subjectData['Scanner'] may already be set, so if 
        // $this->_subjectData is set, use that as the starting
        // point
        if(isset($this->_subjectData)) {
            $subjectData = $this->_subjectData;
        }
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
            $subjectData['ParameterFormCommentID'] = $this->DB->pselectOne(
                "SELECT CommentID FROM flag WHERE Test_name='mri_parameter_form' AND SessionID=:SID", 
                array('SID' => $_REQUEST['sessionID'])
            );
            $subjectData['RadiologyReviewCommentID'] = $this->DB->pselectOne(
                    "SELECT CommentID FROM flag WHERE Test_name='radiology_review' AND SessionID=:SID",
                    array('SID' => $_REQUEST['sessionID'])
                    );

            $subjectData['tarchiveids'] = $tarchiveIDs;
        }

        // Cache the data
        $this->_subjectData = $subjectData;
        return $this->_subjectData;
    }

    function _getOutputType() {
        if(!empty($_REQUEST['outputType'])) {
            return urldecode($_REQUEST['outputType']);
        }
    }
    function GetFileData($selectedTypeID) {
        global $timer;
        
        // Cache the data, since it's called twice. Once to display the files,
        // and once to get the files data for the sidebar
        if(isset($this->_fileData)) {
            return $this->_fileData;
        }

        $extra_where_string = "";
        if(!empty($_REQUEST['selectedOnly'])) {
            $extra_where_string .= " AND sel.Value IS NOT NULL";
        }
        // To better support QC for CIVET output a couple of additional conditions have been put in...
        if(!empty($_REQUEST['outputType'])) {
            $outputType = urldecode($_REQUEST['outputType']);
            if ($outputType=="processed") { $extra_where_string .= " AND OutputType != 'native' "; }
            elseif ($outputType=="native") { $extra_where_string .= " AND OutputType='$outputType'"; }
            elseif ($outputType=="skull_mask") { $extra_where_string .= " AND (OutputType='$outputType' OR  (OutputType='native' AND AcquisitionProtocolID='44') )"; } 
            else { 
                $extra_where_string .= " AND (OutputType='$outputType' OR OutputType='linreg')"; 
            } 
        }

        $query = "SELECT files.FileID FROM files left join parameter_file as sel on (files.FileID=sel.FileID AND sel.ParameterTypeID=$selectedTypeID) WHERE SessionID='$_REQUEST[sessionID]' AND (AcquisitionProtocolID IS NULL OR AcquisitionProtocolID not in (1, 2, 3, 52)) AND PendingStaging=0 $extra_where_string ORDER BY files.OutputType, sel.Value DESC, AcquisitionProtocolID";
        $this->DB->select($query, $files);
        $fileData = array();
        $fIdx = 0;
        $timer->setMarker('Querying for data');
        foreach($files AS $fileID) {
            $file = new MRIFile($fileID['FileID']);

            if(empty($scannerID)) {
                $scannerID = $file->getParameter('ScannerID');
                if(!empty($scannerID)) {
                    $query = "SELECT CONCAT_WS(' ', Manufacturer, Model, Serial_number) FROM mri_scanner WHERE ID=:ScanID";
                    $this->_subjectData['scanner'] = $this->DB->pselectOne($query, array('ScanID' => $scannerID));
                }
            }
            $fileData[$fIdx]['fileID'] = $fileID['FileID'];
            $fileData[$fIdx]['acquisitionProtocol'] = $file->getAcquisitionProtocol();
            $fileData[$fIdx]['coordinateSpace'] = $file->getParameter('CoordinateSpace');
            $fileData[$fIdx]['processingPipeline'] = $file->getParameter('processing:pipeline');
            $fileData[$fIdx]['sourceFile'] = basename($file->getParameter('processing:sourceFile'));
            $fileData[$fIdx]['Tool'] = $file->getParameter('Tool');
            // Order rejected directions by DTIPrep for display
            if (preg_match("/(Directions)([^\(]+)(\(\d+\))/", $file->getParameter('processing:slicewise_rejected'), $sliceRej)) {
                $dirList = preg_split('/\,/', $sliceRej[2]);
                if (count($dirList) > 1) {
                    sort($dirList);
                }
                $fileData[$fIdx]['slicewiseRejected'] = "Directions " . join(", ", $dirList) . " " . $sliceRej[3]; 
            }
            if (preg_match("/(Directions)([^\(]+)(\(\d+\))/", $file->getParameter('processing:interlace_rejected'), $laceRej)) {
                $dirList = preg_split('/\,/', $laceRej[2]);
                if (count($dirList) > 1) {
                    sort($dirList);
                } 
                $fileData[$fIdx]['interlaceRejected'] = "Directions " . join(", ", $dirList) . " " . $laceRej[3];    
            }
            if (preg_match("/(Directions)([^\(]+)(\(\d+\))/", $file->getParameter('processing:intergradient_rejected'), $interRej)) {
                $dirList = preg_split('/\,/', $interRej[2]);
                if (count($dirList) > 1) {
                    sort($dirList);
                } 
                $fileData[$fIdx]['intergradientRejected'] = "Directions " . join(", ", $dirList) . " " . $interRej[3];    
            }
            $fileData[$fIdx]['totalRejected'] = $file->getParameter('processing:total_rejected');
            $fileData[$fIdx]['Algorithm'] = $file->getParameter('Algorithm');
            $fileData[$fIdx]['outputType'] = $file->getParameter('OutputType');
            $fileData[$fIdx]['selected'] = $file->getParameter('Selected');
            $fileData[$fIdx]['qcStatus'] = $file->getParameter('QCStatus');
            $fileData[$fIdx]['qcDate'] = $file->getParameter('QCLastChangeTime');
            $fileData[$fIdx]['new'] = $file->getParameter('QCFirstChangeTime');
            $fileData[$fIdx]['new'] = empty($fileData[$fIdx]['new']);

            if(preg_match("/(\d{4})-?(\d{2})-?(\d{2})/", $file->getParameter('acquisition_date'), $acqDate)) {
                $fileData[$fIdx]['acquisitionDate'] = mktime(12, 0, 0, $acqDate[2], $acqDate[3], $acqDate[1]);
            }
            if(preg_match("/(\d{4})?(\d{2})?(\d{2})/", $file->getParameter('processing:processing_date'), $procDate)) {
                $fileData[$fIdx]['procDate'] = mktime(12, 0, 0, $procDate[2], $procDate[3], $procDate[1]);
            }
            //$fileData[$fIdx]['procDate'] = $file->getParameter('processing:processing_date');
            $fileData[$fIdx]['fileInsertDate'] = $file->getParameter('InsertTime');
            $fileData[$fIdx]['filename'] = basename($file->getParameter('File'));
            $fileData[$fIdx]['fullFilename'] = $file->getParameter('File');
            $fileData[$fIdx]['seriesDescription'] = $file->getParameter('series_description');
            $fileData[$fIdx]['seriesNumber'] = $file->getParameter('series_number');
            $fileData[$fIdx]['echoTime'] = number_format($file->getParameter('echo_time')*1000, 2);
            $fileData[$fIdx]['repetitionTime'] = number_format($file->getParameter('repetition_time')*1000, 2);
            $fileData[$fIdx]['sliceThickness'] = number_format($file->getParameter('slice_thickness'), 2);
            $fileData[$fIdx]['time'] = number_format($file->getParameter('time'), 2);
            $fileData[$fIdx]['xstep'] = number_format($file->getParameter('xstep'), 2);
            $fileData[$fIdx]['ystep'] = number_format($file->getParameter('ystep'), 2);
            $fileData[$fIdx]['zstep'] = number_format($file->getParameter('zstep'), 2);
            $fileData[$fIdx]['Pipeline'] = $file->getParameter('Pipeline');
            $fileData[$fIdx]['Comment'] = $file->getParameter('Comment');
            $fileData[$fIdx]['Caveat'] = $file->getParameter('Caveat');
            $fileData[$fIdx]['SeriesUID'] = $file->getParameter('SeriesUID');
            // this has been changed for more security
            $fileData[$fIdx]['checkpicFilename'] = "mri/jiv/get_file.php?file=" .'pic/'. $file->getParameter('check_pic_filename');
            $fileData[$fIdx]['XMLreport'] = $file->getParameter('processing:DTIPrepXmlReport');
            $fileData[$fIdx]['XMLprotocol'] = $file->getParameter('ProtocolFile');
            $fileData[$fIdx]['NrrdFile'] = $file->getParameter('processing:nrrd_file');
            // the jivs
            $fileData[$fIdx]['jivFilename'] = basename($file->getParameter('File'));
            $fileData[$fIdx]['jivAddress'] = str_replace('_check.jpg', '', $file->getParameter('check_pic_filename'));
            $fileData[$fIdx]['FileType'] = $file->getParameter('FileType');

            $fIdx++;
        }
        $timer->setMarker('looping files');
        // Cache the data
        $this->_fileData = $fileData;
        return $fileData;

    }

    function display($template_file = "mri_browser_volume_list.tpl") {
        global $user, $selectedTypeID;

        $fileData = $this->GetFileData($selectedTypeID);
        $file_tpl_data['outputType'] = $this->_getOutputType();
        $file_tpl_data['status_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
        $file_tpl_data['caveat_options'] = array (''=>'&nbsp;', true=>'True', false=>'False');
        //$file_tpl_data['pending_options'] = array ('Y'=>'Yes', 'N'=>'No');

        $file_tpl_data['selected_options'] = array(''=>'&nbsp;');
        $tmp_types = array();
        $query = "SELECT mri_scan_type.Scan_type FROM mri_scan_type";
        $scanTypes = $this->DB->pselect($query, array());
        
        foreach($scanTypes AS $row) {  
            $scanType = $row['Scan_type'];
            $tmp_types[$scanType] = $scanType;
        }
        $file_tpl_data['selected_options'] = array_merge($file_tpl_data['selected_options'], $tmp_types);

        if($user->hasPermission('mri_feedback')) $file_tpl_data['has_permission'] = true;

        $smarty = new Smarty_neurodb;
        $smarty->assign($file_tpl_data);
        $smarty->assign('files', $fileData);
        $smarty->assign('backURL', $_REQUEST['backURL']);
        $smarty->assign('subject', $this->GetSubjectData());
        $smarty->assign('numFiles',count($fileData));
        return $smarty->fetch($template_file);
    }
}

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

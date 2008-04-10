<?php
/**
 * @package mri
 */
ob_start('ob_gzhandler');

// start benchmarking
require_once "Benchmark/Timer.php";
$timer = new Benchmark_Timer;
$timer->start();

require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "MRIFile.class.inc";
require_once "Notify.class.inc";

// create Database object
$DB = Database::singleton();
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}

// user is logged in, let's continue with the show...
$user =& User::singleton();
if(PEAR::isError($user)) {
    die("Error creating user object: ".$user->getMessage());
}

// two levels of display are available: if nothing else, show a list
// of candidates (with a filter tool).  if $ID_session (or $CandID
// and $VisitNo) are specified, show the volumes available for that
// candidate of type $datatype.  $datatype will default to native [mnc]

$config =& NDB_Config::singleton();
$tpl_data['study_title']=$config->getSetting('title');
$tpl_data['mantis']=$config->getSetting('mantis_url');
$tpl_data['efax']=$config->getSetting('efax');

$tpl_data['css']=$config->getSetting('css');
$tpl_data['user_full_name']=$user->getData('Real_name');
$tpl_data['user_site_name']=$user->getData('Site');

$tpl_data['sessionID'] = $_REQUEST['sessionID'];
$tpl_data['commentID'] = $_REQUEST['commentID'];
$tpl_data['candID']    = $_REQUEST['candID'];

/* VISIT LISTING
*/

$timer->setMarker('setup');
$selectedTypeID = $DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='Selected' LIMIT 1");
$acqDateParamTypeID = $DB->selectOne("SELECT ParameterTypeID FROM parameter_type WHERE Name='acquisition_date' LIMIT 1");

if(!empty($_REQUEST['sessionID']) && is_numeric($_REQUEST['sessionID'])) {
    // save changes if "save" was clicked
    if ($user->hasPermission('mri_feedback') && isset($_POST['save_changes'])) {
        // update statuses
        if (is_array($_POST['status'])) {
            foreach($_POST['status'] AS $curFileID => $curStatus) {
                if ($curStatus == 'unrated') $curStatus='';
                $updateSet = array('QCStatus'=>$curStatus, 'QCLastChangeTime'=>time());

                // set first change time, if it's null only
                $firstChangeTime = $DB->selectOne("SELECT QCFirstChangeTime FROM files WHERE FileID=$curFileID");
                if(empty($firstChangeTime)) $updateSet['QCFirstChangeTime'] = time();

                $updateWhere['FileID'] = $curFileID;
                $success = $DB->update('files', $updateSet, $updateWhere);
                if(PEAR::isError($success)) {
                    die("DB Error: ".$success->getMessage());
                }
            }
        }

        // update selected's
        if (is_array($_POST['selectedvol'])) {
            
            foreach ($_POST['selectedvol'] AS $curFileID => $curSelected) {
                $updateWhere = array('FileID' => $curFileID, 'ParameterTypeID'=>$selectedTypeID);

                if ($curSelected == 'Unselected') {
                    if($DB->selectOne("SELECT COUNT(*) FROM parameter_file WHERE FileID=$curFileID AND ParameterTypeID=$selectedTypeID") > 0) {
                        $success = $DB->delete('parameter_file', $updateWhere);
                    }
                } else {
                    if($DB->selectOne("SELECT COUNT(*) FROM parameter_file WHERE FileID=$curFileID AND ParameterTypeID=$selectedTypeID") > 0) {
                        $updateSet = array('Value'=>$curSelected, 'InsertTime'=>time());
                        $success = $DB->update('parameter_file', $updateSet, $updateWhere);
                    } else {
                        $insertSet = array('FileID' => $curFileID, 'ParameterTypeID'=>$selectedTypeID, 'Value'=>$curSelected, 'InsertTime'=>time());
                        $success = $DB->insert('parameter_file', $insertSet);
                    }
                }
                if(PEAR::isError($success)) {
                    die("DB Error: ".$success->getMessage());
                }
            }
        }

        // update visit status
        if (!empty($_POST['visit_status'])) {
            $save_visit_status = $_POST['visit_status'] == 'Unrated' ? '' : $_POST['visit_status'];
            $old_visit_status = $DB->selectOne("SELECT MRIQCStatus FROM session WHERE ID=$_REQUEST[sessionID]");
            $old_pending_status = $DB->selectOne("SELECT MRIQCPending FROM session WHERE ID=$_REQUEST[sessionID]");
            
            $updateSet = array('MRIQCPending'=>$_POST['visit_pending'], 'MRIQCStatus'=>$_POST['visit_status'], 'MRIQCLastChangeTime'=>date("Y-m-d H:i:s"));
            $firstChangeTime = $DB->selectOne("SELECT MRIQCFirstChangeTime FROM session WHERE ID=$_REQUEST[sessionID]");
            if(empty($firstChangeTime)) $updateSet['MRIQCFirstChangeTime'] = $updateSet['MRIQCLastChangeTime'];

            $success = $DB->update('session', $updateSet, array('ID'=>$_REQUEST['sessionID']));
            if(PEAR::isError($success)) {
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
    } // done saving changes

    $timePoint =& TimePoint::singleton($_REQUEST['sessionID']);
    if(PEAR::isError($timePoint)) print $timePoint->getMessage()."<br>";
    $subjectData['sessionID'] = $_REQUEST['sessionID'];
    $subjectData['SubprojectID'] = $timePoint->getSubprojectID();
    $subjectData['SubprojectTitle'] = $timePoint->getData('SubprojectTitle');
    $subjectData['visitLabel'] = $timePoint->getVisitLabel();
    $subjectData['visitNo'] = $timePoint->getVisitNo();
    $subjectData['site'] = $timePoint->getPSC();
    $DB->selectRow("SELECT MRIQCStatus, MRIQCPending FROM session WHERE ID=$_REQUEST[sessionID]", $qcstatus);
    $subjectData['mriqcstatus'] = $qcstatus['MRIQCStatus'];
    $subjectData['mriqcpending'] = $qcstatus['MRIQCPending'];
    $subjectData['candid'] = $timePoint->getCandID();
    $candidate =& Candidate::singleton($timePoint->getCandID());
    if(PEAR::isError($candidate)) print $candidate->getMessage()."<br>";
    else {
        $subjectData['pscid'] = $candidate->getPSCID();
        $subjectData['dob'] = $candidate->getCandidateDoB();
        $subjectData['edc'] = $candidate->getCandidateEDC();
        $subjectData['gender'] = $candidate->getCandidateGender();
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
        $DB->select($query, $files);
        $fileData = array();
        $fIdx = 0;
        $timer->setMarker('Querying for data');
        foreach($files AS $fileID) {
            $file = new MRIFile($fileID['FileID']);

            if(empty($scannerID)) {
                $scannerID = $file->getParameter('ScannerID');
                if(!empty($scannerID)) {
                    $query = "SELECT CONCAT_WS(' ', Manufacturer, Model, Serial_number) FROM mri_scanner WHERE ID=$scannerID";
                    $subjectData['scanner'] = $DB->selectOne($query);
                }
            }
            $fileData[$fIdx]['fileID'] = $fileID['FileID'];
            $fileData[$fIdx]['acquisitionProtocol'] = $file->getAcquisitionProtocol();
            $fileData[$fIdx]['coordinateSpace'] = $file->getParameter('CoordinateSpace');
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
            $fileData[$fIdx]['fileInsertDate'] = $file->getParameter('InsertTime');
            $fileData[$fIdx]['filename'] = basename($file->getParameter('File'));
            $fileData[$fIdx]['seriesDescription'] = $file->getParameter('series_description');
            $fileData[$fIdx]['seriesNumber'] = $file->getParameter('series_number');
            $fileData[$fIdx]['echoTime'] = number_format($file->getParameter('echo_time')*1000, 2);
            $fileData[$fIdx]['repetitionTime'] = number_format($file->getParameter('repetition_time')*1000, 2);
            $fileData[$fIdx]['sliceThickness'] = number_format($file->getParameter('slice_thickness'), 2);
            $fileData[$fIdx]['xstep'] = number_format($file->getParameter('xstep'), 2);
            $fileData[$fIdx]['ystep'] = number_format($file->getParameter('ystep'), 2);
            $fileData[$fIdx]['zstep'] = number_format($file->getParameter('zstep'), 2);
            $fileData[$fIdx]['Pipeline'] = $file->getParameter('Pipeline');
            $fileData[$fIdx]['Comment'] = $file->getParameter('Comment');
            // this has been changed for more security
            $fileData[$fIdx]['checkpicFilename'] = "/mri/jiv/get_file.php?file=" .'pic/'. $file->getParameter('check_pic_filename');
            // the jivs
            $fileData[$fIdx]['jivFilename'] = basename($file->getParameter('File'));
            $fileData[$fIdx]['jivAddress'] = str_replace('_check.jpg', '', $file->getParameter('check_pic_filename'));

            $fIdx++;
        }
        $timer->setMarker('looping files');
    
    
    // find the current timepoint in the filtered list from State,
    // then assign next and prev
    $filteredSessionList = $_SESSION['State']->getProperty('mriSessionsListed');
    if (!is_array($filteredSessionList)) {$filteredSessionList = array(); }
    $currentListIndex = array_search($_REQUEST['sessionID'], $filteredSessionList);

    // construct the link base
    $linkBase = $_SERVER['REQUEST_URI'];
    $bits[0] = substr($linkBase, 0, strpos($linkBase, '?'));
    $bits[1] = substr($linkBase, strpos($linkBase, '?')+1);
    parse_str($bits[1], $urlParams);

    // set the next and prev links urls    
    if(isset($filteredSessionList[$currentListIndex+1])) {
        $urlParams['sessionID'] = $filteredSessionList[$currentListIndex+1];
        $bits[1] = Utility::unparse_str($urlParams);
        $tpl_data['nextTimepoint']['URL'] = implode('?', $bits);
    }

    if(isset($filteredSessionList[$currentListIndex-1])) {
        $urlParams['sessionID'] = $filteredSessionList[$currentListIndex-1];
        $bits[1] = Utility::unparse_str($urlParams);
        $tpl_data['prevTimepoint']['URL'] = implode('?', $bits);
    }

    $file_tpl_data['outputType'] = $outputType;
    $file_tpl_data['status_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
    //$file_tpl_data['pending_options'] = array ('Y'=>'Yes', 'N'=>'No');

    // fixme this should not be hard-coded. make it read the db for possible native types
    $file_tpl_data['selected_options'] = array (''=>'&nbsp;', 'T1'=>'T1', 'T2'=>'T2', 'PD'=>'PD',  'T1WF'=>'T1WF', 'T2WF'=>'T2WF', 'PDWF'=>'PDWF', 'T1reg'=>'T1reg');
    if($user->hasPermission('mri_feedback')) $file_tpl_data['has_permission'] = true;

    $smarty = new Smarty_neurodb;
    $smarty->assign($file_tpl_data);
    $smarty->assign('files', $fileData);
    $smarty->assign('backURL', $_REQUEST['backURL']);
    $smarty->assign('subject', $subjectData);
    $smarty->assign('numFiles',count($fileData));
    $tpl_data['body']=$smarty->fetch("mri_browser_volume_list.tpl");
    $timer->setMarker('filling volume list template');
    $tpl_data['backURL'] = urldecode($_REQUEST['backURL']);
    $tpl_data['showFloatJIV'] = True;

    // this happens in the main window. before you select a candidate and the corresponding volumes
} else {
    if(!$user->hasPermission('access_all_profiles')) $extra_where_string .= " AND p.CenterID=".$user->getCenterID();
    if(isset($_REQUEST['filter'])) {
        $filter = $_REQUEST['filter'];
        
        if(!empty($filter['site'])) $extra_where_string .= " AND p.CenterID=$filter[site]";
        if (!empty($filter['candID']) AND !ereg(",", $filter['candID'])) $extra_where_string .= " AND c.CandID LIKE '$filter[candID]%'";
        // override to allow for comma separated list if input contains a comma
        if(!empty($filter['candID']) AND ereg(",", $filter['candID'])) $extra_where_string .= " AND c.CandID IN ($filter[candID])";
        if(!empty($filter['pscID'])) $extra_where_string .= " AND c.PSCID LIKE '$filter[pscID]%'";
        if(!empty($filter['visitLabel'])) $extra_where_string .= " AND s.Visit_label LIKE '$filter[visitLabel]%'";
        if(!empty($filter['qcStatus'])) $extra_where_string .= " AND s.MRIQCStatus='$filter[qcStatus]'";
        if(!empty($filter['SubprojectID'])) $extra_where_string .= " AND s.SubprojectID='$filter[SubprojectID]'";
        if(!empty($filter['pending'])) $extra_where_string .= " AND (s.MRIQCPending='Y' OR s.MRIQCStatus='' OR ifnull(f.QCFirstChangeTime, 0)=0)";
        
    
        $query = "SELECT 
            s.ID AS sessionID,
            p.Name AS centerName,
            c.CandID AS candID,
            c.PSCID, s.Visit_label AS visitLabel,
            CONCAT(IF(s.MRIQCPending='Y', 'Pending ', ''), s.MRIQCStatus) AS QCStatus,
            s.SubprojectID AS SubprojectID,
            min(f.InsertTime) AS firstInsertDate,
            UNIX_TIMESTAMP(md.AcquisitionDate) AS firstAcqDate,
            UNIX_TIMESTAMP(s.MRIQCFirstChangeTime) AS firstQCDate,
            UNIX_TIMESTAMP(s.MRIQCLastChangeTime) AS lastQCDate
            FROM psc AS p, candidate AS c, session AS s, files AS f, mri_acquisition_dates AS md
            WHERE s.CenterID=p.CenterID AND s.CandID=c.CandID AND f.SessionID=s.ID AND md.SessionID=s.ID
            $extra_where_string
            AND f.PendingStaging=0 AND f.FileType='mnc' AND f.OutputType='native' AND f.AcquisitionProtocolID not in (1, 2, 3, 52) 
            GROUP BY f.SessionID
            ORDER BY  p.Name, firstAcqDate, c.CandID, s.Visit_label
            ";
    $DB->select($query, $visit_tpl_data['timepoints']);
    if(PEAR::isError($visit_tpl_data['timepoints'])) print $visit_tpl_data['timepoints']->getMessage()."<br>\n";
    }
    $visit_tpl_data['numTimepoints'] = count($visit_tpl_data['timepoints']);
    
    for($i=0; $i<$visit_tpl_data['numTimepoints']; $i++) {
        $minQCDate = $DB->selectOne("select min(QCLastChangeTime) from files where SessionID=".$visit_tpl_data['timepoints'][$i]['sessionID']." AND OutputType='native' AND AcquisitionProtocolID not in (1, 2, 3, 52) group by QCLastChangeTime order by QCLastChangeTime limit 1");
        $visit_tpl_data['timepoints'][$i]['newData'] = empty($minQCDate);
        $filtered_sessionIDs[] = $visit_tpl_data['timepoints'][$i]['sessionID'];
    }
    $_SESSION['State']->setProperty('mriSessionsListed', $filtered_sessionIDs);
    // This is a fixme. Make this a config option. Site users might have permsission to view non native files should be ($user->hasPermission('view_non_native')) 
    if($user->getCenterID() > 0) {
        $query = "SELECT DISTINCT OutputType AS outputType FROM files WHERE FileType='mnc' AND OutputType!='native'";
        $DB->select($query, $visit_tpl_data['outputTypes']);
        $visit_tpl_data['outputTypes'] = array_merge(array(array('outputType'=>'native'),array('outputType'=>'selected')), $visit_tpl_data['outputTypes']);
    } else {
        $visit_tpl_data['outputTypes'][] = array();
        // to avoid empty fields for non privileged users
        $visit_tpl_data['outputTypes'] = array_merge(array(array('outputType'=>'native'),array('outputType'=>'selected')));
    }
    
    $visit_tpl_data['numOutputTypes'] = count($visit_tpl_data['outputTypes']);
    
    $query = "SELECT CenterID, Name, MRI_Alias FROM psc WHERE MRI_Alias<>'' ".(!$user->hasPermission('access_all_profiles') ? "AND CenterID=".$user->getCenterID() : '')." ORDER BY Name";
    $DB->select($query, $sites);
    $visit_tpl_data['site_options']['']='&nbsp;';
    foreach($sites AS $site) {
        $visit_tpl_data['site_options'][$site['CenterID']] = $site['Name'];
        $visit_tpl_data['MRI_Alias'][$site['CenterID']] = $site['MRI_Alias'];
    }
    
    $visit_tpl_data['qcStatus_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
    $visit_tpl_data['SubprojectID_options'] = array (''=>'&nbsp;', '1'=>'1', '2'=>'2');
    
    $smarty = new Smarty_neurodb;
    $smarty->assign('filter', $filter);
    $smarty->assign('backURL', $_SERVER['REQUEST_URI']);
    $smarty->assign($visit_tpl_data);
    $tpl_data['body']=$smarty->fetch("mri_browser_visit_list.tpl");
}

$smarty=new Smarty_neurodb;
// this is a fixme. Same data get's assigned to volume_list
$tpl_data['status_options'] = array (''=>'&nbsp;', 'Pass'=>'Pass', 'Fail'=>'Fail');
$tpl_data['pending_options'] = array (''=>'&nbsp;','Y'=>'Yes', 'N'=>'No');
$smarty->assign('subject', $subjectData);
$smarty->assign('files', $fileData);
if($user->hasPermission('mri_feedback')) $tpl_data['has_permission'] = true;
$smarty->assign($tpl_data);
$smarty->display('mri_browser_main.tpl');
$timer->setMarker('filling main template');

$timer->stop();
//$timer->display();
?>

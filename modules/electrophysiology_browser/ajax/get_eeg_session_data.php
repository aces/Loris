<?php
/**
 * Get EEG Session Data.
 *
 * This retreives the entire eeg session data
 * for a candidate to be visible on the eeg_session form.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  EEG_Session
 * @author   Muhammad Khan <muhammad.khan@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once 'BIDSFile.class.inc';

/**
 * User permission verification:
 * Only users that have the eeg view all sites permission OR
 * have the view site permission and belong to candidates session site
 * are able to fetch the eeg session data.
 */
$user =& \User::singleton();
$timePoint =& \TimePoint::singleton($_REQUEST['sessionID']);
if (!$user->hasPermission('electrophysiology_browser_view_allsites')
    && !((in_array($timePoint->getData('CenterID'), $user->getData('CenterIDs')))
        && $user->hasPermission('electrophysiology_browser_view_site')
    )
)
{
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$response = getSessionData($_REQUEST['sessionID']);

echo json_encode($response);

// TODO Query code here to echo JSON data to the user.

//echo json_encode(array('hello'=>'world'));

// TODO Query code here to echo JSON data to the user.
//echo json_encode(array('hello'=>'world'));
function getSessionData($sessionID)
{
    $response = array(
        'patient' => getSubjectData($sessionID),
        'database' => array_values(getFilesData($sessionID))
    );
    return $response;
}
function getSubjectData($sessionID)
{
    $subjectData = array();
    $timePoint =& \TimePoint::singleton($sessionID);
    $candidate =& \Candidate::singleton($timePoint->getCandID());
    $subjectData['pscid'] = $candidate->getPSCID();
    $subjectData['dccid'] = $timePoint->getCandID();
    $subjectData['visitLabel'] = $timePoint->getVisitLabel();
    $subjectData['sessionID'] = $sessionID;
    $subjectData['site'] = $timePoint->getPSC();
    $subjectData['dob'] = $candidate->getCandidateDoB();
    $subjectData['gender'] = $candidate->getCandidateGender();
    $subjectData['subproject'] = $timePoint->getData('SubprojectTitle');
    $subjectData['output_type'] = $_REQUEST['outputType'];
    return $subjectData;
}
function getFilesData($sessionID)
{
    $fileCollection = array();
    $db = \Database::singleton();
    $outputType = $_REQUEST['outputType'];
    $params['SID'] = $sessionID;
    $query = 'SELECT pf.PhysiologicalFileID, pf.File from
    physiological_file pf ';
    //WHERE SessionID=:SID

    if ($outputType != 'all_types') {
        $query .= 'LEFT JOIN physiological_output_type pot ON ';
        $query .= 'pf.PhysiologicalOutputTypeID=pot.PhysiologicalOutputTypeID ';
        $query .= 'WHERE SessionID=:SID ';
        if ($outputType == 'raw') {
            $query .= 'AND pot.OutputType = "raw"';
        } else if ($outputType == 'derivatives') {
            $query .= 'AND pot.OutputType = "derivatives"';
        }
    } else {
        $query .= "WHERE SessionID=:SID";
    }
    $physiologicalFiles = $db->pselect($query, $params);
    $files = [];
    foreach ($physiologicalFiles as $file) {
        $fileSummary = array();
        $physiologicalFileID = $file['PhysiologicalFileID'];
        $physiologicalFile = $file['File'];
        $physiologicalFileObj = new \BIDSFile($physiologicalFileID);
        $fileName = basename($physiologicalFileObj->getParameter('File'));
        $fileSummary['name'] = $fileName;
        $fileSummary['task']['frequency']['sampling'] = $physiologicalFileObj->getParameter('SamplingFrequency');
        $fileSummary['task']['frequency']['powerline'] = $physiologicalFileObj->getParameter('PowerLineFrequency');
        $fileSummary['task']['channel'][] = array('name'=>'EEG Channel Count', 'value'=>$physiologicalFileObj->getParameter('EEGChannelCount'));
        $fileSummary['task']['channel'][] = array('name'=>'EOG Channel Count', 'value'=>$physiologicalFileObj->getParameter('EOGChannelCount'));
        $fileSummary['task']['channel'][] = array('name'=>'ECG Channel Count', 'value'=>$physiologicalFileObj->getParameter('ECGChannelCount'));
        $fileSummary['task']['channel'][] = array('name'=>'EMG Channel Count', 'value'=>$physiologicalFileObj->getParameter('EMGChannelCount'));
        $fileSummary['task']['reference'] = $physiologicalFileObj->getParameter('EEGReference');
        $fileSummary['details']['task']['description'] = $physiologicalFileObj->getParameter('TaskDescription');
        $fileSummary['details']['instructions'] = $physiologicalFileObj->getParameter('Instructions');
        $fileSummary['details']['eeg']['ground'] = '';
        $fileSummary['details']['eeg']['placement_scheme'] = $physiologicalFileObj->getParameter('EEGPlacementScheme');
        $fileSummary['details']['trigger_count'] = $physiologicalFileObj->getParameter('TriggerChannelCount');
        $fileSummary['details']['record_type'] = $physiologicalFileObj->getParameter('Recording_type');
        $fileSummary['details']['cog']['atlas_id'] = $physiologicalFileObj->getParameter('CogAtlasID');
        $fileSummary['details']['cog']['poid'] = $physiologicalFileObj->getParameter('CogPOID');
        $fileSummary['details']['institution']['name'] = $physiologicalFileObj->getParameter('InstitutionName');
        $fileSummary['details']['institution']['address'] = $physiologicalFileObj->getParameter('InstitutionAddress');
        $fileSummary['details']['misc']['channel_count'] = $physiologicalFileObj->getParameter('MiscChannelCount');
        $fileSummary['details']['manufacturer']['name'] = $physiologicalFileObj->getParameter('Manufacturer');
        $fileSummary['details']['manufacturer']['model_name'] = $physiologicalFileObj->getParameter('ManufacturerModelName');
        $fileSummary['details']['cap']['manufacturer'] = $physiologicalFileObj->getParameter('ManufacturerCapModelName');
        $fileSummary['details']['cap']['model_name'] = $physiologicalFileObj->getParameter('ManufacturerCapModelName');
        $fileSummary['details']['hardware_filters'] = $physiologicalFileObj->getParameter('HardwareFilters');
        $fileSummary['details']['recording_duration'] = $physiologicalFileObj->getParameter('RecordingDuration');
        $fileSummary['details']['epoch_length'] = $physiologicalFileObj->getParameter('EpochLength');
        $fileSummary['details']['device']['version'] = $physiologicalFileObj->getParameter('DeviceSoftwareVersion');
        $fileSummary['details']['device']['serial_number'] = $physiologicalFileObj->getParameter('DeviceSerialNumber');
        $fileSummary['details']['subject_artefact_description'] = $physiologicalFileObj->getParameter('SubjectArtefactDescription');

        $fileSummary['downloads'] = getDownloadLinks($physiologicalFileID, $physiologicalFile);
        $fileCollection[]['file'] = $fileSummary;
    }
    return $fileCollection;
}
function getDownloadlinks($physiologicalFileID, $physiologicalFile)
{
    $db = \Database::singleton();
    $params['PFID'] = $physiologicalFileID;
    $downloadLinks = array();
    $downloadLinks[] = array('type'=>'physiological_file', 'file'=> $physiologicalFile);
    $query = "SELECT DISTINCT(File), 'physiological_electrode_file' as FileType
                FROM physiological_electrode 
                WHERE PhysiologicalFileID=:PFID
                UNION 
              SELECT DISTINCT(File), 'physiological_channel_file' as FileType
                FROM physiological_channel
                WHERE PhysiologicalFileID=:PFID
                UNION 
              SELECT DISTINCT(File), 'physiological_task_event_file' as FileType
                FROM physiological_task_event
                WHERE PhysiologicalFileID=:PFID";
    $downloadResults = $db->pselect($query, $params);
    foreach ($downloadResults as $downloadLink) {
        $downloadLinks[] = array("type"=>$downloadLink['FileType'], "file"=>$downloadLink['File']);
    }
    return $downloadLinks;
}
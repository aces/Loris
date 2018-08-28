<?php
/**
 * Get EEG Session Data.
 *
 * This retrieves the entire eeg session data
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
    $db = \Database::singleton();
    $query = 'SELECT DISTINCT(pf.SessionID) FROM physiological_file pf LEFT
    JOIN session s ON s.ID=pf.SessionID LEFT JOIN candidate c USING (CandID)
    LEFT JOIN psc ON s.CenterID=psc.CenterID LEFT JOIN physiological_output_type
    pot USING (PhysiologicalOutputTypeID) WHERE s.Active = "Y" AND pf.FileType
    IN ("bdf", "cnt", "edf", "set", "vhdr", "vsm") ORDER BY pf.SessionID';
    $sessions = $db->pselect($query, array());
    $sessions = array_column($sessions, 'SessionID');
    $response['patient'] = getSubjectData($sessionID);
    $response['database'] = array_values(getFilesData($sessionID));
    $response['sessions'] = $sessions;
    $currentIndex = array_search($sessionID,$sessions);
    $response['nextSession'] = isset($sessions[$currentIndex+1]) ?
        $sessions[$currentIndex+1] : '';
    $response['prevSession'] = isset($sessions[$currentIndex-1]) ?
        $sessions[$currentIndex-1] : '';
    return $response;
}
function getSubjectData($sessionID)
{
    $subjectData = array();
    $timePoint =& \TimePoint::singleton($sessionID);
    $candidate =& \Candidate::singleton($timePoint->getCandID());
    $subjectData['pscid'] = $candidate->getPSCID();
    $subjectData['dccid'] = $timePoint->getCandID();
    $subjectData['visit_label'] = $timePoint->getVisitLabel();
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

    $queries = [
        'physiological_electrode' => 'physiological_electrode_file',
        'physiological_channel' =>'physiological_channel_file',
        'physiological_task_event' =>'physiological_task_event_file',
        'physiological_archive' =>'all_files'
    ];

    foreach($queries as $query_key=>$query_value) {
        $query_statement = "SELECT DISTINCT(File), '". $query_value . "' as FileType
                FROM " . $query_key . " WHERE PhysiologicalFileID=:PFID";
        //print($query_statement);
        $query_statement = $db->pselectRow($query_statement, $params);
        if (isset($query_statement['FileType'])) {
            $downloadLinks[] = array(
                'type'=>$query_statement['FileType'],
                'file'=>$query_statement['File']
            );
        } else {
            $downloadLinks[] = array(
                'type'=> $query_value,
                'file'=> '',
            );
        }
    }

    $queryFDT = "SELECT Value as File, 'physiological_fdt_file' as
        FileType FROM physiological_parameter_file JOIN parameter_type AS pt
        USING (ParameterTypeID) WHERE pt.Name='fdt_file' AND
        PhysiologicalFileID=:PFID";
    $queryFDT = $db->pselectRow($queryFDT, $params);
    if (isset($queryFDT['FileType'])) {
        $downloadLinks[] = array(
            'type'=>$queryFDT['FileType'],
            'file'=>$queryFDT['File']
        );
    } else {
        $downloadLinks[] = array(
            'type'=> 'physiological_fdt_file',
            'file'=> '',
        );
    }

    return $downloadLinks;
}
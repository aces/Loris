<?php declare(strict_types=1);
/**
 * Get Electrophysiology Session Data.
 *
 * This retrieves the entire electrophysiology session data
 * for a candidate to be visible on the electrophysiology_session form.
 *
 * PHP Version 7
 *
 * @category LORIS
 * @package  Electrophysiology_Session
 * @author   Muhammad Khan <muhammad.khan@mcin.ca>
 * @license  LORIS license
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once 'ElectrophysioFile.class.inc';

/**
 * User permission verification:
 * Only users that have the electrophysiology view all sites permission OR
 * have the view site permission and belong to candidates session site
 * are able to fetch the electrophysiology session data.
 */
$user      = \NDB_Factory::singleton()->user();
$timePoint = \NDB_Factory::singleton()->timepoint(
    intval($_REQUEST['sessionID'])
);

// if a user does not have the permission to view all sites' electrophsyiology
// sessions or if a user does not have permission to view other sites' session
// then display a Forbidden message.
if (!$user->hasPermission('electrophysiology_browser_view_allsites')
    && !((in_array($timePoint->getData('CenterID'), $user->getData('CenterIDs')))
    && $user->hasPermission('electrophysiology_browser_view_site'))
) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

$response = getSessionData($_REQUEST['sessionID']);

echo json_encode($response);

/**
 * Get the session data information.
 *
 * @param int $sessionID ID of the electrophysiology session
 *
 * @return array with the session information
 */
function getSessionData(string $sessionID)
{
    $db = \NDB_Factory::singleton()->database();

    $query = 'SELECT 
                DISTINCT(pf.SessionID) 
              FROM physiological_file pf 
                LEFT JOIN session s ON (s.ID=pf.SessionID) 
                LEFT JOIN candidate c USING (CandID)
                LEFT JOIN psc ON (s.CenterID=psc.CenterID) 
                LEFT JOIN physiological_output_type pot 
                  USING (PhysiologicalOutputTypeID) 
              WHERE 
                s.Active = "Y" 
                AND pf.FileType IN ("bdf", "cnt", "edf", "set", "vhdr", "vsm") 
              ORDER BY pf.SessionID';

    $sessions            = $db->pselect($query, array());
    $sessions            = array_column($sessions, 'SessionID');
    $response['patient'] = getSubjectData($sessionID);
    $response['database']    = array_values(getFilesData($sessionID));
    $response['sessions']    = $sessions;
    $currentIndex            = array_search($sessionID, $sessions);
    $response['nextSession'] = isset($sessions[$currentIndex+1]) ?? '';
    $response['prevSession'] = isset($sessions[$currentIndex-1]) ?? '';

    return $response;
}

/**
 * Get the subject data information.
 *
 * @param int $sessionID ID of the electrophysiology session
 *
 * @return array with the subject information
 */
function getSubjectData($sessionID)
{
    $subjectData = array();
    $timePoint   = \NDB_Factory::singleton()->timepoint(intval($sessionID));
    $candidate   = \NDB_Factory::singleton()->candidate($timePoint->getCandID());

    $subjectData['pscid']       = $candidate->getPSCID();
    $subjectData['dccid']       = $timePoint->getCandID();
    $subjectData['visit_label'] = $timePoint->getVisitLabel();
    $subjectData['sessionID']   = $sessionID;
    $subjectData['site']        = $timePoint->getPSC();
    $subjectData['dob']         = $candidate->getCandidateDoB();
    $subjectData['sex']         = $candidate->getCandidateSex();
    $subjectData['subproject']  = $timePoint->getData('SubprojectTitle');
    $subjectData['output_type'] = $_REQUEST['outputType'];

    return $subjectData;
}

/**
 * Get the list of electrophysiology recordings with their recording information.
 *
 * @param int $sessionID ID of the electrophysiology session
 *
 * @return array with the file collection
 */
function getFilesData($sessionID)
{
    $db = \NDB_Factory::singleton()->database();

    $fileCollection = array();
    $outputType     = $_REQUEST['outputType'];
    $params['SID']  = $sessionID;
    $query          = 'SELECT 
                         pf.PhysiologicalFileID, 
                         pf.FilePath 
                       FROM 
                         physiological_file pf ';
    //WHERE SessionID=:SID

    if ($outputType != 'all_types') {
        $query .= 'LEFT JOIN physiological_output_type pot ON ';
        $query .= 'pf.PhysiologicalOutputTypeID=pot.PhysiologicalOutputTypeID ';
        $query .= 'WHERE SessionID=:SID ';
        if ($outputType == 'raw') {
            $query .= 'AND pot.OutputTypeName = "raw"';
        } else if ($outputType == 'derivatives') {
            $query .= 'AND pot.OutputTypeName = "derivatives"';
        }
    } else {
        $query .= "WHERE SessionID=:SID";
    }

    $physiologicalFiles = $db->pselect($query, $params);

    foreach ($physiologicalFiles as $file) {
        $fileSummary         = array();
        $physiologicalFileID = $file['PhysiologicalFileID'];
        $physiologicalFile   = $file['FilePath'];
        $physioFileObj       = new \ElectrophysioFile($physiologicalFileID);
        $fileName            = basename($physioFileObj->getParameter('FilePath'));

        // -----------------------------------------------------
        // Create a file summary object with file's information
        // -----------------------------------------------------

        // get the file name

        $fileSummary['name'] = $fileName;

        // get the task frequency information

        $sampling  = $physioFileObj->getParameter('SamplingFrequency');
        $powerline = $physioFileObj->getParameter('PowerLineFrequency');

        $fileSummary['task']['frequency']['sampling']  = $sampling;
        $fileSummary['task']['frequency']['powerline'] = $powerline;

        // get the task channel information

        $eegChannelCount = $physioFileObj->getParameter('EEGChannelCount');
        $eogChannelCount = $physioFileObj->getParameter('EOGChannelCount');
        $ecgChannelCount = $physioFileObj->getParameter('ECGChannelCount');
        $emgChannelCount = $physioFileObj->getParameter('EMGChannelCount');

        $fileSummary['task']['channel'][] = array(
                                             'name'  => 'EEG Channel Count',
                                             'value' => $eegChannelCount,
                                            );
        $fileSummary['task']['channel'][] = array(
                                             'name'  => 'EOG Channel Count',
                                             'value' => $eogChannelCount,
                                            );
        $fileSummary['task']['channel'][] = array(
                                             'name'  => 'ECG Channel Count',
                                             'value' => $ecgChannelCount,
                                            );
        $fileSummary['task']['channel'][] = array(
                                             'name'  => 'EMG Channel Count',
                                             'value' => $emgChannelCount,
                                            );

        // get the task reference

        $reference = $physioFileObj->getParameter('EEGReference');

        $fileSummary['task']['reference'] = $reference;

        // get the file's details

        $taskDesc         = $physioFileObj->getParameter('TaskDescription');
        $instructions     = $physioFileObj->getParameter('Instructions');
        $placement        = $physioFileObj->getParameter('EEGPlacementScheme');
        $triggerCount     = $physioFileObj->getParameter('TriggerChannelCount');
        $recordingType    = $physioFileObj->getParameter('Recording_type');
        $cogAtlasID       = $physioFileObj->getParameter('CogAtlasID');
        $cogPoid          = $physioFileObj->getParameter('CogPOID');
        $instituteName    = $physioFileObj->getParameter('InstitutionName');
        $intituteAddress  = $physioFileObj->getParameter('InstitutionAddress');
        $miscChannelCount = $physioFileObj->getParameter('MiscChannelCount');
        $manufacturer     = $physioFileObj->getParameter('Manufacturer');
        $modelName        = $physioFileObj->getParameter('ManufacturerModelName');
        $capManufacturer  = $physioFileObj->getParameter('ManufacturerCapModelName');
        $capModelName     = $physioFileObj->getParameter('ManufacturerCapModelName');
        $hardwareFilters  = $physioFileObj->getParameter('HardwareFilters');
        $duration         = $physioFileObj->getParameter('RecordingDuration');
        $epochLength      = $physioFileObj->getParameter('EpochLength');
        $softwareVersion  = $physioFileObj->getParameter('DeviceSoftwareVersion');
        $serialNumber     = $physioFileObj->getParameter('DeviceSerialNumber');
        $artefactDesc     = $physioFileObj->getParameter('SubjectArtefactDescription');

        $fileSummary['details']['task']['description']     = $taskDesc;
        $fileSummary['details']['instructions']            = $instructions;
        $fileSummary['details']['eeg']['ground']           = '';
        $fileSummary['details']['eeg']['placement_scheme'] = $placement;
        $fileSummary['details']['trigger_count']           = $triggerCount;
        $fileSummary['details']['record_type']            = $recordingType;
        $fileSummary['details']['cog']['atlas_id']        = $cogAtlasID;
        $fileSummary['details']['cog']['poid']            = $cogPoid;
        $fileSummary['details']['institution']['name']    = $instituteName;
        $fileSummary['details']['institution']['address'] = $intituteAddress;
        $fileSummary['details']['misc']['channel_count']  = $miscChannelCount;
        $fileSummary['details']['manufacturer']['name']   = $manufacturer;
        $fileSummary['details']['manufacturer']['model_name'] = $modelName;
        $fileSummary['details']['cap']['manufacturer']        = $capManufacturer;
        $fileSummary['details']['cap']['model_name']          = $capModelName;
        $fileSummary['details']['hardware_filters']           = $hardwareFilters;
        $fileSummary['details']['recording_duration']         = $duration;
        $fileSummary['details']['epoch_length']            = $epochLength;
        $fileSummary['details']['device']['version']       = $softwareVersion;
        $fileSummary['details']['device']['serial_number'] = $serialNumber;
        $fileSummary['details']['subject_artefact_description'] = $artefactDesc;

        // get the links to the files for downloads

        $links = getDownloadLinks($physiologicalFileID, $physiologicalFile);

        $fileSummary['downloads'] = $links;

        $fileCollection[]['file'] = $fileSummary;
    }

    return $fileCollection;
}

/**
 * Gets the download link for the files associated to the electrophysiology
 * file (channels.tsv, electrodes.tsv, task events.tsv...)
 *
 * @param int    $physiologicalFileID FileID of the electrophysiology file
 * @param string $physiologicalFile   electrophysiology file's relative path
 *
 * @return array array with the path to the different files associated to the
 *               electrophysiology file
 */
function getDownloadlinks($physiologicalFileID, $physiologicalFile)
{
    $db = \NDB_Factory::singleton()->database();

    $params['PFID']  = $physiologicalFileID;
    $downloadLinks   = array();
    $downloadLinks[] = array(
                        'type' => 'physiological_file',
                        'file' => $physiologicalFile,
                       );

    $queries = [
                'physiological_electrode'  => 'physiological_electrode_file',
                'physiological_channel'    => 'physiological_channel_file',
                'physiological_task_event' => 'physiological_task_event_file',
                'physiological_archive'    => 'all_files',
               ];

    foreach ($queries as $query_key => $query_value) {
        $query_statement = "SELECT 
                              DISTINCT(FilePath), '$query_value' AS FileType
                            FROM 
                              $query_key 
                            WHERE 
                              PhysiologicalFileID=:PFID";
        $query_statement = $db->pselectRow($query_statement, $params);
        if (isset($query_statement['FileType'])) {
            $downloadLinks[] = array(
                                'type' => $query_statement['FileType'],
                                'file' => $query_statement['FilePath'],
                               );
        } else {
            $downloadLinks[] = array(
                                'type' => $query_value,
                                'file' => '',
                               );
        }
    }

    $queryFDT = "SELECT 
                   Value AS FilePath, 
                   'physiological_fdt_file' AS FileType 
                 FROM 
                   physiological_parameter_file 
                   JOIN parameter_type AS pt USING (ParameterTypeID) 
                 WHERE 
                   pt.Name='fdt_file' 
                   AND PhysiologicalFileID=:PFID";
    $queryFDT = $db->pselectRow($queryFDT, $params);
    if (isset($queryFDT['FileType'])) {
        $downloadLinks[] = array(
                            'type' => $queryFDT['FileType'],
                            'file' => $queryFDT['FilePath'],
                           );
    } else {
        $downloadLinks[] = array(
                            'type' => 'physiological_fdt_file',
                            'file' => '',
                           );
    }

    return $downloadLinks;
}
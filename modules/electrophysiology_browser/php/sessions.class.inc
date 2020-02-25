<?php declare(strict_types=1);

/**
 * This class features the code for the menu portion of the LORIS
 * electrophysiology browser module.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Electrophysiology
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */
namespace LORIS\electrophysiology_browser;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\electrophysiology_browser\Models\ElectrophysioFile;


/**
 * Provides the PHP code for the menu filter for the electrophysiology browser
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Sessions
 * @author     Loris team <info-loris.mni@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://github.com/aces/Loris
 */

class Sessions extends \NDB_Page
{

    public $skipTemplate = true; // stops from looking for a smarty template
    protected $timepoint;

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('electrophysiology_browser_view_allsites')
                || ($user->hasCenter($this->timepoint->getCenterID())
                && $user->hasPermission('electrophysiology_browser_view_site')
            )
        );
    }

    /**
     * Handles a login request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path       = $request->getUri()->getPath();
        $parameters = $request->getQueryParams();
        $user       = $request->getAttribute('user');

        $matches = [];

        // check that the session ID is of type integer
        if (preg_match('#/sessions/(\d+)#', $path, $matches) !== 1) {
            return (new \LORIS\Middleware\PageDecorationMiddleware($user))
                ->process(
                    $request,
                    new \LORIS\Http\StringStream("Invalid session")
                )->withStatus(404);
        }

        $session_id = intval($matches[1]);
        try {
            $this->timepoint = \NDB_Factory::singleton()->timepoint(
                $session_id
            );
        } catch(\LorisException $e) {
            return (new \LORIS\Middleware\PageDecorationMiddleware($user))
                ->process(
                    $request,
                    new \LORIS\Http\StringStream("Session not found")
                )->withStatus(404);
        }

        if (!$this->_hasAccess($user)) {
            return (new \LORIS\Middleware\PageDecorationMiddleware($user))
                ->process(
                    $request,
                    new \LORIS\Http\StringStream("Permission denied")
                )->withStatus(403);
        }

        $accepted_hdrs = explode(
            ',',
            $request->getHeaderLine('Accept')
        );

        if (in_array('text/html', $accepted_hdrs, true)) {
            return parent::handle($request);
        }

        if ($request->getMethod() != 'GET') {
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET']
            ));
        }

        if (!isset($parameters['outputType'])) {
            return (new \LORIS\Http\Response\JSON\BadRequest(
                'outputType required'
            ));
        }

        $outputType = $parameters['outputType'];
        if (!in_array($outputType, ['raw', 'derivatives', 'all_types'])) {
            return (new \LORIS\Http\Response\JSON\BadRequest(
                'invalid output type'
            ));
        }

        return $this->getSessionData($session_id, $outputType);
    }


    /**
     * Get the session data information.
     *
     * @param int    $sessionID  ID of the session to display
     * @param string $outputType output type to be displayed
     *
     * @return ResponseInterface The JSON response
     */
    function getSessionData($sessionID, $outputType)
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

        $response = [];

        $sessions            = $db->pselect($query, []);
        $sessions            = array_column($sessions, 'SessionID');
        $response['patient'] = $this->getSubjectData($outputType);
        $response['database']    = array_values(
            $this->getFilesData($sessionID, $outputType)
        );
        $response['sessions']    = $sessions;
        $currentIndex            = array_search($sessionID, $sessions);
        $response['nextSession'] = $sessions[$currentIndex+1] ?? '';
        $response['prevSession'] = $sessions[$currentIndex-1] ?? '';

        return new \LORIS\Http\Response\JSON\OK($response);
    }


    /**
     * Get the subject data information.
     *
     * @param string $outputType output type to be displayed
     *
     * @return array with the subject information
     */
    function getSubjectData($outputType)
    {
        $subjectData = [];
        $candidate   = \NDB_Factory::singleton()->candidate(
            $this->timepoint->getCandID()
        );

        $subjectData['pscid']       = $candidate->getPSCID();
        $subjectData['dccid']       = $candidate->getCandID();
        $subjectData['visit_label'] = $this->timepoint->getVisitLabel();
        $subjectData['sessionID']   = $this->timepoint->getSessionID();
        $subjectData['site']        = $this->timepoint->getPSC();
        $subjectData['dob']         = $candidate->getCandidateDoB();
        $subjectData['sex']         = $candidate->getCandidateSex();
        $subjectData['subproject']  = $this->timepoint->getData('SubprojectTitle');
        $subjectData['output_type'] = $outputType;

        return $subjectData;
    }



    /**
     * Get the list of electrophysiology recordings with their recording information.
     *
     * @param int    $sessionID  ID of the electrophysiology session
     * @param string $outputType output type to be displayed
     *
     * @return array with the file collection
     */
    function getFilesData(int $sessionID, string $outputType)
    {
        $db = \NDB_Factory::singleton()->database();

        $fileCollection = [];
        $params         = [];
        $params['SID']  = $sessionID;
        $query          = 'SELECT 
                         pf.PhysiologicalFileID, 
                         pf.FilePath 
                       FROM 
                         physiological_file pf ';

        if ($outputType != 'all_types') {
            $query        .= 'LEFT JOIN physiological_output_type pot ON ';
            $query        .= 'pf.PhysiologicalOutputTypeID='
                .'pot.PhysiologicalOutputTypeID ';
            $query        .= 'WHERE SessionID=:SID ';
            $query        .= 'AND pot.OutputTypeName = :OTN ';
            $params['OTN'] = $outputType;
        } else {
            $query .= "WHERE SessionID=:SID";
        }

        $physiologicalFiles = $db->pselect($query, $params);

        foreach ($physiologicalFiles as $file) {
            $fileSummary         = [];
            $physiologicalFileID = $file['PhysiologicalFileID'];
            $physiologicalFile   = $file['FilePath'];
            $physioFileObj       = new ElectrophysioFile(
                intval($physiologicalFileID)
            );
            $fileName            = basename(
                $physioFileObj->getParameter('FilePath')
            );

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

            $fileSummary['task']['channel'][] = [
                'name'  => 'EEG Channel Count',
                'value' => $eegChannelCount,
            ];
            $fileSummary['task']['channel'][] = [
                'name'  => 'EOG Channel Count',
                'value' => $eogChannelCount,
            ];
            $fileSummary['task']['channel'][] = [
                'name'  => 'ECG Channel Count',
                'value' => $ecgChannelCount,
            ];
            $fileSummary['task']['channel'][] = [
                'name'  => 'EMG Channel Count',
                'value' => $emgChannelCount,
            ];

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
            $modelName        = $physioFileObj->getParameter(
                'ManufacturerModelName'
            );
            $capManufacturer  = $physioFileObj->getParameter(
                'ManufacturerCapModelName'
            );
            $capModelName     = $physioFileObj->getParameter(
                'ManufacturerCapModelName'
            );
            $hardwareFilters  = $physioFileObj->getParameter('HardwareFilters');
            $duration         = $physioFileObj->getParameter('RecordingDuration');
            $epochLength      = $physioFileObj->getParameter('EpochLength');
            $softwareVersion  = $physioFileObj->getParameter(
                'DeviceSoftwareVersion'
            );
            $serialNumber     = $physioFileObj->getParameter('DeviceSerialNumber');
            $artefactDesc     = $physioFileObj->getParameter(
                'SubjectArtefactDescription'
            );

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

            $links = $this->getDownloadLinks(
                intval($physiologicalFileID),
                $physiologicalFile
            );

            $fileSummary['downloads'] = $links;

            $fileCollection[]['file'] = $fileSummary;
        }

        return $fileCollection;
    }


    /**
     * Gets the download link for the files associated to the electrophysiology
     * file (channels.tsv, electrodes.tsv, task events.tsv...)
     *
     * @param int    $physioFileID FileID of the electrophysiology file
     * @param string $physioFile   electrophysiology file's relative path
     *
     * @return array array with the path to the different files associated to the
     *               electrophysiology file
     */
    function getDownloadlinks(int $physioFileID, string $physioFile): array
    {
        $db = \NDB_Factory::singleton()->database();

        $params          = [];
        $params['PFID']  = $physioFileID;
        $downloadLinks   = [];
        $downloadLinks[] = [
            'type' => 'physiological_file',
            'file' => $physioFile,
        ];

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
                $downloadLinks[] = [
                    'type' => $query_statement['FileType'],
                    'file' => $query_statement['FilePath'],
                ];
            } else {
                $downloadLinks[] = [
                    'type' => $query_value,
                    'file' => '',
                ];
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
            $downloadLinks[] = [
                'type' => $queryFDT['FileType'],
                'file' => $queryFDT['FilePath'],
            ];
        } else {
            $downloadLinks[] = [
                'type' => 'physiological_fdt_file',
                'file' => '',
            ];
        }

        return $downloadLinks;
    }

    /**
     * Get JS Dependencies
     *
     * @return array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $depends = parent::getJSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = array_merge(
            $depends,
            [
                $baseurl
                . '/electrophysiology_browser/js/electrophysiologySessionView.js',
            ]
        );
        return $depends;
    }

}

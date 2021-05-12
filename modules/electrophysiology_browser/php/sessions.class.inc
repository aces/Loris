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
    protected $sessionID;
    protected $candidate;

    /**
     * Determine whether the user has permission to view this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool whether the user has access
     */
    function _hasAccess(\User $user) : bool
    {
        return (($user->hasPermission('electrophysiology_browser_view_allsites')
                || ($user->hasCenter($this->timepoint->getCenterID())
                && $user->hasPermission('electrophysiology_browser_view_site'))
            ) && $user->hasProject($this->timepoint->getProject()->getId()));
    }

    /**
     * Load the required variables in order to check that the  user
     * has access to the session.
     *
     * @param \User                  $user    The user to load the resources for
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @throws \NotFound If the session id is non-numerical
     * @throws \LorisException  If the session is not found
     *
     * @return void
     */
    public function loadResources(
        \User $user, ServerRequestInterface $request
    ) : void {

        $path    = $request->getUri()->getPath();
        $matches = [];

        if (preg_match('#/sessions/(\d+)#', $path, $matches) !== 1) {
            throw new \NotFound("Invalid session");
        }
        $session_id = intval($matches[1]);

        try {
            $this->timepoint = \NDB_Factory::singleton()->timepoint(
                new \SessionID(strval($session_id))
            );
            $this->sessionID = $session_id;
        } catch(\LorisException $e) {
            throw new \NotFound("Session not found");
        }

        parent::loadResources($user, $request);
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
        $parameters = $request->getQueryParams();
        $user       = $request->getAttribute('user');

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
                'OutputType required'
            ));
        }

        $outputType = $parameters['outputType'];
        if (!in_array($outputType, ['raw', 'derivative', 'all_types'])) {
            return (new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid output type'
            ));
        }

        return $this->getSessionData($outputType);
    }


    /**
     * Get the session data information.
     *
     * @param string $outputType output type to be displayed
     *
     * @return ResponseInterface The JSON response
     */
    function getSessionData($outputType)
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
            $this->getFilesData($outputType)
        );
        $response['sessions']    = $sessions;
        $currentIndex            = array_search($this->sessionID, $sessions);
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
     * @param string $outputType output type to be displayed
     *
     * @return array with the file collection
     */
    function getFilesData(string $outputType)
    {
        $db = \NDB_Factory::singleton()->database();

        $fileCollection = [];
        $params         = [];
        $params['SID']  = $this->sessionID;
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

            // get the summary frequency information

            $sampling  = $physioFileObj->getParameter('SamplingFrequency');
            $powerline = $physioFileObj->getParameter('PowerLineFrequency');

            $fileSummary['summary']['frequency']['sampling'] = [
                'name'  => 'Sampling Frequency',
                'value' => $sampling,
            ];

            $fileSummary['summary']['frequency']['powerline'] = [
                'name'  => 'Powerline Frequency',
                'value' => $powerline,
            ];

            // get the summary channel information

            if ($physioFileObj->getParameter('Modality') == 'ieeg') {
                $ecogChannelCount = $physioFileObj->getParameter('ECOGChannelCount');
                $seegChannelCount = $physioFileObj->getParameter('SEEGChannelCount');

                $fileSummary['summary']['channel_count'][] = [
                    'name'  => 'ECOG Channel Count',
                    'value' => $ecogChannelCount,
                ];
                $fileSummary['summary']['channel_count'][] = [
                    'name'  => 'SEEG Channel Count',
                    'value' => $seegChannelCount,
                ];
            }

            $eegChannelCount = $physioFileObj->getParameter('EEGChannelCount');
            $eogChannelCount = $physioFileObj->getParameter('EOGChannelCount');
            $ecgChannelCount = $physioFileObj->getParameter('ECGChannelCount');
            $emgChannelCount = $physioFileObj->getParameter('EMGChannelCount');

            $fileSummary['summary']['channel_count'][] = [
                'name'  => 'EEG Channel Count',
                'value' => $eegChannelCount,
            ];
            $fileSummary['summary']['channel_count'][] = [
                'name'  => 'EOG Channel Count',
                'value' => $eogChannelCount,
            ];
            $fileSummary['summary']['channel_count'][] = [
                'name'  => 'ECG Channel Count',
                'value' => $ecgChannelCount,
            ];
            $fileSummary['summary']['channel_count'][] = [
                'name'  => 'EMG Channel Count',
                'value' => $emgChannelCount,
            ];

            // get the summary reference

            if ($physioFileObj->getParameter('Modality') == 'ieeg') {
                $reference = $physioFileObj->getParameter('iEEGReference');
            } else {
                $reference = $physioFileObj->getParameter('EEGReference');
            }

            $fileSummary['summary']['reference'] = [
                'name'  => 'Reference',
                'value' => $reference,
            ];

            // get the file's details

            if ($physioFileObj->getParameter('Modality') == 'ieeg') {
                $placement = $physioFileObj->getParameter('iEEGPlacementScheme');
                $ground    = $physioFileObj->getParameter('iEEGGround');
                $electrodeManufacturer           = [
                    'name'  => 'Electrode Manufacturer',
                    'value' => $physioFileObj->getParameter('ElectrodeManufacturer'),
                ];
                $electrodeManufacturersModelName = [
                    'name'  => 'Electrode Manufacturer\'s Model Name',
                    'value' => $physioFileObj->getParameter(
                        'ElectrodeManufacturersModelName'
                    ),
                ];
            } else {
                $placement = $physioFileObj->getParameter('EEGPlacementScheme');
                $ground    = $physioFileObj->getParameter('EEGGround');
                $electrodeManufacturer           = [
                    'name'  => 'Cap Manufacturer',
                    'value' => $physioFileObj->getParameter('CapManufacturer'),
                ];
                $electrodeManufacturersModelName = [
                    'name'  => 'Cap Manufacturer\'s Model Name',
                    'value' => $physioFileObj->getParameter(
                        'CapManufacturersModelName'
                    ),
                ];

            }

            $taskName          = $physioFileObj->getParameter('TaskName');
            $taskDesc          = $physioFileObj->getParameter('TaskDescription');
            $instructions      = $physioFileObj->getParameter('Instructions');
            $headCircumference = $physioFileObj->getParameter('HeadCircumference');
            $triggerCount      = $physioFileObj->getParameter('TriggerChannelCount');
            $recordingType     = $physioFileObj->getParameter('Recording_type');
            $cogAtlasID        = $physioFileObj->getParameter('CogAtlasID');
            $cogPoid           = $physioFileObj->getParameter('CogPOID');
            $instituteName     = $physioFileObj->getParameter('InstitutionName');
            $intituteAddress   = $physioFileObj->getParameter('InstitutionAddress');
            $miscChannelCount  = $physioFileObj->getParameter('MiscChannelCount');
            $manufacturer      = $physioFileObj->getParameter('Manufacturer');
            $modelName         = $physioFileObj->getParameter(
                'ManufacturersModelName'
            );
            $hardwareFilters   = $physioFileObj->getParameter('HardwareFilters');
            $duration          = $physioFileObj->getParameter('RecordingDuration');
            $epochLength       = $physioFileObj->getParameter('EpochLength');
            $softwareVersions  = $physioFileObj->getParameter('SoftwareVersions');
            $softwareFilters   = $physioFileObj->getParameter('SoftwareFilters');
            $serialNumber      = $physioFileObj->getParameter('DeviceSerialNumber');
            $artefactDesc      = $physioFileObj->getParameter(
                'SubjectArtefactDescription'
            );
            $chunksUrl         = $physioFileObj->getParameter(
                'electrophyiology_chunked_dataset_path'
            );

            $fileSummary['details'] = [
                [
                    'name'  => 'Task Name',
                    'value' => $taskName,
                ],
                [
                    'name'  => 'Task Description',
                    'value' => $taskDesc,
                ],
                [
                    'name'  => 'Instructions',
                    'value' => $instructions,
                ],
                [
                    'name'  => 'Recording Type',
                    'value' => $recordingType,
                ],
                [
                    'name'  => 'Recording Duration',
                    'value' => $duration,
                ],
                [
                    'name'  => 'Epoch Length',
                    'value' => $epochLength,
                ],
                [
                    'name'  => 'Subject Artefact Description',
                    'value' => $artefactDesc,
                ],
                [
                    'name'  => 'Head Circumference',
                    'value' => $headCircumference,
                ],
                [
                    'name'  => 'Placement Scheme',
                    'value' => $placement,
                ],
                [
                    'name'  => 'Ground',
                    'value' => $ground,
                ],
                [
                    'name'  => 'Trigger Channel Count',
                    'value' => $triggerCount,
                ],
                [
                    'name'  => 'Misc Channel Count',
                    'value' => $miscChannelCount,
                ],
                [
                    'name'  => 'CogAtlas ID',
                    'value' => $cogAtlasID,
                ],
                [
                    'name'  => 'CogPO ID',
                    'value' => $cogPoid,
                ],
                [
                    'name'  => 'Institution Name',
                    'value' => $instituteName,
                ],
                [
                    'name'  => 'Institution Address',
                    'value' => $intituteAddress,
                ],
                [
                    'name'  => 'Manufacturer',
                    'value' => $manufacturer,
                ],
                [
                    'name'  => 'Manufacturers Model Name',
                    'value' => $modelName,
                ],
                $electrodeManufacturer,
                $electrodeManufacturersModelName,
                [
                    'name'  => 'Device Serial Number',
                    'value' => $serialNumber,
                ],
                [
                    'name'  => 'Hardware Filters',
                    'value' => $hardwareFilters,
                ],
                [
                    'name'  => 'Software Versions',
                    'value' => $softwareVersions,
                ],
                [
                    'name'  => 'Software Filters',
                    'value' => $softwareFilters,
                ],
            ];

            if ($physioFileObj->getParameter('Modality') == 'ieeg') {
                $fileSummary['details'][] = [
                    'name'  => 'DC Offset Correction',
                    'value' => $physioFileObj->getParameter('DCOffsetCorrection'),
                ];

                $fileSummary['details'][] = [
                    'name'  => 'Electrode Groups',
                    'value' => $physioFileObj->getParameter('ElectrodeGroups'),
                ];

                $fileSummary['details'][] = [
                    'name'  => 'Electrical Stimulation',
                    'value' => $physioFileObj->getParameter('ElectricalStimulation'),
                ];

                $fileSummary['details'][] = [
                    'name'  => 'Electrical Stimulation Parameters',
                    'value' => $physioFileObj->getParameter(
                        'ElectricalStimulationParameters'
                    ),
                ];
            }

            // get the links to the files for downloads

            $links = $this->getDownloadLinks(
                intval($physiologicalFileID),
                $physiologicalFile
            );

            $fileSummary['downloads']  = $links;
            $fileSummary['chunks_url'] = $chunksUrl;

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
            'type'  => 'physiological_file',
            'file'  => $physioFile,
            'label' => 'EEG File',
        ];

        $queries = [
            'physiological_electrode'          => 'physiological_electrode_file',
            'physiological_channel'            => 'physiological_channel_file',
            'physiological_task_event'         => 'physiological_task_event_file',
            'physiological_annotation_archive' => 'physiological_annotation_files',
            'physiological_archive'            => 'all_files',
        ];

        $labels = [
            'physiological_electrode_file'   => 'Electrodes',
            'physiological_channel_file'     => 'Channels',
            'physiological_task_event_file'  => 'Events',
            'physiological_annotation_files' => 'Annotations',
            'all_files'                      => 'All Files',
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
                    'type'  => $query_statement['FileType'],
                    'file'  => $query_statement['FilePath'],
                    'label' => $labels[$query_statement['FileType']]
                ];
            } else {
                $downloadLinks[] = [
                    'type'  => $query_value,
                    'file'  => '',
                    'label' => $labels[$query_value],
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
                'type'  => $queryFDT['FileType'],
                'file'  => $queryFDT['FilePath'],
                'label' => '',
            ];
        } else {
            $downloadLinks[] = [
                'type'  => 'physiological_fdt_file',
                'file'  => '',
                'label' => '',
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

    /**
     * Get CSS Dependencies
     *
     * @return array
     */
    function getCSSDependencies()
    {
        $depends = parent::getCSSDependencies();
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = array_merge(
            $depends,
            [
                $baseurl
                . '/electrophysiology_browser/css/electrophysiology_browser.css',
            ]
        );
        return $depends;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                'Electrophysiology Browser',
                '/electrophysiology_browser'
            ),
            new \LORIS\Breadcrumb(
                'View Session',
                "/electrophysiology_browser/sessions/$this->sessionID"
            )
        );
    }

}

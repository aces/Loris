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

use LORIS\electrophysiology_browser\Models\DatasetTags;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use LORIS\electrophysiology_browser\Models\ElectrophysioFile;
use LORIS\electrophysiology_browser\Models\ElectrophysioEvents;

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
        } catch (\LorisException $e) {
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

        $db = $this->loris->getDatabaseConnection();

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
                AND pf.FileType IN ('.
            '"bdf", "cnt", "edf", "set", "vhdr", "vsm", "archive"'.
            ') ORDER BY pf.SessionID';

        $response = [];

        $sessions            = $db->pselect($query, []);
        $sessions            = array_column(
            iterator_to_array($sessions),
            'SessionID'
        );
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
        $subjectData['cohort']      = $this->timepoint->getData('CohortTitle');
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
        $db = $this->loris->getDatabaseConnection();

        $fileCollection = [];
        $params         = [];
        $params['SID']  = $this->sessionID;
        $query          = 'SELECT
                         pf.PhysiologicalFileID
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
            $query .= "WHERE SessionID=:SID AND pf.ParentID IS NULL";
        }

        $physiologicalFiles = $db->pselect($query, $params);

        foreach ($physiologicalFiles as $file) {
            $fileCollection[]['file'] = $this->getSummary($file);
        }

        return $fileCollection;
    }


    /**
     * Get the electrophysiology recording summary metadata.
     *
     * @param array $file electrophysiology file data
     *
     * @return array with the file metadata
     */
    function getSummary(array $file) : array
    {
        $db = $this->loris->getDatabaseConnection();

        $fileSummary     = [];
        $physioFileID    = intval($file['PhysiologicalFileID']);
        $physioFileObj   = new ElectrophysioFile($this->loris, $physioFileID);
        $physioFile      = $physioFileObj->getParameter('FilePath');
        $modality        = $physioFileObj->getParameter('Modality');
        $modalityPrefix  = $modality === 'ieeg' ? 'iEEG' : 'EEG';
        $modalityCapName = $modality === 'ieeg' ? 'Electrode' : 'Cap';

        $fileSummary['id']   = $physioFileID;
        $fileSummary['name'] = basename($physioFile);

        // Summary

        $channels = ['EEG', 'EOG', 'ECG', 'EMG'];
        if ($modality === 'ieeg') {
            $channels = array_merge(['ECOG', 'SEEG'], $channels);
        }

        $fileSummary['summary'] = [
            [
                'name'  => 'Sampling Frequency',
                'value' => $physioFileObj->getParameter('SamplingFrequency'),
            ],
        ];
        $fileSummary['summary'] = array_merge(
            $fileSummary['summary'],
            array_map(
                fn($channel) =>
                [
                    'name'  => $channel.' Channel Count',
                    'value' => $physioFileObj->getParameter(
                        $channel.'ChannelCount'
                    ),
                ],
                $channels
            )
        );
        $fileSummary['summary'] = array_merge(
            $fileSummary['summary'],
            [
                [
                    'name'  => 'Reference',
                    'value' => $physioFileObj->getParameter(
                        $modalityPrefix.'Reference'
                    ),
                ],
                [
                    'name'  => 'Powerline Frequency',
                    'value' => $physioFileObj->getParameter('PowerLineFrequency'),
                ],
            ]
        );

        // Details

        $fileSummary['details'] = [
            [
                'name'  => 'Task Name',
                'value' => $physioFileObj->getParameter('TaskName'),
            ],
            [
                'name'  => 'Task Description',
                'value' => $physioFileObj->getParameter('TaskDescription'),
            ],
            [
                'name'  => 'Instructions',
                'value' => $physioFileObj->getParameter('Instructions'),
            ],
            [
                'name'  => 'Recording Type',
                'value' => $physioFileObj->getParameter('RecordingType'),
            ],
            [
                'name'  => 'Recording Split Count',
                'value' => $physioFileObj->getParameter('SplitCount'),
            ],
            [
                'name'  => 'Recording Duration',
                'value' => $physioFileObj->getParameter('RecordingDuration'),
            ],
            [
                'name'  => 'Epoch Length',
                'value' => $physioFileObj->getParameter('EpochLength'),
            ],
            [
                'name'  => 'Subject Artefact Description',
                'value' => $physioFileObj->getParameter(
                    'SubjectArtefactDescription'
                ),
            ],
            [
                'name'  => 'Head Circumference',
                'value' => $physioFileObj->getParameter('HeadCircumference'),
            ],
            [
                'name'  => 'Placement Scheme',
                'value' =>  $physioFileObj->getParameter(
                    $modalityPrefix.'PlacementScheme'
                ),
            ],
            [
                'name'  => 'Ground',
                'value' => $physioFileObj->getParameter($modalityPrefix.'Ground'),
            ],
            [
                'name'  => 'Trigger Channel Count',
                'value' => $physioFileObj->getParameter('TriggerChannelCount'),
            ],
            [
                'name'  => 'Misc Channel Count',
                'value' => $physioFileObj->getParameter('MiscChannelCount'),
            ],
            [
                'name'  => 'CogAtlas ID',
                'value' => $physioFileObj->getParameter('CogAtlasID'),
            ],
            [
                'name'  => 'CogPO ID',
                'value' => $physioFileObj->getParameter('CogPOID'),
            ],
            [
                'name'  => 'Institution Name',
                'value' => $physioFileObj->getParameter('InstitutionName'),
            ],
            [
                'name'  => 'Institution Address',
                'value' => $physioFileObj->getParameter('InstitutionAddress'),
            ],
            [
                'name'  => 'Manufacturer',
                'value' => $physioFileObj->getParameter('Manufacturer'),
            ],
            [
                'name'  => 'Manufacturers Model Name',
                'value' => $physioFileObj->getParameter(
                    'ManufacturersModelName'
                ),
            ],
            [
                'name'  => $modalityCapName.' Manufacturer',
                'value' => $physioFileObj->getParameter(
                    $modalityCapName.'Manufacturer'
                ),
            ],
            [
                'name'  => $modalityCapName.' Manufacturer\'s Model Name',
                'value' => $physioFileObj->getParameter(
                    $modalityCapName.'ManufacturersModelName'
                ),
            ],
            [
                'name'  => 'Device Serial Number',
                'value' => $physioFileObj->getParameter('DeviceSerialNumber'),
            ],
            [
                'name'  => 'Hardware Filters',
                'value' => $physioFileObj->getParameter('HardwareFilters'),
            ],
            [
                'name'  => 'Software Versions',
                'value' => $physioFileObj->getParameter('SoftwareVersions'),
            ],
            [
                'name'  => 'Software Filters',
                'value' => $physioFileObj->getParameter('SoftwareFilters'),
            ],
        ];

        if ($modality == 'ieeg') {
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

        $fileSummary['downloads']   = $this->getDownloadLinks($physioFileObj);
        $fileSummary['chunks_urls'] = $physioFileObj->getChunksURLs();

        $fileOutput = $db->pselectone(
            'SELECT pot.OutputTypeName
                FROM physiological_output_type pot
                INNER JOIN physiological_file AS pf
                ON pf.PhysiologicalFileID=:PFID
                AND pf.PhysiologicalOutputTypeID=pot.PhysiologicalOutputTypeID',
            ['PFID' => $physioFileID]
        );

        // Get the task's event data
        $events = new ElectrophysioEvents(
            $this->loris,
            $physioFileID
        );
        $fileSummary['events'] = $events->getData();

        $datasetTags = new DatasetTags(
            $this->loris,
            $physioFileID
        );
        $fileSummary['datasetTags'] = $datasetTags->getData();

        $fileSummary['epochsURL'] = $db->pselectOne(
            "SELECT FilePath
            FROM physiological_event_file
            WHERE PhysiologicalFileID=:physioFileID
            AND FileType='tsv'",
            ['physioFileID' => $physioFileID]
        );

        $fileSummary['output_type'] = $fileOutput;
        $fileSummary['splitData']   = $physioFileObj->getSplitData(0);

        // TODO: Fetch all relevant ones and merge beforehand (project_schema_rel?)
        $hedSchema = $db->pselect(
            "SELECT node.ID as id,
           node.ParentID as parentID,
           node.SchemaID as schemaID,
           node.Name as name,
           node.LongName as longName,
           node.Description as description,
           hs.Name as schemaName
           FROM hed_schema_nodes AS node
           LEFT JOIN hed_schema AS hs ON (hs.ID = node.SchemaID)",
            []
        );

        $fileSummary['hedSchema'] = $hedSchema;

        return $fileSummary;
    }

    /**
     * Gets the download link for all the electrophysiology files
     *
     * @param ElectrophysioFile $physioFile ElectrophysiologyFile instance
     *
     * @return array array with the path to the different files associated to the
     *               electrophysiology file
     */
    function getDownloadLinks(ElectrophysioFile $physioFile): array
    {
        $nSplit        = intval($physioFile->getParameter('SplitCount'));
        $downloadLinks = [];

        if ($nSplit === 0) {
            $downloadLinks[] = [
                'groupName' => '',
                'links'     => $this->getPhysioFileDownloadlinks($physioFile),
            ];
        } else {
            foreach (range(0, $nSplit-1) as $i) {
                $splitData = $physioFile->getSplitData($i);
                if (is_null($splitData)) {
                    continue;
                }

                $splitPhysioFile = $splitData['splitPhysioFile'];

                $downloadLinks[] = [
                    'groupName' => 'Split '.($i+1),
                    'links'     => $this->getPhysioFileDownloadlinks(
                        $splitPhysioFile
                    ),
                ];
            }
        }
        return $downloadLinks;
    }

    /**
     * Gets the download link for the files associated to a particular
     * electrophysiology file (channels.tsv, electrodes.tsv, task events.tsv...)
     *
     * @param ElectrophysioFile $physioFileObj ElectrophysiologyFile instance
     *
     * @return array array with the path to the different files associated to the
     *               electrophysiology file
     */
    function getPhysioFileDownloadlinks(ElectrophysioFile $physioFileObj): array
    {
        $physioFileID  = $physioFileObj->getParameter('PhysiologicalFileID');
        $physioFile    = $physioFileObj->getParameter('FilePath');
        $db            = $this->loris->getDatabaseConnection();
        $downloadLinks = [];

        $downloadLinks[] = [
            'type'  => 'physiological_file',
            'file'  => $physioFile,
            'label' => 'EEG File(s)',
        ];

        $queryFDT = "SELECT
            Value AS FilePath,
            'physiological_fdt_file' AS FileType
            FROM
            physiological_parameter_file
            JOIN parameter_type AS pt USING (ParameterTypeID)
            WHERE
            pt.Name='fdt_file'
            AND PhysiologicalFileID=:PFID";
        $queryFDT = $db->pselectRow($queryFDT, ['PFID' => $physioFileID]);
        if (isset($queryFDT['FileType'])) {
            $downloadLinks[] = [
                'type'  => $queryFDT['FileType'],
                'file'  => $queryFDT['FilePath'],
                'label' => '',
            ];
        }

        // Metadata

        $queries = [
            'physiological_electrode'     => 'physiological_electrode_file',
            'physiological_coord_system'  => 'physiological_coord_system_file',
            'physiological_channel'       => 'physiological_channel_file',
            'physiological_event_archive' => 'physiological_event_files',
            'physiological_archive'       => 'all_files',
        ];

        $labels = [
            'physiological_electrode_file'    => 'Electrodes',
            'physiological_coord_system_file' => 'Coordinate System',
            'physiological_channel_file'      => 'Channels',
            'physiological_event_files'       => 'Events',
            'all_files'                       => 'All Files',
        ];

        foreach ($queries as $query_key => $query_value) {
            // TODO: Revisit logic if we plan to support multiple electrode spaces
            if ($query_key == 'physiological_electrode') {
                // electrode filepath linked to coordinate system
                $query_statement = "SELECT DISTINCT (FilePath)
                        FROM physiological_electrode
                        JOIN physiological_coord_system_electrode_rel
                            USING (PhysiologicalElectrodeID)
                        WHERE PhysiologicalFileID=:PFID";
            } else if ($query_key == 'physiological_coord_system') {
                // coordinate system json
                $query_statement = "SELECT DISTINCT (FilePath)
                          FROM physiological_coord_system
                          JOIN physiological_coord_system_electrode_rel
                              USING (PhysiologicalCoordSystemID)
                          WHERE PhysiologicalFileID=:PFID";
            } else {
                // others metadata
                $query_statement = "SELECT DISTINCT FilePath
                    FROM $query_key
                    WHERE PhysiologicalFileID=:PFID";
            }
            $query_statement = $db->pselectRow(
                $query_statement,
                ['PFID' => $physioFileID]
            );

            if ($query_statement) {
                $downloadLinks[$query_value] = [
                    'file'  => $query_statement['FilePath'],
                    'label' => $labels[$query_value],
                ];
            } else {
                $downloadLinks[$query_value] = [
                    'file'  => '',
                    'label' => $labels[$query_value],
                ];
            }
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

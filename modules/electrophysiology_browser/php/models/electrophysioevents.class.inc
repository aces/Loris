<?php declare(strict_types=1);
namespace LORIS\electrophysiology_browser\Models;
use SodiumException;

/**
 * This object contains the methods to get
 * Electrophysiology events from the DB
 *
 * @category Electrophysiology
 * @package  Electrophysiology
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ElectrophysioEvents
{
    private int $_physioFileID;
    private array $_data;
    private \LORIS\LorisInstance $loris;

    /**
     * Construct an Event object
     *
     * @param \LORIS\LorisInstance $loris        The LORIS instance
     * @param integer              $physioFileID Electrophysiological file ID
     */
    function __construct(\LORIS\LorisInstance $loris, int $physioFileID)
    {
        $this->loris         = $loris;
        $this->_physioFileID = $physioFileID;
        $db = $this->loris->getDatabaseConnection();

        $taskEvents = iterator_to_array(
            $db->pselect(
                'SELECT te.*
                FROM physiological_task_event AS te
                JOIN physiological_event_file AS f
                ON f.EventFileID = te.EventFileID
                WHERE f.PhysiologicalFileID=:PFID AND f.FileType="tsv"',
                ['PFID' => $this->_physioFileID]
            )
        );

        $taskEventIDs = array_map(
            function ($taskEvent) {
                return $taskEvent['PhysiologicalTaskEventID'];
            },
            $taskEvents
        );

        $taskEventIDs = array_combine(
            array_map('intval', array_keys($taskEventIDs)),
            array_values($taskEventIDs)
        );

        $extraColumns = $db->pselect(
            'SELECT opt.*
                  FROM physiological_task_event_opt AS opt
                  WHERE opt.PhysiologicalTaskEventID IN ('
            . (
            count($taskEventIDs) > 0
                ? join(',', $taskEventIDs)
                : 'null'
            ) . ')',
            []
        );

        $hedTags = $db->pselect(
            'SELECT *
                  FROM physiological_task_event_hed_rel
                  WHERE PhysiologicalTaskEventID IN ('
            . (
            count($taskEventIDs) > 0
                ? join(',', $taskEventIDs)
                : 'null'
            ) . ')',
            []
        );

        $this->_data = [
            'instances'    => $taskEvents,
            'extraColumns' => $extraColumns,
            'hedTags'      => $hedTags
        ];
    }

    /**
     * Get data for the Electrophysiological events
     *
     * @return array The data array
     */
    function getData(): array
    {
        return $this->_data;
    }

    /**
     * Updates event tables when there is a POST request.
     * Will add new derivative files if none exist for the given instance.
     * Will either add new events or update existing ones.
     *
     * @param array    $instance_data Instance data
     * @param array    $metadata      Metadata
     * @param int|null $instance_id   InstanceID
     *
     * @return array
     */
    function update(
        array $instance_data,
        array $metadata,
        ?int $instance_id,
    ): array {

        $user = \User::singleton();
        $db   = $this->loris->getDatabaseConnection();

        if ($user->hasPermission('electrophysiology_browser_edit_annotations')) {

            //If no derivative files exist, must create new files
            $eventFileID = $db->pselect(
                "SELECT EventFileID
                      FROM physiological_task_event
                      WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $this->_physioFileID]
            );

            if (is_null($instance_id)) {
                // TODO: Support Instance INSERT
                $instance_id = 1;
            }

            $instance = [
                'Onset'    => $instance_data['onset'],
                'Duration' => $instance_data['duration'],
            ];

            // TODO: Support Event Instance Insert
            if (!empty($eventFileID)) {
                // TODO: VALIDATE HED
                $deletedTagIDs = $instance_data['deleted_hed'];
                $newTagIDs     = $instance_data['added_hed'];

                // Update physiological_task_event
                $db->update(
                    'physiological_task_event',
                    $instance,
                    ['PhysiologicalTaskEventID' => $instance_id]
                );

                // Update HED tags
                foreach ($deletedTagIDs as $deletedTagID) {
                    $db->delete(
                        'physiological_task_event_hed_rel',
                        [
                            'PhysiologicalTaskEventID' => $instance_id,
                            'ID'                       => $deletedTagID
                        ]
                    );
                }

                foreach ($newTagIDs as $newTagID) {
                    $db->insert(
                        'physiological_task_event_hed_rel',
                        [
                            'PhysiologicalTaskEventID' => $instance_id,
                            'HEDTagID'                 => $newTagID
                        ]
                    );
                }
                $db->update(
                    'physiological_event_file',
                    ['LastUpdate' => date("Y-m-d H:i:s")],
                    ['PhysiologicalFileID' => $this->_physioFileID]
                );
            }

            $taskEvent = iterator_to_array(
                $db->pselect(
                    'SELECT * FROM physiological_task_event
            WHERE PhysiologicalTaskEventID=:PTEID',
                    ['PTEID' => $instance_id]
                )
            );

            $extraColumns = $db->pselect(
                'SELECT opt.*
                  FROM physiological_task_event_opt AS opt
                  WHERE opt.PhysiologicalTaskEventID=:PTEID',
                ['PTEID' => $instance_id]
            );

            $hedTags = $db->pselect(
                'SELECT *
                  FROM physiological_task_event_hed_rel
                  WHERE PhysiologicalTaskEventID=:PTEID',
                ['PTEID' => $instance_id]
            );

            return [
                'instance'     => $taskEvent[0],
                'extraColumns' => $extraColumns,
                'hedTags'      => $hedTags
            ];
        }
        return [];
    }

    /**
     * Deletes one event instance
     *
     * @param int $physiologicalTaskEventID PhysiologicalTaskEventID
     *
     * @return void
     */
    function deleteEvent(int $physiologicalTaskEventID): void
    {
        $db =  $this->loris->getDatabaseConnection();

        $physioFileID = $db->pselectone(
            'SELECT PhysiologicalFileID
              FROM physiological_task_event
              WHERE PhysiologicalTaskEventID=:taskEventID',
            ['taskEventID' => $physiologicalTaskEventID]
        );

        // TODO: Check that this cascades properly to rel tables
        if ($this->_physioFileID == $physioFileID) {
            $db->delete(
                "physiological_task_event",
                ['PhysiologicalTaskEventID' => $physiologicalTaskEventID]
            );
        }
    }

    /**
     * Deletes one event's HED tag
     *
     * @param int $physiologicalTaskEventID PhysiologicalTaskEventID
     * @param int $hedTagID                 HEDTagID
     *
     * @return void
     */
    function deleteHEDTag(int $physiologicalTaskEventID, int $hedTagID): void
    {
        $db =  $this->loris->getDatabaseConnection();

        $physioFileID = $db->pselectone(
            'SELECT PhysiologicalFileID
              FROM physiological_task_event
              WHERE PhysiologicalTaskEventID=:taskEventID',
            ['taskEventID' => $physiologicalTaskEventID]
        );

        // TODO: Check that this cascades properly to rel tables
        if ($this->_physioFileID == $physioFileID) {
            $db->delete(
                "physiological_task_event_hed_rel",
                [
                    'PhysiologicalTaskEventID' => $physiologicalTaskEventID,
                    'HEDTagID'                 => $hedTagID
                ]
            );
        }
    }

    /**
     * Updates the event files associated with the given
     * physiological file ID
     *
     * @return void
     * @throws SodiumException
     */
    function updateFiles(): void
    {
        $db =  $this->loris->getDatabaseConnection();

        //Get data directory base path from Config
        $config  = \NDB_Factory::singleton()->config();
        $dataDir = $config->getSetting("dataDirBasepath");

        $tsv = iterator_to_array(
            $db->pselect(
                "SELECT
            EventFileID   AS id,
            FilePath      AS filePath,
            ProjectID     AS projectID,
            LastUpdate    AS lastUpdate,
            LastWritten   AS lastWritten
          FROM physiological_event_file
          WHERE PhysiologicalFileID=:PFID
          AND FileType='tsv'",
                ['PFID' => $this->_physioFileID]
            )
        );

        $projectID = $db->pselectOneInt(
            'SELECT ProjectID FROM session AS s WHERE s.ID = (
                SELECT SessionID FROM physiological_file
                WHERE PhysiologicalFileID=:PFID
            )',
            ['PFID' => $this->_physioFileID]
        );

        $json = iterator_to_array(
            $db->pselect(
                "SELECT
            EventFileID   AS id,
            FilePath      AS filePath,
            LastUpdate    AS lastUpdate,
            LastWritten   AS lastWritten
          FROM physiological_event_file
          WHERE (
              PhysiologicalFileID=:PFID OR ProjectID=:PID
          )
          AND FileType='json'",
                [
                    'PFID' => $this->_physioFileID,
                    'PID'  => $projectID
                ]
            )
        );

        $tsvPath  = count($tsv) > 0
            ? \Utility::pathJoin(
                $dataDir,
                \Utility::resolvePath($tsv[0]['filePath'])
            )
            : '';
        $jsonPath = count($json) > 0
            ? \Utility::pathJoin(
                $dataDir,
                \Utility::resolvePath($json[0]['filePath'])
            )
            : '';

        // Define paths for creation if either file don't exist
        if (strlen($tsvPath) === 0 || strlen($jsonPath) === 0) {
            $physioFilePath        = $db->pselectOne(
                'SELECT FilePath
                FROM physiological_file
                WHERE PhysiologicalFileID=:PFID',
                ['PFID' => $this->_physioFileID]
            );
            $indexOfLastUnderscore = strripos($physioFilePath, '_');
            $sessionDirectory      = substr(
                $physioFilePath,
                0,
                $indexOfLastUnderscore
            );

            if (strlen($tsvPath) === 0) {
                $relativePath = $sessionDirectory . '_events.tsv';
                $db->insert(
                    'physiological_event_file',
                    [
                        'ProjectID'           => $projectID,
                        'PhysiologicalFileID' => $this->_physioFileID,
                        'FileType'            => 'tsv',
                        'FilePath'            => $relativePath,
                    ]
                );
                $tsvPath = \Utility::pathJoin(
                    $dataDir,
                    \Utility::resolvePath($relativePath)
                );
            }

            if (strlen($jsonPath) === 0) {
                // Second directory level: bids_imports/Dataset/
                $datasetDirectory = substr(
                    $sessionDirectory,
                    0,
                    strpos(
                        $sessionDirectory,
                        '/',
                        strpos($sessionDirectory, '/') + 1
                    )
                );
                $taskFound        = preg_match(
                    '/sub-.+_(task-.+)_/',
                    $physioFilePath,
                    $matches
                );
                $relativePath     = $datasetDirectory . '/' .
                    ($taskFound ? "$matches[1]_" : '') .
                    'events.json';
                $db->insert(
                    'physiological_event_file',
                    [
                        'ProjectID'           => $projectID,
                        'PhysiologicalFileID' => $this->_physioFileID,
                        'FileType'            => 'json',
                        'FilePath'            => $relativePath,
                    ]
                );
                $jsonPath = \Utility::pathJoin(
                    $dataDir,
                    \Utility::resolvePath($relativePath)
                );
            }
        }

        // Update files if files updated before database updated
        if ($tsv[0]['lastWritten'] <= $tsv[0]['lastUpdate']
            || $json[0]['lastWritten'] <= $json[0]['lastUpdate']
        ) {
            // events.tsv
            $tsvFile = fopen($tsvPath, 'w'); // Will override all file content

            $extraColumns = iterator_to_array(
                $db->pselect(
                    "SELECT *
                    FROM physiological_task_event_opt
                    WHERE PhysiologicalTaskEventID IN (
                        SELECT PhysiologicalTaskEventID
                        FROM physiological_task_event
                        WHERE PhysiologicalFileID=:PFID
                    )",
                    ['PFID' => $this->_physioFileID]
                )
            );

            $hed_tags = iterator_to_array(
                $db->pselect(
                    "SELECT *
                    FROM physiological_task_event_hed_rel
                    WHERE PhysiologicalTaskEventID IN (
                        SELECT PhysiologicalTaskEventID
                        FROM physiological_task_event
                        WHERE PhysiologicalFileID=:PFID
                    )",
                    ['PFID' => $this->_physioFileID]
                )
            );

            $columnNames = $db->pselect(
                "SELECT DISTINCT PropertyName
                    FROM physiological_task_event_opt
                    WHERE PhysiologicalTaskEventID IN (
                        SELECT PhysiologicalTaskEventID
                        FROM physiological_task_event
                        WHERE PhysiologicalFileID=:PFID
                    )",
                ['PFID' => $this->_physioFileID]
            );

            $datasetTags    = new DatasetTags($this->loris, $this->_physioFileID);
            $datasetHEDTags = $datasetTags->getData();

            // TODO: Make columns more dynamic
            $tsvEntries = [
                'onset', 'duration', 'sample', 'trial_type', 'response_time', 'value'
            ];
            foreach ($columnNames as $columnName) {
                $tsvEntries[] = $columnName['PropertyName'];
            }

            $tsvEntries[] = 'HED';

            // Add columns names
            $columns = implode("\t", $tsvEntries);
            fwrite($tsvFile, "$columns\n");

            $instances = $db->pselect(
                "SELECT
                    PhysiologicalTaskEventID,
                    Onset,
                    Duration,
                    EventSample,
                    TrialType,
                    ResponseTime,
                    EventValue
                FROM physiological_task_event
                WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $this->_physioFileID]
            );

            foreach ($instances as $instance) {
                // Setup each column in correct order
                $inputTSV = [
                    $instance['Onset'],
                    $instance['Duration'],
                    $instance['EventSample'],
                    $instance['TrialType'],
                    $instance['ResponseTime'],
                    $instance['EventValue'],
                ];

                $taskEventID = $instance['PhysiologicalTaskEventID'];

                // Get instance's extra columns
                $instanceExtraColumns
                    = array_filter(
                        array_values($extraColumns),
                        function ($column) use ($taskEventID) {
                            return
                                $column['PhysiologicalTaskEventID'] == $taskEventID;
                        }
                    );

                foreach ($columnNames as $columnName) {
                    $column = array_filter(
                        array_values($instanceExtraColumns),
                        function ($col) use ($columnName) {
                            return
                                $col['PropertyName'] == $columnName['PropertyName'];
                        }
                    );

                    $columnValue = count($column) > 0
                        ? array_values($column)[0]['PropertyValue']
                        : 'n/a';

                    $inputTSV[] = $columnValue;
                }

                // Set all null values to 'n/a'
                $inputTSV = array_map(
                    function ($v) {
                        return is_null($v) ? "n/a" : $v;
                    },
                    $inputTSV
                );

                // Build assembled HED string
                $hed        = $datasetTags->buildHEDString(
                    $instance,
                    $instanceExtraColumns,
                    array_filter(
                        $hed_tags,
                        function ($hed_tag) use ($taskEventID) {
                            return $hed_tag['PhysiologicalTaskEventID']
                                == $taskEventID;
                        }
                    ),
                    $datasetHEDTags
                );
                $inputTSV[] = $hed;

                // Implode with tabs as delimiter
                $input = implode("\t", $inputTSV);

                fwrite($tsvFile, $input."\n");
            }
            fclose($tsvFile);

            // events.json
            $eventsJSON = [];

            foreach (array_keys($datasetHEDTags) as $eventColumn) {
                $levels = [];
                $hed    = [];
                foreach (array_keys($datasetHEDTags[$eventColumn]) as $columnValue) {
                    $tags = $datasetHEDTags[$eventColumn][$columnValue];
                    $levelDescription = '';
                    $hedString        = '';
                    if (count($tags) > 0) {
                        $levelDescription = $tags[0]['Description'] ?? '';
                        $hedString        = $datasetTags->buildHEDString(
                            [],
                            [],
                            $tags,
                            $datasetHEDTags
                        );
                    }
                    $levels[$columnValue] = $levelDescription;
                    $hed[$columnValue]    = $hedString;
                }
                $eventsJSON[$this->_getColumnName($eventColumn)] = [
                    'Levels' => $levels,
                    'HED'    => $hed,
                ];
            }

            $encodedEvents = json_encode($eventsJSON, JSON_PRETTY_PRINT);
            $jsonFile      = fopen($jsonPath, 'w');
            fwrite($jsonFile, $encodedEvents);
            fclose($jsonFile);

            // Update archives and create new hash
            $this->_updateArchives([$tsvPath, $jsonPath]);

            // Update time that files were written to
            $db->update(
                'physiological_event_file',
                ['LastWritten' => date("Y-m-d H:i:s")],
                ['PhysiologicalFileID' => $this->_physioFileID]
            );
        }
    }

    /**
     * Convert column name from DB into BIDS-recognized column name
     *
     * @param string $columnName Column name from DB
     *
     * @return string
     */
    function _getColumnName(string $columnName) : string
    {
        return match (strtolower($columnName)) {
            'eventvalue', 'event_value', 'value' => 'value',
            'trialtype' => 'trial_type',
            default => $columnName,
        };
    }

    /**
     * Updates the event and physiological archives for the given
     * physiological file ID with the provided paths and updates
     * database with new archive file hash
     *
     * @param array $paths Paths to files to be added to archive
     *
     * @return void
     * @throws SodiumException
     */
    function _updateArchives(array $paths) : void
    {
        $db =  $this->loris->getDatabaseConnection();

        //Get data directory base path from Config
        $config  = \NDB_Factory::singleton()->config();
        $dataDir = $config->getSetting("dataDirBasepath");

        $archive_table_names = [
            'physiological_event_archive',
            'physiological_archive'
        ];

        foreach ($archive_table_names as $archive_table_name) {
            $filepath = $db->pselectOne(
                "SELECT
                DISTINCT(FilePath)
                FROM $archive_table_name
                WHERE PhysiologicalFileID=:PFID",
                ['PFID' => $this->_physioFileID]
            );

            $filepath = \Utility::pathJoin(
                $dataDir,
                \Utility::resolvePath($filepath)
            );

            $archive_file = new \PharData($filepath);
            foreach ($paths as $path) {
                $archive_file->addFile($path, basename($path));
            }

            $f    = file_get_contents($filepath);
            $hash = sodium_crypto_generichash($f);

            //Update database with hash
            $db->update(
                $archive_table_name,
                ['Blake2bHash'         => bin2hex($hash)],
                ['PhysiologicalFileID' => $this->_physioFileID]
            );
        }
    }
}

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

    /**
     * Construct an Event object
     *
     * @param integer $physioFileID Electrophysiological file ID
     *                              to collect event data from
     */
    function __construct(int $physioFileID)
    {
        $this->_physioFileID = $physioFileID;
        $db = \NDB_Factory::singleton()->database();

        $taskEvents = $db->pselect(
            'SELECT te.*
                FROM physiological_task_event AS te
                JOIN physiological_event_file AS f
                ON f.EventFileID = te.EventFileID
                WHERE f.PhysiologicalFileID=:PFID AND f.FileType="tsv"',
            ['PFID' => $this->_physioFileID]
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

        $this->_data = [
            'instances'    => $taskEvents,
            'extraColumns' => $extraColumns,
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

        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();

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
                return [];
            }

            $instance = [
                'Onset'    => $instance_data['onset'],
                'Duration' => $instance_data['duration'],
            ];

            // TODO: Support Event Instance Insert
            if (!empty($eventFileID)) {
                // Update physiological_task_event
                $db->update(
                    'physiological_task_event',
                    $instance,
                    ['PhysiologicalTaskEventID' => $instance_id]
                );

                $db->update(
                    'physiological_event_file',
                    ['LastUpdate' => date("Y-m-d H:i:s")],
                    ['PhysiologicalFileID' => $this->_physioFileID]
                );
            }

            $taskEvent = $db->pselect(
                'SELECT * FROM physiological_task_event
            WHERE PhysiologicalTaskEventID=:PTEID',
                ['PTEID' => $instance_id]
            );

            $extraColumns = $db->pselect(
                'SELECT opt.*
                  FROM physiological_task_event_opt AS opt
                  WHERE opt.PhysiologicalTaskEventID=:PTEID',
                ['PTEID' => $instance_id]
            );

            return [
                'instance'     => $taskEvent[0],
                'extraColumns' => $extraColumns,
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
        $db = \NDB_Factory::singleton()->database();

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
     * Updates the event files associated with the given
     * physiological file ID
     *
     * @return void
     * @throws SodiumException
     */
    function updateFiles(): void
    {
        $db      = \NDB_Factory::singleton()->database();

        //Get data directory base path from Config
        $config  = \NDB_Factory::singleton()->config();
        $dataDir = $config->getSetting("dataDirBasepath");

        $tsv = $db->pselect(
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
        );

        if (count($tsv) > 0) {
            $tsvPath = $dataDir . $tsv[0]['filePath'];
            // Update files if files updated before database updated
            if ($tsv[0]['lastWritten'] <= $tsv[0]['lastUpdate']) {
                // events.tsv
                $tsvFile = fopen($tsvPath, 'w'); // Will override all file content

                $extraColumns = $db->pselect(
                    "SELECT *
                    FROM physiological_task_event_opt
                    WHERE PhysiologicalTaskEventID IN (
                        SELECT PhysiologicalTaskEventID
                        FROM physiological_task_event
                        WHERE PhysiologicalFileID=:PFID
                    )",
                    ['PFID' => $this->_physioFileID]
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

                // TODO: Make columns more dynamic
                $tsvEntries = [
                    'onset', 'duration', 'sample', 'trial_type',
                    'response_time', 'value'
                ];
                foreach ($columnNames as $columnName) {
                    $tsvEntries[] = $columnName['PropertyName'];
                }
                //            $tsvEntries[] = 'HED';

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
                                    $column['PhysiologicalTaskEventID'] ==
                                    $taskEventID;
                            }
                        );

                    foreach ($columnNames as $columnName) {
                        $column = array_filter(
                            array_values($instanceExtraColumns),
                            function ($col) use ($columnName) {
                                return
                                    $col['PropertyName'] ==
                                    $columnName['PropertyName'];
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

                    // Implode with tabs as delimiter
                    $input = implode("\t", $inputTSV);

                    fwrite($tsvFile, $input . "\n");
                }
                fclose($tsvFile);

                //Update archives and create new hash
                $this->_updateArchives([$tsvPath]);

                // Update time that files were written to
                $db->update(
                    'physiological_event_file',
                    ['LastWritten' => date("Y-m-d H:i:s")],
                    ['PhysiologicalFileID' => $this->_physioFileID]
                );
            }
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
        $db      = \NDB_Factory::singleton()->database();

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

            $filepath = $dataDir . $filepath;

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

<?php declare(strict_types=1);

/**
 * This file contains code to import EEG data into
 * DQT
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once 'generic_includes.php';

/**
 * Wrapper around CouchDB EEG functions
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */
class CouchDBEEGImporter
{
    var $SQLDB; // reference to the database handler, store here instead
    // of using Database::singleton in case it's a mock.
    var $CouchDB; // reference to the CouchDB database handler

    // this is just in an instance variable to make
    // the code a little more readable.
    private $_Dictionary = [];

    /**
     * Constructor for CouchDBMRIImporter
     */
    function __construct()
    {
        $factory       = \NDB_Factory::singleton();
        $config        = \NDB_Config::singleton();
        $couchConfig   = $config->getSetting('CouchDB');
        $this->SQLDB   = $factory->Database();
        $this->CouchDB = $factory->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
    }

    /**
     * Runs the script
     *
     * @return void
     */
    function run()
    {
        $this->updateDataDict();
        $CandidateData = $this->getCandidateData();
        $results       = $this->updateCandidateDocs($CandidateData);
        $this->createRunLog($results);
    }

    /**
     * Add data dictionary in DQT
     *
     * @return void
     */
    function updateDataDict()
    {

        $this->_Dictionary = [];

        $eeg_array = [
            'Acquisition_Time'          => 'Acquisition Time',
            'FilePaths'                 => 'Paths of all session recordings',
            'age_at_scan'               => 'Subject\'s age at scan',
            'CapManufacturer'           => 'Cap Manufacturer',
            'CapManufacturersModelName' => 'Manufacturer Cap Model Name',
            'EEGChannelCount'           => 'EEG Channel Count',
            'EOGChannelCount'           => 'EOG Channel Count',
            'ECGChannelCount'           => 'ECG Channel Count',
            'EMGChannelCount'           => 'EMG Channel Count',
            'EEGReference'              => 'EEG Reference',
            'EEGGround'                 => 'EEG Ground',
            'EEGPlacementScheme'        => 'EEG Placement Scheme',
            'HardwareFilters'           => 'Hardware Filters',
            'InstitutionName'           => 'Institution Name',
            'InstitutionAddress'        => 'Institution Address',
            'MiscChannelCount'          => 'Misc Channel Count',
            'Manufacturer'              => 'Manufacturer',
            'ManufacturerModelName'     => 'Manufacturer Model Name',
            'PowerLineFrequency'        => 'Power Line Frequency',
            'RecordingType'             => 'Recording Type',
            'RecordingDuration'         => 'Recording Duration',
            'SamplingFrequency'         => 'Sampling Frequency',
            'SoftwareFilters'           => 'Software Filters',
            'SoftwareVersions'          => 'Software Version',
            'TriggerChannelCount'       => 'Trigger Channel Count',
            'TaskDescription'           => 'Task Description',
            'TaskName'                  => 'Task Name',
            'OutputType'                => 'Output type - raw or derived',
            'HEDTags'                   => 'HED Tags - Unique List',
            'HEDTagsShortForm'          => 'HED Tags - Short Form',
        ];

        foreach ($eeg_array as $field => $desc) {
            $this->_Dictionary[$field] = [
                'Type'        => "varchar(255)",
                'Description' => $desc
            ];
        }

        $this->CouchDB->replaceDoc(
            "DataDictionary:eeg_data",
            [
                'Meta'           => ['DataDict' => true],
                'DataDictionary' => ['eeg_data' => $this->_Dictionary]
            ]
        );
    }


    /**
     * Get Candidate Data
     *
     * @return array
     */
    public function getCandidateData(): array
    {
        $query = "SELECT
        psc.Name                                  AS Site,
        c.PSCID                                   AS PSCID,
        c.CandID                                  AS DCCID,
        Project.Name                              AS Project,
        s.Visit_label                             AS Visit_Label,
        MIN(pf.AcquisitionTime)                   AS Acquisition_Time,
        MIN(pf.InsertTime)                        AS Insert_Time,
        GROUP_CONCAT(DISTINCT pot.OutputTypeName) AS OutputType,
        s.ID                                      AS SessionID,
        s.CenterID                                AS CenterID,
        s.ProjectID                               AS ProjectID,
        GROUP_CONCAT(DISTINCT pf.FilePath)        AS FilePaths,
        GROUP_CONCAT(DISTINCT pef.EventFileID)    AS EventFileID
      FROM physiological_file pf
        LEFT JOIN session s   ON (s.ID=pf.SessionID)
        LEFT JOIN candidate c USING (CandID)
        LEFT JOIN psc         ON (s.CenterID=psc.CenterID)
        LEFT JOIN Project     ON (s.ProjectID=Project.ProjectID)
        LEFT JOIN physiological_event_file pef
            USING (PhysiologicalFileID)
        LEFT JOIN physiological_output_type pot
          USING (PhysiologicalOutputTypeID)
      WHERE c.Active='Y'
        AND s.Active='Y'
        AND pf.FileType IN (
          SELECT type FROM ImagingFileTypes WHERE Description LIKE '%(EEG)'
        )
      GROUP BY SessionID";

        $CandidateData = $this->SQLDB->pselect($query, []);
        foreach ($CandidateData as &$row) {
            $sessionID          = $row['SessionID'];
            $eeg_header_results = $this->_addEEGHeaderInfo($sessionID);
            $row = array_merge($row, $eeg_header_results);
        }
        return $CandidateData;
    }

    /**
     * Add EEG header information
     *
     * @param int $sessionID Session ID
     *
     * @return array          Array of EEG header info
     */
    function _addEEGHeaderInfo(int $sessionID): array
    {
        $records = $this->SQLDB->pselect(
            "SELECT
                Name,
                GROUP_CONCAT(DISTINCT Value SEPARATOR ',\n') AS Value
            FROM physiological_parameter_file
            JOIN parameter_type USING (ParameterTypeID)
            LEFT JOIN physiological_file USING (PhysiologicalFileID)
            WHERE Name IN (
                'age_at_scan',
                'CapManufacturer',
                'CapManufacturersModelName',
                'ECGChannelCount',
                'EEGChannelCount',
                'EEGGround',
                'EEGPlacementScheme',
                'EEGReference',
                'EMGChannelCount',
                'EOGChannelCount',
                'HardwareFilters',
                'InstitutionAddress',
                'InstitutionName',
                'Manufacturer',
                'ManufacturersModelName',
                'MiscChannelCount',
                'PowerLineFrequency',
                'RecordingDuration',
                'RecordingType',
                'SamplingFrequency',
                'SoftwareFilters',
                'SoftwareVersions',
                'TaskDescription',
                'TaskName',
                'TriggerChannelCount'
            )
            AND SessionID=:sid
            GROUP BY Name",
            ['sid' => $sessionID]
        );

        $header = [];
        foreach ($records as $index => $record) {
            $header[$record['Name']] = $record['Value'];
        }

        $hed_tags = $this->SQLDB->pselect(
            "WITH DatasetTags AS (
            SELECT DISTINCT HEDTagID
            FROM bids_event_dataset_mapping
            WHERE ProjectID = (
              SELECT ProjectID
              FROM session
              WHERE ID = :sid
            )
          ), EventRelTags AS (
            SELECT DISTINCT ptehr.HEDTagID
            FROM physiological_task_event_hed_rel AS ptehr
            JOIN physiological_task_event AS pte
                ON ptehr.PhysiologicalTaskEventID = pte.PhysiologicalTaskEventID
            JOIN physiological_file AS pf
                ON pte.PhysiologicalFileID = pf.PhysiologicalFileID
            WHERE pf.SessionID = :sid
          )
          SELECT
              GROUP_CONCAT(DISTINCT hed_schema_nodes.Name) AS Name,
              GROUP_CONCAT(DISTINCT hed_schema_nodes.LongName) AS LongName
          FROM hed_schema_nodes
          WHERE hed_schema_nodes.ID IN (
              SELECT HEDTagID FROM DatasetTags
              UNION
              SELECT HEDTagID FROM EventRelTags
          );",
            ['sid' => $sessionID]
        );

        if (count($hed_tags) > 0) {
            $header['HEDTags']          = $hed_tags[0]['LongName'];
            $header['HEDTagsShortForm'] = $hed_tags[0]['Name'];
        }

        return $header;
    }

    /**
     * Updates DQT with the new data
     *
     * @param array $data Candidate data to be updated
     *
     * @return void
     */
    function updateCandidateDocs($data)
    {
        $results = [
            'new'       => 0,
            'modified'  => 0,
            'unchanged' => 0,
        ];

        foreach ($data as $index => $candidateRecord) {
            $doc        = $candidateRecord;
            $identifier = [
                $candidateRecord['PSCID'],
                $candidateRecord['Visit_Label']
            ];
            $docid      = 'EEG_Files:' . join('_', $identifier);
            unset($doc['PSCID']);
            unset($doc['Visit_Label']);
            unset($doc['SessionID']);

            $success = $this->CouchDB->replaceDoc(
                $docid,
                [
                    'Meta' => [
                        'DocType'    => 'eeg_data',
                        'identifier' => $identifier,
                    ],
                    'data' => $doc,
                ]
            );
            print $docid . ": " . $success . "\n";

            if (!isset($results[$success])) {
                $results[$success] = 0;
            }

            $results[$success] += 1;
        }

        return $results;
    }

    /**
     * Creates run log
     *
     * @param array $results The results of running the query
     *
     * @return void
     */
    function createRunLog($results)
    {
        $now = date("c");
        $id  = $this->CouchDB->createDoc(
            [
                'Meta'    => ['DocType' => 'RunLog'],
                'RunInfo' => [
                    'Script'        => 'EEG Data Importer',
                    'Time'          => "$now",
                    'DocsCreated'   => $results['new'],
                    'DocsModified'  => $results['modified'],
                    'DocsUnchanged' => $results['unchanged'],
                ],
            ]
        );
        print "Created run log with id $id\n";
    }
}

// Don't run if we're doing the unit tests; the unit test will call run.
if (!class_exists('UnitTestCase')) {
    $Runner = new CouchDBEEGImporter();
    $Runner->run();
}

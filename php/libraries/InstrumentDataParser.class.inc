<?php declare(strict_types=1);

/**
 * This file contains a class used to parse Instrument Data csv files
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

namespace LORIS;

require_once 'NDB_Factory.class.inc';
require_once 'CSVParser.class.inc';

use _PHPStan_ce0aaf2bf\Nette\Neon\Exception;
use DatabaseException;
use LorisException;
use RuntimeException;
use NDB_Factory;
use NotFound;
use SplFileInfo;
use \LORIS\Data\Dictionary\DictionaryItem as DictionaryItem;

/**
 * This class is used to parse instrument data
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class InstrumentDataParser extends CSVParser
{
    private string $instrumentName;

    /**
     * Construct parser
     *
     * @param string      $instrumentName Instrument name
     * @param SplFileInfo $csvFile        csv file path
     *
     * @return void
     */
    public function __construct(string $instrumentName, SplFileInfo $csvFile)
    {
        parent::__construct($csvFile);
        $this->instrumentName = $instrumentName;
    }

    /**
     * Parse the csv file
     *
     * @param LorisInstance $loris Loris instance
     *
     * @return array    Returns array of column names as strings
     * @throws RuntimeException
     */
    public function parseCSV(
        LorisInstance $loris,
        bool $includeCreationColumns = false
    ): array
    {
        try {
            $config = \NDB_Config::singleton();

            $expectedHeaders = self::getCSVHeaders(
                $loris,
                $this->instrumentName,
                $includeCreationColumns,
                $config->getSetting('useEDC') === 'true'
            );
            return $this->parse($expectedHeaders);
        } catch (\Exception $e) {
            throw new RuntimeException(
                "An error occurred while parsing: {$e->getMessage()}"
            );
        }
    }

    /**
     * Get expected csv columns for an instrument
     *
     * @param LorisInstance $loris                      Loris instance
     * @param string        $instrumentName             Instrument name
     * @param bool          $includeCreationColumns     Whether to include columns for
     *                                                  creating participants and sessions
     *
     * @return array    Returns array of column names as strings
     * @throws NotFound
     */
    public static function getCSVHeaders(
        LorisInstance $loris,
        string $instrumentName,
        bool $includeCreationColumns = false,
        bool $useEDC = false
    ): array {
        return array_merge(
            ($includeCreationColumns
                ? array_merge(['StudyID', 'DOB', 'Sex', 'Project', 'Site', 'Visit_label', 'Cohort'],  // Required fields to create new
                    $useEDC ? ['EDC'] : []
                )
                : ['PSCID', 'Visit_label']),    // SessionID
            self::getInstrumentHeaders(
                $loris,
                $instrumentName,
                ['CommentID', 'UserID', 'Testdate', 'Examiner']
            ),
        );
    }

    /**
     * Convert instrument data dictionary to columns
     *
     * @param DictionaryItem[] $dataDict       Data dictionary
     * @param string           $instrumentName Instrument name
     * @param array            $excluded       Excluded columns. Default is
     *                                         single-item array with empty
     *                                         string
     *
     * @return array    Returns instrument columns
     */
    protected static function convertDictionaryToColumns(
        array $dataDict, string $instrumentName, array $excluded = ['']
    ): array {
        return array_reduce(
            $dataDict,
            function ($columns, $field) use ($instrumentName, $excluded) {
                $fieldName = implode(
                    '',     // Strip first occurrence of prefix
                    explode("{$instrumentName}_", $field->getName(), 2)
                );
                if (!in_array($fieldName, $excluded)) {
                    $columns[] = $fieldName;
                }
                return $columns;
            },
            []
        );
    }

    /**
     * Get instrument columns
     *
     * @param LorisInstance $loris          Loris instance
     * @param string        $instrumentName Instrument name
     * @param array         $excluded       Excluded columns. Default is
     *                                      single-item array with empty
     *                                      string
     *
     * @return array    Returns instrument columns
     * @throws NotFound
     */
    protected static function getInstrumentHeaders(
        LorisInstance $loris, string $instrumentName, array $excluded = ['']
    ): array {
        $instrument = \NDB_BVL_Instrument::factory($loris, $instrumentName);
        $dataDict   = $instrument->getDataDictionary();
        return self::convertDictionaryToColumns(
            $dataDict,
            $instrumentName,
            $excluded,
        );
    }

    /**
     * Validate Instrument data
     *
     * @param array $instrumentData Instrument data from csv row
     * @param array $injectedColumns Columns to inject to every row
     * @param bool $createNonexistent Whether to create nonexistent participants/visits
     *
     * @return array    Returns array of column names as strings
     * @throws Exception
     */
    public static function validateData(
        array $instrumentData,
        array $injectedColumns,
        bool $createNonexistent = false,
    ): array {
        $errors = [];
        // TODO: Rollback on failure? Creations are occurring
        foreach ($instrumentData as &$dataRow) {
            try {
                $sessionID = null;
                try {
                    // Validate that session exists
                    $sessionID            = self::obtainSessionID(
                        $dataRow['PSCID'],
                        $dataRow['Visit_label']
                    );
                } catch (\LorisException $e) {
                    if (!$createNonexistent) {
                        throw new Exception($e->getMessage());
                    }

                    $db = NDB_Factory::singleton()->database();

                    // Ensure non-candidate fields exists (TODO: convert to method?)
                    $projectID = $db->pselectOneInt(
                        "SELECT ProjectID
                        FROM Project
                        WHERE Name = :rowProject
                        OR Alias = :rowProject",
                        ['rowProject' => $dataRow['Project']]
                    );
                    if (is_null($projectID)) {
                        throw new Exception(
                            "Project: {$dataRow['Project']} does not exist"
                        );
                    }

                    $centerID = $db->pselectOneInt(
                        "SELECT CenterID
                        FROM psc
                        WHERE Name = :rowSite
                        OR Alias = :rowSite",
                        ['rowSite' => $dataRow['Site']]
                    );
                    if (is_null($centerID)) {
                        throw new Exception(
                            "Site: {$dataRow['Site']} does not exist"
                        );
                    }

                    $cohortID = $db->pselectOneInt(
                        "SELECT CohortID
                        FROM cohort
                        WHERE title = :rowCohort",
                        ['rowCohort' => $dataRow['Cohort']]
                    );
                    if (is_null($cohortID)) {
                        throw new Exception(
                            "Cohort: {$dataRow['Cohort']} does not exist"
                        );
                    }


                    // Ensure Cohort belongs to Project
                    $projectCohortRelID = $db->pselectOneInt(
                        "SELECT ProjectCohortRelID
                        FROM project_cohort_rel
                        WHERE ProjectID = :projectID
                        AND CohortID = :cohortID",
                        [
                            'projectID' => $projectID,
                            'cohortID' => $cohortID,
                        ]
                    );
                    if (is_null($projectCohortRelID)) {
                        throw new Exception(
                            "Cohort: {$dataRow['Cohort']} is not part of Project: {$dataRow['Project']}"
                        );
                    }

                    // Check if Visit_label exists
                    $visitID = $db->pselectOneInt(
                        "SELECT VisitID
                        FROM visit
                        WHERE VisitLabel = :rowVisitLabel",
                        ['rowVisitLabel' => $dataRow['Visit_label']]
                    );
                    if (is_null($visitID)) {
                        throw new Exception(
                            "Visit_label: {$dataRow['Visit_label']} does not exist"
                        );
                    }

                    // Ensure visit belongs to project/cohort
                    $visitProjectCohortRelID = $db->pselectOneInt(
                        "SELECT VisitProjectCohortRelID
                        FROM visit_project_cohort_rel
                        WHERE VisitID = :visitID
                        AND ProjectCohortRelID = :projectCohortRelID",
                        [
                            'visitID' =>            $visitID,
                            'projectCohortRelID' => $projectCohortRelID
                        ]
                    );
                    if (is_null($visitProjectCohortRelID)) {
                        throw new Exception(
                            "Visit_label: {$dataRow['Visit_label']} does not belong to Project|Cohort: {$dataRow['Project']}|{$dataRow['Cohort']}"
                        );
                    }

                    // Check if candidate exists - NOTE: CBIG ONLY
                    // TODO: StudyID -> PSCID mapping needed for non-CBIG
                    $candID = $db->pselectOneInt(
                        "SELECT CandID
                        FROM candidate_project_extid_rel
                        WHERE ExtStudyID = :rowStudyID",
                        ['rowStudyID' => $dataRow['StudyID']]
                    );

                    if (is_null($candID)) {
                        // Create candidate - NOTE: CBIG ONLY
                        $edc = \NDB_Config::singleton()
                            ->getSetting('useEDC') === 'true'
                            ? $dataRow['EDC'] : null;

                        $candID = \Candidate::createNew(
                            \CenterID::singleton($centerID),
                            $dataRow['DOB'],
                            $edc,
                            new \LORIS\StudyEntities\Candidate\Sex(
                                $dataRow['Sex'] ?? 'Other'
                            ),
                            $dataRow['StudyID'], // Matters if generation: "user"
                            \ProjectID::singleton($projectID)
                        );

                        // Create externalID rel
                        $db->insert(
                            'candidate_project_extid_rel',
                            [
                                'CandID' => $candID,
                                'ProjectExternalID' => $projectID,
                                'ExtStudyID' => $dataRow['StudyID']
                            ]
                        );
                    }

                    $candidate = \Candidate::singleton($candID);

                    // Create Session
                    $session = \TimePoint::createNew(
                        $candidate,
                        $cohortID,
                        $dataRow['Visit_label'],
                        \Site::singleton(\CenterID::singleton($centerID)),
                        \Project::getProjectFromID(\ProjectID::singleton($projectID)),
                    );

                    $sessionID = $session->getSessionID();
                }

                $dataRow['SessionID'] = $sessionID;

                // Delete extra (non-instrument) columns
                unset($dataRow['StudyID']);
                unset($dataRow['DOB']);
                unset($dataRow['Age']);
                unset($dataRow['EDC']);
                unset($dataRow['Project']);
                unset($dataRow['Site']);
                unset($dataRow['Cohort']);


                // Inject columns
                $dataRow = array_merge($dataRow, $injectedColumns);
            } catch (\Exception $e) {
                $errors[] = $e->getMessage();
            }
        }

        return [
            'data'   => $instrumentData,
            'errors' => $errors,
        ];
    }


    /**
     * Get the session ID from PSCID and Visit_label
     *
     * @param string $pscID candidate PSCID
     * @param string $visitLabel session Visit_label
     *
     * @return int                  Returns SessionID
     * @throws LorisException
     */
    public static function obtainSessionID(string $pscID, string $visitLabel): int
    {
        $db = NDB_Factory::singleton()->database();

        $query = "SELECT s.ID
            FROM session AS s
            LEFT JOIN candidate c ON c.ID = s.CandidateID
            WHERE Visit_label = :visitLabel
            AND PSCID = :PSCID";

        $sessionID = $db->pselectOneInt(
            $query,
            [
                'PSCID'      => $pscID,
                'visitLabel' => $visitLabel,
            ]
        );

        if (is_null($sessionID)) {
            throw new \LorisException(
                "Session not found for PSCID: $pscID" .
                " and Visit_label: $visitLabel"
            );
        }
        return $sessionID;
    }

    /**
     * Insert instrument data in DB
     *
     * @param LorisInstance $loris          Loris instance
     * @param array         $instrumentData Instrument data to insert
     *
     * @return array    Returns insertion results
     * @throws NotFound
     */
    public static function insertInstrumentData(
        LorisInstance $loris, array $instrumentData, string $instrumentName, string $csvFilename
    ): array {
        $db = NDB_Factory::singleton()->database();
        $instrumentHeaders = self::getInstrumentHeaders(
            $loris,
            $instrumentName
        );

        $errors = [];
        try {
            $db->beginTransaction();
            try {
                foreach ($instrumentData as $data) {
                    try {
                        // Prepare row data
                        $rowData = array_reduce(
                            $instrumentHeaders,
                            function ($columns, $columnName) use ($data) {
                                $columns[$columnName]
                                    = strlen($data[$columnName]) > 0
                                    ? $data[$columnName]
                                    : null;
                                return $columns;
                            },
                            []
                        );

                        // Create generic instrument
                        $instrument = \NDB_BVL_Instrument::factory(
                            $loris,
                            $instrumentName,
                            '',
                            '',
                            false
                        );

                        $success = false;

                        if (!is_null($instrument)) {
                          // Instrument exists

                          // Populate instrument with data
                          // Change below is expected to allow population
                          $_FILES   = [];
                          $_REQUEST = $rowData;
                          $_POST    = $rowData;

                          $instrument->form->getGroupValues(
                            array_keys($rowData),
                            $out
                          );

                          // Generate CommentID for instrument
                          $battery = new \NDB_BVL_Battery();
                          $battery->selectBattery(
                            new \SessionID(strval($data['SessionID']))
                          );
                          $commentID = $battery->addInstrument(
                            $loris,
                            $instrumentName
                          );
                          $instrument->commentID = $commentID;

                          // Validate and save
                          $success = $instrument->save();
                        }

                        if (!$success) {
                            throw new RuntimeException(
                                "This row failed data validation."
                            );
                        } else {
                            // Success - Link file entry to DataID
                            $query  = "SELECT DataID
                                    FROM flag
                                    WHERE CommentID = :commentID";
                            $dataID = $db->pselectOneInt(
                                $query,
                                [
                                    'commentID' => $instrument->getCommentID()
                                ]
                            );

                            $db->update(
                                'instrument_data_files',
                                ['DataID'   => $dataID],
                                ['FilePath' => $csvFilename]
                            );
                        }
                    } catch (\Exception $e) {
                        error_log("Error caught: {$e->getMessage()}");
                        $errors[] = [
                            'row'     => $data,
                            'message' => "Error caught: {$e->getMessage()}",
                        ];
                    }
                }

                if (count($errors) > 0) {
                    error_log('Errors found:' . json_encode($errors));
                    $db->rollBack();
                    return [
                        'success' => false,
                        'message' => $errors,
                    ];
                } else {
                    $db->commit();
                    error_log("Saved " . count($instrumentData) . " row(s)");

                    return [
                        'success' => true,
                        'message' => "Saved " . count($instrumentData) . " row(s)",
                    ];
                }
            } catch (\Exception $e) {
                error_log(
                    "Rolling back due to unexpected error: {$e->getMessage()}"
                );
                $db->rollBack();
                return [
                    'success' => false,
                    'message' => "Data error: {$e->getMessage()}"
                ];
            }
        } catch (DatabaseException $e) {
            error_log("DB exception: {$e->getMessage()}");
            return [
                'success' => false,
                'message' => "DB Error: {$e->getMessage()}"
            ];
        }
    }
}

// TODO: Tech debt
/*
 * Seems like Examiner can't be put in the csv --
 * so selected in dropdown and one per file
 */

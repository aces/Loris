<?php declare(strict_types=1);

/**
 * This file contains a class used to parse Instrument Data csv files
 *
 * PHP Version 8
 *
 * @category Main
 * @package  LORIS
 * @author   Jefferson Casimir <jefferson.casimir@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

require_once 'NDB_Factory.class.inc';
require_once 'CSVParser.class.inc';

use _PHPStan_c875e8309\Nette\Neon\Exception;
use DatabaseException;
use NDB_BVL_Battery;
use NDB_Factory;
use NotFound;
use SplFileInfo;

/**
 * This class is used as a helper for parsing csv files
 *
 * PHP Version 8
 *
 * @category Main
 * @package  LORIS
 * @author   Jefferson Casimir <jefferson.casimir@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class InstrumentDataParser extends CSVParser
{
    private string $instrumentName;

    /**
     * Construct parser
     *
     * @param string        $instrumentName Instrument name
     * @param SplFileInfo   $csvFile        csv file path
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
     * @throws Exception
     */
    public function parseCSV(LorisInstance $loris): array
    {
        try {
            $expectedHeaders = self::getCSVHeaders($loris, $this->instrumentName);
            return $this->parse($expectedHeaders);
        } catch (\Exception $e) {
            throw new Exception("An error occurred while parsing: {$e->getMessage()}");
        }
    }

    /**
     * Get expected csv columns for an instrument
     *
     * @param LorisInstance $loris Loris instance
     * @param string $instrumentName Instrument name
     *
     * @return array    Returns array of column names as strings
     * @throws NotFound
     */
    public static function getCSVHeaders(LorisInstance $loris, string $instrumentName): array
    {
        return array_merge(
            ['PSCID', 'Visit_label'],   // SessionID
            // Convert to static list of flag fields
            self::getFlagHeaders(   // Whitelist would prevent invalid columns -- write tests
                [
                    'ID', 'SessionID', 'Test_name', 'TestID',
                    'CommentID', 'UserID', 'Data', 'DataID',
                    'Order'
                ]
            ),
            self::getInstrumentHeaders(
                $loris,
                $instrumentName,
                [
                    'CommentID', 'UserID', 'Testdate', 'Examiner'
                ]
            ),
        );
    }

    /**
     * Get expected columns from `flag` table
     *
     * @param array $excluded Excluded columns. Default is
     *                        single-item array with empty
     *                        string
     *
     * @return array    Returns columns from flag table
     */
    public static function getFlagHeaders(array $excluded = ['']): array
    {
        return self::getDBColumns('flag', $excluded);
    }

    /**
     * Get columns from DB table
     *
     * @param array $excluded Excluded columns. Default is
     *                        single-item array with empty
     *                        string
     *
     * @return array            Returns columns from DB table
     */
    public static function getDBColumns(string $tableName, array $excluded = ['']): array
    {
        $db = NDB_Factory::singleton()->database();

        $query   = "SELECT column_name
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = :table
             AND column_name NOT IN (" .
            implode(
                ',',
                array_map(
                    function ($col) {
                        return "'$col'";
                    },
                    $excluded,
                )
            ) . ")";
        $results = $db->pselect(
            $query,
            [
                'table' => $tableName,
            ]
        );

        $headers = [];
        foreach ($results as $row) {
            $headers[] = $row['column_name'];
        }
        return $headers;
    }

    /**
     * Get expected columns from the instrument's table
     *
     * @param LorisInstance $loris Loris instance
     * @param string $instrumentName Instrument name
     * @param array $excluded Excluded columns. Default is
     *                        single-item array with empty
     *                        string
     *
     * @return array    Returns columns from flag table
     * @throws NotFound
     */
    protected static function getInstrumentHeaders(LorisInstance $loris, string $instrumentName, array $excluded = ['']): array
    {
        $instrumentType = self::checkInstrumentType($instrumentName);

        return match ($instrumentType) {
//            'SQL' => self::getDBColumns($instrumentName, $excluded),    // TODO: Below should be good for all
            'PHP', 'Instrument Builder' => self::getDataDictionary($loris, $instrumentName, $excluded),
            default  => self::getDataDictionary($loris, $instrumentName, $excluded),
        };
    }

    /**
     * Validate Instrument data
     *
     * @return array    Returns array of column names as strings
     */
    public function validateData(array $instrumentData, array $injectedColumns): array
    {
        try {
            foreach ($instrumentData as &$dataRow) {
                // Validate Session
                $sessionID            = $this->obtainSessionID(
                    $dataRow['PSCID'],
                    $dataRow['Visit_label']
                );
                $dataRow['SessionID'] = $sessionID;
                $dataRow              = array_merge($dataRow, $injectedColumns);
            }
            return $instrumentData;
        } catch (\Exception $e) {
            error_log("Invalid data: {$e->getMessage()}");
            return [];
        }
    }


    /**
     * Get the session ID from PSCID and Visit_label
     *
     * @param string $pscID candidate PSCID
     * @param string $visitLabel session Visit_label
     *
     * @return int                  Returns SessionID
     * @throws Exception
     */
    public function obtainSessionID(string $pscID, string $visitLabel): int
    // TODO: Timepoint/getTimepointFormPSCIDandVisitLabel(,)
    {
        $db = NDB_Factory::singleton()->database();

        $query = "SELECT s.ID
            FROM session AS s
            LEFT JOIN candidate USING (CandID)
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
            throw new Exception(
                "Session not found for PSCID: $pscID
                        and Visit_label: $visitLabel"
            );
        }
        return $sessionID;
    }

    /**
     * Insert instrument data in DB
     *
     * @param LorisInstance $loris      Loris instance
     * @param array $instrumentData     Instrument data to insert
     *
     * @return array    Returns insertion results
     * @throws NotFound
     */
    public function insertInstrumentData(LorisInstance $loris, array $instrumentData): array
    {
        $db = NDB_Factory::singleton()->database();

        $testID = $db->pselectOneInt(
            "SELECT ID
            FROM test_names
            WHERE Test_name = :testName",
            [
                'testName' => $this->instrumentName,
            ]
        );

        $instrumentHeaders = $this->getInstrumentHeaders($loris, $this->instrumentName);

        $useInstrumentDataTable = !$db->tableExists($this->instrumentName);
        // TODO: INSTEAD USE ->usesJSONData

        $errors = [];
        try {
            $db->beginTransaction();
            try {
                foreach ($instrumentData as $data) {
                    try {
                        // TODO: addInstrument then _save() (or save() with validation/score -- checkbox)
                        $data['CommentID'] = NDB_BVL_Battery::generateCommentID(
                            new \SessionID(strval($data['SessionID'])),
                            $this->instrumentName,
                        );

                        error_log('trying to save');
                        error_log(json_encode(array_reduce(
                            $instrumentHeaders,
                            function($columns, $columnName) use ($data) {
                                $columns[$columnName] =
                                    strlen($data[$columnName]) > 0
                                        ? $data[$columnName]
                                        : null;
                                return $columns;
                            },
                            []
                        ))
                        );

                        $dataID = null;

                        if ($useInstrumentDataTable) {
                            // Insert as JSON string -- TODO: unsafe?
                            $db->unsafeinsert(
                                'instrument_data',
                                [
                                    'Data' => json_encode(array_reduce(
                                        $instrumentHeaders,
                                        function($columns, $columnName) use ($data) {
                                            $columns[$columnName] =
                                                strlen($data[$columnName]) > 0
                                                    ? $data[$columnName]
                                                    : null;
                                            return $columns;
                                        },
                                        []
                                    ))
                                ]
                            );
                            $dataID = $db->getLastInsertId();
                        } else {
                            // Insert in instrument's table
                            $db->insert(
                                $this->instrumentName,
                                array_reduce(
                                    $instrumentHeaders,
                                    function($columns, $columnName) use ($data) {
                                        $columns[$columnName] =
                                            strlen($data[$columnName]) > 0
                                                ? $data[$columnName]
                                                : null;
                                        return $columns;
                                    },
                                    []
                                ),
                            );
                        }

                        // Insert flag data
                        $db->insert(
                            'flag',
                            [
                                'SessionID'                   => $data['SessionID'],
                                'TestID'                      => $testID,
                                'CommentID'                   => $data['CommentID'],
                                'Data_entry'                  => $data['Data_entry'],
                                'Required_elements_completed' => $data['Required_elements_completed'],
                                'Administration'              => $data['Administration'],
                                'Validity'                    => $data['Validity'],
                                'Exclusion'                   => $data['Exclusion'],
                                'UserID'                      => $data['UserID'],
                                'Testdate'                    => $data['Testdate'],
                                'DataID'                      => $dataID,
                            ]
                        );
                    } catch (PDOException $e) {
                        error_log("Error caught: {$e->getMessage()}");
                        $errors[] = [
                            'row'     => $data,
                            'error'   => $e->getMessage(),
                            'message' => "Error caught: {$e->getMessage()}",
                        ];
                    }
                }

                if (count($errors) > 0) {
                    error_log('Errors found:'.json_encode($errors));
                    $db->rollBack();
                    return [
                        'success' => false,
                        'errors'  => $errors,
                        'message' => 'Errors found:'.json_encode($errors),
                    ];
                } else {
                    $db->commit();
                    error_log("Saved " . count($instrumentData) . " row(s)");
                    return [
                        'success' => true,
                        'errors'  => [],
                        'message' => "Saved " . count($instrumentData) . " row(s)",
                    ];
                }
            } catch (\Exception $e) {
                error_log("Rolling back due to unexpected error: {$e->getMessage()}");
                $db->rollBack();
                return [
                    'success' => false,
                    'errors'  => [],
                    'message' => "Unexpected error: {$e->getMessage()}"
                ];
            }
        } catch (DatabaseException $e) {
            error_log("DB exception: {$e->getMessage()}");
            return [
                'success' => false,
                'errors'  => [],
                'message' => "DB Error: {$e->getMessage()}"
            ];
        }
    }


    /**
     * Get columns from NDB_BVL_Instrument
     *
     * @param LorisInstance $loris      Loris instance
     * @param string $instrumentName    Instrument name
     * @param array $excluded           Excluded columns. Default is
     *                                  single-item array with empty
     *                                  string
     *
     * @return array                    Returns columns from DB table
     * @throws NotFound
     */
    public static function getDataDictionary(LorisInstance $loris, string $instrumentName, array $excluded = ['']): array
    {
        $instrument = \NDB_BVL_Instrument::factory($loris, $instrumentName);
        $dataDict = $instrument->getDataDictionary();

        // TODO: Find out whave _/save needs to works

        return array_reduce(
            $dataDict,
            function($columns, $field) use ($instrumentName, $excluded) {
                $fieldName = $field->getName();
                // Strip prefix
                $fieldName = str_replace("${instrumentName}_", '', $fieldName);
                if (!in_array($fieldName, $excluded)) {
                    $columns[] = $fieldName;
                }
                return $columns;
            },
            []
        );
    }


    /**
     * Determine the instrument type between LINST and PHP
     *
     * @param string $instrument The instrument name
     *
     * @return string The instrument type
     */
    public static function checkInstrumentType(string $instrument): string
    {
        // TODO: COPIED FROM modules/instrument_manager/php/instrumentrow.class.inc
        $db = NDB_Factory::singleton()->database();

        if ($db->tableExists($instrument)) {
            return 'SQL';
        }

        $_factory = \NDB_Factory::singleton();
        $_path    = $_factory->config()->getSetting("base");

        $linst = $_path . "/project/instruments/$instrument.linst";
        if (file_exists($linst)) {
            return 'Instrument Builder';
        }

        $php = $_path .
            "/project/instruments/NDB_BVL_Instrument_$instrument.class.inc";

        if (file_exists($php)) {
            return 'PHP';
        }

        return 'Missing';
    }
}



// TODO: Tech debt
/*
 * Seems like Examiner can't be put in the csv -- so selected in dropdown and one per file
 *
 */

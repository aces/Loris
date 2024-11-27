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

use DatabaseException;
use RuntimeException;
use NDB_Factory;
use NotFound;
use SplFileInfo;
use \LORIS\Data\Dictionary\DictionaryItem as DictionaryItem;

/**
 * This class is used to parse instrument data
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
    public function parseCSV(LorisInstance $loris): array
    {
        try {
            $expectedHeaders = self::getCSVHeaders($loris, $this->instrumentName);
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
     * @param LorisInstance $loris          Loris instance
     * @param string        $instrumentName Instrument name
     *
     * @return array    Returns array of column names as strings
     * @throws NotFound
     */
    public static function getCSVHeaders(
        LorisInstance $loris, string $instrumentName
    ): array {
        return array_merge(
            ['PSCID', 'Visit_label'],   // SessionID
            // Convert to static list of flag fields
            // List: Data_entry, Required_elements_completed, Administration,
            //       Validity, Exclusion, Testdate
            self::getFlagHeaders(   // Whitelist would prevent invalid columns
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
     * @param string $tableName DB table name
     * @param array  $excluded  Excluded columns. Default is
     *                          single-item array with empty
     *                          string
     *
     * @return array            Returns columns from DB table
     */
    public static function getDBColumns(
        string $tableName, array $excluded = ['']
    ): array {
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
                    explode("${instrumentName}_", $field->getName(), 2)
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
     * @param array $instrumentData  Instrument data from csv row
     * @param array $injectedColumns Columns to inject to every row
     *
     * @return array    Returns array of column names as strings
     */
    public function validateData(
        array $instrumentData, array $injectedColumns
    ): array {
        $errors = [];
        foreach ($instrumentData as &$dataRow) {
            try {
                // Validate Session
                $sessionID            = $this->obtainSessionID(
                    $dataRow['PSCID'],
                    $dataRow['Visit_label']
                );
                $dataRow['SessionID'] = $sessionID;

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
     *  TODO: Timepoint/getTimepointFormPSCIDandVisitLabel(,)
     *
     * @param string $pscID      candidate PSCID
     * @param string $visitLabel session Visit_label
     *
     * @return int                  Returns SessionID
     * @throws RuntimeException
     */
    public function obtainSessionID(string $pscID, string $visitLabel): int
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
            throw new RuntimeException(
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
    public function insertInstrumentData(
        LorisInstance $loris, array $instrumentData
    ): array {
        $db = NDB_Factory::singleton()->database();
        $instrumentHeaders = $this->getInstrumentHeaders(
            $loris,
            $this->instrumentName,
        );

        // TODO: Conditional rollback?

        $errors = [];
        try {
            $db->beginTransaction();
            try {
                foreach ($instrumentData as $data) {
                    try {
                        $battery = new \NDB_BVL_Battery();
                        $battery->selectBattery(
                            new \SessionID(strval($data['SessionID']))
                        );
                        $commentID = $battery->addInstrument(
                            $loris,
                            $this->instrumentName
                        );

                        $instrument = \NDB_BVL_Instrument::factory(
                            $loris,
                            $this->instrumentName,
                            $commentID
                        );

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

                        // TODO: Tech debt -- can be reset between getGV and save
                        $_FILES   = [];
                        $_REQUEST = $rowData;
                        $_POST    = $rowData;

                        $instrument->form->getGroupValues(
                            array_keys($rowData),
                            $out
                        );
                        $success = $instrument->save();
                        if (!$success) {
                            throw new RuntimeException(
                                "This row failed data validation."
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

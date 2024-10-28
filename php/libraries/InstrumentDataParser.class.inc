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
require_once __DIR__ . "/../../tools/generic_includes.php";     // TODO: Delete line

include_once 'NDB_Factory.class.inc';
include_once 'CSVParser.class.inc';
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
     * @param string $instrumentName    Instrument name
     * @param SplFileInfo $csvFile      csv file path
     *
     * @return void
     */
    public function __construct(string $instrumentName, SplFileInfo $csvFile)
    {
        parent::__construct($csvFile);
        $this->instrumentName = $instrumentName;
    }

    /**
     * Get columns from DB table
     *
     * @param array $excluded   Excluded columns. Default is
     *                          single-item array with empty
     *                          string
     *
     * @return array            Returns columns from DB table
     */
    public static function getDBColumns(string $tableName, array $excluded = ['']): array
    {
        $db = \NDB_Factory::singleton()->database();

        $query = "SELECT column_name
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE table_name = :table
             AND column_name NOT IN (" .
            implode(',', array_map(
                function ($col) { return "'$col'"; },
                $excluded,
            )) . ")";
        $results = $db->pselect($query, [
            'table' => $tableName,
        ]);

        $headers = [];
        foreach ($results as $row) {
            $headers[] = $row['column_name'];
        }
        return $headers;
    }

    /**
     * Get expected columns from `flag` table
     *
     * @param array $excluded   Excluded columns. Default is
     *                          single-item array with empty
     *                          string
     *
     * @return array    Returns columns from flag table
     */
    public static function getFlagHeaders(array $excluded = ['']): array
    {
        return InstrumentDataParser::getDBColumns('flag', $excluded);
    }

    /**
     * Get expected columns from the instrument's table
     *
     * @param array $excluded   Excluded columns. Default is
     *                          single-item array with empty
     *                          string
     *
     * @return array    Returns columns from flag table
     */
    public static function getInstrumentHeaders(string $instrumentName, array $excluded = ['']): array
    {
        return InstrumentDataParser::getDBColumns($instrumentName, $excluded);
    }

    /**
     * Get expected csv columns for an instrument
     *
     * @return array    Returns array of column names as strings
     */
    public static function getCSVHeaders(string $instrumentName): array
    {
        return array_merge(
            ['PSCID', 'Visit_label'],
            InstrumentDataParser::getFlagHeaders(['ID', 'CommentID', 'SessionID']),
            InstrumentDataParser::getInstrumentHeaders($instrumentName, ['CommentID', 'UserID', 'Testdate']),
        );
    }

    /**
     * Parse the csv file
     *
     * @return array    Returns array of column names as strings
     */
    public function parseCSV(): array
    {
        try
        {
            $expectedHeaders = $this->getCSVHeaders($this->instrumentName);
            return $this->parse($expectedHeaders);
        } catch (\Exception $e) {
            error_log("An error occurred while parsing {$e->getMessage()}");
            return [];
        }
    }
 }


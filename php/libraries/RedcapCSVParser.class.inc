<?php declare(strict_types=1);

/**
 * This file contains a class used to parse Instrument Data csv files
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

namespace LORIS;

require_once 'NDB_Factory.class.inc';
require_once 'InstrumentDataParser.class.inc';
require_once __DIR__ .
    '/../../modules/redcap/php/client/models/redcapdictionaryrecord.class.inc';
require_once __DIR__ . '/../../modules/redcap/php/client/redcapprops.class.inc';

use DatabaseException;
use LORIS\redcap\client\models\RedcapDictionaryRecord;
use RuntimeException;
use NDB_Factory;
use NotFound;
use SplFileInfo;
use \LORIS\Data\Dictionary\DictionaryItem as DictionaryItem;

/**
 * This class is used to parse redcap data
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class RedcapCSVParser extends InstrumentDataParser
{
    private bool $trimInstrumentName;
    private array $importableInstruments = [];

    /**
     * Construct parser
     *
     * @param SplFileInfo $csvFile               csv file path
     * @param array       $importableInstruments Importable Redcaop instruments
     * @param bool        $trimInstrumentName    whether instrument name
     *                                           should be trimmed from
     *                                           columns
     *
     * @return void
     */
    public function __construct(
        SplFileInfo $csvFile,
        array       $importableInstruments = [],
        bool        $trimInstrumentName = false
    ) {
        parent::__construct($csvFile);
        $this->trimInstrumentName    = $trimInstrumentName;
        $this->importableInstruments = $importableInstruments;
    }

    /**
     * Parse the Data Dictionary csv file
     *
     * @param LorisInstance $loris Loris instance
     *
     * @return RedcapDictionaryRecord[] Returns array RedcapDictionaryRecord
     * @throws RuntimeException
     */
    public function parseDictionaryCSV(LorisInstance $loris): array
    {
        try {
            $expectedHeaders = RedcapDictionaryRecord::getHeaders();
            return $this->parse(
                [],
                -1,
                function ($row) {
                    $instrumentName = $row[1];

                    if (count($this->importableInstruments) > 0
                        && !in_array(
                            $instrumentName, $this->importableInstruments, true
                        )
                    ) {
                        $msg = " -> instrument '$instrumentName' skipped.\n";
                        error_log($msg);
                        return true;
                    }

                    return false;
                },
                function ($csvHeaders, $row) use ($expectedHeaders) {
                    try {
                        if (count($csvHeaders) < count($expectedHeaders)) {
                            // Pad row with blanks -- Assumes order was same as expected
                            $row = array_pad($row, count($expectedHeaders), '');
                        }

                        if (count($row) !== count($expectedHeaders)) {
                            throw new \LorisException('Incompatible headers');
                        }

                        return new RedcapDictionaryRecord(
                            array_combine($expectedHeaders, $row),
                            $this->trimInstrumentName
                        );
                    } catch (\LorisException $le) {
                        error_log("Caught ERROR: "
                            . $le->getMessage());
                        if ($this->trimInstrumentName) {
                            // print error but continue with non-trimmed
                            error_log($le->getMessage());
                            return new RedcapDictionaryRecord(
                                array_combine($expectedHeaders, $row),
                                false,
                            );
                        }
                        throw new \LorisException(
                            "Failed to create RedcapDictionaryRecord"
                        );
                    }
                }
            );
        } catch (\Exception $e) {
            throw new RuntimeException(
                "An error occurred while parsing: {$e->getMessage()}"
            );
        }
    }

    /**
     * Separate parsed array of RedcapDictionaryRecord to LINST instruments
     *
     * @param RedcapDictionaryRecord[] $parsedCSV Parsed CSV file
     *
     * @return array[]
     */
    public static function convertDictionaryCSVToLINST(array $parsedCSV): array
    {
        $instruments = [];
        foreach ($parsedCSV as $dictionaryRecord) {
            $linst = $dictionaryRecord->toLINST();
            if (!empty($linst)) {
                $instruments[$dictionaryRecord->form_name][] = $linst;
            }
        }
        return $instruments;
    }

    /**
     * Convert array of RedcapDictionaryRecord to LINST file
     *
     * @param array[] $instruments        LINST instruments
     * @param string  $outputFolder       Instrument output folder
     * @param string  $instrumentTitleMap Instrument name map
     *
     * @return void
     */
    public static function createLINSTFiles(
        array $instruments, string $outputFolder, $instrumentTitleMap = []
    ): void {
        foreach ($instruments as $instrumentName => $instrument) {
            self::createLINSTFile(
                $outputFolder,
                $instrumentName,
                in_array($instrumentName, $instrumentTitleMap)
                    ? $instrumentTitleMap[$instrumentName]
                    : $instrumentName,
                $instrument
            );
        }
    }


    /**
     * Create LINST file from REDCap dictionary
     *
     * @param string $output_dir       the output directory
     * @param string $instrument_name  the instrument name
     * @param string $instrument_title the instrument title/label
     * @param array  $instrument       the instrument data
     *
     * @return void
     */
    public static function createLINSTFile(
        string $output_dir,
        string $instrument_name,
        string $instrument_title,
        array $instrument
    ): void {
        $fp = fopen("$output_dir/$instrument_name.linst", "w");
        fwrite($fp, "{-@-}testname{@}$instrument_name\n");
        fwrite($fp, "table{@}$instrument_name\n");
        fwrite($fp, "title{@}$instrument_title\n");

        // Standard LORIS metadata fields that the instrument builder adds
        // and LINST class automatically adds to instruments.
        fwrite($fp, "date{@}Date_taken{@}Date of Administration{@}{@}\n");
        fwrite($fp, "static{@}Candidate_Age{@}Candidate Age (Years)\n");
        fwrite($fp, "static{@}gestational_age{@}Gestational Age (Days)\n");
        fwrite($fp, "static{@}Window_Difference{@}Window Difference (+/- Days)\n");
        fwrite($fp, "select{@}Examiner{@}Examiner{@}NULL=>''\n");

        foreach ($instrument as $field) {
            // avoid 'timestamp_start', changed in 'static' instead of 'text'
            if (str_contains($field, "{@}timestamp_start{@}")) {
                // transform timestamp start to static
                fwrite($fp, "static{@}timestamp_start{@}Start time (server)\n");

                // add 'timestamp_stop' and 'Duration' fields after 'timestamp_start'
                fwrite($fp, "static{@}timestamp_stop{@}Stop time (server)\n");
                fwrite($fp, "static{@}Duration{@}Duration (server) (in seconds)\n");

            } else {
                // write field line
                fwrite($fp, "$field\n");

            }
        }
        fclose($fp);
    }
}

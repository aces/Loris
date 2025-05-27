<?php declare(strict_types=1);

/**
 * This file contains a class used to parse Instrument Data csv files
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

namespace LORIS;

require_once 'NDB_Factory.class.inc';
require_once 'CSVParser.class.inc';

use DatabaseException;
use LORIS\redcap\client\models\RedcapDictionaryRecord;
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
class RedcapCSVParser extends CSVParser
{
    private bool $trimInstrumentName;
    private array $importableInstruments = [];

    /**
     * Construct parser
     *
     * @param SplFileInfo $csvFile csv file path
     * @param bool $trimInstrumentName whether instrument name
     *                                              should be trimmed from columns
     * @param array $importableInstruments List of importable Redcaop instruments
     *
     * @return void
     */
    public function __construct(
        SplFileInfo $csvFile,
        array       $importableInstruments = [],
        bool        $trimInstrumentName = false
    )
    {
        parent::__construct($csvFile);
        $this->trimInstrumentName = $trimInstrumentName;
        $this->importableInstruments = $importableInstruments;
    }

    /**
     * Parse the csv file
     *
     * @param LorisInstance $loris      Loris instance
     *
     * @return RedcapDictionaryRecord[] Returns array RedcapDictionaryRecord
     * @throws RuntimeException
     */
    public function parseCSV(LorisInstance $loris): array
    {
        try {
            $expectedHeaders = RedcapDictionaryRecord::getHeaders();

            error_log(json_encode($expectedHeaders));
            return $this->parse(
                [],
                -1,
                function ($row) {
                    $instrumentName = $row[1];

                    if (
                        count($this->importableInstruments) > 0 &&
                        !in_array($instrumentName, $this->importableInstruments, true)
                    ) {
                        $msg = " -> instrument not importable '$instrumentName', skipped.\n";
                        fwrite(STDERR, $msg);
                        return true;
                    }

                    return false;
                },
                function ($csvHeaders, $row) use ($expectedHeaders) {
                    try {
                        return new RedcapDictionaryRecord(
                            array_combine($expectedHeaders, $row),
                            $this->trimInstrumentName
                        );
                    } catch (\LorisException $le) {
                        if ($this->trimInstrumentName) {
                            // print error but continue with non-trimmed
                            fprintf(STDERR, $le->getMessage());
                            return new RedcapDictionaryRecord(
                                array_combine($expectedHeaders, $row)
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
     * Convert array of RedcapDictionaryRecord to LINST file
     *
     * @param RedcapDictionaryRecord[] $dataDict Data dictionary
     * @param string $outputFolder               Location of output LINST file
     *
     * @return void
     */
    public static function convertParsedCSVRecordsToLINST(
        array $parsedCSV, string $outputFolder
    ): void
    {
        $instruments = [];
        foreach ($parsedCSV as $dictionaryRecord) {
            $linst = $dictionaryRecord->toLINST();
            if (!empty($linst)) {
                $instruments[$dictionaryRecord->form_name][] = $linst;
            }
        }

        fwrite(STDOUT, "\n-- Writing LINST/META files.\n\n");

        // write instrument
        foreach ($instruments as $instrumentName => $instrument) {
            self::createLINSTFile(
                $outputFolder,
                $instrumentName,
                $instrumentName, // Intead of $redcap_intruments_map[$instrument_name]
                $instrument
            );
        }
        fwrite(STDOUT, "\n-- end\n");
    }


    /**
     * Write LINST file and its associated META file.
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
        fwrite(STDERR, " -> writing '$instrument_name'\n");
        //
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

        // META file
        $fp_meta = fopen("$output_dir/$instrument_name.meta", "w");
        fwrite($fp_meta, "testname{@}$instrument_name\n");
        fwrite($fp_meta, "table{@}$instrument_name\n");
        fwrite($fp_meta, "jsondata{@}true\n");
        fwrite($fp_meta, "norules{@}true");
        fclose($fp_meta);
    }

}

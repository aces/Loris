<?php declare(strict_types=1);
/**
 * This class encapsulates the concept of a Data Importer for LORIS. It contains
 * functions to assist with comparing CSV files defining candidates for whom
 * data should be imported from one LORIS instance to another. An example of this
 * would be in importing data from a closed context into an "open science" context.
 * In this case, some data may be ethically approved for sharing and some may not.
 * This class as well as its child classes assist with parsing LORIS data for
 * import into a new context.
 *
 * @note It is meant as a template for back-end scripts to be run by an admistrator.
 * The code has not been written in the context of receiving untrusted input
 * from a web-interface and as such MUST NOT be used by core LORIS code which
 * interfaces with user input.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
abstract class DataImporter
{
    /**
     * These constants represent the indices of columns within the mapping file.
     * The file passed must have the headers organized in this order.
     * The names of the columns in the csv file don't matter as long as they are
     * formatted like this.
     *
     * Format:
     *      OLD_PSCID,NEW_PSCID,NEW_CANDID
     *
     * @var int
     */
    const OLD_PSCID  = 0;
    const NEW_PSCID  = 1;
    const NEW_CANDID = 2;

    /* An associative array of CSV headers to rows of CSV data */
    protected $dataRows = array();

    /* An associative array of CSV headers to rows of CSV data. Contains a
     * mapping of the original PSCIDs used in the source databse to the
     * new PSCIDs and the new CandIDs.
     */
    protected $mappingRows = array();

    /* The table in the DB to update */
    protected $table = '';

    /* An array of PSCIDs that represent the union of candidates present in the
     * source LORIS instance and the destination instance. These candidates are
     * the ones whose data is being transferred.
     *
     * @var string[]
     */
    public $sharedCandidates = array();

    /**
     * A mapping of old PSCIDs to new PSCIDS.
     *
     * @var array<string,string>
     */
    protected $PSCIDMapping = array();

    /**
     * A mapping of new PSCIDs to new CandIDs.
     *
     * @var array<string,string>
     */
    protected $candIDMapping = array();

    /**
     * An array of all PSCIDs the `candidate` table of the database.
     *
     * @var string[]
     */
    protected $existingPSCIDs = array();

    /* An array of PSCIDs that are present in the mapping file but skipped for
     * processing. */
    public $candidatesSkipped = array();

    /* An array containing informaiton to be formatted into a MySQL UPDATE
     * statement. */
    protected $UPDATEQueue = array();

    /* An array containing informaiton to be formatted into a MySQL INSERT
     * statement. */
    protected $INSERTQueue = array();


    /**
     * Creates a new data importer object. Must be generated through two CSV
     * files: the "mapping file" and the "data file".
     *
     * The mapping file contains threee columns, old (source) PSCIDs, new
     * (destination) PSCIDs, and new CandIDs.
     *
     * The data file is a CSV containing export data from the script
     * `tools/exporters/dataExtractor.php`. It must contain a column for old
     * (source) PSCIDs. This allows this class and children classes to link
     * the source data with new PSCIDs and CandIDs. The precise format
     * and number of columns depends on the execute of the dataExtractor script.
     *
     * @param SplFileInfo $mappingFile A path to the CSV mapping file.
     * @param SplFileInfo $dataFile    A path to the CSV data file.
     *
     * @return void
     */
    public function __construct(
        SplFileInfo $mappingFile,
        SplFileInfo $dataFile
    ) {

        // Create a mapping between PSCIDs and new PSCIDs to new CandIDs.
        $this->populateDataFromCSVs($mappingFile, $dataFile);
        $this->buildIDMappings();
        $this->calculateSharedCandidates();
        $this->existingPSCIDs = \NDB_Factory::singleton()->database()->pselectCol(
            'SELECT PSCID from candidate',
            array()
        );
    }

    /**
     * Filter out candidates present in data export but not included in the
     * mapping file. If the candidates are not present in the mapping file
     * that means that they are being deliberately excluded from import.
     *
     * @return void Modifies the property `sharedCandidates`.
     */
    function calculateSharedCandidates(): void
    {
        foreach ($this->dataRows as $row) {
            $oldPSCID = $row[$this->dataHeaders[self::OLD_PSCID]];
            if (!is_null($this->newPSCID($oldPSCID))) {
                $this->sharedCandidates[] = $oldPSCID;
            }
        }
    }

    /**
     * During import, candidates will be given new PSCIDs to assist in
     * de-identification between LORIS instances.
     *
     * This function prepares the list of candidates that will be imported.
     *
     * It maps old (source) PSCIDs to new (destination) PSCIDs and verifies
     * that new PSCIDs refer to valid IDs in the Database. (These are inserted
     * beforehand by an administrator, not by this script.)
     *
     * Finally, this function calls a function to build SQL queries that will be
     * used for data import. The structure of these queries is defined by the
     * child class.
     *
     * @return void
     */
    function processData()
    {
        foreach ($this->dataRows as $row) {
            // Get the old PSCID. Should always be in the column at index 0.
            $oldPSCID = $this->extractOldPSCIDFromRow($row);

            // Skip candidates not present in mapping file.
            if (!in_array($oldPSCID, $this->sharedCandidates, true)) {
                continue;
            }

            $newPSCID = $this->newPSCID($oldPSCID);

            // Check that the new PSCID from the mapping file is actually present in
            // the Database. It's possible that the candidate has been deleted since
            // the mapping file was created.
            $newPSCIDExists = in_array(
                $newPSCID,
                $this->existingPSCIDs,
                true
            );
            if (!$newPSCIDExists) {
                // Don't add a skipped candidate to the skipped array if we've
                // already encountered it.
                // This can occur for example when multiple visit labels are
                // listed for a single candidate.
                $skippedAlready = in_array(
                    $newPSCID,
                    $this->candidatesSkipped,
                    true
                );
                if (!$skippedAlready) {
                    $this->candidatesSkipped[] = $newPSCID;
                }
                continue;
            }
            // Child classes will determine what information should
            // be included in a given query.
            $this->buildSQLQuery($row);
        }
    }

    /**
     * Populates class properties UPDATEQueue and/or INSERTQueue with data
     * processed from $mappingFile and $dataFile.
     *
     * @param array $row A row of the $dataFile to be processed.
     *
     * @return void
     */
    abstract function buildSQLQuery(array $row): void;

    /**
     * Returns the length of the sharedCandidates property.
     *
     * @return int
     */
    function countSharedCandidates()
    {
        return count($this->sharedCandidates);
    }

    /**
     * Given an old (source) PSCID, return the corresponding new (destination)
     * PSCID.
     *
     * @param string $oldPSCID The original PSCID being queried.
     *
     * @return ?string The new PSCID, or null if not found in the mapping array.
     */
    protected function newPSCID(string $oldPSCID): ?string
    {
        return $this->PSCIDMapping[$oldPSCID] ?? null;
    }

    /**
     * Given a new (destination) PSCID, return the corresponding new CandID.
     *
     * @param string $newPSCID The PSCID being queried.
     *
     * @return ?string The new CandID, or null if not found in the mapping array.
     */
    protected function newCandID(string $newPSCID): ?string
    {
        return $this->candIDMapping[$newPSCID] ?? null;
    }


    /**
     * Returns a visual representation of the SQL queries to be run in order to
     * perform data import. Used for displaying to users and logging.
     *
     * @return string SQL commands to be run to perform import.
     */
    public function report(): string
    {
        $report = array_merge(
            $this->formatUPDATEStatements(),
            $this->formatINSERTStatements()
        );
        return join("\n", $report);
    }

    /**
     * Get the value of the PSCID in the source database from a given CSV
     * row.
     *
     * @param string[] $row A row from the CSV mapping file.
     *
     * @return string The old (source) PSCID
     */
    protected function extractOldPSCIDFromRow(array $row): string
    {
        return $row[$this->dataHeaders[self::OLD_PSCID]];
    }

    /**
     * Build a one-to-one mapping of old to new PSCIDs with the old IDs as the key.
     * Create a mapping of PSCIDs to CandIDs to allow for direct lookup of a CandID
     * given a PSCID. It is more efficient to use this dictionary than searching the
     * CSV rows for a CandID each time we need one.
     *
     * @return void
     */
    protected function buildIDMappings(): void
    {
        foreach ($this->mappingRows as $row) {
            $oldPSCID  = $row[$this->mappingHeaders[self::OLD_PSCID]];
            $newPSCID  = $row[$this->mappingHeaders[self::NEW_PSCID]];
            $newCandID = $row[$this->mappingHeaders[self::NEW_CANDID]];

            $this->PSCIDMapping[$oldPSCID]  = $newPSCID;
            $this->candIDMapping[$newPSCID] = $newCandID;
        }
    }

    /**
     * Populate class properties mappingRows, dataRows, mappingHeaders, and
     * dataHeaders to facilitate processing CSV data.
     *
     * @param SplFileInfo $mappingFile Path to the mappingFile.
     * @param SplFileInfo $dataFile    Path to the dataFile.
     *
     * @return void
     */
    protected function populateDataFromCSVs(
        SplFileInfo $mappingFile,
        SplFileInfo $dataFile
    ): void {
        // Basic validation -- readable
        // Get data from CSV files.
        $this->mappingRows = self::populateArrayFromCSV($mappingFile);
        $this->dataRows    = self::populateArrayFromCSV($dataFile);

        // Creating these arrays allows referencing the columns by index. This
        // allows the use of name constants to access the data from within the
        // CSV files instead of hard-coding column names into this script.
        $this->mappingHeaders = array_keys($this->mappingRows[0]);
        $this->dataHeaders    = array_keys($this->dataRows[0]);
    }


    /**
     * Format UPDATE commands for printing.
     *
     * @return void
     */
    protected function formatUPDATEStatements()
    {
        $commandQueue = $this->UPDATEQueue;
        if (count($commandQueue) < 1) {
            return array();
        }
        $formattedCommand = <<<SQL
UPDATE %s
SET %s
WHERE %s;

SQL;
        $report           = array();
        foreach ($commandQueue as $command) {
            $setString   = array();
            $whereString = array();
            // Iterate over all columns and create a formatted string.
            // There will only be one column for COLUMN_IMPORT mode but several
            // for VISIT_IMPORT.
            foreach ($command['data'] as $column => $value) {
                $value       = $this->quoteWrapUnlessNULL($value);
                $setString[] = "$column = $value";
            }
            foreach ($command['where'] as $column => $value) {
                $whereString[] = "$column = '$value'";
            }
            // Interpolate the $setString into the SQL heredoc above and add
            // it to the final $report output.
            $report[] = sprintf(
                $formattedCommand,
                $command['table'] ?? $this->table,
                implode(', ', $setString),
                implode(' AND ', $whereString)
            );
        }
        return $report;
    }

    /**
     * Format INSERT commands for printing.
     *
     * @return string[] Formatted array
     */
    protected function formatINSERTStatements(): array
    {
        $commandQueue = $this->INSERTQueue;
        if (count($commandQueue) < 1) {
            return array();
        }
        // Format commands for printing.
        $report           = array();
        $formattedCommand = <<<SQL
INSERT INTO %s
(%s)
VALUES(%s);

SQL;
        foreach ($commandQueue as $command) {
            $report[] = sprintf(
                $formattedCommand,
                $command['table'] ?? $this->table,
                implode(',', array_keys($command['data'])),
                implode(
                    ',',
                    array_map(
                        array(
                            $this,
                            'quoteWrapUnlessNULL',
                        ),
                        array_values($command['data'])
                    )
                )
            );
        }
        return $report;
    }


    /**
     * Converts a csv file into a two-dimensional PHP array where each element
     * contains an associative array of the column names and the values.
     * Example file.csv:
     *
     *      OldPSCID,newPSCID,newCandID
     *      MON001,MON999,123456
     *      ...
     *
     * becomes:
     * [0] => Array (
     *     [oldPSCID] => MON001,
     *     [newPSCID] => MON999,
     *     [newCandID] => 123456
     * ),
     * ...
     *
     * @param SplFileInfo $filename The name of the CSV file containing data.
     *
     * @throws InvalidArgumentException If no data in files or if they're
     *                                      inaccessible
     *
     * @return array<array<string,string>> The contents of the CSV file loaded
     *                                      into an associative array.
     */
    public static function populateArrayFromCSV(SplFileInfo $filename): array
    {
        $data = self::csvToArray($filename->getRealPath());
        if (count($data) < 1) {
            throw new InvalidArgumentException(
                "No data found in $filename" . PHP_EOL
            );
        }
        return $data;
    }

    /**
     * Convert a comma separated file into an associated array.
     * The first row should contain the array keys.
     *
     * @param string $filename  Path to the CSV file
     * @param string $delimiter The separator used in the file
     *
     * @return array
     *
     * @link      http://gist.github.com/385876
     * @author    Jay Williams <http://myd3.com/>
     * @copyright Copyright (c) 2010, Jay Williams
     * @license   http://www.opensource.org/licenses/mit-license.php MIT License
     */
    static function csvToArray(string $filename = '', string $delimiter = ','): array
    {
        if (!file_exists($filename) || !is_readable($filename)) {
            return array();
        }

        $header = null;
        $data   = array();
        if (($handle = fopen($filename, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== false) {
                if (!$header) {
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }
        return $data;
    }

    /**
     * Wraps a string in single quotes. Useful for an array_map callback when
     * preparing values to be used in a SET statement.
     * Values of NULL should not be quote-wrapped as MySQL will interpret this
     * as a string containing the word NULL rather than a value equivalent to
     * null.
     *
     * @param string $value The data to quote-wrap.
     *
     * @return string The param surrounded by single quotes.
     */
    function quoteWrapUnlessNULL(string $value): string
    {
        if ($value === 'NULL') {
            return $value;
        }
        return sprintf("'%s'", $value);
    }
}

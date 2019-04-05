<?php declare(strict_types=1);

abstract class DataImporter {

    /**
     * These constants represent the indices of columns within the mapping file.
     * The file passed must have the headers organized in this order. 
     * The names of the columns in the csv file don't matter as long as they are formatted
     * like this.
     *
     *
     * Format:
     *      OLD_PSCID,NEW_PSCID,NEW_CANDID
     *
     * @var int
     */
    const OLD_PSCID = 0;
    const NEW_PSCID = 1;
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

    /* The table in the DB to update */
    protected $sharedCandidates = array();

    /* A mapping of old PSCIDs to new PSCIDS. */
    protected $PSCIDMapping = array();

    /* A mapping of new PSCIDs to new CandIDs */
    private $candIDMapping = array();

    /* An array of PSCIDs present in the candidate table of the database. */
    private $existingPSCIDs = array();

    /* An array of PSCIDs that are present in the mapping file but skipped for
     * processing. */
    public $candidatesSkipped = array();

    /* An array containing informaiton to be formatted into a MySQL UPDATE
     * statement. */
    protected $UPDATEQueue = array();

    /* An array containing informaiton to be formatted into a MySQL INSERT
     * statement. */
    protected $INSERTQueue = array();

   
    public function __construct(
        SplFileInfo $mappingFile, 
        SplFileInfo $dataFile
    ) {
        // Create a mapping between PSCIDs and new PSCIDs to new CandIDs.
        $this->populateDataFromCSVs($mappingFile, $dataFile);
        $this->buildIDMappings();
        $this->calculateSharedCandidates();
        $this->existingPSCIDs = \Database::singleton()->pselectCol(
            'SELECT PSCID from candidate',
            array()
        );
    }

    abstract function calculateSharedCandidates();

    function processData() {
        foreach ($this->dataRows as $row) {
            // Get the old PSCID. Should always be in the column at index 0.
            $oldPSCID = $this->extractOldPSCIDFromRow($row);
            echo "Old PSCID: $oldPSCID\n";

            // Skip candidates not present in mapping file.
            if (!in_array($oldPSCID, $this->sharedCandidates, true)) {
                echo "skipping\n";
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
                // Don't add a skipped candidate to the skipped array if we've already
                // encountered it. This can occur for example when multiple visit labels
                // are listed for a single candidate.
                $skippedAlready = in_array(
                    $newPSCID,
                    $this->candidatesSkipped,
                    true
                );
                if (!$skippedAlready) {
                    $this->skippedPSCIDs[] = $newPSCID;
                }
                continue;
            }
            // Child classes will determine what information should
            // be included in a given query.
            $this->buildSQLQuery($row);
        }
    }

    abstract function buildSQLQuery(array $row);

    function hasSharedCandidates() {
        return count($this->sharedCandidates);
    }

    function newPSCID(string $oldPSCID): ?string {
        return $this->PSCIDMapping[$oldPSCID] ?? null;
    }

    function newCandID(string $newPSCID): ?string {
        return $this->candIDMapping[$newPSCID] ?? null;
    }


    function report() {
        $report = array_merge(
            $this->formatUPDATEStatements(),
            $this->formatINSERTStatements()
        );
        return join("\n", $report);
    }

    /**
     * Get the value of the PSCID in the source database from a given CSV
     * row.
     */
    protected function extractOldPSCIDFromRow(array $row) {
        return $row[$this->dataHeaders[self::OLD_PSCID]];
    }

    // Build a one-to-one mapping of old to new PSCIDs with the old IDs as the key.
    // Create a mapping of PSCIDs to CandIDs to allow for direct lookup of a CandID
    // given a PSCID. It is more efficient to use this dictionary than searching the
    // CSV rows for a CandID each time we need one.
    protected function buildIDMappings() {
        foreach ($this->mappingRows as $row) {
            $oldPSCID = $row[$this->mappingHeaders[self::OLD_PSCID]];
            $newPSCID = $row[$this->mappingHeaders[self::NEW_PSCID]];
            $newCandID = $row[$this->mappingHeaders[self::NEW_CANDID]];

            $this->PSCIDMapping[$oldPSCID] = $newPSCID;
            $this->candIDMapping[$newPSCID] = $newCandID;
        }
    }

    protected function populateDataFromCSVs(
        SplFileInfo $mappingFile, 
        SplFileInfo $dataFile
    ) {
        // Basic validation -- readable
        // Get data from CSV files.
        $this->mappingRows = self::populateArrayFromCSV($mappingFile);
        $this->dataRows = self::populateArrayFromCSV($dataFile);

        // Creating these arrays allows referencing the columns by index. This allows the
        // use of name constants to access the data from within the CSV files instead
        // of hard-coding column names into this script.
        $this->mappingHeaders = array_keys($this->mappingRows[0]);
        $this->dataHeaders = array_keys($this->dataRows[0]);
    }


    // Format commands for printing.
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
        $report = array();
        foreach ($commandQueue as $command) {
            $setString = array();
            $whereString = array();
            // Iterate over all columns and create a formatted string. Will only be one
            // column for COLUMN_IMPORT mode but several for VISIT_IMPORT.
            foreach ($command['data'] as $column => $value) {
                $value = $this->quoteWrapUnlessNULL($value);
                $setString[] = "$column = $value";
            }
            // Interpolate the $setString into the SQL heredoc above and add it to the
            // final $report output.
            foreach ($command['where'] as $column => $value) {
                $whereString[] = "$column = '$value'";
            }
            $report[] = sprintf(
                $formattedCommand, 
                $this->table,
                implode(', ', $setString),
                implode(' AND ', $whereString)
            );
        }
        return $report;
    }

    /**
     *
     * @return string[]
     */
    protected function formatINSERTStatements(): array {
        $commandQueue = $this->INSERTQueue;
        if (count($commandQueue) < 1) {
            return array();
        }
        // Format commands for printing.
        $report = array();
        $formattedCommand = <<<SQL
INSERT INTO %s
(%s)
VALUES(%s);

SQL;
        foreach ($commandQueue as $command) {
            $report[] = sprintf(
                $formattedCommand,
                $this->table,
                implode(',', array_keys($command['data'])),
                implode(',', array_map(array($this, 'quoteWrapUnlessNULL'), array_values($command['data'])))
            );
        }
        return $report;
    }


    // Converts a csv file into a two-dimensional PHP array where each element
    // contains an associative array of the column names and the values.
    //
    // e.g. file.csv:
    //
    //      oldPSCID,newPSCID,newCandID
    //      MON001,MON999,123456
    //      ...
    //
    // becomes:
    // [0] => Array (
    //     [oldPSCID] => MON001,
    //     [newPSCID] => MON999,
    //     [newCandID] => 123456
    // ),
    // ...
    //
    // @throws InvalidArgumentException If no data in files or if they're inaccessible
    //
    // @return array The contents of the CSV file loaded into an associative array.
    //
    public static function populateArrayFromCSV(SplFileInfo $filename): array {
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
     * Example:
     *
     * @param string $filename Path to the CSV file
     * @param string $delimiter The separator used in the file
     * @return array
     * @link http://gist.github.com/385876
     * @author Jay Williams <http://myd3.com/>
     * @copyright Copyright (c) 2010, Jay Williams
     * @license http://www.opensource.org/licenses/mit-license.php MIT License
     */
    static function csvToArray(string $filename='', string $delimiter=','): array
    {
        if(!file_exists($filename) || !is_readable($filename))
            return array();

        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== FALSE)
        {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== FALSE)
            {
                if (!$header)
                    $header = $row;
                else
                    $data[] = array_combine($header, $row);
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
     * @return string The param surrounded by single quotes.
     */
    function quoteWrapUnlessNULL(string $string): string
    {
        if ($string === 'NULL') {
            return $string;
        }
        return sprintf("'%s'", $string);
    }
}



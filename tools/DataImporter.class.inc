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

    /* The table in the DB to update */
    protected $table = '';

    /* The table in the DB to update */
    protected $sharedCandidates = array();

    /* A mapping of old PSCIDs to new PSCIDS. */
    protected $PSCIDMapping = array();

    /* A mapping of new PSCIDs to new CandIDs */
    protected $candIDMapping = array();
   
    // This class should not be instantiated directly.
    private function __construct() {
    }

    abstract function calculateSharedCandidates();

    function hasSharedCandidates() {
        return count($this->sharedCandidates);
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
        $this->mappingHeaders = array_keys($mappingRows[0]);
        $this->dataHeaders = array_keys($dataRows[0]);
    }


    // Format commands for printing.
    protected function formatUPDATEStatements(array $commandQueue)
    {
        if (count($commandQueue) < 1) {
            return array();
        }
        $table = $commandQueue[0]['table'];
        $formattedCommand = <<<SQL
UPDATE $table
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
                $value = quoteWrapUnlessNULL($value);
                $setString[] = "$column = $value";
            }
            // Interpolate the $setString into the SQL heredoc above and add it to the
            // final $report output.
            foreach ($command['where'] as $column => $value) {
                $whereString[] = "$column = '$value'";
            }
            $report[] = sprintf(
                $formattedCommand, 
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
    protected function formatINSERTStatements(array $commandQueue, array $columnNames): array {
        if (count($commandQueue) < 1) {
            return array();
        }
        // Format commands for printing.
        $report = array();
        $table = $commandQueue[0]['table'];
        $formattedCommand = <<<SQL
INSERT INTO $table
(%s)
VALUES(%s);

SQL;
        foreach ($commandQueue as $command) {
            $report[] = sprintf(
                $formattedCommand,
                implode(',', array_keys($command['data'])),
                implode(',', array_map('quoteWrapUnlessNULL', array_values($command['data'])))
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
    public static function populateArrayFromCSV(string $filename): array {
        $data = csvToArray($filename);
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
    function csvToArray(string $filename='', string $delimiter=','): array
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
     *
     */
    function quoteWrapUnlessNULL(string $string): string
    {
        if ($string === 'NULL') {
            return $string;
        }
        return sprintf("'%s'", $string);
    }
}



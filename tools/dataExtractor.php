<?php declare(strict_types=1);
/**
 * This script, given a table and a column name, will grab all the cells from
 * that column and create a CSV file containing that data alongside the
 * PSCID corresponding to the candidate whom that data describes.
 *
 * It is intended to work with the dataImporter.php tool to selectively push
 * data from one LORIS instance to another by joining on PSCIDs.
 *
 * NOTE This script is currenly a prototype and so its functionalit is limited
 * to grabbing columns from the `candidate` table in LORIS.
 *
 * @category Tools
 * @package  Open Science
 * @author   John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 *
 */

require_once "generic_includes.php";

const NUM_ARGS_REQUIRED = 3;

/**
 * Command line argument for the mode of data importation.
 */
const COLUMN_EXPORT = 'column';
const INSTRUMENT_EXPORT = 'instrument';
const VISIT_EXPORT = 'visits';

/**
 * The LORIS subfolder where output file will be written.
 *
 * @var string
 */
const OUTPUT_FOLDER = 'project/data_export/';


// TODO Make Usage message more informative.
$usage = <<<USAGE
Usage: 
To export a columns from a specified table:
php {$argv[0]} %s <table> <column[,column2,...]> <date> [outfile]\n
       <table>      The name of a table in the database from which to extract
                    data.
       <column>     The name of a column in the database from which to extract
                    data. Can also specify multiple columns using a 
                    comma-separated list.
       <date>       Values in the table that occur before this date will
                    be excluded. Used in instrument extraction. 
                    Format YYYY-MM-DD.
       [outfile]    Optional. The target path (parent folder) where CSV data
                    will be written. Default is LORIS_BASE/project/data_export/.

To export columns from an instrument table specifically:
php {$argv[0]} %s <table> <column[,column2,...]> <date> [outfile]\n
       <table>      The name of a table in the database from which to extract
                    data. Should correspond to an instrument.
       <column>     The name of a column in the database from which to extract
                    data. Can also specify multiple columns using a 
                    comma-separated list.
                    The CommentID column will always be included so it is not
                    necessary to provide it in this list.
       <date>       Values in the table that occur before this date will
                    be excluded. Used in instrument extraction. 
                    Format YYYY-MM-DD.
       [outfile]    Optional. The target path (parent folder) where CSV data
                    will be written. Default is LORIS_BASE/project/data_export/.

To export candidate session information:
php {$argv[0]} %s <date> [outfile]\n
       <date>       Values in the session table that occur before this date will
                    be excluded. This is required for ethics. Format YYYY-MM-DD.
       [outfile]    Optional. The target path (parent folder) where CSV data
                    will be written. Default is LORIS_BASE/project/data_export/.

USAGE;

$usageError = sprintf($usage, COLUMN_EXPORT, INSTRUMENT_EXPORT, VISIT_EXPORT);

// Ensure minimum number of arguments are present
if (count($argv) < NUM_ARGS_REQUIRED) {
    die ($usageError);
}

// Ensure that the execution mode passed to the script is supported.
$mode = $argv[1];
if ($mode !== COLUMN_EXPORT 
    && $mode !== VISIT_EXPORT 
    && $mode !== INSTRUMENT_EXPORT
) {
    die ($usageError);
}

// Create default output path. This value will be overwritten below if a user
// specifies a custom path.
// e.g. /var/www/loris/project/data_export/
$filepath = $config->getSetting('base') . OUTPUT_FOLDER;

$query = '';
$params = array();

if ($mode === VISIT_EXPORT)
{
    $cutoffDate = $argv[2];
    // Overwrite default path if a custom path was specified by user.
    $filepath = $argv[3] ?? $filepath;

    $filename = 'visits_dataExtract_output.csv';
    // Get visit label information from the `session` table.
    // All date/dateime fields are excluded from the query as they are potentially 
    // identifying. Visit statuses reflecting a Failure, Withdrawal, or 
    // Recycling Bin are also excluded.
    $sessionColumns = array(
        'CenterID',
        'VisitNo',
        'Visit_label',
        'SubprojectID',
        'Submitted',
        'Current_stage',
        'Screening',
        'Visit',
        'Approval',
        'Active',
        'Hardcopy_request',
        'BVLQCStatus',
        'BVLQCType',
        'BVLQCExclusion',
        'QCd',
        'Scan_done',
        'MRIQCStatus',
        'MRIQCPending',
        'MRICaveat'
    );

    // Build query information
    
    // Add abbreviations to columns. 
    // E.g. QCd --> s.QCd (for `session s` in SQL statement).
    $columnQuery = implode(
        ',', 
        prependTableAbbreviation($sessionColumns, 's')
    );

    $query = "SELECT " .
        "c.PSCID,$columnQuery " .
        "FROM session s " .
        "INNER JOIN candidate c " .
        "ON c.CandID = s.CandID " .
        "WHERE Visit NOT IN ('Failure', 'Withdrawal') " .
        "AND Current_stage != 'Recycling Bin' " .
        "AND DATE(Date_visit) < :cutoffDate";

    $params = array('cutoffDate' => $cutoffDate);

    // Prepend PSCID to the array column headers so that it will be properly
    // marked in the CSV output.
    array_unshift($sessionColumns, 'PSCID');
    $headers = $sessionColumns;
} else {
    // COLUMN and INSTRUMENT export are similar in many ways so they have shared
    // preprocessing below.
    if (!isset($argv[4])) {
        // Ensure minimum number of arguments are present.
        // Done separately here since COLUMN_EXPORT and INSTRUMENT_EXPORT 
        // require more args than
        // VISIT_EXPORT. 
        // TODO This should likely be refactored at some point.
        die ($usageError);
    }

    // The Database table from which to extract data.
    $table = $argv[2];
    if ($table === 'session') {
        die (
            'Please use the `visits` extraction mode to retrive information ' .
            'from the session table.' . PHP_EOL
        );
    }

    // A single column or list of columns joined by commas, e.g. "DoB,Sex"
    $column = $argv[3];

    $cutoffDate = $argv[4];
    //
    // Overwrite default path if a custom path was specified by user.
    $filepath = $argv[5] ?? $filepath;

    // Format of output filename: <table_column_dataExtract_output.csv>
    $filename = sprintf(
        "%s_dataExtract_output.csv", 
        $table, 
    );

    if ($mode === COLUMN_EXPORT) {
        // Create an array containing 'PSCID' and the column names from the
        // command line input. Then join them as a comma-separated string (to be
        // written as the headers to the CSV file).
        $headers = array_merge(array('PSCID'), explode(',', $column));

        // Build basic SQL query info.
        $query = "SELECT PSCID,$column from $table";
        $params = array();
    } else if ($mode === INSTRUMENT_EXPORT) {
        // Query whether a tabel has the `Date taken` column. 
        // If so we
        // will add $cutoffDate to the WHERE clause of the query that will grab
        // the data from $table.
        // If not, then the table is not an instrument table so the script exits.
        $result = $DB->pselect(
            "SHOW COLUMNS FROM $table LIKE 'Date_taken'",
            array()
        );
        if (empty($result)) {
            die ("Table $table is does not contain instrument information.\n");
        }
        unset($result);

        $headers = explode(',', $column);


        
        // Add abbreviations to columns. 
        // E.g. QCd --> s.QCd (for `session s` in SQL statement).
        $columnQuery = implode(',', prependTableAbbreviation($headers, 't'));

        $query = "SELECT c.PSCID, s.Visit_label, $columnQuery
            from candidate c
            INNER JOIN session s ON c.CandID = s.CandID
            INNER JOIN flag f ON f.SessionID = s.ID
            INNER JOIN $table t ON t.CommentID = f.CommentID
            WHERE DATE(t.Date_taken) < :cutoffDate " .
            'AND f.CommentID NOT LIKE "DDE%"';

        $params['cutoffDate'] = $cutoffDate;
        
        // Prepend PSCID and Visit_label to the CSV headers so that they will
        // be recorded properly in the output
        array_unshift($headers, 'Visit_label');
        array_unshift($headers, 'PSCID');
    }
}

// Grab info from the database.
$result = $DB->pselect(
    $query,
    $params
);

if (count($result) < 1) {
    die ('No results found for the given criteria.' . PHP_EOL);
}

// Write data to CSV.
writeToCsv(
    new SplFileInfo($filepath . $filename), 
    $headers,
    $result
);

/**
 * Write array to CSV file.
 *
 * @param SplFileInfo $filename The absolute path to the output file.
 * @param array $headers The headers/column names of the CSV output file
 * @param array $data The rows to write to the CSV file.
 *
 * @return void
 */
function writeToCsv(SplFileInfo $file, array $headers, array $data): void {
    // Create $filepath if it doesn't exist.
    if (!is_dir($file->getPath())) {
        mkdir($file->getPath());
    }
    try {
        $fileObj = $file->openFile('w');
    } catch (RuntimeException $e) {
        throw new InvalidArgumentException(
            'Could not open ' . $file->getRealPath() . ' for writing.' .
            $e-getMessage()
        );
    }
    // Write CSV headers
    $fileObj->fputcsv($headers);

    foreach ($data as $row) {
        $output = $row;
        // Make sure that we write null values as NULL to the CSV file. The
        // default behaviour is writing an empty string.
        foreach($row as $key => $value) {
            if (is_null($value)) {
                $output[$key] = 'NULL';
            }
        }

        $fileObj->fputcsv($output);
    }
    echo 'Content written to CSV file at ' . $file->getRealPath() . PHP_EOL;
}

/**
 *
 * @return array
 */
function prependTableAbbreviation(array $columnNames, string $prefix) {
    $result = array();
    foreach ($columnNames as $column) {
        $result[] = "$prefix.$column";
    }
    return $result;
}

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

const NUM_ARGS_REQUIRED = 2;

/**
 * Command line argument for the mode of data importation.
 */
const COLUMN_EXPORT = 'column';
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
php {$argv[0]} %s <table> <column[,column2,...]> [outfile]\n
       <table>      The name of a table in the database from which to extract
                    data.
       <column>     The name of a column in the database from which to extract
                    data. Can also specify multiple columns using a 
                    comma-separated list.
       [outfile]    Optional. The target path (parent folder) where CSV data
                    will be written. Default is LORIS_BASE/project/data_export/.

To export candidate session information:
php {$argv[0]} %s [outfile]\n
       [outfile]    Optional. The target path (parent folder) where CSV data
                    will be written. Default is LORIS_BASE/project/data_export/.

USAGE;

// Ensure minimum number of arguments are present
if (count($argv) < NUM_ARGS_REQUIRED) {
    die (sprintf($usage, COLUMN_EXPORT, VISIT_EXPORT));
}

// Ensure that the execution mode passed to the script is supported.
$mode = $argv[1];
if ($mode !== COLUMN_EXPORT && $mode !== VISIT_EXPORT) {
    die (sprintf($usage, COLUMN_EXPORT, VISIT_EXPORT));
}

// Create default output path. This value will be overwritten below if a user
// specifies a custom path.
// e.g. /var/www/loris/project/data_export/
$filepath = $config->getSetting('base') . OUTPUT_FOLDER;

switch ($mode) {
case COLUMN_EXPORT:
    // The Database table
    $table = $argv[2];
    if ($table === 'session') {
        die (
            'Please use the `visits` extraction mode to retrive information ' .
            'from the session table.' . PHP_EOL
        );
    }
    if (!isset($argv[3])) {
        // Ensure minimum number of arguments are present.
        // Done separately here since COLUMN_EXPORT requires more args than
        // VISIT_EXPORT. 
        // This should likely be refactored at some point.
        die (sprintf($usage, COLUMN_EXPORT, VISIT_EXPORT));
    }
    // A single column or list of columns joined by commas, e.g. "DoB,Sex"
    $column = $argv[3];
    // NOTE Prototype only allows `candidate` for $col
    if ($table !== 'candidate') {
        die(
            'Only columns from the `candidate` table are currently supported.' 
            . PHP_EOL
        );
    }
    // Grab info from $DB
    $result = $DB->pselect(
        "SELECT PSCID,$column from $table",
        array()
    );

    // Overwrite default path if a custom path was specified by user.
    $filepath = $argv[4] ?? $filepath;

    // Format of output filename: <table_column_dataExtract_output.csv>
    $filename = sprintf(
        "%s_%s_dataExtract_output.csv", 
        $table, 
        // Convert comma in column list to underscore, if present.
        str_replace(',', '_', $column)
    );

    // Create an array containing 'PSCID' and the column names from the
    // command line input. Then join them as a comma-separated string (to be
    // written as the headers to the CSV file).
    $headers = array_merge(array('PSCID'), explode(',', $column));

    break;
case VISIT_EXPORT:
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
    // Add abbreviations to columns. 
    // E.g. QCd --> s.QCd (for `session s` in SQL statement).
    $columnQuery = implode(',', 
        array_map(
            'prependSessionAbbreviation', 
            $sessionColumns
        )
    );

    $query = "SELECT " .
        "c.PSCID,$columnQuery " .
        "FROM session s " .
        "INNER JOIN candidate c " .
        "ON c.CandID = s.CandID " .
        "WHERE Visit NOT IN ('Failure', 'Withdrawal') " .
        "AND Current_stage != 'Recycling Bin';";

    $result = $DB->pselect($query, array());
    
    // Overwrite default path if a custom path was specified by user.
    $filepath = $argv[2] ?? $filepath;

    $filename = 'visits_dataExtract_output.csv';
    // Prepend PSCID to the array column headers so that it will be properly
    // marked in the CSV output.
    array_unshift($sessionColumns, 'PSCID');
    $headers = $sessionColumns;
    break;
}
// Write data to CSV
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
 * Callback used to append the string 's.' to all column names to be used in
 * querying the `session` table.
 *
 * @param string $column The value to be prepended to.
 *
 * @return string
 */
function prependSessionAbbreviation(string $column) {
    return "s.$column";
}

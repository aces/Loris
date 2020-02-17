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

$usage = <<<USAGE
Usage: php {$argv[0]} <table> <column>\n
USAGE;

if (count($argv) < NUM_ARGS_REQUIRED) {
    die($usage);
}

// NOTE Prototype only allows `candidate` for $col
if ($argv[1] !== 'candidate') {
    die(
        'Only columns from the `candidate` table are currently supported.' 
        . PHP_EOL
    );
}

$table = $argv[1];
$column = $argv[2];

// Grab info from $DB
$result = $DB->pselect(
    "SELECT PSCID,$column from $table",
    array()
);

// Format of output filename: <table_column_dataExtract_output.csv>
$filename = sprintf("%s_%s_dataExtract_output.csv", $table, $column);

// Write PSCID and queried column data to CSV output.
// NOTE Data must be linked to PSCID for now
writeToCsv($filename, array('PSCID', $column), $result);
unset($result);
unset($filename);

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
// Add abbreviations to columns
$columnQuery = implode(',', array_map(
    'prependSessionAbbreviation', 
    $sessionColumns));

$query = "SELECT " .
    "c.PSCID,$columnQuery " .
    "FROM session s " .
    "INNER JOIN candidate c " .
    "ON c.CandID = s.CandID " .
    "WHERE Visit NOT IN ('Failure', 'Withdrawal') " .
    "AND Current_stage != 'Recycling Bin';";

$result = $DB->pselect($query, array());
print_r($result);

$filename = 'visits_dataExtract_output.csv';
// Prepend PSCID to the array column headers so that it will be properly
// marked in the CSV output.
array_unshift($sessionColumns, 'PSCID');
writeToCsv($filename, $sessionColumns, $result);


function writeToCsv(string $filename, array $headers, array $data): void {
    $fp = fopen($filename, 'w');
    if (!$fp) {
        throw new InvalidArgumentException(
            "Could not open $filename for writing." . PHP_EOL
        );
    }
    // Write CSV headers
    fputcsv($fp, $headers);

    foreach($data as $row) {
        fputcsv($fp, $row);
    }
}

/**
 * Callback used to append the string 's.' to all column names to be used in
 * querying the `session` table.
 */
function prependSessionAbbreviation(string $column) {
    return "s.$column";
}

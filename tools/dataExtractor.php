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

$fp = fopen($filename, 'w');

if (!$fp) {
    die ("Could not open $filename for writing." . PHP_EOL);
}
// Write CSV headers
// NOTE Right now data must be linked to PSCID.
fputcsv($fp, array('PSCID',$column));

foreach($result as $fields) {
    fputcsv($fp, $fields);
}

<?php
/**
 * This script is the part of the second step for normalizing the mri_protocol table.
 * It populates the new min & max columns for each field that can contain ranges and
 * returns SQL statements to remove the old %_range columns.
 *
 * "Usage: php normalize_mri_protocol_range_data.php [tosql]";
 * "Example: php normalize_mri_protocol_range_data.php tosql";
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */
require_once 'generic_includes.php';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';

// set default arguments
$confirm = false;
$printToSQL = false;
// SQL output
$output     = "";

// check if the 'tosql' option is passed
if (!empty($argv[1]) && $argv[1] == "tosql") {
  $printToSQL = true;
}

$DB = \Database::singleton();

// get all "ID" values from the mri_protocol table
$mp_idx = $DB->pselect("SELECT ID FROM mri_protocol", array());
$idx = array();
foreach($mp_idx as $num => $value) {
    array_push($idx, $value["ID"]);
}

// get all column names like "%_range" from mri_protocol table
$mp_columns = $DB->pselect("SELECT column_name FROM information_schema.columns WHERE table_name='mri_protocol'", array());
$mp_range_columns = array();
foreach($mp_columns as $id => $value) {
    if (substr($value["column_name"], -5) == "range") {
        array_push($mp_range_columns, $value["column_name"]);
    }
}

foreach($idx as $id) {
    $mp_data = $DB->pselect("SELECT * FROM mri_protocol mp WHERE mp.ID=:id", array('id' => $id));
    $data_to_insert = array();
    foreach($mp_range_columns as $range_col) {
        $col_data = explode("-", $mp_data[0][$range_col]);
        $col_name = str_replace('range', '', $range_col);
        $col_min = $col_name . "min";
        $col_max = $col_name . "max";
        if (sizeof($col_data) > 1) {
            $data_to_insert[$col_min] = $col_data[0];
            $data_to_insert[$col_max] = $col_data[1];
        } else if (sizeof($col_data) == 1 && $col_data[0] != "") {
            $data_to_insert[$col_min] = $col_data[0];
            $data_to_insert[$col_max] = $col_data[0];
        }
    }
    $not_null = 0;
    foreach ($data_to_insert as $data) {
        if ($data != null) {
            $not_null += 1;
        }
    }
    // only update non-null range cols 
    if ($not_null > 0) {
        $DB->update("mri_protocol", $data_to_insert, array('ID' => $id));
    }
}

echo("Data insertion for new min & max columns is complete.\n");

foreach($mp_range_columns as $range_column) {
    $output .= "ALTER TABLE mri_protocol DROP $range_column;\n";
}

if ($printToSQL) {
  _exportSQL($output);
} else {
  echo("Please execute the following SQL statements to delete the original range columns.\n\n");
  echo($output);
}

function _exportSQL ($output) {
    //export file
    $filename = __DIR__ . "/../project/tables_sql/DELETE_mri_protocol_range_columns.sql";
    $fp       = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

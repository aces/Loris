<?php
/**
 * This script is the part of the second step for normalizing the mri_protocol table. It populates the new min & max columns for each field that
 * can contain ranges and returns SQL statements to remove the old %_range columns.
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
$DB = \Database::singleton();

// get all "ID" values from the mri_protocol table
$mp_idx = $DB->pselect("SELECT ID FROM mri_protocol_3", array());
$idx = array();
foreach($mp_idx as $num => $value) {
    array_push($idx, $value["ID"]);
}

// get all column names like "%_range" from mri_protocol table
$mp_columns = $DB->pselect("SELECT column_name FROM information_schema.columns WHERE table_name='mri_protocol_3'", array());
$mp_range_columns = array();
foreach($mp_columns as $id => $value) {
    if (substr($value["column_name"], -5) == "range") {
        array_push($mp_range_columns, $value["column_name"]);
    }
}

foreach($idx as $id) {
    $mp_data = $DB->pselect("SELECT * FROM mri_protocol_3 mp WHERE mp.ID=:id", array('id' => $id));
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
    $DB->update("mri_protocol_3", $data_to_insert, array('ID' => $id));
}

echo("Data insertion for new min & max columns is complete. Please execute the
      following SQL commands to delete the original range columns\n\n.");

foreach($mp_range_columns as $range_column) {
  echo("DELETE $range_column FROM mri_protocol\n"); 
}

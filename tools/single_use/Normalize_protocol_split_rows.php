<?php
/**
 * This script is the first step to normalizing the  table for projects which store
 * comma-separated values. This script splits up cells containing commas by creating new rows for
 * each value and maintaining unique combinations of values.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Liza Levitis <llevitis.mcin@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris
 */

require_once __DIR__ . '/../generic_includes.php';
require_once 'Database.class.inc';
require_once 'Utility.class.inc';

/*
 * Converts an array of arrays of values for different fields into
 * an array of unique combinations of the different values.
 */
function cartesian($input)
{
    // filter out empty values
    $result = array(array());
    foreach ($input as $key => $values) {
        $append = array();
        foreach($result as $product) {
            foreach($values as $item) {
                $product[$key] = $item;
                // remove $key with empty value so that
                // an empty string isn't inserted into the database instead of a default NULL value
                if ($product[$key] == "") {
                    unset($product[$key]);
                }
                $append[] = $product;
            }
        }
        $result = $append;
    }
    return $result;
}

function split_commas($table_name)
{
    $DB = \Database::singleton();
    // Get the list of unique IDs from the table
    $rows         = $DB->pselect("SELECT * FROM ".$table_name."", array());
    $total_commas = 0;
    foreach ($rows as $row) {
        $num_commas = 0;
        foreach($row as $key => $value) {
            if ($key == "ID") {
                $id = $row[$key];
            }
            $row[$key] = explode(",", $value);
            if (sizeof($row[$key]) > 1) {
                $num_commas += sizeof($row[$key]) - 1;
            }
        }
        $total_commas += $num_commas;
        if ($num_commas == 0) {
            continue;
        }
        $all_combinations = cartesian($row);
        foreach ($all_combinations as $combination) {
            unset($combination["ID"]);
            $DB->insert($table_name, $combination);
        }
        // remove the row for the original ID
        $DB->delete($table_name, array("ID" => $id));
    }
    if ($total_commas == 0) {
        echo("$table_name: No commas have been detected in $table_name. The table has been unaltered.\n\n");
    } else {
        echo("$table_name: All $table_name entries are now unique and not comma-separated.\n\n");
    }
}

$tables_to_normalize = array(
                        "mri_protocol",
                        "mri_protocol_checks",
                       );
foreach ($tables_to_normalize as $table) {
    split_commas($table);
}
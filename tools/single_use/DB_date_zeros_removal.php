#!/usr/bin/env php
<?php declare(strict_types=1);

/**
 * Script exporting Update statements to remove 0000-00-00 values
 * and replace them by NULL
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Rida Abou-Haidar <rida.loris@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../generic_includes.php';

$database = $config->getSetting('database');

$db->_trackChanges = false;

// Set up variables
$currentDate    = date("Y-m-d");
$filename       = __DIR__
. "/../../SQL/Archive/18.0/" . $currentDate ."-update_zero_fields_statements.sql";
$output         = "";
$alters         ="";
$updates        ="";
$nonNullUpdates ="";

// Begin Script
echo "\n#################################################################\n\n".
    "This Script will generate an UPDATE statement for every date field ".
    "currently in the database. \nThe output file is SQL/Archive/18.0/".
    $currentDate . "-update_zero_fields_statements.sql and includes foreign key ".
    "checks disabling and re-enabling.\n".
    "\n#################################################################\n\n";

$database_name = $database['database'];

$field_names = $DB->pselect(
    "
                      SELECT
                          TABLE_NAME,
                          COLUMN_NAME,
                          COLUMN_DEFAULT,
                          DATA_TYPE,
                          IS_NULLABLE,
                          COLUMN_TYPE,
                          EXTRA
                      FROM INFORMATION_SCHEMA.COLUMNS
                      WHERE DATA_TYPE IN ('date','timestamp','datetime')
                          AND TABLE_SCHEMA=:dbn",
    ["dbn" => $database['database']]
);

// First pass detecting all 'on update CURRENT_TIMESTAMP' fields.
// these fields need to be included in the update statements to
// avoid them being updated to the time the script was run
$autoUpdateFields = [];
foreach ($field_names as $key => $field) {
    if (strstr($field['EXTRA'], 'on update CURRENT_TIMESTAMP') !== false) {
        $autoUpdateFields[$field['TABLE_NAME']][] = $field['COLUMN_NAME'];
    }
}

// BEGIN building script

//save old variables
$output .="SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; \n";
$output .="SET @OLD_sql_mode=@@sql_mode; \n";

//disable obstacles
$output .="SET FOREIGN_KEY_CHECKS=0; \n";
$output .="SET sql_mode = ''; \n";

foreach ($field_names as $key => $field) {
    //check for auto-updated fields and generate SQL string if needed
    $autoUpdateSQL = '';
    if (array_key_exists($field['TABLE_NAME'], $autoUpdateFields)) {
        foreach ($autoUpdateFields[$field['TABLE_NAME']] as $col) {
            $autoUpdateSQL .= ", ".$DB->escape($col)."=".$col;
        }
    }

    if ($field['COLUMN_DEFAULT']=='0000-00-00') {
        echo "The script will modify the date schema for TABLE: `"
            . $field['TABLE_NAME']
            . "` FIELD: `"
            . $field['COLUMN_NAME']
            . "` to default to NULL\n";
        $alters .= "ALTER TABLE ".$DB->escape($field['TABLE_NAME'])
            . " MODIFY "
            . $DB->escape($field['COLUMN_NAME'])
            . " "
            . $field['COLUMN_TYPE']." NULL DEFAULT NULL;\n";
    } elseif ($field['COLUMN_DEFAULT']=='0000-00-00 00:00:00') {
        echo "The script will modify the date schema for TABLE: `"
            . $field['TABLE_NAME']
            . "` FIELD: `"
            . $field['COLUMN_NAME']
            . "` to default to NULL\n";
        $alters .= "ALTER TABLE "
            . $DB->escape($field['TABLE_NAME'])
            . " MODIFY "
            . $DB->escape($field['COLUMN_NAME'])
            . " "
            . $field['COLUMN_TYPE']
            . " NULL DEFAULT NULL;\n";
    }

    if ($field['DATA_TYPE'] == 'date' && $field['IS_NULLABLE'] == 'YES') {
        $updates .= "UPDATE "
            . $DB->escape($database['database'])
            . "."
            . $DB->escape($field['TABLE_NAME'])
            . " SET "
            . $DB->escape($field['COLUMN_NAME'])
            . "=NULL"
            . $autoUpdateSQL
            . " WHERE CAST(".$DB->escape($field['COLUMN_NAME'])
            . " AS CHAR(20))='0000-00-00';\n";
    } elseif (($field['DATA_TYPE']=='datetime' || $field['DATA_TYPE']=='timestamp')
        && $field['IS_NULLABLE']=='YES'
    ) {
        $updates .= "UPDATE "
            . $DB->escape($database['database'])
            . "."
            . $DB->escape($field['TABLE_NAME'])
            . " SET "
            . $DB->escape($field['COLUMN_NAME'])
            . "=NULL"
            . $autoUpdateSQL
            . " WHERE CAST("
            . $DB->escape($field['COLUMN_NAME'])
            . " AS CHAR(20))='0000-00-00 00:00:00';\n";
    } else {
        if ($field['DATA_TYPE'] == 'date') {
            echo "COLUMN "
                . $field['COLUMN_NAME']
                . " in TABLE "
                . $field['TABLE_NAME']
                . " is NOT NULLABLE. "
                . "A date '1000-01-01' will be entered "
                . "instead of '0000-00-00' values.\n";
            $nonNullUpdates .= "UPDATE "
                . $DB->escape($database['database'])
                . "."
                . $DB->escape($field['TABLE_NAME'])
                . " SET "
                . $DB->escape($field['COLUMN_NAME'])
                . "='1000-01-01'"
                . $autoUpdateSQL
                . " WHERE CAST(".$DB->escape($field['COLUMN_NAME'])
                . " AS CHAR(20))='0000-00-00';\n";
        } elseif ($field['DATA_TYPE'] == 'datetime') {
            echo "COLUMN "
                . $field['COLUMN_NAME']
                . " in TABLE "
                . $field['TABLE_NAME']
                . " is NOT NULLABLE. "
                . "A datetime '1000-01-01 00:00:00' will be entered "
                . "instead of '0000-00-00' values.\n";
            $nonNullUpdates .= "UPDATE "
                . $DB->escape($database['database'])
                . "."
                . $DB->escape($field['TABLE_NAME'])
                . " SET "
                . $DB->escape($field['COLUMN_NAME'])
                . "='1000-01-01 00:00:00'"
                . $autoUpdateSQL
                . " WHERE CAST("
                . $DB->escape($field['COLUMN_NAME'])
                . " AS CHAR(20))='0000-00-00 00:00:00';\n";
        } elseif ($field['DATA_TYPE'] == 'timestamp') {
            echo "COLUMN "
                . $field['COLUMN_NAME']
                . " in TABLE "
                . $field['TABLE_NAME']
                . " is NOT NULLABLE. "
                . "A timestamp '1970-01-01 00:00:01' will be entered "
                . "instead of '0000-00-00' values.\n";
            $nonNullUpdates .= "UPDATE "
                . $DB->escape($database['database'])
                . "."
                . $DB->escape($field['TABLE_NAME'])
                . " SET "
                . $DB->escape($field['COLUMN_NAME'])
                . "='1970-01-01 00:00:01'"
                . $autoUpdateSQL
                . " WHERE CAST("
                . $DB->escape($field['COLUMN_NAME'])
                . " AS CHAR(20))='0000-00-00 00:00:00';\n";
        }
    }
}

$output .= $alters . $updates . $nonNullUpdates;
$output .="SET sql_mode = @OLD_sql_mode; \n";
$output .="SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; \n";
// END building script

$fp =fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);

?>

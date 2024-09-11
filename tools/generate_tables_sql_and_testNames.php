#!/usr/bin/php
<?php

/**
 * The script generate_tables_sql_and_testNames.php takes
 * the ip_output.txt file generated from lorisform_parser.php
 * and outputs an sql build file for the table of each instrument
 * it finds in the ip_output.txt file.
 * These sql files are output to the tables_sql/ subdirectory.
 *
 * Example usage:  cat ip_output.txt |  php generate_tables_sql_and_testNames.php
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . "/generic_includes.php";

$data = stream_get_contents(STDIN);

$instruments = explode("{-@-}", trim($data));

$tblCount       = 0;
$parameterCount = 0;
$pages          = [];
foreach ($instruments as $instrument) {
    $catId  = "";
    $output = "";
    $items  = explode("\n", trim($instrument));
    foreach ($items as $item) {
        $paramId = "";
        $bits    = explode("{@}", trim($item));
        if (preg_match("/Examiner[0-9]*/", $bits[1])) {
            continue;
        }
        switch ($bits[0]) {
        // generate the CREATE TABLE syntax
        case "table":
            $tablename = $bits[1];
            $filename  = __DIR__ . "/../project/tables_sql/".$tablename.".sql";
            $output   .= "CREATE TABLE `$tablename` (
                `CommentID` varchar(255) NOT NULL default '',
                `UserID` varchar(255) default NULL,
                `Examiner` varchar(255) default NULL,
                `Testdate` timestamp "
                    . "DEFAULT CURRENT_TIMESTAMP "
                    . "ON UPDATE CURRENT_TIMESTAMP,\n";
            break;

        case "page":
            if (array_key_exists(2, $bits)) {
                $pages[] = htmlspecialchars($bits[2]);
            }
            continue 2;

        // no SQL need to be generated.
        case "title":
            $title = $bits[1];

        case "header":
            continue 2;
            break;

        // generate specific column definitions for specific HTML elements
        default:
            if ($bits[1] == "") {
                continue 2;
            }
            if ($bits[0] == "select") {
                $bits[0] = enumizeOptions(
                    $bits[3],
                    $tablename ?? null,
                    $bits[1]
                );
            } elseif ($bits[0] == "selectmultiple") {
                $bits[0] = "varchar(255)";
            } elseif ($bits[0] == "textarea") {
                $bits[0] = "text";
            } elseif ($bits[0] == "text") {
                $bits[0] = "varchar(255)";
            } elseif ($bits[0] == "checkbox") {
                $bits[0] = "varchar(255)";
            } elseif ($bits[0] == "static") {
                $bits[0] = "varchar(255)";
            } elseif ($bits[0] == "numeric") {
                // without this option, default MySQL is simply numeric
                // which is traduced to "decimal(10,0)"
                // which truncates the floating point part.
                $bits[0] = "decimal(14,4)";
            }

            $output .= "`$bits[1]` $bits[0] default NULL,\n";
        }
    }
    $output .= "PRIMARY KEY (`CommentID`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n";
    print "Filename: $filename\n";
    $dirname = dirname($filename);
    if (!is_dir($dirname)) {
        mkdir($dirname, 0755, true);
    }

    $fp = fopen($filename, "w");
    fwrite($fp, $output);
    $sql = "REPLACE INTO test_names (Test_name, Full_name, Sub_group) "
         . "VALUES ('$tablename', '$title', 1);";

    fwrite($fp, $sql);
    foreach ($pages as $pageNo => $page) {
        unset($sql);
        $sql = "INSERT INTO instrument_subtests (
                  Test_name,
                  Subtest_name,
                  Description
                ) VALUES ('%s', '%s_page%s', '%s');\n";

        fprintf($fp, $sql, $tablename, $tablename, $pageNo+1, $page);
    }
    fclose($fp);
}

echo "\n\Table SQL Generation complete\n";

/**
 * Generate options to use for MySQL enums.
 *
 * @param string $options The available enum values separated by '{-}'
 * @param string $table   The name of the table.
 * @param string $name    The name of the instrument (?)
 *
 * @return $string The options formatted for MySQL enum structure.
 */
function enumizeOptions(string $options, string $table, string $name): string
{
    $options = explode("{-}", $options);
    foreach ($options as $option) {
        $option =explode("=>", $option);
        if ($option[0] != 'NULL') {
            $enum[] =$option[0];
        }
    }
    if (!is_array($enum)) {
        echo "$table $name $options\n";
    }
    $enum = implode(",", $enum);
    return "enum($enum)";
}
?>

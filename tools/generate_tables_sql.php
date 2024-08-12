#!/usr/bin/php
<?php
/**
 * The script generate_tables_sql.php takes the ip_output.txt file generated from
 * lorisform_parser.php and outputs an sql build file for the table of each
 * instrument it finds in the ip_output.txt file.  These sql files are output
 * to the tables_sql/ subdirectory.
 *
 * Usage: php generate_tables_sql.php [-D]
 * Options:
 *          [-D]: Adds DROP TABLE statement to output query
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

// Get command line options
$opts = getopt("D");

$fp   = fopen(__DIR__ . "/ip_output.txt", "r");
$data = fread($fp, filesize(__DIR__ . "/ip_output.txt"));
fclose($fp);

$instruments = explode("{-@-}", trim($data));

$tblCount       = 0;
$parameterCount = 0;
foreach ($instruments as $instrument) {
    $catId  = "";
    $output = "";
    $items  = explode("\n", trim($instrument));
    foreach ($items as $item) {
        $paramId = "";
        $bits    = explode("{@}", trim($item));
        if (preg_match(
            "/Examiner[0-9]*/",
            $bits[1] ?? null
        )
        ) {
            continue;
        }
        switch ($bits[0]) {
        // No SQL generated for these cases.
        case "testname":
        case "title":
        case "header":
            continue 2;

        // generate the CREATE TABLE syntax
        case "table":
            $tablename = $bits[1];
            $filename  = __DIR__ . "/../project/tables_sql/".$tablename.".sql";
            if (isset($opts["D"])) {
                $output = "DROP TABLE IF EXISTS `$tablename`;\n";
            }

            $output .= "CREATE TABLE `$tablename` (
                `CommentID` varchar(255) NOT NULL default '',
                `UserID` varchar(255) default NULL,
                `Examiner` varchar(255) default NULL,
                `Testdate` timestamp "
                . "DEFAULT CURRENT_TIMESTAMP "
                . "ON UPDATE CURRENT_TIMESTAMP,\n";

            break;

        // generate specific column definitions for specific types of HTML elements
        default:
            if (isset($bits[1]) && $bits[1] === '') {
                continue 2;
            }
            switch ($bits[0] ?? null) {
            case "selectmultiple":
                $bits[0] = "varchar(255)";
                break;
            case "textarea":
                $bits[0] = "text";
                break;
            case "text":
                $bits[0] = "varchar(255)";
                break;
            case "checkbox":
                $bits[0] = "varchar(255)";
                break;
            case "static":
                $bits[0] = "varchar(255)";
                break;
            case "radio":
                $bits[0] = enumizeOptions($bits[3], $table = [], $bits[1]);
                break;
            case "numeric":
                // without this option, default MySQL is simply numeric
                // which is traduced to "decimal(10,0)"
                // which truncates the floating point part.
                $bits[0] = "decimal(14,4)";
                break;
            case "select":
                $bits[0]   = enumizeOptions(
                    $bits[3] ?? null,
                    $table = [],
                    $bits[1]
                );
                break;
            }
            $output .= "`$bits[1]` $bits[0] default NULL,\n";
        }
    }
    $output .= "PRIMARY KEY  (`CommentID`)\n"
            . ") ENGINE=InnoDB DEFAULT CHARSET=utf8;\n";
    $dirname = dirname($filename);
    if (!is_dir($dirname)) {
        mkdir($dirname, 0755, true);
    }
    $fp = fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

echo "\n\Table SQL Generation complete\n";

/**
 * Generate options to use for MySQL enums.
 *
 * @param string $options The available enum values separated by '{-}'
 * @param array  $table   The name of the table.
 * @param string $name    The name of the instrument (?)
 *
 * @return $string The options formatted for MySQL enum structure.
 */
function enumizeOptions(string $options, array $table, string $name): string
{
    $options = explode("{-}", $options);
    foreach ($options as $option) {
        $option =  explode("=>", $option);
        if ($option[0] != 'NULL') {
            $enum[] = $option[0];
        }
    }
    if (!is_array($enum)) {
        echo "$table $name $options\n";
    }
    $enum = implode(",", $enum);
    return "enum($enum)";
}
?>

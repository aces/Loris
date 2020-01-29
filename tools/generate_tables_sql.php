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
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

 set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// require all relevant OO class libraries
require_once __DIR__ . "/../vendor/autoload.php";
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";

// Get command line options
$opts = getopt("D");

$fp   =fopen("ip_output.txt", "r");
$data =fread($fp, filesize("ip_output.txt"));
fclose($fp);

$instruments =explode("{-@-}", trim($data));

$tblCount       = 0;
$parameterCount = 0;
foreach ($instruments as $instrument) {
    $catId = "";
    $items = explode("\n", trim($instrument));
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
            //generate the CREATE TABLE syntax
        case "table":
            $filename = "../project/tables_sql/".$bits[1].".sql";
            $output   = "";
            if (isset($opts["D"])) {
                $output = "DROP TABLE IF EXISTS `$bits[1]`;\n";
            }
            // There's no good way to display this SQL command without exceeding
            // out line length requirements, so disable phpcs for this chunk.
            // phpcs:disable
            $output .= <<<OUTPUT
CREATE TABLE `$bits[1]` (
    `CommentID` varchar(255) NOT NULL default '',
    `UserID` varchar(255) default NULL,
    `Examiner` varchar(255) default NULL,
    `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',
OUTPUT;
            break;
            // phpcs:enable

            //no SQL need be generated.
        case "title":
        case "header":
            continue 2;

            //generate specific column definitions for specific types of HTML
            //elements
        default:
            if (isset($bits[1]) && $bits[1] === '') {
                continue 2;
            }
            switch ($bits[0] ?? null) {
            case "selectmultiple":
                $bits[0] ="varchar(255)";
                break;
            case "textarea":
                $bits[0] ="text";
                break;
            case "text":
                $bits[0] ="varchar(255)";
                break;
            case "checkbox":
                $bits[0] ="varchar(255)";
                break;
            case "static":
                $bits[0] = "varchar(255)";
                break;
            case "radio":
                $bits[0] =enumizeOptions($bits[3], $table = array(), $bits[1]);
                break;
            case "select":
                $bits[0]   =enumizeOptions(
                    $bits[3] ?? null,
                    $table = array(),
                    $bits[1]
                );
                break;
            }
            if (array_key_exists(2, $bits)) {
                $bits[2] =htmlspecialchars($bits[2]);
            }
            $output .="`$bits[1]` $bits[0] default NULL,\n";
        }
        $output .="PRIMARY KEY  (`CommentID`)\n
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n";
    }
    $fp =fopen($filename, "w");
    fwrite($fp, $output);
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
    $options =explode("{-}", $options);
    foreach ($options as $option) {
        $option =explode("=>", $option);
        if ($option[0]!='NULL') {
            $enum[] =$option[0];
        }
    }
    if (!is_array($enum)) {
        echo "$table $name $options\n";
    }
    $enum =implode(",", $enum);
    return "enum($enum)";
}
?>

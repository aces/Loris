#!/usr/bin/php
<?php
/**
 * Behavioural
 *
 * PHP Version 7
 *
 * Parses a LINST file and creates a corresponding SQL script. Optionally 
 * applies this new script automatically.
 *
 * @category Tools
 * @package  Behavioural
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once 'generic_includes.php';
// Display usage message if flag parameter is absent or invalid.
if (!isset($argv[2]) 
    || !in_array(
        $argv[2],
        array(
            '--to-sql',
            '--apply'
        ),
        true
    )
) {
    $usage = <<<USAGE
The generate_tables_sql_and_testNames.php script takes the 
{instrument_name}.linst file from the /instrument_manager  module and installs 
an instrument for the table of each instrument it finds in the 
{instrument_name}.linst file.
These sql files are written to the tables_sql/ subdirectory.

Ex cmd without SQL execution:
php generate_tables_sql_and_testNames.php
../instruments/[instrument_name].linst --to-sql

Ex cmd with SQL execution:
php generate_tables_sql_and_testNames.php 
../instruments/[instrument_name].linst --apply
USAGE; 

    echo $usage;
};

$execute_mysql_query = $argv[2] === '--apply';
$data          = file_get_contents($argv[1]);
$instruments   = explode("{-@-}", trim($data));
$error_message = "";
// Do validation
if (!is_array($instruments)) {
    $error_message = "Instrument file could not be processed.";
} else {
    $pages = array();
    $sql_query_statement  = "";
    $sql_query_table_name = "";
    $sql_query_columns    = array();
    // Setup Database object.
    $factory   = \NDB_Factory::singleton();
    $db        = $factory->database();
    foreach ($instruments as $instrument) {
        $items = explode("\n", trim($instrument));
        foreach ($items as $item) {
            $bits = explode("{@}", trim($item));
            if (preg_match("/Examiner[0-9]*/", $bits[1])) {
                continue;
            }
            switch($bits[0]) {
                // Generate the CREATE TABLE syntax
            case "table":
                // Remove backticks from table name to prevent errors when 
                // writing SQL patch file.
                $sql_query_table_name = str_replace('`', '', $db->escape($bits[1]));
                $file_name = "../project/tables_sql/".$sql_query_table_name.".sql";
                $output    = "CREATE TABLE `$sql_query_table_name` (\n";
                $output   .= "`CommentID` varchar(255) NOT NULL default '',\n"
                    ."`UserID` varchar(255) default NULL,\n"
                    ."`Examiner` varchar(255) default NULL,\n"
                    ."`Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON "
                    ."UPDATE CURRENT_TIMESTAMP,\n"
                    ."`Data_entry_completion_status` "
                    ."enum('Incomplete','Complete') "
                    ."NOT NULL default 'Incomplete',\n";
                $sql_query_statement = "CREATE TABLE `$sql_query_table_name` (\n";
                // Create first five query entries.
                $sql_query_columns[] = "`CommentID` "
                    ."varchar(255) NOT NULL default '',\n";
                $sql_query_columns[] = "`UserID` varchar(255) default NULL,\n";
                $sql_query_columns[] = "`Examiner` varchar(255) default NULL,\n";
                $sql_query_columns[] = "`Testdate` "
                    ."timestamp DEFAULT CURRENT_TIMESTAMP "
                    ."ON UPDATE CURRENT_TIMESTAMP,\n";
                $sql_query_columns[] = "`Data_entry_completion_status` "
                    ."enum('Incomplete','Complete') "
                    ."NOT NULL default 'Incomplete',\n";
                break;
            case "page":
                $pages[] = $bits[2];
                continue 2;
                // Continue as no SQL needs to be generated.
            case "title":
                $title = $bits[1];
            case "header":
                continue;
                break;
                // Generate specific column definitions for types of HTML elements
            default:
                if ($bits[1] == "") {
                    continue;
                }
                if ($bits[0] == "select") {
                    $bits[0] = enumizeOptions($bits[3]);
                } else if ($bits[0] == "selectmultiple") {
                    $bits[0] = "varchar(255)";
                } else if ($bits[0] == "textarea") {
                    $bits[0] = "text";
                } else if ($bits[0] == "text") {
                    $bits[0] = "varchar(255)";
                } else if ($bits[0] == "checkbox") {
                    $bits[0] = "varchar(255)";
                } else if ($bits[0] == "static") {
                    $bits[0] = "varchar(255)";
                } else {
                    // Sanitize $bits to mitigate SQL injection attacks.
                    $bits[0] = str_replace('`', '', $db->escape($bits[0]));
                }
                $bits[2]     = htmlspecialchars($bits[2]);
                $output     .= "`$sql_query_table_name` $bits[0] default NULL,\n";
                $column_name = str_replace('`', '', $db->escape($bits[1]));
                $sql_query_columns[] = "`$column_name` $bits[0] default NULL,\n";
            }
        }
        $output .= "PRIMARY KEY  (`CommentID`)\n) ENGINE=InnoDB"
            ." DEFAULT CHARSET=utf8;\n";
        $fp      = fopen($file_name, "w");
        fwrite($fp, $output);
        // Check if Table Name exists
        if (empty($sql_query_table_name)) {
            $error_message = "Table name does not exist";
        } else {
            fwrite(
                $fp,
                "REPLACE INTO test_names (Test_name, Full_name, Sub_group) "
                ."VALUES ('$sql_query_table_name', '$title', 1);\n"
            );
            // Writes a record of the changes to a file but is not sourced directly.
            foreach ($pages as $page_number => $page) {
                fwrite(
                    $fp,
                    "INSERT INTO instrument_subtests "
                    ."(Test_name, Subtest_name, Description)"
                    ." VALUES ('$sql_query_table_name', '"
                    .$sql_query_table_name."_page".($page_number+1)
                    ."', '$page');\n"
                );
            }
        }
        // Writes the error message to the sql file.
        if (!empty($error_message)) {
            fwrite(
                $fp,
                "/* The SQL file is invalid! \n"
                ."tools/generate_tables_sql_and_testNames.php error_message:\n"
                ."$error_message\n"
                ."*/"
            );
        }
        fclose($fp);
    }
    // Execute the SQL tasks if no error_message and CLI flag set.
    if ($db->isConnected() 
        && empty($error_message)
        && $execute_mysql_query
    ) {
        if (!$db->tableExists($sql_query_table_name)) {
            // Table doesn't exist!
            $sql_query_statement .= implode($sql_query_columns);
            $sql_query_statement .=
                "PRIMARY KEY  (`CommentID`)\n) ENGINE=InnoDB "
                ."DEFAULT CHARSET=utf8;\n";
            $statement            = $db->prepare($sql_query_statement);
            $statement->execute();
        } else {
            $error_message = "There is already an instrument installed with 
                this name.";
        }
        $statement = $db->prepare(
            'REPLACE INTO test_names (Test_name, Full_name, Sub_group)'
            .' VALUES (?, ?, 1)'
        );
        $statement->bindParam(1, $sql_query_table_name, PDO::PARAM_STR);
        $statement->bindParam(2, $title, PDO::PARAM_STR);
        $statement->execute();
        // Each page requires its own seprate query to be run.
        foreach ($pages as $page_number => $page) {
            $statement    = $db->prepare(
                'INSERT INTO instrument_subtests'
                .' (Test_name, Subtest_name, Description)'
                .' VALUES (?, ?, ?)'
            );
            $subtest_name = $sql_query_table_name . "_page" . ($page_number+1);
            $statement->bindParam(1, $sql_query_table_name, PDO::PARAM_STR);
            $statement->bindParam(2, $subtest_name, PDO::PARAM_STR);
            $statement->bindParam(3, $page, PDO::PARAM_STR);
            $statement->execute();
        }
    }
}
if ($error_message) {
    echo $error_message;
}
/**
 * Creates a partial MySQL enum statement based on options extracted from
 * a LINST file (which is in turn based on an HTML select field).
 *
 * @param array $options the enum values.
 *
 * @return string
 */
function enumizeOptions(string $options): string
{
    $enum    = array();
    $options = explode("{-}", $options);
    foreach ($options as $option) {
        $option = explode("=>", $option);
        if ($option[0] != 'NULL') {
            $enum[] = $option[0];
        }
    }
    $enum = implode(",", $enum);
    return "enum($enum)";
}

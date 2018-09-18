#!/usr/bin/php
<?php
/**
 * Behavioural
 *
 * PHP Version 7
 *
 * The generate_tables_sql_and_testNames.php takes the {instrument_name}.linst file
 * from /instrument_manager and installs an instrument for the table of each
 * instrument it finds in the {instrument_name}.linst file.
 * These sql files are output to the tables_sql/ subdirectory.
 *
 * Ex cmd with SQL execution:
 * php generate_tables_sql_and_testNames.php < ../instruments/[instrument_name].linst
 *
 * Ex cmd without SQL execution:
 * php generate_tables_sql_and_testNames.php <
 * ../instruments/[instrument_name].linst false
 *
 * @category Tools
 * @package  Behavioural
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
// require all relevant libraries
require_once "./generic_includes.php";
$execute_mysql_query = ($argv[2] ?? true) === true;
$data          = file_get_contents($argv[1]);
$instruments   = explode("{-@-}", trim($data));
$error_message = "";
// User supplied instrument(s).
if (is_array($instruments)) {
    $pages = array();
    $sql_query_statement  = "";
    $sql_query_table_name = "";
    $sql_query_columns    = array();
    // Setup Database object.
    $factory   = \NDB_Factory::singleton();
    $db        = $factory->database();
    foreach ($instruments AS $instrument) {
        $items = explode("\n", trim($instrument));
        foreach ($items AS $item) {
            $bits = explode("{@}", trim($item));
            if (preg_match("/Examiner[0-9]*/", $bits[1])) {
                continue;
            }
            switch($bits[0]) {
                // Generate the CREATE TABLE syntax
                case "table":
                    $sql_query_table_name = str_replace('`', '', $db->escape($bits[1]));
                    $file_name = "../project/tables_sql/".$bits[1].".sql";
                    $output    = "CREATE TABLE `$bits[1]` (\n";
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
                    continue;
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
                        $bits[0] = enumizeOptions(
                            $bits[3],
                            $sql_query_table_name,
                            $bits[1]
                        );
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
                    } else if ($bits[0]=="date") {
                        if (empty($bits[3])
                            || empty($bits[4])
                        ) {
                            $error_message = "Instrument(s) file has invalid "
                                . "instrument data.";
                        }
                    } else {
                        // Safety SQL injection prevention.
                        $bits[0] = str_replace('`', '', $db->escape($bits[0]));
                    }
                    $bits[2]     = htmlspecialchars($bits[2]);
                    $output     .= "`$bits[1]` $bits[0] default NULL,\n";
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
            $error_message = "Instrument(s) file has invalid instrument data.";
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
    // Execute the SQL tasks if no error_message.
    if ($db->isConnected() && empty($error_message)) {
        if (!$db->tableExists($sql_query_table_name)) {
            // Table doesn't exist!
            $sql_query_statement .= implode($sql_query_columns);
            $sql_query_statement .=
                "PRIMARY KEY  (`CommentID`)\n) ENGINE=InnoDB "
                ."DEFAULT CHARSET=utf8;\n";
            $statement            = $db->prepare($sql_query_statement);
            $statement->execute();
        } else {
            $error_message = "Instrument(s) file uses existing name.";
        }
        $statement = $db->prepare(
            'REPLACE INTO test_names (Test_name, Full_name, Sub_group)'
            .' VALUES (?, ?, 1)'
        );
        $statement->bindParam(1, $sql_query_table_name, PDO::PARAM_STR);
        $statement->bindParam(2, $title, PDO::PARAM_STR);
        if ($execute_mysql_query) {
            $statement->execute();
        }
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
            if ($execute_mysql_query) {
                $statement->execute();
            }
        }
    }
} else {
    $error_message = "Instrument(s) file has invalid instrument data.";
}
if ($error_message) {
    echo $error_message;
}
/**
 * The enumizeOptions function
 *
 * @param array  $options the enum values.
 * @param string $table   the table name used.
 * @param string $name    the enum name used.
 *
 * @return string
 */
function enumizeOptions($options, $table, $name)
{
    $enum    = [];
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

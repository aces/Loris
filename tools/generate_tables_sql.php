#!/usr/bin/php
<?php

/**
 * generate_tables_sql.php takes the ip_output.txt file generated from
 * lorisform_parser.php and outputs an sql build file for the table of each
 * instrument it finds in the ip_output.txt file.  These sql files are output
 * to the tables_sql/ subdirectory.
 *
 * Usage: php generate_tables_sql.php [-D]
 * Options:
 *          [-D]: Adds DROP TABLE statement to output query
 *
 * @package behavioural
 */

 set_include_path(get_include_path().":../project/libraries:../php/libraries:");

//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(), '4.3.0', '<')) {
    define('STDIN', fopen("php://stdin", "r"));
    register_shutdown_function(
        create_function(
            '',
            'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;'
        )
    );
}


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

$tblCount       =0;
$parameterCount =0;
foreach($instruments AS $instrument){
    $catId ="";
    $items =explode("\n", trim($instrument));
    foreach($items AS $item){
        $paramId ="";
        $bits    =explode("{@}", trim($item));
        if(preg_match("/Examiner[0-9]*/", (string)(array_key_exists(1, $bits) ? $bits[1] : null))) {
            continue;
        }
        switch($bits[0]){
            //generate the CREATE TABLE syntax
        case "table":
            $filename = "../project/tables_sql/".$bits[1].".sql";
            $output   = "";
            if (isset($opts["D"])) {
                $output = "DROP TABLE IF EXISTS `$bits[1]`;\n";
            }
            $output .= "CREATE TABLE `$bits[1]` (\n";
            $output .= "`CommentID` varchar(255) NOT NULL default '',\n
                            `UserID` varchar(255) default NULL,\n
                            `Examiner` varchar(255) default NULL,\n
                            `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n
                            `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',\n";
            break;

            //no SQL need be generated.
        case "title":
        case "header":
            continue;
            break;

            //generate specific column definitions for specific types of HTML elements
        default:
            if((array_key_exists(1, $bits) ? $bits[1] : "") == "") {
                continue;
            }
            if($bits[0]=="select") {
                $bits[0]   =enumizeOptions(
                    array_key_exists(3, $bits) ? $bits[3] : null,
                    $table = array(),
                    $bits[1]
                );
            } else if((array_key_exists(0, $bits) ? $bits[0] : null) =="selectmultiple") {
                $bits[0] ="varchar(255)";
            } else if((array_key_exists(0, $bits) ? $bits[0] : null) == "textarea") {
                $bits[0] ="text";
            } else if((array_key_exists(0, $bits) ? $bits[0] : null) == "text") {
                $bits[0] ="varchar(255)";
            } else if((array_key_exists(0, $bits) ? $bits[0] : null) == "checkbox") {
                $bits[0] ="varchar(255)";
            } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "static") {
                $bits[0] ="varchar(255)";
            } else if ((array_key_exists(0, $bits) ? $bits[0] : null) == "radio") {
                $bits[0] =enumizeOptions($bits[3], $table = array(), $bits[1]);
            }
            if(array_key_exists(2, $bits)) {
                $bits[2] =htmlspecialchars($bits[2]);
            }
            $output .="`$bits[1]` $bits[0] default NULL,\n";
        }

    }
    $output .="PRIMARY KEY  (`CommentID`)\n
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n";
    $fp      =fopen($filename, "w");
    fwrite($fp, $output);
    fclose($fp);
}

echo "\n\Table SQL Generation complete\n";

function enumizeOptions($options, $table, $name)
{
    $options =explode("{-}", $options);
    foreach($options as $option){
        $option =explode("=>", $option);
        if($option[0]!='NULL') {
            $enum[] =$option[0];
        }
    }
    if(!is_array($enum)) {
        echo "$table $name $options\n";
    }
    $enum =implode(",", $enum);
    return "enum($enum)";
}


?>

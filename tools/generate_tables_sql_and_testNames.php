#!/usr/bin/php
<?php

/**
 * generate_tables_sql.php takes the ip_output.txt file generated from
 * lorisform_parser.php and outputs an sql build file for the table of each
 * instrument it finds in the ip_output.txt file.  These sql files are output
 * to the tables_sql/ subdirectory.
 *
 * ex cmd:  php generate_tables_sql.php
 *
 * @package behavioural
 */

//Ensure php version compatability
//taken from php.net notes

// require all relevant OO class libraries
require_once __DIR__ . "/../vendor/autoload.php";
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";

$data = stream_get_contents(STDIN);

$instruments=explode("{-@-}",trim($data));

$tblCount=0;
$parameterCount=0;
$pages = array();
foreach($instruments AS $instrument){
    $catId="";
    $items=explode("\n",trim($instrument));
    foreach($items AS $item){
        $paramId="";
        $bits=explode("{@}",trim($item));
        if(preg_match("/Examiner[0-9]*/" , $bits[1])){
            continue;
        }
        switch($bits[0]){
            //generate the CREATE TABLE syntax
            case "table":
                $tablename = $bits[1];

                $filename="../project/tables_sql/".$bits[1].".sql";
                $output="CREATE TABLE `$bits[1]` (\n";
                $output.="`CommentID` varchar(255) NOT NULL default '',
                          `UserID` varchar(255) default NULL,
                          `Examiner` varchar(255) default NULL,
                          `Testdate` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',\n";
            break;
            case "page":
                $pages[] = $bits[2];
                continue;

            //no SQL need be generated.
            case "title":
                $title = $bits[1];
            case "header":
                continue;
            break;

            //generate specific column definitions for specific types of HTML elements
            default:
                if($bits[1] == "") {
                    continue;
                }
                if($bits[0]=="select"){
                    $bits[0]=enumizeOptions($bits[3], isset($tablename) ? $tablename : null, $bits[1]);
                } else if($bits[0]=="selectmultiple"){
                    $bits[0]="varchar(255)";
                } else if($bits[0]=="textarea"){
                    $bits[0]="text";
                } else if($bits[0]=="text"){
                    $bits[0]="varchar(255)";
                } else if($bits[0]=="checkbox") {
                    $bits[0]="varchar(255)";
                } else if ($bits[0]=="static") {
                    $bits[0]="varchar(255)";
                }

                $bits[2]=htmlspecialchars($bits[2]);
                $output.="`$bits[1]` $bits[0] default NULL,\n";
        }

    }
    $output.="PRIMARY KEY  (`CommentID`)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8;\n";
    print "Filename: $filename\n";
    $fp=fopen($filename, "w");
    fwrite($fp, $output);
    fwrite($fp, "REPLACE INTO test_names (Test_name, Full_name, Sub_group) VALUES ('$tablename', '$title', 1);\n");
    foreach($pages as $pageNo => $page) {
        fwrite($fp, "INSERT INTO instrument_subtests (Test_name, Subtest_name, Description) VALUES ('$tablename', '" . $tablename  . "_page" . ($pageNo+1) . "', '$page');\n");

    }
    fclose($fp);
}

echo "\n\Table SQL Generation complete\n";

function enumizeOptions($options, $table, $name){
    $options=explode("{-}",$options);
    foreach($options as $option){
        $option=explode("=>",$option);
        if($option[0]!='NULL'){
            $enum[]=$option[0];
        }
    }
    if(!is_array($enum)){
        echo "$table $name $options\n";
    }
    $enum=implode(",",$enum);
    return "enum($enum)";
}


?>

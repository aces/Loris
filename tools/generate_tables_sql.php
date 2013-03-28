#!/data/web/neurodb/software/bin/php
<?php

/**
 * generate_tables_sql.php takes the ip_output.txt file generated from
 * quickform_parser.php and outputs an sql build file for the table of each
 * instrument it finds in the ip_output.txt file.  These sql files are output
 * to the tables_sql/ subdirectory.
 * 
 * ex cmd:  php generate_tables_sql.php
 *
 * @package behavioural
 */

 set_include_path(get_include_path().":../project/libraries:../php/libraries:");

//Ensure php version compatability
//taken from php.net notes
if (version_compare(phpversion(),'4.3.0','<'))
{
    define('STDIN',fopen("php://stdin","r"));
    register_shutdown_function( create_function( '' , 'fclose(STDIN);
    fclose(STDOUT); fclose(STDERR); return true;' ) );
}


// PEAR::Config
require_once "Config.php";

// define which configuration file we're using for this installation
$configFile = "../project/config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

// require all relevant OO class libraries
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
require_once "../php/libraries/NDB_BVL_Instrument.class.inc";

/*
* new DB Object
*/
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(PEAR::isError($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}


$fp=fopen("ip_output.txt","r");
$data=fread($fp, filesize("ip_output.txt"));
fclose($fp);

$instruments=explode("{-@-}",trim($data));

$tblCount=0;
$parameterCount=0;
foreach($instruments AS $instrument){
    $catId="";
    $items=explode("\n",trim($instrument));
    foreach($items AS $item){
        $paramId="";
        $bits=explode("{@}",trim($item));
        if(ereg("Examiner[0-9]*" , $bits[1])){
            continue;
        }
        switch($bits[0]){
            //generate the CREATE TABLE syntax
            case "table":
                $filename="../project/tables_sql/".$bits[1].".sql";
                $output="CREATE TABLE `$bits[1]` (\n";
                $output.="`CommentID` varchar(255) NOT NULL default '',\n
                          `UserID` varchar(255) default NULL,\n
                          `Examiner` varchar(255) default NULL,\n
                          `Testdate` timestamp NOT NULL,\n
                          `Data_entry_completion_status` enum('Incomplete','Complete') NOT NULL default 'Incomplete',\n";
            break;

            //no SQL need be generated.
            case "title":
            case "header":
                continue;
            break;

            //generate specific column definitions for specific types of HTML elements
            default:
                if($bits[1] == "") {
                    continue;
                }
                if($bits[0]=="select"){
                    $bits[0]=enumizeOptions($bits[3], $table, $bits[1]);
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
    $output.="PRIMARY KEY  (`CommentID`)\n
              );\n";
    $fp=fopen($filename, "w");
    fwrite($fp, $output);
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

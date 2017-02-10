<?php
/**
 * Script changing all table engines from the schema to InnoDB
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
set_include_path(get_include_path().":".__DIR__."/../project/libraries:".":".__DIR__."/../php/libraries:");
require_once __DIR__ . "/../vendor/autoload.php";

// Base variables
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__."/../project/config.xml");
$config = NDB_Config::singleton();
$db =& Database::singleton();
$base = $config->getSetting('base');


echo "\n#################################################################\n\n".
    "This script will create ALTER TABLE statements to change any table in the ".
    "Loris SCHEMA with a MyISAM engine to use INNODB. \nThe output file is ".
    "tables_sql/change_MyISQM_to_INNODB.sql and includes foreign key ".
    "checks disabling and re-enabling.\n".
    "\n#################################################################\n\n";


// SETUP INPUT from schema files in SQL loris directory
$schemaFiles=array(
    "0000-00-00-schema.sql",
    "0000-00-01-Permission.sql",
    "0000-00-02-Menus.sql",
    "0000-00-03-ConfigTables.sql",
    "0000-00-04-Help.sql"
);
$schemaFileBase=$base."SQL/";
$completeSchema="";
foreach ($schemaFiles as $file) {
    $completeSchema .= $fc =file_get_contents($schemaFileBase.$file, "r");
}
//print_r($completeSchema);
$createdTables=array();
preg_match_all('/CREATE TABLE \`([_a-zA-Z0-9]+)\`/', $completeSchema, $createdTables);
//END INPUT

// SETUP OUTPUT to file in project/tables_sql/change_MyISAM_to_INNODB_schemaTables.sql
$filename = __DIR__ . "/../project/tables_sql/change_MyISAM_to_INNODB_schemaTables.sql";
$output = "";
$output .="SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; \n";
$output .="SET FOREIGN_KEY_CHECKS=0; \n";

foreach ($createdTables[1] as $key=>$table)
{
    $output .= "ALTER TABLE `".$table."` ENGINE=INNODB;\n";
}
$output .="SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; \n";
$fp=fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);
?>

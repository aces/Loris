<?php
/**
 * Script changing all table engines in the database to InnoDB
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
$database = $config->getSetting('database');


echo "\n#################################################################\n\n".
    "This script will create ALTER TABLE statements to change any table in the ".
    "DATABASE with a MyISAM engine to use INNODB. \nThe output file is ".
    "tables_sql/change_MyISQM_to_INNODB.sql and includes foreign key ".
    "checks disabling and re-enabling.\n".
    "\n#################################################################\n\n";


// SETUP INPUT from Database table schema
$table_names = $db->pselect("
                      SELECT TABLE_NAME 
                      FROM INFORMATION_SCHEMA.TABLES
                      WHERE TABLE_SCHEMA =:dbn 
                        AND ENGINE = 'MyISAM'",
    array("dbn"=>$database['database'])
);
//END INPUT

// SETUP OUTPUT to file in project/tables_sql/change_MyISAM_to_INNODB_allTables.sql
$filename = __DIR__ . "/../project/tables_sql/change_MyISAM_to_INNODB_allTables.sql";
$output = "";
$output .="SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS; \n";
$output .="SET FOREIGN_KEY_CHECKS=0; \n";

foreach ($table_names as $key=>$table)
{
    $output .= "ALTER TABLE `".$table["TABLE_NAME"]."` ENGINE=INNODB;\n";
}
$output .="SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS; \n";
$fp=fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);
?>

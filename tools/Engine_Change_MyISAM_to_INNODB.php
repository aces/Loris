<?php
/**
 * Script exporting Update statements to remove 0000-00-00 values
 * and replace them by NULL
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
require_once __DIR__ . "/../../vendor/autoload.php";
//require_once "NDB_Config.class.inc";

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__."/../project/config.xml");
$config = NDB_Config::singleton();

$db =& Database::singleton();
$database = $config->getSetting('database');

$base = $config->getSetting('base');
$db->_trackChanges = false;

$filename = __DIR__ . "/../project/tables_sql/change_MyISQM_to_INNODB.sql";
$output = "";
$output .="SET FOREIGN_KEY_CHECKS=0; \n";

echo "\n#################################################################\n\n".
    "This script will create ALTER TABLE statements to change any table in the ".
    "database with a MyISAM engine to use INNODB. \nThe output file is ".
    "tables_sql/change_MyISQM_to_INNODB.sql and includes foreign key ".
    "checks disabling and re-enabling.\n".
    "\n#################################################################\n\n";

$database_name= $database['database'];

$table_names = $db->pselect("
                      SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
                      WHERE TABLE_SCHEMA =:dbn 
                        AND ENGINE = 'MyISAM'",
    array("dbn"=>$database['database'])
);

foreach ($table_names as $key=>$table)
{
    $output .= "ALTER TABLE `".$table["TABLE_NAME"]."` ENGINE=INNODB;\n";
}
$output .="SET FOREIGN_KEY_CHECKS=1; \n";
$fp=fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);

?>

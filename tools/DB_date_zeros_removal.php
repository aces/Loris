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
set_include_path(get_include_path().":".__DIR__."/../project/libraries:".":".__DIR__."/../../php/libraries:");
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

$filename = __DIR__ . "/../project/tables_sql/update_zero_fields_statements.sql";
$output = "";
$output .="SET FOREIGN_KEY_CHECKS=0; \n";

echo "\n#################################################################\n\n".
    "This Script will generate an UPDATE statement for every date field ".
    "currently in the database. \nThe output file is ".
    "tables_sql/update_zero_fields_statements.sql and includes foreign key ".
    "checks disabling and re-enabling.\n".
    "\n#################################################################\n\n";

$database_name= $database['database'];

$field_names = $db->pselect("
                      SELECT TABLE_NAME,COLUMN_NAME,COLUMN_DEFAULT,DATA_TYPE 
                      FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE DATA_TYPE IN ('date','timestamp','datetime') 
                          AND TABLE_SCHEMA=:dbn",
    array("dbn"=>$database['database'])
);

foreach ($field_names as $key=>$field)
{
    if ($field['COLUMN_DEFAULT']=='0000-00-00') {
        echo "The script will modify the date schema for TABLE: `".$field['TABLE_NAME']."` FIELD: `".$field['COLUMN_NAME']."` to default to NULL\n";
        $output .= "ALTER TABLE `".$field['TABLE_NAME']."` MODIFY `".$field['COLUMN_NAME']."` DATE DEFAULT NULL;\n";
    } else if ($field['COLUMN_DEFAULT']=='0000-00-00 00:00:00') {
        echo "The script will modify the date schema for TABLE: `".$field['TABLE_NAME']."` FIELD: `".$field['COLUMN_NAME']."` to default to NULL\n";
        $output .= "ALTER TABLE `".$field['TABLE_NAME']."` MODIFY `".$field['COLUMN_NAME']."` DATETIME DEFAULT NULL;\n";
    }
    if ($field['DATA_TYPE'] == 'date') {
        $output .= "UPDATE ".$database['database'].".".$field['TABLE_NAME'].
            " SET ".$field['COLUMN_NAME']."=NULL".
            " WHERE CAST(".$field['COLUMN_NAME']." AS CHAR(20))='0000-00-00';\n";
    } else if ($field['DATA_TYPE'] == 'datetime' || $field['DATA_TYPE'] == 'timestamp') {
        $output .= "UPDATE ".$database['database'].".".$field['TABLE_NAME'].
            " SET ".$field['COLUMN_NAME']."=NULL".
            " WHERE CAST(".$field['COLUMN_NAME']." AS CHAR(20))='0000-00-00 00:00:00';\n";
    }
}
$output .="SET FOREIGN_KEY_CHECKS=1; \n";
$fp=fopen($filename, "w");
fwrite($fp, $output);
fclose($fp);

?>

<?php
/* This is used by the stats page to get the list of scorable columns for an
* instrument via AJAX. It's used so that ScatterPlot-SVG.php can be run for
* any scorable in an instrument, dynamically */
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();


list($row,$row_id,$column,$column_id) =   split("_", $_REQUEST['field_id']);
$value = $_REQUEST['field_value'];

print "row id is $row_id column id is $column_id value $value";
$table_desc = $DB->pselect("DESC mri_protocol",array());
$column_name = $table_desc[$column_id]['Field'];

$DB->update('mri_protocol',array($column_name=>$value),array('ID'=>$row_id));

?>


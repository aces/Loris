<?php
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';

$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->initialize();
list($row,$row_id,$column,$column_id) = split("_", $_REQUEST['field_id']);
$value = $_REQUEST['field_value'];
$table_desc = $DB->pselect("DESC mri_protocol",array());
$column_name = $table_desc[$column_id]['Field'];
$DB->update('mri_protocol',array($column_name=>$value),array('ID'=>$row_id));
?>

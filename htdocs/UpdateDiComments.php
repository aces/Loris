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

require_once "Utility.class.inc";
list($text, $id) =   split("_", $_REQUEST['id']);
$value = $_REQUEST['value'];

$DB->update('data_integrity_flag',array('dataflag_comment'=>$value),array('dataflag_id'=>$id)); // update it
?>
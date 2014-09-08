<?php
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

ob_start('ob_gzhandler');
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "HelpFile.class.inc";

// create DB object
$DB =& Database::singleton();
if(PEAR::isError($DB)) {
    return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
}

// store some request information
if(!empty($_REQUEST['helpID'])){
	$helpID = $_REQUEST['helpID'];
} else{
	if (!empty($_REQUEST['test_name'])) {
		$helpID = HelpFile::hashToID(md5($_REQUEST['test_name']));

	}
}
$help_file =& HelpFile::factory($helpID);
$data = $help_file->toArray();
$data['content'] = trim($data['content']);
print json_encode($data);
ob_end_flush();

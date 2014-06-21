<?php
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');
/* This is used by the data dictionary page to update the column descriptions on the fly */
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->initialize();


list($name,$extra) = split("___", $_REQUEST['fieldname']);

if (get_magic_quotes_gpc()) {
    // Magic quotes adds \ to description, get rid of it.
    $description = stripslashes($_REQUEST['description']);
} else {
    // Magic quotes is off, so we can just directly use the description
    // since insert() will use a prepared statement.
    $description = $_REQUEST['description'];
}

// create user object
$user =& User::singleton();
if (Utility::isErrorX($user)) {
	return PEAR::raiseError("User Error: ".$user->getMessage());
}

if ($user->hasPermission('data_dict_edit')) { //if user has edit permission
	if ($DB->pselectOne("SELECT COUNT(*) FROM parameter_type_override WHERE Name =:id",array('id'=>$name))==0) {  //if it doesn't exist
		$DB->insert('parameter_type_override',array('Name'=>$name,'Description'=>$description)); //insert it
	} else {
		$DB->update('parameter_type_override',array('Description'=>$description),array('Name'=>$name)); //else update it
	}
}

?>


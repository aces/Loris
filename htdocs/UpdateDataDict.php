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

list($field, $test_name,$extra) =   split("___", $_REQUEST['fieldname']);

$name = $test_name . "_" . $field;
if(get_magic_quotes_gpc()) {
    // Magic quotes adds \ to description, get rid of it.
    $description = stripslashes($_REQUEST['description']);
} else {
    // Magic quotes is off, so we can just directly use the description
    // since insert() will use a prepared statement.
    $description = $_REQUEST['description'];
}


if ($DB->pselectOne("SELECT COUNT(*) FROM parameter_type_override WHERE Name =:id",array('id'=>$name))==0){  //if it doesn't exist
	$DB->insert('parameter_type_override',array('Name'=>$name,'Description'=>$description)); //insert it
}
else{
	$DB->update('parameter_type_override',array('Description'=>$description),array('Name'=>$name)); //else update it
}

?>


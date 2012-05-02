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




//extract the test_name from the test_battery table
if ($_REQUEST['UseDisplayName'] == true){
	$info= Utility::getTestNameusingMappedName($_REQUEST['instrument']);
	$instrument = $info['Test_name'];
	$fields = Utility::getSourcefields($instrument);
}

//extract the test_name from the test_names table
else{
	$fields = Utility::getSourcefields( Utility::getTestNameUsingFullName($_REQUEST['instrument']));
}

print "All Fields\n";
if ($fields!=null){
	foreach($fields as $field){
		if ($_REQUEST['UseDisplayName'] == true){
			print $field['SourceField'] . "\n";
		}
		else{
			print $field['Name'] . "\n";
		}
	}
}
?>

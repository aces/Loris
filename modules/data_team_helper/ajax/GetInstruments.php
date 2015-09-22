<?php
/* This is used by the data_team_helper module */
ini_set('default_charset', 'utf-8');
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

require_once "Utility.class.inc";

//gets the given visit_label and returns the instrument

$instruments = Utility::getVisitInstruments($_REQUEST['visit_label']);

print "All Instruments\n";
foreach($instruments as $instrument){
    print $instrument['Test_name_display'] . "\n";
}
?>
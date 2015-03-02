<?php

set_include_path(get_include_path().":../project/libraries:../php/libraries:");


// PEAR::Config

//allow instruments to find libraries
require_once 'Utility.class.inc';

// require all relevant OO class libraries
require_once "Database.class.inc";
require_once "NDB_Config.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "Candidate.class.inc";
require_once 'NDB_Client.class.inc';

$configFile = "../project/config.xml";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);
$DB = Database::singleton();

?>

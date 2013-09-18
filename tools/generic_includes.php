<?php

// PEAR::Config
require_once "Config.php";

//allow instruments to find libraries
set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// define which configuration file we're using for this installation
$configFile = "../project/config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(Utility::isErrorX($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config = $configObj->toArray();
$config = $config['config'];
unset($configObj, $root);

// require all relevant OO class libraries
require_once "Database.class.inc";
require_once "NDB_Config.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "Candidate.class.inc";

/*
 * new DB Object
 * gets connection name and user name..
 */
$DB =& Database::singleton($config['database']['database'], $config['database']['username'], $config['database']['password'], $config['database']['host']);
if(Utility::isErrorX($DB)) {
    print "Could not connect to database: ".$DB->getMessage()."<br>\n";
    die();
}

?>

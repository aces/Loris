<?php

/**
 * This script contains useful generic stuff to include
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Loris <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris
 */

set_include_path(
    get_include_path().":".
    __DIR__."/../project/libraries:".
    __DIR__."/../php/libraries:"
);

require_once __DIR__ . "/../vendor/autoload.php";
$configFile = __DIR__."/../project/config.xml";
$client     = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);
$DB = Database::singleton();

//allow instruments to find libraries
require_once 'Utility.class.inc';

// require all relevant OO class libraries
require_once "Database.class.inc";
require_once "NDB_Config.class.inc";
require_once "NDB_BVL_Instrument.class.inc";
require_once "Candidate.class.inc";

?>

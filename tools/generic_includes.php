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
$DB     = Database::singleton();
$config = NDB_Config::singleton();
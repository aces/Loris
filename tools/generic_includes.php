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

/**
 * Helper function that writes a string supplied in the parameters to a filepath
 * specified in the parameters using the indicated mode. This function should be
 * used as a standard in the tools PHP scripts.
 *
 * @param string $filePath Desired path for the generated file (including extension)
 * @param string $output   String to be written to the file specified in $filePath
 * @param string $mode     Creation mode of the file
 */
function writeToFile(string $filePath, string $output, string $mode = "w")
{
    $fp =fopen($filePath, $mode);
    fwrite($fp, $output);
    fclose($fp);
}
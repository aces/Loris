<?php
/**
 * Invokes a module's helper scripts, which should be contained in said
 * module's php directory.
 *
 * Used by "new" style modules for accessing ajax helper scripts which
 * are located outside of the htdocs directory.
 *
 * Note that right now only PHP ajax helper's are supported.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  MRI
 *  @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 *
 */


// Load config file and ensure paths are correct
set_include_path(
    get_include_path() . ":" .
    __DIR__ . "/../project/libraries:" .
    __DIR__ . "/../php/libraries"
);

// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../project/config.xml");

// Checks that config settings are set
$config =& NDB_Config::singleton();
$paths  = $config->getSetting('paths');

// Basic config validation
$basePath    = $paths['base'];
if (empty($basePath)) {
    error_log("ERROR: Config settings are missing");
    header("HTTP/1.1 500 Internal Server Error"); 
    exit(1);
}


// Now get the file and do file validation
$Module = $_GET['Module'];
$File = $_GET['script'];
if (empty($Module) || empty($File)) {
    error_log("Missing required parameters for request");
    header("HTTP/1.1 400 Bad Request");
    exit(2);
}

// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all scripts are relative to $basePath
// and there's no way to go up a level.
if (strpos("..", $File) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

// Also check the module directory for PHP files
set_include_path(
    get_include_path() . ":" .
    __DIR__ . "/../project/libraries:" .
    __DIR__ . "/../php/libraries:" .
    __DIR__ . "/../modules/$Module/php"
);
$FullPath = $basePath . "/modules/$Module/ajax/$File";

if (!file_exists($FullPath)) {
    error_log("ERROR: File $File does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

require $FullPath;
?>

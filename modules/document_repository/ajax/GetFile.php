<?php
/**
 * Controls access to a document repository's user files.
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  Document Repository
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

$File = $_GET['File'];

// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $basePath
if (strpos("..", $File) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}


$FullPath = __DIR__ . "/../user_uploads/$File";

if (!file_exists($FullPath)) {
    error_log("ERROR: File $File does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

$fp = fopen($FullPath, 'r');
fpassthru($fp);
fclose($fp);
?>

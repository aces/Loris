<?php
/**
 * Controls access to files on the filesystem. This script should ensure that 
 * only files relative to the paths specified in the config.xml are accessible.
 * By calling new NDB_Client(), it also makes sure that the user is logged in to 
 * Loris.
 *
 * It also does validation to make sure said paths are specified and not set to /
 * for security reasons.
 *
 * Used by MRI Browser and (old) Data Query GUI.
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
    get_include_path() . ":../../../project/libraries:../../../php/libraries"
);
// Since we're sending binary data, we don't want PHP to print errors or warnings 
// inline. They'll still show up in the Apache logs.
ini_set("display_errors", "Off");

// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../../project/config.xml");

// Checks that config settings are set
$config =& NDB_Config::singleton();
$paths  = $config->getSetting('paths');

// Basic config validation
$imagePath    = $paths['imagePath'];
$DownloadPath = $paths['DownloadPath'];
$mincPath     = $paths['mincPath'];
if (empty($imagePath) || empty($DownloadPath) || empty($mincPath)) {
    error_log("ERROR: Config settings are missing");
    header("HTTP/1.1 500 Internal Server Error"); 
    exit(1);
}

if ($imagePath === '/' || $DownloadPath === '/' || $mincPath === '/') {
    error_log("ERROR: Path can not be root for security reasons.");
    header("HTTP/1.1 500 Internal Server Error"); 
    exit(2);
}

// Now get the file and do file validation
$File = $_GET['file'];

// File validation
if (strpos($File, ".") === false) {
    error_log("ERROR: Could not determine file type.");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

// Find the extension
$pieces  = preg_split('/\./', basename($File));
array_shift($pieces);
$FileExt = join(".", $pieces);
unset($pieces);

// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $imagePath,
// $DownloadPath or $mincPath
if (strpos("..", $File) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

switch($FileExt) {
case 'mnc':
    $FullPath = $mincPath . '/' . $File;
    $MimeType = "application/x-minc";
    $DownloadFilename = basename($File);
    break;
case 'png':
    $FullPath = $imagePath . '/' . $File;
    $MimeType = "image/png";
    break;
case 'jpg':
    $FullPath = $imagePath . '/' . $File;
    $MimeType = "image/jpeg";
    break;
case 'header':
case 'raw_byte.gz':
    // JIVs are relative to imagePath for historical reasons
    // And they don't have a real mime type.
    $FullPath = $imagePath . '/' . $File;
    $MimeType = 'application/octet-stream';
    break;
case 'xml':
    $FullPath = $imagePath . '/' . $File;
    $MimeType = 'application/xml';
    $DownloadFilename = basename($File);
    break;
case 'nrrd':
    // NRRD don't have a real mime type.
    $FullPath = $imagePath . '/' . $File;
    $MimeType = 'application/octet-stream';
    $DownloadFilename = basename($File);
    break;
default:
    $FullPath = $DownloadPath . '/' . $File;
    $MimeType = 'application/octet-stream';
    $DownloadFilename = basename($File);
    break;
}

if (!file_exists($FullPath)) {
    error_log("ERROR: File $File does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

header("Content-type: $MimeType");
if (!empty($DownloadFilename)) {

    header("Content-Disposition: attachment; filename=$DownloadFilename");
}
$fp = fopen($FullPath, 'r');
fpassthru($fp);
fclose($fp);
?>

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
 */

$user =& User::singleton();
if (!$user->hasPermission('document_repository_view') && !$user->hasPermission('document_repository_delete')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

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

// Ensure file exists in the document_repository table before serving
$db     =& Database::singleton();
$record = $db->pselectOne(
    "SELECT record_id FROM document_repository WHERE "
    . "Data_dir=:dd",
    array('dd' => $File)
);

if (empty($record)) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
} else {
    $FullPath = __DIR__ . "/../user_uploads/$File";
    echo "$FullPath";

    if (!file_exists($FullPath)) {
        error_log("ERROR: File $FullPath does not exist");
        header("HTTP/1.1 404 Not Found");
        exit(5);
    }

    $fp = fopen($FullPath, 'r');
    fpassthru($fp);
    fclose($fp);
}
?>

<?php
/**
 * Controls access to a document repository's user files.
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 7
 *
 *  @category Loris
 *  @package  Document_Repository
 *  @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 *  @license  Loris license
 *  @link     https://github.com/aces/Loris-Trunk
 */

$user =& User::singleton();
if (!$user->hasPermission('document_repository_view')
    && !$user->hasPermission('document_repository_delete')
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Load config file and ensure paths are correct
set_include_path(
    get_include_path() . ":" .
    __DIR__ . "/../project/libraries:" .
    __DIR__ . "/../php/libraries"
);

$file = $_GET['File'];

// Ensure file exists in the document_repository table before serving
$db     =& Database::singleton();
$record = $db->pselectOne(
    "SELECT record_id FROM document_repository WHERE "
    . "Data_dir=:dd",
    array('dd' => $file)
);

if (empty($record)) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

$path = __DIR__ . "/../user_uploads/$file";

if (!file_exists($path)) {
    error_log("ERROR: File $path does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

// Output file in downloadable format
header('Content-Description: File Transfer');
header('Content-Type: application/force-download');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($path) . "\"");
readfile($path);

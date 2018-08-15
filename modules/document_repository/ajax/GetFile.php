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

$user =& \User::singleton();
if (!$user->hasPermission('document_repository_view')
    && !$user->hasPermission('document_repository_delete')
) {
    header("HTTP/1.1 403 Forbidden");
    exit(1);
}
require_once '../tools/generic_includes.php';

// Initialize downloader.
require_once __DIR__ . '/../php/DocRepoFileDownloader.class.inc';
$db =& \Database::singleton();
$config = NDB_Config::singleton();
$paths  = $config->getSetting('paths');
$lorisRoot = $paths['base'];

$downloadBasePath = $lorisRoot . 'modules/document_repository/user_uploads/';
$downloader = new DocRepoFileDownloader($downloadBasePath);

// Format: username/filename.ext
$partialPath = $_GET['File'];

// Verify file exists in the database.
if (!$downloader->isFileInDatabase($partialPath)) {
    error_log("ERROR Requested file is not in the database");
    http_response_code(400);
    exit(2);
}
// All generic verification and sanitization occurs here.
$downloader->downloadFile($downloadBasePath . $partialPath);

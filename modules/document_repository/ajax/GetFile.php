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

$user = \User::singleton();
if (!$user->hasPermission('document_repository_view')
    && !$user->hasPermission('document_repository_delete')
) {
    http_response_code(403);
    throw new LorisException(
        "ERROR: {$user->getUsername()} is forbidden from viewing/deleting "
        . "files in the document repository."
    );
}
require_once '../tools/generic_includes.php';
require_once __DIR__ . '/../php/DocRepoAttachment.class.inc';

// Initialize downloader.
$paths     = \NDB_Config::singleton()->getSetting('paths');
$lorisRoot = $paths['base'];

$partialPath = $_GET['File'] ?? null; //Format: username/filename.ext
if (is_null($partialPath)) {
    http_response_code(400);
    echo "Bad request. A valid path must be specified.";
} else {
    $downloadBasePath = $lorisRoot . 'modules/document_repository/user_uploads/';
    $attachment       = new DocRepoAttachment($downloadBasePath . $partialPath);
    var_dump($attachment);
    if (!$attachment->isFileInDatabase($partialPath)) {
        throw new LorisException("Requested file is not in the database");
    }
    $attachment->download();
}

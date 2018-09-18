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
    http_response_code(403);
    throw new LorisException(
        "ERROR: {$user->getUsername()} is forbidden from viewing/deleting "
        . "files in the document repository."
    );
}
require_once '../tools/generic_includes.php';

// Initialize downloader.
require_once __DIR__ . '/../php/DocRepoFileDownloader.class.inc';
$db        =& \Database::singleton();
$config    = NDB_Config::singleton();
$paths     = $config->getSetting('paths');
$lorisRoot = $paths['base'];

// Format of $partialPath: username/filename.ext
$partialPath = $_GET['File'] ?? null;
if (is_null($partialPath)) {
    http_response_code(400);
    echo "Bad request. A valid path must be specified.";
} else {
    $downloadBasePath = $lorisRoot . 'modules/document_repository/user_uploads/';
    $response         = new DocRepoFileDownloader($downloadBasePath . $partialPath);
    if (!$response->isFileInDatabase($partialPath)) {
        throw new LorisException("Requested file is not in the database");
    }

    header('Content-Type: ' . $response->getHeaderLine('Content-Type'));
    header("Content-Disposition: attachment; filename=" . basename($partialPath));
    fpassthru($response->getBody()->detach());
}

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
require_once '../tools/generic_includes.php';
require_once __DIR__ . '/../php/DocRepoFileDownloader.class.inc';

$file = $_GET['File'];

$path = __DIR__ . "/../user_uploads/";
$downloader = new DocRepoFileDownloader($path);
$fileName = $downloader->getFileNameFromDatabase(intval($file));
$downloader->downloadFile($path . $fileName);

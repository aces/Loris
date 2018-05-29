<?php
/**
 * Publication Downloader
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Publication
 * @author   David <dblader.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

$user =& User::singleton();
if (!$user->hasPermission('publication_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Make sure that the user isn't trying to break out of the $path
// by using a relative filename.
$file     = basename($_GET['File']);
$config   = NDB_Config::singleton();
$path     = $config->getSetting('publication_uploads');
$filePath = $path . $file;

if (!file_exists($filePath)) {
    error_log("ERROR: File $filePath does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

// Output file in downloadable format
header('Content-Description: File Transfer');
header('Content-Type: application/force-download');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($filePath) . "\"");
readfile($filePath);
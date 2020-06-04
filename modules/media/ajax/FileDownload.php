<?php
/**
 * Media downloader.
 *
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Alex I. <ailea.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

$user =& User::singleton();
//NOTE Should this be 'media_read' instead? It seems that downloading files
//should be a read permission, not write.
if (!$user->hasPermission('media_write')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Make sure that the user isn't trying to break out of the $path
// by using a relative filename.
$file     = basename($_GET['File']);
$config   =& NDB_Config::singleton();
$path     = $config->getSetting('mediaPath');
$filePath = $path . $file;

$downloadNotifier = new NDB_Notifier(
    "media",
    "download",
    array("file" => $file)
);

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
$downloadNotifier->notify();

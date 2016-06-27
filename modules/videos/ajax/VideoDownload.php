<?php
/**
 * Video downloader.
 *
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Videos
 * @author   Loris Team <ailea@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 *
 */

$user =& User::singleton();
if (!$user->hasPermission('video_upload')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Make sure that the user isn't trying to break out of the $path by using a relative
// filename. No need to check for '/' since all downloads are relative to $basePath.
$file = $_GET['File'];
if (strpos("..", $file) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}

$config =& NDB_Config::singleton();
$path = $config->getSetting('VideosPath');
$filePath = $path . $file;

if (!file_exists($filePath)) {
    error_log("ERROR: File $filePath does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

// Output file in downloadable format
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($filePath) . "\"");
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($file));
ob_clean();
flush();

readfile($filePath);

exit;
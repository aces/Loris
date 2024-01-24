<?php
/**
 * Media downloader.
 *
 * This ensures that the file exists and the user is logged in to
 * Loris before trying to return the file to the user.
 *
 * PHP Version 8
 *
 * @category Loris
 * @package  Media
 * @author   Alex I. <ailea.mcin@gmail.com>
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

$user =& User::singleton();
//NOTE Should this be 'media_read' instead? It seems that downloading files
//should be a read permission, not write.
if (!$user->hasPermission('media_read')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Make sure that the user isn't trying to break out of the $path
// by using a relative filename.
$file   = html_entity_decode($_GET['File']);
$config =& NDB_Config::singleton();
$downloadNotifier = new NDB_Notifier(
    "media",
    "download",
    ["file" => $file]
);
// local file download first
// if file name not start with S3 then down load from AWS s3
if (substr($file, 0, 3) !== "s3:") {
    $path     = $config->getSetting('mediaPath');
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
} else {
    // download from AWS s3
    if (getenv('AWS_ACCESS_KEY_ID') !== false) {
        $s3part           = explode("/", str_replace("s3://", "", $file));
        $s3ClientInstance = S3ClientSingleton::getInstance();
        // it will pass bucketname folder and filename to download
        $s3ClientInstance->s3download($s3part[0], null, end($s3part));
    }
}
$downloadNotifier->notify();

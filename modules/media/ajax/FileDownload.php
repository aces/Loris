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
$file     = html_entity_decode(basename($_GET['File']));
$config   =& NDB_Config::singleton();
$path     = $config->getSetting('mediaPath');
$filePath = $path . $file;

$downloadNotifier = new NDB_Notifier(
    "media",
    "download",
    ["file" => $file]
);

// download from s3

use Aws\S3\S3Client;
$s3_download_status = false;

$config      = \NDB_Config::singleton();
$bucketName = $config->getSetting('AWS_S3_Default_Bucket');

// Initialize the S3 client
if (getenv('AWS_ACCESS_KEY_ID') !== false) {
		// Initialize the S3 client using S3ClientSingleton
       $s3ClientInstance = S3ClientSingleton::getInstance();
       $s3_download_status = $s3ClientInstance->s3download($bucketName, "media", $file);	     	 
}

// download from local
if (!$s3_download_status) {
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
}
$downloadNotifier->notify();

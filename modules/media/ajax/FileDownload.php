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

$s3_download_status = false;
// download from s3

use Aws\S3\S3Client;

$bucketName = 'wangshen-s3';

// Initialize the S3 client
$s3 = new S3Client([
    'version' => 'latest',
    'region' => 'us-east-1',
    'credentials' => [
        'key' => 'AKIA5SZEQ473D4MXLZXC',
        'secret' => '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',
    ],
]);
// Get the S3 object
try {
    $s3Object = $s3->getObject([
        'Bucket' => $bucketName,
        'Key' => "media/".$file,
    ]);

    // Set headers to indicate a file download
    header('Content-Type: ' . $s3Object['ContentType']);
    header('Content-Disposition: attachment; filename="' . $file . '"');

    // Output the file content
    echo $s3Object['Body'];
    $s3_download_status = true;
} catch (Exception $e) {
    // Handle any errors that occurred during the download
    error_log("Error: " . $e->getMessage());
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

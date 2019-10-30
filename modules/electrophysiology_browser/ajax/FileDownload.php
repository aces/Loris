<?php declare(strict_types=1);
/**
 * Electrophysiology downloader.
 *
 * This ensures that the file exists and the user is logged in to
 * LORIS before trying to return the file to the user.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Media
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris-Trunk
 */

$user =& User::singleton();
//NOTE Should this be 'media_read' instead? It seems that downloading files
//should be a read permission, not write.

$hasAccess = $user->hasPermission('electrophysiology_browser_view_allsites')
    || ($user->hasCenter($timePoint->getCenterID())
        && $user->hasPermission('electrophysiology_browser_view_site'));

if (!$hasAccess) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Make sure that the user isn't trying to break out of the $path
// by using a relative filename.
$file     = $_GET['File'];
$config   =& NDB_Config::singleton();
$path     = $config->getSetting('imagePath');
$filePath = $path . $file;

if (!file_exists($filePath)) {
    error_log("ERROR: File $filePath does not exist");
    header("HTTP/1.1 404 Not Found");
    exit;
}

// Output file in downloadable format
header('Content-Description: File Transfer');
header('Content-Type: application/force-download');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($filePath) . "\"");
readfile($filePath);

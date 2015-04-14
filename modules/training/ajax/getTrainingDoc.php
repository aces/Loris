<?php
/**
 * Opens a file or document used as part of the training module.
 * The file is only opened if the user is logged in and is either an examiner
 * or has the 'examiner' permission
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

require_once __DIR__ . "/../../../vendor/autoload.php";

$user = User::singleton();

// Checks that config settings are set
$config = NDB_Config::singleton();
$paths  = $config->getSetting('paths');

// Basic config validation
$basePath = $paths['base'];
if (empty($basePath)) {
    error_log("ERROR: Config settings are missing");
    header("HTTP/1.1 500 Internal Server Error");
    exit(1);
}

$File = $_GET['file'];

$ext = pathinfo($File, PATHINFO_EXTENSION);
if ($ext == 'pdf') {
    $FullPath = $basePath . "/project/data/training/pdf/$File";
} elseif ($ext == 'mp4') {
    $FullPath = $basePath . "/project/data/training/video/$File";
}
// Check that the user has training permission, or is an trainer
if (!$user->hasPermission('training')) {
    error_log("ERROR: Permission denied for accessing $File");
    header('HTTP/1.1 403 Forbidden');
    exit(2);
}

// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $basePath
if (strpos("..", $File) !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(3);
}

if (!file_exists($FullPath)) {
    error_log("ERROR: File $File does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(4);
}

$finfo    = finfo_open(FILEINFO_MIME_TYPE);
$MimeType = finfo_file($finfo, $FullPath);

header("Content-type: $MimeType");
$fp = fopen($FullPath, 'r');
fpassthru($fp);
fclose($fp);

exit(0);
?>
<?php

/**
 * Controls access to data release files.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Data_Release
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

$user   =& User::singleton();
$config = \NDB_Factory::singleton()->config();
$path   = $config->getSetting('dataReleasePath');

$File = $_GET['File'];
// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $basePath
if (strpos($File, "..") !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}
$FullPath = $path . $File;
if (!file_exists($FullPath)) {
    error_log("ERROR: File $FullPath does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}
$db         = \Database::singleton();
$fileID     = $db->pselectOne(
    "SELECT ID FROM data_release WHERE "
    . "file_name=:fn",
    array('fn' => $File)
);
$uid        = $db->pselectOne(
    "SELECT ID FROM users WHERE "
    . "UserID=:userid",
    array('userid' => $user->getUsername())
);
$permission = $db->pselectOne(
    "SELECT 'X' 
          FROM data_release_permissions 
          WHERE userid=:uid AND data_release_id=:fileID",
    array(
        'uid'    => $uid,
        'fileID' => $fileID,
    )
);
if (empty($permission)) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// Output file in downloadable format
header('Content-Description: File Transfer');
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . basename($FullPath) . "\"");
readfile($FullPath);
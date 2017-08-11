<?php

/**
 * Controls access to data release files.
 *
 * PHP Version 5
 *
 *  @category Loris
 *  @package  Data_Release
 *  @author   Justin Kat <justinkat@gmail.com>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://github.com/aces/Loris
 */

$user =& User::singleton();

// Ensures the user is logged in, and parses the config file.
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../project/config.xml");
// Checks that config settings are set
$config =& NDB_Config::singleton();
$File   = $_GET['File'];
// Make sure that the user isn't trying to break out of the $path by
// using a relative filename.
// No need to check for '/' since all downloads are relative to $basePath
if (strpos($File, "..") !== false) {
    error_log("ERROR: Invalid filename");
    header("HTTP/1.1 400 Bad Request");
    exit(4);
}
$FullPath = __DIR__ . "/../user_uploads/$File";
if (!file_exists($FullPath)) {
    error_log("ERROR: File $FullPath does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}
$db         =& Database::singleton();
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
    "SELECT 'X' FROM data_release_permissions WHERE "
    . "userid=:uid AND data_release_id=:fileID",
    array(
     'uid'    => $uid,
     'fileID' => $fileID,
    )
);
if (empty($permission)) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
$fp = fopen($FullPath, 'r');
fpassthru($fp);
fclose($fp);

?>

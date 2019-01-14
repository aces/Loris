<?php
/**
 * Publication file deletion script
 *
 * Deletes a specified file by upload ID (PublicationUploadID)
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Publication
 * @author   David <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
$uploadID = $_REQUEST['uploadID'];
$db       = \Database::singleton();
$user     = \User::singleton();
$config   = \NDB_Config::singleton();

$query      = "SELECT PublicationID, URL ".
    "FROM publication_upload ".
    "WHERE PublicationUploadID=:upid";
$uploadData = $db->pselectRow($query, array('upid' => $uploadID));

if (empty($uploadData)) {
    header("HTTP/1.1 400 Bad Request");
    return;
}

permissionCheck($uploadData, $db, $user);

$db->delete(
    'publication_upload',
    array('PublicationUploadID' => $uploadID)
);

$base = $config->getSetting('publication_uploads');

unlink($base . $uploadData['URL']);


/**
 * Permission check
 *
 * @param array    $uploadData upload data
 * @param Database $db         database
 * @param User     $user       user
 *
 * @return void
 */
function permissionCheck($uploadData, $db, $user) : void
{
    $origUser = $db->pselectOne(
        'SELECT UserID FROM publication WHERE PublicationID=:pid',
        array('pid' => $uploadData['PublicationID'])
    );

    $editors = $db->pselectCol(
        'SELECT UserID 
        FROM publication_users_edit_perm_rel 
        WHERE PublicationID=:pid',
        array('pid' => $uploadData['PublicationID'])
    );

    if ($user->getId() !== $origUser && !in_array($user->getId(), $editors)) {
        header("HTTP/1.1 403 Forbidden");
        return;
    }
}
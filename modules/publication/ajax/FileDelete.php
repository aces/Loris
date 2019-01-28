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

$message = array('message' => null);

if (empty($uploadData)) {
    http_response_code(400);
    $message['message'] = 'Invalid Upload ID';
    echo json_encode($message);
    exit;
}

if (userCanDelete($uploadData, $db, $user)) {

    $db->delete(
        'publication_upload',
        array('PublicationUploadID' => $uploadID)
    );

    $src  = $config->getSetting('publication_uploads') . $uploadData['URL'];
    $dest = $config->getSetting('publication_deletions') . $uploadData['URL'];

    rename($src, $dest);

} else {
    http_response_code(403);
    $message['message'] = 'You do not have permission to delete this file.';
    echo json_encode($message);
    exit;
}

/**
 * Permission check
 *
 * @param array    $uploadData upload data
 * @param Database $db         database
 * @param User     $user       user
 *
 * @return bool
 */
function userCanDelete($uploadData, $db, $user) : bool
{
    $retVal   = false;
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

    // Allow user to delete if they are original uploader
    // or is user with edit permission
    if ($user->getId() === $origUser || in_array($user->getId(), $editors)) {
        $retVal = true;
    }

    return $retVal;
}
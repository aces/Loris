<?php declare(strict_types=1);

/**
 * Publication file deletion script
 *
 * Deletes a specified file by upload ID (PublicationUploadID)
 *
 * PHP Version 8
 *
 * @category Loris
 * @package  Publication
 * @author   David <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
$uploadID = $_REQUEST['uploadID'];
$factory  = \NDB_Factory::singleton();
$db       = $factory->database();
$user     = $factory->user();
$config   = \NDB_Config::singleton();

$query      = "SELECT PublicationID, Filename ".
    "FROM publication_upload ".
    "WHERE PublicationUploadID=:upid";
$uploadData = $db->pselectRow($query, ['upid' => $uploadID]);

$message = ['message' => null];

if (empty($uploadData)) {
    http_response_code(400);
    $message['message'] = 'Invalid Upload ID';
    print json_encode($message);
    exit(0);
}

if (userCanDelete($uploadData, $db, $user)) {
    $uploaddir = $config->getSetting('publication_uploads');
    $deletedir = $config->getSetting('publication_deletions');

    if (empty($uploaddir) || empty($deletedir)) {
        throw new \Exception("Invalid config setting");
    }
    if (empty($uploadData['Filename'])) {
        throw new \Exception("Invalid filename");
    }

    $db->delete(
        'publication_upload',
        ['PublicationUploadID' => $uploadID]
    );

    $src  = \Utility::pathJoin($uploaddir, $uploadData['Filename']);
    $dest = \Utility::pathJoin($deletedir, $uploadData['Filename']);

    rename($src, $dest);

} else {
    http_response_code(403);
    $message['message'] = 'You do not have permission to delete this file.';
    print json_encode($message);
    exit(0);
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
        ['pid' => $uploadData['PublicationID']]
    );

    $editors = $db->pselectCol(
        'SELECT UserID 
        FROM publication_users_edit_perm_rel 
        WHERE PublicationID=:pid',
        ['pid' => $uploadData['PublicationID']]
    );

    // Allow user to delete if they are original uploader
    // or is user with edit permission
    if ($user->getId() === $origUser || in_array($user->getId(), $editors)) {
        $retVal = true;
    }

    return $retVal;
}

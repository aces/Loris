<?php
/**
 * Issue tracker
 *
 * Handles attachments in issue_tracker and
 * returns data in response for frontend requests.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

/**
 * Issue tracker
 *
 * Handles attachments in issue_tracker and
 * returns data in response for frontend requests.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($_REQUEST['action'] === 'download') {
        downloadAttachment();
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if ($_REQUEST['action'] === 'delete') {
        echo json_encode(deleteAttachment());
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_REQUEST['action'] === 'new') {
        echo json_encode(newAttachment());
    }
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

/**
 * Create attachment for issue_tracker
 *
 * @return array
 */
function newAttachment() : array
{
    $user       =& User::singleton();
    $attachment = new \LORIS\issue_tracker\UploadHelper();
    $attachment->setupUploading(
        $user,
        $_FILES,
        $_POST
    );
    return ['success' => true];
}

/**
 * Deletes attachment from issue_tracker
 *
 * @return array
 */
function deleteAttachment() : array
{
    $uuid  = $_GET['uuid'];
    $DB    = \Database::singleton();
    $query = 'UPDATE issues_attachments SET deleted=1 WHERE file_uuid=:uuid;';
    $stmt  = $DB->prepare($query);
    $stmt->execute(array('uuid' => $uuid));

    return ['success' => true];
}

/**
 * Download attachment from issue_tracker
 *
 * @return void
 * @throws LorisException
 */
function downloadAttachment() : void
{
    $uuid      = $_GET['uuid'];
    $issue     = $_GET['issue'];
    $filename  = $_GET['filename'];
    $mime_type = $_GET['mime_type'];

    $config = \NDB_Config::singleton();
    $attachment_data_dir = rtrim(
        $config->getSetting('IssueTrackerDataPath'),
        '/'
    );

    $fileToDownload = trim($attachment_data_dir) .
        '/attachments/' .
        strval($issue) . '/' .
        $uuid;

    if (!is_readable($fileToDownload)) {
        throw new \LorisException('Attachment NOT FOUND');
    }

    $size = filesize($fileToDownload);
    $name = rawurldecode($filename);

    header('Content-Type: ' . $mime_type);
    header('Content-Transfer-Encoding: binary');
    header('Content-Disposition: attachment; filename="'.$name.'"');
    header("Content-Length: ".$size);
    readfile($fileToDownload);
}

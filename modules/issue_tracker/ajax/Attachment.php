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
    if ($_REQUEST['action'] === 'delete') {
        echo json_encode(deleteAttachment());
    } else if ($_REQUEST['action'] === 'download') {
        downloadAttachment();
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
    $response   = $attachment->setupUploading(
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
    $uuid   = $_GET['uuid'];
    $DB     = \Database::singleton();
    $query  = 'UPDATE issues_attachments SET deleted=1 WHERE file_uuid=:uuid;';
    $stmt    = $DB->prepare($query);
    $results = $stmt->execute(array('uuid' => $uuid));

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
    $uuid     = $_GET['uuid'];
    $issue    = $_GET['issue'];
    $filename = $_GET['filename'];

    $config = \NDB_Config::singleton();
    $attachment_data_dir = rtrim(
        $config->getSetting('IssueTrackerDataPath'),
        '/'
    );

    $fileToDownload = $attachment_data_dir .
        '/attachments/' .
        strval($issue) . '/' .
        $uuid . '/' .
        $filename;

    if (!is_readable($fileToDownload)) {
        throw new \LorisException('Attachment NOT FOUND');
    }

    $size = filesize($fileToDownload);
    $name = rawurldecode($filename);
    $known_mime_types = array(
                         'htm'  => 'text/html',
                         'exe'  => 'application/octet-stream',
                         'zip'  => 'application/zip',
                         'doc'  => 'application/msword',
                         'jpg'  => 'image/jpg',
                         'php'  => 'text/plain',
                         'xls'  => 'application/vnd.ms-excel',
                         'ppt'  => 'application/vnd.ms-powerpoint',
                         'gif'  => 'image/gif',
                         'pdf'  => 'application/pdf',
                         'txt'  => 'text/plain',
                         'html' => 'text/html',
                         'png'  => 'image/png',
                         'jpeg' => 'image/jpg',
                        );

    $file_extension = strtolower(substr(strrchr($fileToDownload, '.'), 1));
    if (array_key_exists($file_extension, $known_mime_types)) {
        $mime_type = $known_mime_types[$file_extension];
    } else {
        $mime_type = 'application/force-download';
    }

    header('Content-Type: ' . $mime_type);
    header('Content-Transfer-Encoding: binary');
    header('Content-Disposition: attachment; filename="'.$name.'"');
    header("Content-Length: ".$size);
    readfile($fileToDownload);
}

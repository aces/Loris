<?php
/**
 * Issue tracker
 *
 * Handles attachments and returns data in response to a front end call.
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
 * Handles attachments and returns data in response to a front end call.
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
        echo json_encode(downloadAttachment());
    }
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_REQUEST['action'] === 'new') {
        echo json_encode(newAttachment());
    }
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

function newAttachment() {
    $user       =& User::singleton();
    $attachment = new \LORIS\issue_tracker\UploadHelper();
    $response   = $attachment->setupUploading(
        $user,
        $_FILES,
        $_POST
    );
    return ['success' => true];
}

function deleteAttachment() {

    return ['success' => true];
}

function downloadAttachment() {

    return ['success' => true];
}

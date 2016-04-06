<?php
/**
 * Ajax script used to get the progress of an MRI pipeline run for a specific MRI
 * scan. The upload progress for a scan (identified by its uploadId) consists of:
 *   - Value of column Inserting in table mri_upload for the upload ID.
 *   - Value of column InsertionComplete in table mri_upload for the upload ID.
 *   - The notifications in table notification_spool for that scan (if script
 *     argument summary is true, only those with verbose == 'N' are returned,
 *     otherwise they are all returned).
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   Nicolas Brossard <justinkat@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */

// Get LORIS user issuing the request
$user =& User::singleton();
if (!$user->hasPermission('imaging_uploader')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(
    get_include_path().":../../project/libraries:../../php/libraries:"
);
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";

$client = new NDB_Client();
$client->initialize("../../project/config.xml");

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();

// return bad request if uploadId is not in POST argument list
// or if it is not a number
if (empty($_POST['uploadId']) || !is_numeric($_POST['uploadId'])) {
    header("HTTP/1.1 400 Bad Request");
    exit;
} else {
    $uploadId = $_POST['uploadId'];
}

// return bad request if summary is not in POST argument list
// of if it is neither 'true' nor 'false'
if (empty($_POST['summary'])
    || ($_POST['summary'] != 'true' && $_POST['summary'] != 'false')
) {
    header("HTTP/1.1 400 Bad Request");
    exit;
} else {
    $summary = $_POST['summary'] == 'true';
}

// Fetch columns Inserting and InsertionComplete from table mri_upload
$query = "SELECT Inserting, InsertionComplete 
          FROM mri_upload
          WHERE UploadId =:uploadId";

$row       = $DB->pselectRow(
    $query,
    array('uploadId' => $uploadId)
);
$inserting = $row['Inserting'];
$insertionComplete = $row['InsertionComplete'];

// Get notifications from table notification_spool. Only get those with
// Verbose == 'N' if summary is set to true
$query = "SELECT NotificationID, TimeSpooled, Error, Verbose, Message 
          FROM notification_spool
          WHERE ProcessID = :processId";
if ($summary) {
    $query .= " AND Verbose = 'N'";
}

$notifications = $DB->pselect(
    $query,
    array('processId' => $uploadId)
);

// Return JSON object encapsulating the response
print json_encode(
    array(
     'inserting'         => $inserting,
     'insertionComplete' => $insertionComplete,
     'notifications'     => $notifications,
    )
);

?>

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

if (!\User::singleton()->hasPermission('imaging_uploader')) {
    http_response_code(403);
    return;
}
if (!validRequest()) {
    http_response_code(400);
    return;
}

$uploadId = $_POST['uploadId'];
$summary  = $_POST['summary'] === 'true';

/* Fetch columns Inserting and InsertionComplete from table mri_upload
 * create Database object
 */
$DB    =& Database::singleton();
$query = "SELECT Inserting, InsertionComplete 
          FROM mri_upload
          WHERE UploadId =:uploadId";

$row       = $DB->pselectRow(
    $query,
    array('uploadId' => $uploadId)
);
$inserting = $row['Inserting'];
$insertionComplete = $row['InsertionComplete'];

/* Get the active notifications from table notification_spool. Only get the ones
 *  with Verbose == 'N' if summary is set to true.
 */
$query = "SELECT NotificationID, TimeSpooled, Error, Verbose, Message
          FROM notification_spool
          WHERE ProcessID = :processId
          AND Active='Y'";
if ($summary) {
    $query .= " AND Verbose = 'N'";
}

$notifications = $DB->pselect(
    $query,
    array('processId' => $uploadId)
);

// Return JSON object encapsulating the response
echo json_encode(
    array(
     'inserting'         => $inserting,
     'insertionComplete' => $insertionComplete,
     'notifications'     => $notifications,
    )
);

/**
 * Ensure that the POST request sent to this script is well-formed:
 * - uploadID must be present and be a positive integer
 * - summary must be equal to 'true' or 'false' when present.
 *
 * @return bool Whether the above conditions apply.
 */
function validRequest(): bool
{
    if (empty($_POST['uploadId'])
        || !is_numeric($_POST['uploadId'])
        || intval($_POST['uploadId'] < 0)
        || ($_POST['summary'] !== 'true' && $_POST['summary'] !== 'false')
    ) {
        return false;
    }
    return true;
}
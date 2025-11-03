<?php declare(strict_types=1);

/**
 * Ajax script used to get the progress of an MRI pipeline run for a specific MRI
 * scan. The upload progress for a scan (identified by its uploadId) consists of:
 *   - Value of column Inserting in table mri_upload for the upload ID.
 *   - Value of column InsertionComplete in table mri_upload for the upload ID.
 *   - The notifications in table notification_spool for that scan (if script
 *     argument summary is true, only those with verbose == 'N' are returned,
 *     otherwise they are all returned).
 *
 * PHP Version 8
 *
 * @category Documentation
 * @package  Main
 * @author   Nicolas Brossard <justinkat@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */

// Base access check - user must have either of these permissions
// more access validation after request validation
if (!$user->hasAnyPermission(
    [
        'imaging_uploader_allsites',
        'imaging_uploader_ownsites',
    ]
)
) {
    http_response_code(403);
    return;
}
$config        = \NDB_Factory::singleton()->config();
$advancedperms = $config->getSetting('useAdvancedPermissions');
$user          = \NDB_Factory::singleton()->user();
$centerString  = implode("','", $user->getCenterIDs());
$projectString = implode("','", $user->getProjectIDs());
$username      = $user->getUsername();

if (!validRequest()) {
    http_response_code(400);
    return;
}

$uploadId = $_POST['uploadId'];
$summary  = $_POST['summary'] === 'true';
$DB       = \NDB_Factory::singleton()->database();

// Access Control - mimic menu filter behaviour
// MySQL order of operations dictates that ANDs get computed before ORs which
// means this where clause can take the follwoing forms
// 1. WHERE mu.UploadedBy='$username' OR 1=1
//      -> returns all records
// 2. WHERE mu.UploadedBy='$username' OR (1=1 AND s.CenterID IN ...)
//      -> returns records for user's sites
// 3. WHERE mu.UploadedBy='$username' OR (1=1 AND s.ProjectID IN ...)
//      -> returns records for user's projects
// 4. WHERE mu.UploadedBy='$username'
//        OR (1=1 AND s.CenterID IN ... AND s.ProjectID IN ...)
//      -> returns records for user's sites and projects
// 5. WHERE mu.UploadedBy='$username'
//        OR (1=1 AND s.CenterID IN ... AND s.ProjectID IN ...)
//        OR mu.SessionID IS NULL
//     -> returns records for user's sites and projects and null session data
// Other combinations are possible but order of operations still applies
$accessQuery = "SELECT * 
     FROM mri_upload mu 
     LEFT JOIN session s ON (s.ID = mu.SessionID)
     ";
$accessWhere = " WHERE (mu.UploadedBy='$username' OR 1=1 ";
if (!$user->hasPermission('imaging_uploader_allsites')) {
    // Create where clause for sites
    $accessWhere = $accessWhere . " AND s.CenterID IN ('$centerString') ";
}

if ($advancedperms === 'true') {
    // If config setting is enabled, check the user's sites and projects
    // site/project match + user's own uploads
    $accessWhere = $accessWhere . " AND s.ProjectID IN ('$projectString')";
}

if ($user->hasPermission('imaging_uploader_nosessionid')) {
    // clause for accessing null session data
    $accessWhere = $accessWhere . " OR mu.SessionID IS NULL ";
}

// Wrap entire access logic in parentheses and add AND clause for specific upload ID
$accessWhere = $accessWhere . ") AND UploadId =:uploadId";

$accessData = $DB->pselectRow(
    $accessQuery.$accessWhere,
    ['uploadId' => $uploadId]
);


if (empty($accessData)) {
    http_response_code(403);
    return;
}


/* Fetch columns Inserting and InsertionComplete from table mri_upload
 * create Database object
 */
$query = "SELECT Inserting, InsertionComplete 
          FROM mri_upload
          WHERE UploadId =:uploadId";

$row       = $DB->pselectRow(
    $query,
    ['uploadId' => $uploadId]
);
$inserting = $row['Inserting'] ?? '';
$insertionComplete = $row['InsertionComplete'] ?? '';

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
    ['processId' => $uploadId]
);

// Return JSON object encapsulating the response
echo json_encode(
    [
        'inserting'         => $inserting,
        'insertionComplete' => $insertionComplete,
        'notifications'     => $notifications ?? '',
    ]
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

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
if (!($user->hasPermission('imaging_browser_view_allsites')
        || ($oneIsStudySite
            && $user->hasPermission('imaging_browser_view_site')
        )
        || $user->hasPermission('imaging_browser_phantom_allsites')
        || $user->hasPermission('imaging_browser_phantom_ownsite')
    )) {
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

if (!empty($_POST['sortedIDs'])) {
    $filtered = $_SESSION['State']->getProperty('mriSessionsListed');
    $sorted = $_POST['sortedIDs'];

    $_SESSION['State']
        ->setProperty(
            'mriSessionsListed',
            array_intersect($sorted, $filtered)
        );
}

exit;
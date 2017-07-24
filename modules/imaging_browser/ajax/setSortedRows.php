<?php
/**
 * Used to keep the sorted order of rows in imaging_browser menu for
 * the navigation links in the imaging viewer
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  Loris license
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
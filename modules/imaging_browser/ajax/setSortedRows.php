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
 * @link     https://github.com/aces/Loris-Trunk
 */

// Get LORIS user issuing the request
$user =& User::singleton();
if (!($user->hasPermission('imaging_browser_view_allsites')
    || ($user->hasStudySite()
    && $user->hasPermission('imaging_browser_view_site'))
    || $user->hasPermission('imaging_browser_phantom_allsites')
    || $user->hasPermission('imaging_browser_phantom_ownsite'))
) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

if (!empty($_POST['sortedIDs'])) {
    $filtered = $_SESSION['State']->getProperty('mriSessionsListed');
    $sorted   = $_POST['sortedIDs'];
    $_SESSION['State']
        ->setProperty(
            'mriSessionsListed',
            array_intersect($sorted, $filtered)
        );
}

exit;

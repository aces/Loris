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

/* User has access if they have an 'all site' permission or if they are
 * part of a study site and are permitted to view their own site.
 */
$canAccess = \User::singleton()->hasAnyPermission(
    array(
        'imaging_browser_view_allsites',
        'imaging_browser_phantom_allsites',
        'imaging_browser_phantom_ownsite',
    )
)
|| ($user->hasStudySite()
&& $user->hasPermission('imaging_browser_view_site'));

if (!$canAccess) {
    header("HTTP/1.1 403 Forbidden");
    return;
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

return;

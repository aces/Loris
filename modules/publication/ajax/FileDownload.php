<?php
/**
 * Publication Downloader
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Publication
 * @author   David <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

$user    = \User::singleton();
$message = array('message' => null);

if (userCanDownload($user)) {
    // Make sure that the user isn't trying to break out of the $path
    // by using a relative filename.
    $file     = basename($_GET['File']);
    $config   = NDB_Config::singleton();
    $path     = $config->getSetting('publication_uploads');
    $filePath = $path . $file;

    if (!file_exists($filePath)) {
        error_log("ERROR: File $filePath does not exist");
        http_response_code(404);
        $message['message'] = "Could not locate file: $file";
        exit(json_encode($message));
    }

    // Output file in downloadable format
    header('Content-Description: File Transfer');
    header("Content-Transfer-Encoding: Binary");
    header("Content-disposition: attachment; filename=\"" .  $file . "\"");
    readfile($filePath);
} else {
    http_response_code(403);
    $message['message'] = 'You do not have permission to download this file.';
    exit(json_encode($message));
}

/**
 * Permission check
 *
 * @param User $user user
 *
 * @return bool
 */
function userCanDownload($user) : bool
{
    $retVal = false;
    if ($user->hasPermission('publication_view')
        || $user->hasPermission('publication_propose')
        || $user->hasPermission('publication_approve')
    ) {
        $retVal = true;
    }

    return $retVal;
}
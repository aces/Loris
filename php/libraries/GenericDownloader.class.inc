<?php
/**
 * Class to provide file downloading functionality, taking care
 * of basic validation (e.g. checking that a file exists and is readable) as
 * well as providing protection against path traversal attacks.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */

require_once '../php/libraries/FileDownloader.class.inc';
/**
 * This serves as a generic base class for other modules in LORIS to extend as
 * needed. It implements the FileDownloader interface to provide core download
 * functionality and security. It does not actually provide any functionlity
 * related to retrieving additional file information from the database as in
 * practice this is done in an ad-hoc way across LORIS.  Therefore it is
 * suitable only when a file can be directly and simply retrieved from the
 * file system.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class GenericDownloader implements FileDownloader
{

    protected $realBasePath;

    /**
     * Constructor for GenericDownloader.
     *
     * @param string $basePath The full path to the directory that will serve
     *                              the files for download.
     *
     * @return none
     */
    function __construct(string $basePath)
    {
        $this->realBasePath = realpath($basePath);
        // Ensure there is a trailing forward slash.
        $this->realBasePath = rtrim($this->realBasePath, '/') . '/';
    }

    /**
     * Downloads a file from the filesystem.
     *
     * @param string $userPath The full path supplied by the calling program.
     *                          This path can be unsanitized (i.e. can accept
     *                          raw request data) as sanitization is done
     *                          automatically.
     *
     * @return none
     */
    public function downloadFile(string $userPath): void
    {
        // Ensure that every following test is conducted on a sanitized
        // (non-malicious) file path.
        $this->sanitizePath($userPath);
        $fileName = basename($userPath);
        $fullPath = $userPath;

        // Ensure the server is configured correctly to allow the apache user
        // to download files from the directory where they are stored.
        if (!is_readable($this->realBasePath)) {
            error_log(
                "ERROR: $this->realBasePath should be readable by the "
                . 'apache user but is not.'
            );
            http_response_code(500);
            return;
        }
        // Make sure file is actually a file.
        if (!is_file($fullPath)) {
            error_log($fullPath);
            error_log("ERROR: File requested for download is not a file.");
            http_response_code(400);
            return;
        }

        // Make sure the file itself is readable.
        if (!is_readable($fullPath)) {
            error_log("ERROR: A forbidden file was requested for download");
            http_response_code(403);
            return;
        }

        // Make sure the requested file exists.
        if (!file_exists($fullPath)) {
            error_log("ERROR: File requested for download does not exist.");
            http_response_code(404);
            return;
        }

        // Get mime type and do the file download.
        $mimeType = mime_content_type($fullPath);
        header("Content-type: $mimeType");
        header("Content-Disposition: attachment; filename=$fileName");
        $fp = fopen($fullPath, 'r');
        fpassthru($fp);
        fclose($fp);
    }

    /**
     * Must be declared due to FileDownloader.
     *
     * @param int $id The MySQL ID associated with a filename.
     *
     * @return string
     */
    public function getFileNameFromDatabase(int $id)
    {
    }

    /**
     * Protects against path traversal by resolving paths containing relative
     * characters. If relative characters are detected this function will log
     * the incident.  The function will throw an exception if a path traversal 
     * attempt is confirmed.
     *
     * @param string $userPath The full path supplied by the user.
     *
     * @return none
     */
    function sanitizePath(string $userPath): void
    {
        if (strpos($userPath, '..') !== false) {
            error_log(
                'WARNING: A relative path was supplied in the context of '
                . 'downloading a file.'
            );
        }
        //Resolve path (remove '..' and other relative file path structures.
        $realUserPath = realpath($userPath);
        // Validate that the path supplied by the user begins with the same base
        // path as the proper directory of the file.
        // If not, it is almost certainly a hacking attempt.
        if ($realUserPath === false
            || strpos($realUserPath, $this->realBasePath) !== 0
        ) {
            http_response_code(400);
            throw new LorisException('ERROR: Likely path traversal attempt in '
                . 'file download.');
        }
    }

}

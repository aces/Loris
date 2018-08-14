<?php

require_once '../php/libraries/FileDownloader.class.inc';

class GenericDownloader implements FileDownloader
{

    // The name of the table in the database where more information about a file
    // can be found.
    protected $tableName;
    protected $realBasePath;

    function __construct(string $basePath, string $tableName = '')
    {
        $this->realBasePath = realpath($basePath);
        // Ensure there is a trailing forward slash.
        $this->realBasePath = rtrim($this->realBasePath, '/') . '/';
        $this->tableName    = $tableName;
    }

    public function downloadFile(string $userPath)
    {

        // Ensure that every following test is conducted on a sanitized
        // (non-malicious) file path.
        $this->sanitizePath($userPath);
        $fileName = basename($realUserPath);
        $fullPath = $this->realBasePath . $fileName;

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

    public function getFileNameFromDatabase(int $id)
    {
    }

    function sanitizePath(string $userPath): void
    {
        if (strpos($userPath, '..') !== false) {
            error_log('WARNING: A relative path was supplied in the context of '
                . 'downloading a file.');
        }
        //Resolve path (remove '..' and other relative file path structures.
        $realUserPath = realpath($userPath);
        // Validate that the path supplied by the user begins with the same base
        // path as the proper directory of the file.
        // If not, it is almost certainly a hacking attempt.
        if (realpath($fullPath) === false
            || strpos($realUserPath, $this->realBasePath) !== 0
        ) {
            error_log("ERROR: Likely path traversal attempt in file download.");
            http_response_code(400);
            exit(1);
        }
    }

}

<?php

interface FileDownloader
{
    /**
     * Download a file given a path to the file.
     */
    function downloadFile(string $fullPath);
    /**
     * If the location of a file is stored from a database, the class
     * implementing this function will need to specify how that is done.
     */
    function getFilenameFromDatabase(string $identifier);

    /**
     * We must be sure that a relative path is not being used maliciously to
     * download a forbidden file.
     */
    function sanitizePath(string $fullPath);
}


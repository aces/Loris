<?php

interface FileDownloader
{
    /**
     * Download a file given a path to the file.
     */
    function downloadFile(string $fullPath);
}


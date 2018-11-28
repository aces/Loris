<?php
/**
 * MediaFileDownloadValidator downloads files and does some validation.
 */
namespace LORIS\media;

require_once 'FileDownloadValidator.class.inc';

class MediaFileDownloadValidator extends FileDownloadValidator {
    
    public function __construct(string $filepath) {
        $paths = \NDB_Config::singleton()->getSetting('paths');
        /* The mediaPath config setting should be set to the full path to the
         * directory containing the requested file.
         */
        $this->filepath = $paths['mediaPath'] . $filepath;
        error_log($this->filepath);
    }
    
    public function getContentType(): string
    {
        return finfo_open(FILEINFO_MIME, $this->filepath);
    }

    public function exists(): bool
    {
        return file_exists($this->filepath);
    }

    public function getFilename(): string {
        return $this->filepath;
    }

}

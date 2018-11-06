<?php
/**
 * FileDownloadValidator downloads files and does some validation.
 * It does reasonable things for the above interface where applicable
 * and leaves the rest abstract for a concrete implementation to
 * enforce such as a module checking permissions. 
 */
require_once 'DownloadableFile.class.inc';
abstract class FileDownloadValidator implements DownloadableFile {
    protected $filepath;
    
    public function __construct(string $filepath) {
        $this->filepath = $filepath;
    }
    
    public function getContents() : \Psr\Http\Message\StreamInterface {
        // an example of a reasonable thing to do here 
        return new \Zend\Diactoros\Stream($this->filepath);
    }
    
    abstract public function getContentType() : string;

    /**
     * FIXME This function should be expanded to specify which users can 
     * acess a given file. However this functionality is not yet implemented
     * in LORIS. Anyone with te media_write permission can download any file;
     * there is no concept of user-file permissions at the LORIS level.
     *
     * @return bool True
     */
    public function hasAccess(\User $user): bool
    {
        return true;
    }

    private function _isSafe(): bool
    {
        // Check for path traversal attempts for file that are not symlinks.
        if (!is_link($this->filepath)) {
            if (!$this->_safePathPrefix($this->path)) {
                return false;
            }
        }
    }

    /**
     * Protects against path traversal by resolving paths containing relative
     * characters. This is done by checking that the prefix of the real path
     * matches the one supplied to the function.
     *
     * E.g.
     *      Input of "/var/www/loris/my_uploads/" will have the same prefix as
     *      the valid path of /var/www/loris/my_uploads/, but an input like
     *      "/var/www/loris/my_uploads/../../../../../etc/passwd" will resolve
     *      to "/etc/passwd" which will not have the same prefix as the valid
     *      destination.
     * Note that this approach does not work for symlinks as their resolved
     * paths are expected to be outside of the target directory. This option
     * is left open in case sysadmins decide that the files must be hosted
     * elsewhere.
     *
     * @return bool Whether path traversal is happening.
     */
    private function _safePathPrefix(): bool
    {
        // Resolve path (remove '..' and other relative file path structures.)
        $realUserPath = realpath($userPath);
        if ($realUserPath === false
            || strpos($realUserPath, $userPath) !== 0
        ) {
            return false;
        }
        return true;
    }

    /**
     *
     * @throws \LorisException
     */
    private function _validate(): void
    {
    }
}

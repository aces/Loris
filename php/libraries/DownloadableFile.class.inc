<?php
/**
 * A DownloadableFile represents a file that a user
 * can download.
 */
interface DownloadableFile {
    /**
     * Returns a StreamInterface to download the file
     */
    public function getContents() : \Psr\Http\Message\StreamInterface;
    
    /**
     * Returns the Content-Type being returned, if
     * known. The empty string should be interpreted
     * as "unknown"
     */
    public function getContentType(): string;
    
    /**
     * Returns the filename for this file that should
     * be presented to the end user, if known, otherwise
     * the empty string
     */
    public function getFilename(): string;
    
    /**
     * Returns true if the file being downloaded exists. Classes implementing
     * this interface should ensure that this check covers a basic check of
     * whether the requested file exists on the file system as well as additional
     * database-related checks as necessary.
     */
    public function exists(): bool;
    
    /**
     * Return true if the user can access this file
     */
    public function hasAccess(\User $user): bool;

}

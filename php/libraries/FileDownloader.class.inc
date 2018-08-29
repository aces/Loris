<?php
/**
 * The file contains the interface that outlines functions providing download
 * functionality in LORIS.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Main
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */

/**
 * Interface to define expected behaviour for modules that provide file
 * downloading functionality.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Main
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
interface FileDownloader
{
    /**
     * Download a file given a path to the file.
     *
     * @param string $fullPath The full path to the resource to download
     *
     * @return resource
     */
    function downloadFile(string $fullPath);

    /**
     * Returns the MIME type given a file
     *
     * @param string $fullPath The path to the file.
     *
     * @return string The MIME type of $filename.
     */
    function getContentType(string $fullPath): string;
}


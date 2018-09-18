<?php
/**
 * Class to provide file downloading functionality, taking care
 * of basic validation (e.g. checking that a file exists and is readable) as
 * well as providing protection against path traversal attacks.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Main
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */

use Zend\Diactoros\Response;
use Zend\Diactoros\Response\InjectContentTypeTrait;
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
 *  @package  Main
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class GenericDownloader extends Response
{
    use InjectContentTypeTrait;

    /**
     * Constructor for GenericDownloader.
     *
     * @param string $path A path to a file attachment for download.
     *
     * @return void
     */
    function __construct(string $path)
    {
        /* Warn administrators if relative paths are used. This could be done
         * legitimately in some circumstances but is also often suspicious.
         */
        if (strpos($path, '..') !== false) {
            error_log(
                'WARNING: A relative path was supplied in the context of '
                . 'downloading a file.'
            );
        }

        if (!is_readable($path)) {
            error_log(
                "ERROR: $this->realBasePath should be readable by the "
                . 'apache user but is not.'
            );
            throw new LorisException(
                "The server is not configured to allow downloads from the "
                . "requested location. Please contact your administrator."
            );
        }
        if (!is_file($path)) {
            throw new \LorisException(
                "Not a file or file does not exist."
            );
        }

        // Check for path traversal attempts for file that are not symlinks.
        if (!is_link($path)) {
            if (!$this->safePathPrefix($path)) {
                throw new LorisException(
                    'ERROR: Likely path traversal attempt in user-supplied '
                    . 'parameter'
                );
            }
        }

        parent::__construct(
            new \Zend\Diactoros\Stream(realpath($path), 'r'),
            '200',
            $this->injectContentType(
                (new \finfo(FILEINFO_MIME_TYPE))->file($path),
                array()
            )
        );
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
     * Note that this approach does not work for symlinks as their resolve paths
     * are actually expected to be outside of the target directory. This option
     * is left open in case sysadmins decide that the files must be hosted
     * elsewhere.
     *
     * @param string $userPath The full path supplied by the user.
     *
     * @return bool Whether path traversal is happening.
     */
    function safePathPrefix(string $userPath): bool
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

}

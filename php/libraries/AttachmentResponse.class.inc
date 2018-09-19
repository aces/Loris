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
/**
 * This serves as a generic base class for other modules in LORIS to extend as
 * needed. It does basic validation as to whether a file is accessible and
 * also provides path traversal protection.
 * This class does NOT provide functionality related to retrieving additionl
 * file information from the database as in practice this is done in an ad-hoc
 * way across LORIS.  Therefore its use as a base class is suitable only when
 * a file can be directly and simply retrieved from the file system.
 *
 * {@inheritdoc}
 *
 *  @category Main
 *  @package  Main
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class AttachmentResponse extends Response
{
    use InjectContentTypeTrait;
    public $path;

    /**
     * Constructor for AttachmentResponse.
     *
     * {@inheritdoc}
     * Creates a new stream based on $path and adds some headers.
     *
     * @param string $path    A path to a file attachment for download.
     * @param string $status  A response status code.
     * @param array  $headers Optional headers to include.
     *
     * @return void
     */
    function __construct(
        string $path,
        string $status = '200',
        array $headers = array()
    ) {
        $this->path = $path;
        // Throw exception if path is not valid.
        $this->validate();

        $headers = array_replace(
            $headers,
            array(
             'content-disposition' => 'attachment; filename=' . basename($path),
            )
        );

        parent::__construct(
            new \Zend\Diactoros\Stream(realpath($path), 'r'),
            $status,
            $this->injectContentType(
                (new \finfo(FILEINFO_MIME_TYPE))->file(realpath($this->path)),
                $headers
            )
        );
        $this->download();
    }

    /**
     * Do basic validation and security checking on the supplied download path
     *
     * @return void
     * @throws LorisException
     */
    function validate(): void
    {
        /* Warn administrators if relative paths are used. This could be done
         * legitimately in some circumstances but is also often suspicious.
         */
        if (strpos($this->path, '..') !== false) {
            error_log(
                'WARNING: A relative path was supplied in the context of '
                . 'downloading a file.'
            );
        }

        if (!is_readable($this->path)) {
            error_log(
                "ERROR: $this->realBasePath should be readable by the "
                . 'apache user but is not.'
            );
            throw new \LorisException(
                "The server is not configured to allow downloads from the "
                . "requested location. Please contact your administrator."
            );
        }
        if (!is_file($this->path)) {
            throw new \LorisException(
                "Not a file or file does not exist."
            );
        }

        // Check for path traversal attempts for file that are not symlinks.
        if (!is_link($this->path)) {
            if (!$this->safePathPrefix($this->path)) {
                throw new \LorisException(
                    'ERROR: Likely path traversal attempt in user-supplied '
                    . 'parameter'
                );
            }
        }
    }

    /**
     * Actually download the file. A manual chunked-download approach is used
     * here to support downloading very large files from the server.
     *
     * @return void
     */
    function download(): void
    {
        $chunkSize = 1024 * 1024;
        $stream    = $this->getBody();
        header('content-type: ' . $this->getHeader('content-type')[0]);
        header('content-length: ' . $stream->getSize());
        while (!$stream->eof()) {
            $buffer = $stream->read($chunkSize);
            echo $buffer;
            ob_flush();
            flush();
        }
        $stream->close();
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

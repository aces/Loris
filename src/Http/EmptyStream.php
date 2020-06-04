<?php
/**
 * File contains the EmptyStream implementation.
 *
 * PHP Version 7
 *
 * @category PSR7
 * @package  Http
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;

/**
 * An empty stream represents a stream for HTTP requests/responses with
 * no body.
 *
 * It always gets added by the ResponseGenerator MiddlewareChainer to
 * responses which have no body, to ensure that calling getBody() on a
 * request returns a StreamInterface and doesn't cause null pointer
 * exceptions.
 *
 * (It can also be used in any other context where a ServerResponse
 * wants to replace the body with an empty body.)
 *
 * @category PSR7
 * @package  Http
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class EmptyStream implements \Psr\Http\Message\StreamInterface
{
    /**
     * Serializes the body to a string to implement PSR7's
     * StreamInterface
     *
     * @return string ""
     */
    public function __toString()
    {
        return "";
    }

    /**
     * Stub to implements PSR7 StreamInterface. No-op
     *
     * @return void
     */
    public function close()
    {
    }

    /**
     * Stub to implements PSR7 StreamInterface. No-op
     *
     * @return null
     */
    public function detach()
    {
        return null;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return int 0
     */
    public function getSize()
    {
        return 0;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return int 0
     */
    public function tell()
    {
        return 0;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return bool true (An EmptyStream is always at its end)
     */
    public function eof()
    {
        return true;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return bool false (An EmptyStream has nowhere to seek.)
     */
    public function isSeekable()
    {
        return false;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @param int $offset The offset to seek to in the stream
     * @param int $whence The position that offset is relative to.
     *
     * @return int 0
     */
    public function seek($offset, $whence = SEEK_SET)
    {
        return 0;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return void
     */
    public function rewind()
    {
        return;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return bool false
     */
    public function isWritable()
    {
        return false;
    }

    /**
     * Stub to implements PSR7 StreamInterface. No-op.
     *
     * @param string $string The string to write to the stream
     *
     * @return int The number of bytes written (always 0)
     */
    public function write($string) : int
    {
        return 0;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return bool true
     */
    public function isReadable()
    {
        return true;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @param int $length The length of the stream to read
     *
     * @return string ""
     */
    public function read($length)
    {
        return "";
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return string ""
     */
    public function getContents()
    {
        return "";
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @param string|null $key The key to retrieve metadata for
     *
     * @return null
     */
    public function getMetadata($key = null)
    {
        return null;
    }
}

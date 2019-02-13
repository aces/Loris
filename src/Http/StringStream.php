<?php
/**
 * This file implements a StringStream, a simple wrapper which converts
 * a PHP string into a PSR7 StreamInterface compatible with other PSR7
 * interfaces.
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

use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A StringStream provides a simple wrapper over a string to convert
 * it to a \Psr\Http\Message\StreamInterface.
 *
 * @category PSR7
 * @package  Http
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class StringStream implements \Psr\Http\Message\StreamInterface, RequestHandlerInterface
{
    protected $stream;
    protected $size;

    /**
     * Takes the value $val and converts it to a PSR7 StreamInterface.
     *
     * @param string $val The string value to convert to a stream.
     */
    public function __construct(string $val)
    {
        $this->stream = fopen("php://temp", "r+");
        fwrite($this->stream, $val);
        rewind($this->stream);
        $this->size = strlen($val);
    }

    /**
     * Reserialize the string value to a PHP string.
     *
     * @return string
     */
    public function __toString()
    {
        try {
            $this->rewind();
            return $this->getContents();
        } catch (\Exception $e) {
            return "";
        }
    }

    /**
     * Implements the PSR7 StreamInterface and closes the underlying stream.
     *
     * @return void
     */
    public function close()
    {
        if (fclose($this->stream) === false) {
            throw new LorisException(
                'Could not close stream!'
            );
        }
    }

    /**
     * Implements the PSR7 StreamInterface and detaches the underlying stream.
     *
     * @return resource|null Underlying PHP stream, if any
     */
    public function detach()
    {
        $oldstream    = $this->stream;
        $this->stream = null;
        return $oldstream;
    }

    /**
     * Returns the size of the string which is being streamed.
     *
     * @return int|null Returns the size in bytes if known, or null if unknown.
     */
    public function getSize()
    {
        return $this->size;
    }

    /**
     * Returns the current pointer into the stream.
     *
     * @return int Position of the file pointer
     * @throws \RuntimeException on error.
     */
    public function tell()
    {
        $val = ftell($this->stream);
        if ($val === false) {
            throw new \RuntimeException("Invalid stream for tell");
        }
        return $val;
    }

    /**
     * Returns true if the stream is at the end of the stream.
     *
     * @return bool
     */
    public function eof()
    {
        return feof($this->stream);

    }

    /**
     * Returns whether the stream is seekable to implement
     * StreamInterface.
     *
     * @return bool true
     */
    public function isSeekable()
    {
        return true;
    }

    /**
     * Seeks to a specific position in the String
     *
     * @param int $offset Stream offset
     * @param int $whence Specifies how the cursor position will be calculated
     *     based on the seek offset. Valid values are identical to the built-in
     *     PHP $whence values for `fseek()`.  SEEK_SET: Set position equal to
     *     offset bytes SEEK_CUR: Set position to current location plus offset
     *     SEEK_END: Set position to end-of-stream plus offset.
     *
     * @see http://www.php.net/manual/en/function.fseek.php
     *
     * @return void
     * @throws \RuntimeException on failure.
     */
    public function seek($offset, $whence = SEEK_SET)
    {
        $off = fseek($this->stream, $offset, $whence);
        if ($off === -1) {
            throw new \RuntimeException("Could not seek in stream");
        }
    }

     /**
     * Seek to the beginning of the stream.
     *
     * @see seek()
     * @see http://www.php.net/manual/en/function.fseek.php
     *
     * @return void
     * @throws \RuntimeException on failure.
     */
    public function rewind()
    {
        // StringStream isSeekable is always true, so we just rewind
        // and don't bother to check if it's seekable.
        if (rewind($this->stream) === false) {
            throw new \RuntimeException("Could not rewind stream");
        }
    }

    /**
     * Returns whether or not the stream is writable.
     *
     * @return bool
     */
    public function isWritable()
    {
        return is_writable(stream_get_meta_data($this->stream)['uri']);
    }

    /**
     * Writes a value to the underlying stream.
     *
     * @param string $string The string that is to be written.
     *
     * @return int Returns the number of bytes written to the stream.
     * @throws \RuntimeException on failure.
     */
    public function write($string)
    {
        $n = fwrite($this->stream, $string);
        if ($n === false) {
            throw new \RuntimeException("Could not write to stream");
        }
        return $n;
    }

    /**
     * Returns true if the stream is in a readable state in
     * order to implement PSR7 StreamInterface
     *
     * @return bool
     */
    public function isReadable()
    {
        return $this->stream !== null;
    }

    /**
     * Reads up to $length from the stream returns the value as
     * a string in order to implement PSR7 StreamInterface
     *
     * @param int $length Read up to $length bytes from the object and return
     *     them. Fewer than $length bytes may be returned if underlying stream
     *     call returns fewer bytes.
     *
     * @return string Returns the data read from the stream, or an empty string
     *     if no bytes are available.
     * @throws \RuntimeException if an error occurs.
     */
    public function read($length)
    {
        $val = fread($this->stream, $length);
        if ($val === false) {
            throw new \RuntimeException("Could not read from stream");
        }
        return $val;
    }

    /**
     * Returns the remaining contents in a string
     *
     * @return string
     * @throws \RuntimeException if unable to read.
     * @throws \RuntimeException if error occurs while reading.
     */
    public function getContents()
    {
        $val = stream_get_contents($this->stream);
        if ($val === false) {
            throw new \RuntimeException("Could not get stream contents");
        }
        return $val;
    }

    /**
     * Get stream metadata as an associative array or retrieve a specific key.
     *
     * The keys returned are identical to the keys returned from PHP's
     * stream_get_meta_data() function.
     *
     * @param string $key Specific metadata to retrieve.
     *
     * @see http://php.net/manual/en/function.stream-get-meta-data.php
     *
     * @return array|mixed|null Returns an associative array if no key is
     *     provided. Returns a specific key value if a key is provided and the
     *     value is found, or null if the key is not found.
     */
    public function getMetadata($key = null)
    {
        $metadata = stream_get_meta_data($this->stream);
        if ($key === null) {
            return $metadata;
        }
        return $metadata[$key];
    }

    /**
     * A StringStream can act as a handler, which resolves to a response with
     * itself as a body.
     *
     * This is primarily to allow it to be used as content by middleware.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface A response whose body consists of this string

     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
            return (new \Zend\Diactoros\Response())
                        ->withBody($this);
    }
}

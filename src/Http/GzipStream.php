<?php declare(strict_types=1);
namespace LORIS\Http;

/**
 * A GzipStreams wraps another stream and returns the contents
 * GZip encoded.
 */
class GzipStream implements \Psr\Http\Message\StreamInterface
{
    private bool $sentEof = false;
    protected $stream;

    public function __construct(protected \Psr\Http\Message\StreamInterface $inner)
    {
        $this->stream  = deflate_init(ZLIB_ENCODING_GZIP, ['level' => 9]);
        $this->sentEof = false;
    }

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
        $this->inner->close();
    }

    /**
     * Stub to implements PSR7 StreamInterface. No-op
     *
     * @return null
     */
    public function detach()
    {
        $this->inner->detach();
    }

    /**
     * Implements PSR7 StreamInterface. We do not know
     * the final size of the stream, so return null.
     *
     * @return null
     */
    public function getSize()
    {
        return null;
    }

    /**
     * Stub to implements PSR7 StreamInterface.
     *
     * @return int 0
     */
    public function tell()
    {
        return throw new \RuntimeException("Tell not implemented");
    }

    /**
     * Wrap inner stream to tell if we're at eof.
     *
     * @return bool
     */
    public function eof()
    {
        return $this->inner->eof() && $this->sentEof;
    }

    /**
     * Implement PSR7 StreamInterface. We are not seekable.
     *
     * @return bool false
     */
    public function isSeekable()
    {
        return false;
    }

    /**
     * Implement PSR7 StreamInterface. We are not seekable.
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
        if ($this->inner->eof() && !$this->sentEof) {
            $this->sentEof = true;
            return deflate_add($this->stream, '', ZLIB_FINISH);
        }
        $data = $this->inner->read($length);
        return deflate_add($this->stream, $data, ZLIB_NO_FLUSH);
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

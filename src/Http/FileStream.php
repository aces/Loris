<?php
/**
 * This file implements a FileStream, a simple wrapper which converts
 * a file into a PSR7 StreamInterface compatible with other PSR7
 * interfaces.
 *
 * @category PSR7
 * @package  Http
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 *
 * @see https://www.php-fig.org/psr/psr-7/
 */
namespace LORIS\Http;

/**
 * A FileStream provides a simple wrapper over a file to convert
 * it to a \Psr\Http\Message\StreamInterface.
 *
 * @category PSR7
 * @package  Http
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FileStream implements \Psr\Http\Message\StreamInterface
{
    /**
     * @var resource
     */
    protected $resource;
    /**
     * @var string|resource
     */
    protected $stream;
    /**
     * @param string|resource $stream
     * @param string $mode Mode with which to open stream
     * @throws \Exception
     */
    public function __construct($stream, $mode = 'r')
    {
        $error = null; 
        $this->stream = $stream;
        if (is_resource($stream)) {
            $this->resource = $stream;
        } elseif (is_string($stream)) {
            $this->resource = fopen($stream, $mode);
        } else {
            throw new \Exception(
                'Invalid stream provided; must be a string stream identifier or resource'
            );
        }
    }
    /**
     * {@inheritdoc}
     */
    public function __toString()
    {
        if (! $this->isReadable()) {
            return '';
        }
        try {
            $this->rewind();
            return $this->getContents();
        } catch (\Exception $e) {
            return '';
        }
    }
    /**
     * {@inheritdoc}
     */
    public function close()
    {
        if (! $this->resource) {
            return;
        }
        $resource = $this->detach();
        fclose($resource);
    }
    /**
     * {@inheritdoc}
     */
    public function detach()
    {
        $resource = $this->resource;
        $this->resource = null;
        return $resource;
    }
    /**
     * Attach a new stream/resource to the instance.
     *
     * @param string|resource $resource
     * @param string $mode
     * @throws \Exception for stream identifier that cannot be
     *     cast to a resource
     * @throws \Exception for non-resource stream
     */
    public function attach($resource, $mode = 'r')
    {
        if (! is_resource($resource) && is_string($resource)) {
            $resource = fopen($resource, $mode);
        }
        if (! is_resource($resource)) {
            throw new \Exception(
                'Invalid stream provided; must be a string stream identifier or resource'
            );
        }
        $this->resource = $resource;
    }
    /**
     * {@inheritdoc}
     */
    public function getSize()
    {
        if (null === $this->resource) {
            return 0;
        }
        $stats = fstat($this->resource);
        if ($stats !== false) {
            return (int)$stats['size'];
        }
        return 0;
    }
    /**
     * {@inheritdoc}
     */
    public function tell()
    {
        if (! $this->resource) {
            throw new \Exception('No resource available; cannot tell position');
        }
        $result = ftell($this->resource);
        if (! is_int($result)) {
            throw new \Exception('Error occurred during tell operation');
        }
        return $result;
    }
    /**
     * {@inheritdoc}
     */
    public function eof()
    {
        if (! $this->resource) {
            return true;
        }
        return feof($this->resource);
    }
    /**
     * {@inheritdoc}
     */
    public function isSeekable()
    {
        if (! $this->resource) {
            return false;
        }
        $meta = stream_get_meta_data($this->resource);
        return $meta['seekable'];
    }
    /**
     * {@inheritdoc}
     */
    public function seek($offset, $whence = SEEK_SET)
    {
        if (! $this->resource) {
            throw new \Exception('No resource available; cannot seek position');
        }
        
        if (! $this->isSeekable()) {
            throw new \Exception('Stream is not seekable');
        }
        $result = fseek($this->resource, $offset, $whence);
        if (0 !== $result) {
            throw new \Exception('Error seeking within stream');
        }
        return true;
    }
    /**
     * {@inheritdoc}
     */
    public function rewind()
    {
        return $this->seek(0);
    }
    /**
     * {@inheritdoc}
     */
    public function isWritable()
    {
        if (! $this->resource) {
            return false;
        }
        $meta = stream_get_meta_data($this->resource);
        return is_writable($meta['uri']);
    }
    /**
     * {@inheritdoc}
     */
    public function write($string)
    {
        if (! $this->resource) {
            throw new \Exception('No resource available; cannot write');
        }
        $result = fwrite($this->resource, $string);
        if (false === $result) {
            throw new \Exception('Error writing to stream');
        }
        return $result;
    }
    /**
     * {@inheritdoc}
     */
    public function isReadable()
    {
        if (! $this->resource) {
            return false;
        }
        $meta = stream_get_meta_data($this->resource);
        $mode = $meta['mode'];
        return (strstr($mode, 'r') || strstr($mode, '+'));
    }
    /**
     * {@inheritdoc}
     */
    public function read($length)
    {
        if (! $this->resource) {
            throw new \Exception('No resource available; cannot read');
        }
        if (! $this->isReadable()) {
            throw new \Exception('Stream is not readable');
        }
        $result = fread($this->resource, $length);
        if (false === $result) {
            throw new \Exception('Error reading stream');
        }
        return $result;
    }
    /**
     * {@inheritdoc}
     */
    public function getContents()
    {
        if (! $this->isReadable()) {
            return '';
        }
        $result = stream_get_contents($this->resource);
        if (false === $result) {
            throw new \Exception('Error reading from stream');
        }
        return $result;
    }
    /**
     * {@inheritdoc}
     */
    public function getMetadata($key = null)
    {
        if (null === $key) {
            return stream_get_meta_data($this->resource);
        }
        $metadata = stream_get_meta_data($this->resource);
        if (! array_key_exists($key, $metadata)) {
            return null;
        }
        return $metadata[$key];
    }
}

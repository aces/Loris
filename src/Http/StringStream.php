<?php
namespace LORIS\Http;

/**
 * A StringStream provides a simple wrapper over a string to convert
 * it to a \Psr\Http\Message\StreamInterface
 */
class StringStream implements \Psr\Http\Message\StreamInterface {
    protected $stream;
    protected $size;

    public function __construct($val) {
        $this->stream = fopen("php://temp", "r+");
        fwrite($this->stream, $val);
        rewind($this->stream);
        $this->size = strlen($val);
    }
    public function __toString() {
        try {
            $this->rewind();
            return $this->getContents();
        } catch(Exception $e) {
            return "";
        }
    }

    public function close() {
        return fclose($this->stream);
    }

    public function detach() {
        return $this->stream = null;
    }

    public function getSize() {
        return $this->size;
    }

    public function tell() {
        $val = ftell($this->stream);
        if ($val === FALSE) {
            throw new \RuntimeException("Invalid stream for tell");
        }
        return $val;
    }

    public function eof() {
        return feof($this->stream);

    }

    public function isSeekable() {
        return true;
    }

    public function seek($offset, $whence = SEEK_SET) {
        $off = fseek($offset, $whence);
        if ($off === -1) {
            throw new \RuntimeException("Could not seek in stream");
        }
    }
    public function rewind() {
        // StringStream isSeekable is always true, so we just rewind
        // and don't bother to check if it's seekable.
        if (rewind($this->stream) === FALSE) {
            throw new \RuntimeException("Could not rewind stream");
        }
    }

    public function isWritable() {
        return is_writable($this->stream);
    }

    public function write($string) {
        $n = fwrite($this->stream, $string);
        if ($n === FALSE) {
            throw new \RuntimeException("Could not write to stream");
        }
        return $n;
    }
    public function isReadable() {
        return $this->stream !== null;
    }

    public function read($length) {
        $val = fread($this->stream, $length);
        if ($val === FALSE) {
            throw new \RuntimeException("Could not read from stream");
        }
        return $val;
    }
    public function getContents() {
        $val = stream_get_contents($this->stream);
        if ($val === FALSE) {
            throw new \RuntimeException("Could not get stream contents");
        }
        return $val;
    }
    public function getMetadata($key=null) {
        $metadata = stream_get_meta_data($this->stream);
        if ($key === null) {
            return $metadata;
        }
        return $metadata[$key];
    }
}

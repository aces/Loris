<?php
namespace LORIS\Http;

/**
 * A StringStream provides a simple wrapper over a string to convert
 * it to a \Psr\Http\Message\StreamInterface
 */
class StringStream implements \Psr\Http\Message\StreamInterface {
    // @todo Handle error cases correct. PSR7 says to throw an exception,
    // but the fopen/etc functions generally return the false literal.
    protected $stream;
    protected $size;

    public function __construct($val) {
        $this->stream = fopen("php://temp", "r+");
        fwrite($this->stream, $val);
        rewind($this->stream);
        $this->size = strlen($val);
    }
    public function __toString() {
        $this->rewind();
        return $this->getContents();
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
        return ftell($this->stream);
    }
    public function eof() {
        return feof($this->stream);

    }
    public function isSeekable() {
        return true;
    }
    public function seek($offset, $whence = SEEK_SET) {
        return fseek($offset, $whence);
    }
    public function rewind() {
        return rewind($this->stream);
    }
    public function isWritable() {
        return is_writable($this->stream);
    }

    public function write($string) {
        return fwrite($this->stream, $string);
    }
    public function isReadable() {
        return $this->stream !== null;
    }

    public function read($length) {
        return fread($this->stream, $length);
    }
    public function getContents() {
        return stream_get_contents($this->stream);
    }
    public function getMetadata($key=null) {
        $metadata = stream_get_meta_data($this->stream);
        if ($key === null) {
            return $metadata;
        }
        return $metadata[$key];
    }
}

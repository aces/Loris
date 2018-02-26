<?php
namespace LORIS\Http;

/**
 * An empty stream represents a stream for HTTP requests/responses with
 * no body.
 */
class EmptyStream implements \Psr\Http\Message\StreamInterface {
    public function __toString() {
        return "";
    }

    public function close() {
    }

    public function detach() {
    }
    public function getSize() {
        return 0;
    }
    public function tell() {
        return 0;
    }
    public function eof() {
        return true;
    }
    public function isSeekable() {
        return false;
    }
    public function seek($offset, $whence = SEEK_SET) {
        return 0;
    }
    public function rewind() {
        return;
    }
    public function isWritable() {
        return false;
    }
    public function write($string) {
        return;
    }
    public function isReadable() {
        return true;
    }

    public function read($length) {
        return "";
    }
    public function getContents() {
        return "";
    }
    public function getMetadata($key=null) {
        return null;
    }
}

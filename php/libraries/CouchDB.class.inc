<?
require_once 'NDB_Config.class.inc';

// Wrapper around fopen/close/get/etc so that
// we can throw in a mock for testing..
class SocketWrapper {
    function __construct() {
    }

    function __destruct() {
    }

    function setHost($host) {
        $this->host = $host;
    }

    function setPort($port) {
        $this->port= $port;
    }

    function open() {
        $this->socket = fsockopen($this->host, $this->port);
    }
    function close() {
        fclose($this->socket);
    }
    function eof() {
        return feof($this->socket);
    }

    function gets() {
        return fgets($this->socket);
    }

    function write($str) {
        fwrite($this->socket, $str);
        /*
        $total = strlen($str);
        $bytesSent = 0;
        do {
            $bytesSentThisTime = fwrite($this->socket, $str, 1000);
            if($bytesSentThisTime == 0) {
                throw new Exception("Error writing data");
            }
            $bytesSent += $bytesSentThisTime;
        } while ($bytesSent < $total);
         */
        /* if(!fwrite($this->socket, $str)) {
            throw new Exception("abc");
        }
         */
    }
}

class CouchDB {
    static function singleton() {
        static $db = null;
        if($db === null) {
            $db = new CouchDB();
            $db->SocketHandler = new SocketWrapper();
            return $db;
        }
        return $db;
    }

    function _constructURL($op, $doc) {
        $config = NDB_Config::singleton();
        $db = $config->getSetting("CouchDB");
        return "$op /$db[database]/$doc";
    }

    function _getURL($url, $op = 'GET') {
        $config = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');
        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);
        $handler->open();

        $handler->write("$op $url HTTP/1.0\r\n\r\n");

        while(!$handler->eof()) {
            $response .= $handler->gets();
        }
        $handler->close();
        $response_split = explode("\r\n\r\n", $response, 2);
        return trim($response_split[1]);
    }


    function _getRelativeURL($url, $op = 'GET') {
        $config = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');
        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);
        $handler->open();

        $handler->write($this->_constructURL($op, $url) . " HTTP/1.0\r\n\r\n");

        $response = '';
        while(!$handler->eof()) {
            $response .= $handler->gets();
        }
        $handler->close();
        $response_split = explode("\r\n\r\n", $response, 2);
        return trim($response_split[1]);
    }

    function _postURL($url, $data, $op = 'POST') {
        $config = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');
        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);
        $handler->open();

        $handler->write("$op $url HTTP/1.0\r\n");
        $handler->write("Content-Length: " . strlen($data) . "\r\n\r\n");
        $handler->write($data);
        while(!$handler->eof()) {
            $response .= $handler->gets();
        }
        $handler->close();
        $response_split = explode("\r\n\r\n", $response, 2);
        return trim($response_split[1]);
   }

   function _postRelativeURL($url, $data, $op = 'POST', $mimeType = 'application/json') {
        $config = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');
        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);
        $handler->open();

        $handler->write($this->_constructURL($op, $url) . " HTTP/1.1\r\n");
        $handler->write("Host: " . $couchconfig['hostname'] . "\r\n");
        $handler->write("Connection: close\r\n");
        $handler->write("Content-Length: " . strlen($data) . "\r\n\r\n");
        $handler->write($data);
        $response = '';
        while(!$handler->eof()) {

            $response .= $handler->gets();
        }
        $handler->close();
        $response_split = explode("\r\n\r\n", $response, 2);
        return trim($response_split[1]);
   }

    function getDoc($id, $options = array()) {

        if(!empty($options)) {
            if(strpos($id, "?") === false) {
                $url = $id . "?" . http_build_query($options);
            } else {
                $url = $id . "&" . http_build_query($options);
            }
        } else {
            $url = $id;
        }
        $json = $this->_getRelativeURL($url);
        $data = json_decode($json, true);

        if(isset($data['error']) && $data['error'] === 'not_found') {
            return array();
        }
        
        return $data;
    }

    function deleteDoc($id) {
        $json = $this->_getRelativeURL($id, "DELETE");
        $data = json_decode($json, true);

        return ($data['ok'] === true);

    }

    function putDoc($id, $doc) {
        $json = $this->_postRelativeURL($id, json_encode($doc), 'PUT');
    }

    function replaceDoc($id, $doc) {
        $original_doc = $this->getDoc($id);
        if($original_doc === array() ) {
            $this->putDoc($id, $doc);
            return "new";
        }
        $m_original = $original_doc;
        unset($m_original['_id']);
        unset($m_original['_rev']);
        unset($m_original['_attachments']);
        if($m_original === $doc) {
            return 'unchanged contents';
        }

        $doc['_rev'] = $original_doc['_rev'];
        if(isset($original_doc['_attachments'])) {
            // Preserve the attachments if there are any.
            $doc['_attachments'] = $original_doc['_attachments'];
        }
        $this->putDoc($id, $doc);
        return 'modified';
    }

    function QueryView($designdoc, $viewname, $params) {
        $query = $this->_getRelativeURL("_design/" . $designdoc . "/_view/" . $viewname . "?" . http_build_query($params));
        $data = json_decode($query, true);
        if($data['error'] == 'not_found') {
            return array();
        }
        return $data['rows'];
    }
}
?>

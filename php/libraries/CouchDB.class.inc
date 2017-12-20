<?php
/**
 * This file contains a database wrapper around the CouchDB API for Loris.
 *
 * PHP Version 5
 *
 *  @category Main
 *  @package  Main
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Wrapper around PHP IO functions (fopen/close/get/etc)
 * so that a mock can be used for testing HTTP requests
 *
 *  @category Testing
 *  @package  Test
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
class SocketWrapper
{
    /**
     * Constructor for SocketWrapper
     */
    function __construct()
    {
    }

    /**
     * Destructor for SocketWrapper
     */
    function __destruct()
    {
    }

    /**
     * Set the host that the SocketWrapper is connecting to
     *
     * @param string $host The hostname
     *
     * @return none
     */
    function setHost($host)
    {
        $this->host = $host;
    }

    /**
     * The port on the host that this SocketWrapper is connecting
     * to
     *
     * @param integer $port The port number
     *
     * @return none
     */
    function setPort($port)
    {
        $this->port = $port;
    }

    /**
     * Opens the socket and stores a reference to the socket handler for other
     * I/O functions. setHost and setPort must be called before this.
     *
     * @return none
     */
    function open()
    {
        $this->socket = fsockopen($this->host, $this->port);
        if ($this->socket === false) {
            throw new \LorisException(
                "Could not connect to CouchDB server at $this->host:$this->port"
            );
        }
    }

    /**
     * Closes the previously opened socket.
     *
     * @return none
     */
    function close()
    {
        $status = fclose($this->socket);
        if ($status === false) {
            throw new \LorisException("Could not close CouchDB network socket");
        };
    }

    /**
     * Check if EOF has been reached on the previously opened socket
     *
     * @return boolean Directly pass return value of feof()
     */
    function eof()
    {
        if ($this->socket) {
            return feof($this->socket);
        }
    }

    /**
     * Pass through to fgets on previously opened socket.
     *
     * @return mixed Directly passes return value of fgets
     */
    function gets()
    {
        if ($this->socket) {
            $status = fgets($this->socket);
            if ($status === false) {
                if ($this->eof()) {
                    return $status;
                }
                throw new \LorisException(
                    "Could not read from CouchDB server at $this->host:$this->port"
                );
            }
            return $status;
        }
    }

    /**
     * Write to the previously opened socket.
     *
     * @param string $str The string to write to the socket
     *
     * @return none
     */
    function write($str)
    {
        $status = fwrite($this->socket, $str);
        if ($status === false) {
            throw new \LorisException("Could not write to CouchDB server");
        }
    }
}

/**
 * Implementation of a wrapper around CouchDB's APIs, so that Loris can access
 * a CouchDB database programmatically.
 *
 *  @category Main
 *  @package  Main
 *  @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris-Trunk/
 */
class CouchDB
{

    /**
     * This array keep a reference for each instance of this class.
     */
    private static $_instances = array();

    /**
     * Keep the database name
     */
    private $_database = '';

    /**
     * Boolean true if we are currently doing a bulk transaction.
     */
    var $bulk = false;

    /**
     * Array of documents to be commited when the current bulk transaction
     * ends.
     */
    var $bulkDocuments = array();

    /**
     * Private Constructor for CouchDB
     *
     * @param string $database The couchDB database name
     */
    private function __construct($database = '')
    {
        $this->_database = $database;
    }

    /**
     * Returns one and only one CouchDB database wrapper object for a given
     * database name.
     *
     * NOTE: You shouldn't call this directly, instead you should
     *       probably use the NDB_Factory->couchDB() factory method
     *       which calls this.
     *
     * @param string $database The couchDB database name
     *
     * @return CouchDB A Loris CouchDB wrapper object
     */
    static function &getInstance($database = null)
    {
        if (empty(self::$_instances[$database])) {

            if (empty($database)) {
                // Default to DQT
                $config   = \NDB_Config::singleton();
                $database = $config->getSetting("CouchDB")['database'];
            }

            $db = new CouchDB($database);
            $db->SocketHandler = new SocketWrapper();

            self::$_instances[$database] = $db;
        }
        return self::$_instances[$database];
    }

    /**
     * Helper function to construct an HTTP request relative to the CouchDB database
     *
     * @param string $op  The HTTP verb to use
     * @param string $doc The URL that we want relative to the Database
     *
     * @return string The complete low level HTTP request to pass to CouchDB
     */
    function _constructURL($op, $doc)
    {
        return "$op /$this->_database/$doc";
    }

    /**
     * Low level function to send a GET request to CouchDB, relative
     * to the server (not relative to the database.)
     *
     * @param string $url     The URL to GET relative to CouchDB server (not DB)
     * @param string $op      The HTTP verb to use for the request.
     * @param array  $headers An array of extra HTTP headers to send
     *
     * @return string A string representation of the JSON returned by CouchDB
     */
    function _getURL($url, $op = 'GET', $headers = array())
    {
        $config      = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');

        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);

        $handler->open();
        $handler->write("$op $url HTTP/1.0\r\n");
        foreach ($headers as $key => $value) {
            $handler->write($key . ':' . $value . "\r\n");
        }
        $handler->write("\r\n");

        $response = '';
        while (!$handler->eof()) {
            $response .= $handler->gets();
        }
        $handler->close();
        $response_split = explode("\r\n\r\n", $response, 2);
        return trim($response_split[1]);
    }


    /**
     * Low level function to get a document from CouchDB, relative to the
     * CouchDB database.
     *
     * @param string $url The URL to GET from the server relative to the DB
     * @param string $op  The HTTP verb to use for the request
     *
     * @return string A string representation of the JSON returned by CouchDB
     */
    function _getRelativeURL($url, $op = 'GET')
    {
        $config      = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');

        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);

        $handler->open();
        $handler->write($this->_constructURL($op, $url) . " HTTP/1.0\r\n");
        $handler->write(
            "Authorization: Basic "
            . base64_encode(
                $couchconfig['admin'] . ":" . $couchconfig['adminpass']
            )
            . "\r\n"
        );

        $handler->write("\r\n");

        $response        = '';
        $finishedHeaders = false;
        $lastLine        = '';
        $curLine         = '';
        while (!$handler->eof()) {
            $curLine = $handler->gets();

            if ($finishedHeaders === false) {
                if ($curLine == "\r\n") {
                    $finishedHeaders = true;
                }
            } else { // headers are finished
                $response .= $curLine;
            }

            $lastLine = $curLine;
        }
        $handler->close();

        return $response;
    }

    /**
     * Internal function to make a low level HTTP POST request to the CouchDB
     * server, not relative to the CouchDB server (not database). This is useful
     * for posting to other CouchDB databases on the same server (ie. the users
     * database.)
     *
     * @param string  $url        The URL relative to the server to make a POST
     *                            request to.
     * @param array   $data       Associative array representing the JSON document
     *                            to POST.
     * @param array   $headers    The extra HTTP headers to send with the request
     * @param boolean $printValue If true the return from CouchDB will be printed
     *                            instead of returned. This avoids the overhead of
     *                            having to parse it server-side if the request is
     *                            expected to be directly interpreted by javascript.
     *
     * @return string A string representation of the JSON return value from CouchDB
     */
    function _postURL($url, $data, $headers = array(), $printValue = false)
    {
        $config      = NDB_Config::singleton();
        $couchconfig = $config->getSetting('CouchDB');

        $handler = $this->SocketHandler;
        $handler->setHost($couchconfig['hostname']);
        $handler->setPort($couchconfig['port']);

        $handler->open();
        $handler->write($url . " HTTP/1.0\r\n");
        $handler->write("Content-Length: " . strlen($data) . "\r\n");
        $handler->write("Content-type: application/json\r\n");

        $handler->write(
            "Authorization: Basic "
            . base64_encode(
                $couchconfig['admin']
                . ":"
                . $couchconfig['adminpass']
            )
            . "\r\n"
        );

        foreach ($headers as $key => $value) {
            $handler->write($key . ':' . $value . "\r\n");
        }
        $handler->write("\r\n");
        $handler->write($data);
        $response        = '';
        $finishedHeaders = false;
        while (!$handler->eof()) {
            $line = $handler->gets();
            if ($finishedHeaders === false) {
                if ($line == "\r\n") {
                    $finishedHeaders = true;
                }
            } else {
                if ($printValue) {
                    print $line;
                } else {
                    $response .= $line;
                }
            }
        }
        $handler->close();
        if ($printValue) {
            return null;
        }
        return $response;
    }

    /**
     * Posts a URL relative to the CouchDB database URL.
     *
     * @param string  $url        The name of the document to be posted
     * @param string  $data       The content to be written to the URL
     *                            as the HTTP payload.
     * @param string  $op         The HTTP operation to use. Default POST.
     * @param boolean $printValue If true the return from CouchDB will be printed
     *                            instead of returned. This avoids the overhead of
     *                            having to parse it server-side if the request is
     *                            expected to be directly interpreted by javascript.
     *
     * @return The page content (Without headers) returned by the
     *         CouchDB web server.
     */
    function _postRelativeURL($url, $data, $op = 'POST', $printValue = false)
    {
        return $this->_postURL(
            $this->_constructURL($op, $url),
            $data,
            array(),
            $printValue
        );
    }

    /**
     * Returns a document from CouchDB database
     *
     * @param string $id      The document to retrieve
     * @param array  $options HTTP options to add to the request
     *
     * @return array An associative array representing the document
     */
    function getDoc($id, $options = array())
    {
        $json = $this->_getRelativeURL($id);

        if (!empty($options)) {
            if (strpos($id, "?") === false) {
                $url = $id . "?" . http_build_query($options);
            } else {
                $url = $id . "&" . http_build_query($options);
            }
        } else {
            $url = $id;
        }
        $json = $this->_getRelativeURL($url);
        $data = json_decode($json, true);

        if (isset($data['error']) && $data['error'] === 'not_found') {
            return array();
        }

        return $data;
    }

    /**
     * Delete a named document from CouchDB database
     *
     * @param string $id The document name to delete
     *
     * @return boolean True if delete was successful
     */
    function deleteDoc($id)
    {
        $getjson = $this->_getRelativeURL($id);
        $getdata = json_decode($getjson, true);

        $json = $this->_getRelativeURL($id . "?rev=" . $getdata['_rev'], "DELETE");
        $data = json_decode($json, true);

        if (!isset($data['ok'])) {
            return false;
        }
        return ($data['ok'] === true);

    }

    /**
     * Makes a raw PUT request for the named document, without any error
     * handling around CouchDB formatting or checking.
     *
     * If currently in a bulk transaction, this adds it to the bulk request
     * that will be sent on commit.
     *
     * @param string $id  The document name to PUT
     * @param array  $doc An array representing the JSON document
     *
     * @return string The JSON string returned by the CouchDB server, or
     *                null if in bulk mode.
     */
    function putDoc($id, $doc)
    {
        $encoded = json_encode($doc);

        if ($this->bulk) {
            $doc['_id'] = $id;
            array_push($this->bulkDocuments, $doc);
            return null;
        }

        $json = $this->_postRelativeURL($id, $encoded, 'PUT');

        return $json;
    }

    /**
     * Makes a raw POST request to CouchDB server. This will create the
     * document with a CouchDB generated id.
     *
     * @param array $doc A PHP array encoding the JSON document to be created
     *
     * @return string the JSON string returned by the CouchDB server
     */
    function postDoc($doc)
    {
        $json = $this->_postRelativeURL("", json_encode($doc), 'POST');
        return $json;
    }

    /**
     * Creates a new document in the CouchDB database with a server
     * generated id.
     *
     * NOTE: If you know the id of the document you want to create,
     *       use replaceDoc instead.
     *
     * @param array $doc An associative array representing the document
     *                   to create.
     *
     * @return string|FALSE id of created document or FALSE if creation failed.
     */
    function createDoc($doc)
    {
        $json = $this->postDoc($doc);
        $data = json_decode($json, true);
        if (!isset($data['ok'])) {
            return false;
        }

        if (isset($data['error'])) {
            return false;
        }
        return $data["id"];

    }

    /**
     * Replace a named CouchDB doc with the passed one, or create it
     * if it doesn't exist.
     *
     * @param string $id  CouchDB doc name to replace
     * @param array  $doc Associative array containing the document to be
     *                    created/updated.
     *
     * @return string The status of how the document was modified.
     */
    function replaceDoc($id, $doc)
    {
        $original_doc = $this->getDoc($id);
        if ($original_doc === array() ) {
            $this->putDoc($id, $doc);
            return "new";
        }
        $m_original = $original_doc;
        unset($m_original['_id']);
        unset($m_original['_rev']);
        unset($m_original['_attachments']);
        if ($m_original === $doc) {
            return 'unchanged contents';
        }

        $doc['_rev'] = $original_doc['_rev'];
        if (isset($original_doc['_attachments'])) {
            // Preserve the attachments if there are any.
            $doc['_attachments'] = $original_doc['_attachments'];
        }
        $this->putDoc($id, $doc);
        return 'modified';
    }

    /**
     * Function to query a CouchDB view and return an array of
     * the results parsed into a PHP array.
     *
     * @param string  $designdoc Design Doc containing the view
     * @param string  $viewname  View to be queried
     * @param array   $params    Any additional parameters to be passed to the
     *                           CouchDB view
     * @param boolean $full_json If true will include the full json returned,
     *                           and not just the parsed rows.
     *
     * @return array An array of the rows returned by the view
     */
    function queryView($designdoc, $viewname, $params, $full_json=false)
    {
        $keys = null;
        if (isset($params['keys'])) {

            $keys = $params['keys'];
            unset($params['keys']);

            $url = "_design/" . $designdoc . "/_view/" . $viewname
                . "?" . http_build_query($params);

            $query = $this->_postRelativeURL(
                $url,
                json_encode(array('keys' => $keys)),
                'POST',
                $full_json
            );

        } else {
            $url   = "_design/" . $designdoc . "/_view/" . $viewname
                     . "?" . http_build_query($params);
            $query = $this->_getRelativeUrl($url);
        }

        if ($full_json) {
            return $query;
        }
        $data = json_decode($query, true);

        if (isset($data['error']) && $data['error'] == 'not_found') {
            return array();
        }
        return $data['rows'];
    }

    /**
     * Signals that a large transaction is about to happen, and that the
     * CouchDB wrapper should send a single bulk request for all the
     * upcoming updates, instead of one request per update.
     *
     * This does not affect get requests, and functions like replaceDoc
     * will still need to send multiple get requests to CouchDB to get the
     * current revision, but the PUT requests will be queued until commited
     * with commitBulkTransaction();
     *
     * @return none
     */
    function beginBulkTransaction()
    {
        $this->bulk = true;
    }

    /**
     * Sends a POST request to update all the documents that have been queued
     * since the BulkTransaction was started.
     *
     * @return string The string that was returned by CouchDB
     */
    function commitBulkTransaction()
    {
        if ($this->bulk !== true) {
            return false;
        }
        $docs = json_encode(array('docs' => $this->bulkDocuments));

        $this->bulk          = false;
        $this->bulkDocuments = array();

        return $this->_postRelativeURL('_bulk_docs', $docs);
    }
}
?>

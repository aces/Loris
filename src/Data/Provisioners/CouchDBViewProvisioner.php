<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\Data\Provisioners;

use \LORIS\Data\ProvisionerInstance;
use \LORIS\Data\DataInstance;
use \LORIS\Data\CouchDBViewQuery;
use \LORIS\Data\CouchDBResultRow;
use \LORIS\LorisInstance as Loris;

/**
 * A CouchDBViewProvisioner is an instance of ProvisionerInstance which
 * queries a couchdb view and returns the result as a Traversable.
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Xavier Lecours <xavier.lecours@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
abstract class CouchDBViewProvisioner extends ProvisionerInstance
{
    private $_couchdb;
    private $_authorizationheader;
    private $_urlpath;
    private $_params;

    /**
     * Constructor
     */
    public function __construct(Loris $loris, CouchDBViewQuery $query)
    {
        $setting = $loris->getConfiguration()
            ->getSetting("CouchDB");

        $this->_couchdb = $loris->getCouchDBConnection();
        $this->_couchdb
            ->SocketHandler
            ->setHost($setting['hostname']);
        $this->_couchdb
            ->SocketHandler
            ->setPort(intval($setting['port']));

        $this->_authorizationheader = "Authorization: Basic "
            . base64_encode(
                $setting['admin'] . ":" . $setting['adminpass']
            )
            . "\r\n";

        $designdoc      = $query->getDesigndoc();
        $view           = $query->getView();
        $this->_urlpath = "_design/$designdoc/_view/$view/";

        $this->_params = $query->getParams();
    }

    /**
     * Convert a single row from the query to a DataInstance suitable for use
     * by filters and mappers.
     *
     * This must be implemented by users of this class in order to convert
     * the database row to a suitable DataInstance model.
     *
     * @param array $row The database row
     *
     * @return DataInstance The row converted to a DataInstance
     */
    abstract public function getInstance($row) : DataInstance;

    private function _filter(): bool
    {
        return true;
    }

    /**
     * Returns all the items in the rows property of the results.
     *
     * @return \Traversable
     */
    public function getAllInstances() : \Traversable
    {
        $handler = $this->sendQuery($this->_params);
        while(!$handler->eof()) {
            $line = $handler->gets() ?: '';

            // HTTP error handling
            if (preg_match('/^HTTP\/1.0 [45]/', $line, $matches)) {
                while(!$handler->eof()) {
                    error_log($line);
                    $line = $handler->gets();
                }
                error_log(print_r(get_object_vars($this), true));
                throw new \Error('The provisioner can\'t get the view results.');
            }

            if (preg_match('/^(\{.*}),*/', $line, $matches)) {
                $row = new CouchDBResultRow($matches[1]);
                // This is a data line
                if ($this->_filter($row)) {
                    yield $this->getInstance($row);
                }
            }
        }
    }

    public function withParams(array $params): CouchDBViewProvisioner
    {
        $new          = clone($this);
        $new->_params = array_merge($params, $this->_params);
        return $new;
    }

    /**
     * Send the http request and return the SocketWrapper from which
     * the response can be read.
     *
     * When keys are provided in the params, a POST request will
     * be sent instead of a GET. This allow to send more data because the
     * keys will be sent in the request body.
     *
     * see: https://docs.couchdb.org/en/stable/api/ddoc/views.html
     *
     * @return \SocketWrapper
     */
    protected function sendQuery(): \SocketWrapper
    {
        $method  = 'GET';
        $payload = '';
        $params  = $this->_params;
        $handler = $this->_couchdb->SocketHandler;

        $handler->open();

        if (isset($params['keys'])) {
            $payload = json_encode(
                ["keys" => $params['keys']]
            );
            $method  = 'POST';

            $params['keys'] = null;
        }

        $url = $this->_urlpath  . "?" . http_build_query($params);

        $handler->write(
            $this->_couchdb->_constructURL($method, $url) . " HTTP/1.0\r\n"
        );
        $handler->write($this->_authorizationheader);

        $handler->write("Content-Length: " . strlen($payload) . "\r\n");
        $handler->write("Content-type: application/json\r\n");
        $handler->write("\r\n$payload");

        return $handler;
    }
}

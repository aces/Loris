<?php declare(strict_types=1);
/**
 * Handles queries for CouchDB.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The View class for GET & POST requests.
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class View extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);
            case 'POST':
                return $this->_handlePOST($request);
            default:
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
        }
    }

    /**
     * Search data for the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Retrieve 'type' of request.
        $type = substr(
            $values['lorispath'],
            strpos($values['lorispath'], '/View/') + strlen('/View/')
        );

        // Process the 'type' of request.
        switch ($type) {
            case 'datadictionary':
                return $this->_datadictionary($request);
            default:
                return new \LORIS\Http\Response\JsonResponse(
                    $values
                );
        }
    }

    /**
     * Access the datadictionary of the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _datadictionary(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Access CouchDB credentials
        $client = new \NDB_Client();
        $client->makeCommandLine();
        $client->initialize(__DIR__ . '/../../../project/config.xml');

        // Start Connecting to CouchDB
        $config      = \NDB_Config::singleton();
        $couchConfig = $config->getSetting('CouchDB');
        $cdb         = \NDB_Factory::singleton()->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );

        // Retrieve the Query params for CouchDB
        $category = $values['category'] ?? null;
        $key      = $values['key'] ?? null;
        $results  = array();

        // Process Query depending on category or key.
        if ($category) {
            $category = urlencode($_REQUEST['category']);

            $results = $cdb->queryView(
                'DQG-2.0',
                'datadictionary',
                array(
                    'reduce'   => "false",
                    'startkey' => "[\"$category\"]",
                    'endkey'   => "[\"$category\", \"ZZZZZZZZ\"]",
                )
            );
        } else if ($key) {
            $key     = explode('%2C', urlencode($key));
            $results = $cdb->queryView(
                'DQG-2.0',
                'datadictionary',
                array(
                    'reduce' => 'false',
                    'key'    => "[\"$key[0]\",\"$key[1]\"]",
                )
            );
        }

        // Return Query results to the user.
        return new \LORIS\Http\Response\JsonResponse(
            $results
        );
    }

    /**
     * Save data for the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);

        return new \LORIS\Http\Response\JsonResponse(
            json_encode($values)
        );
    }

    /**
     * Returns true if the user has permission to access
     * the DQT module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('dataquery_view'));
    }

}

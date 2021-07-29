<?php declare(strict_types=1);
/**
 * The Sessions 'endpoint' class for the DQT Module.
 *
 * PHP Version 7.4
 *
 * @category   API
 * @package    Loris
 * @subpackage DQT
 * @author     Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Loris/
 */
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * A class for handling the /dqt/sessions/ endpoint.
 * The initial DQT setup process calls this API in
 * the background for the stream "reader" to retrieve
 * the needed sessions from couchDB.
 *
 * PHP Version 7.4
 *
 * @category   API
 * @package    LORIS
 * @subpackage DQT
 * @author     Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.text GPLv3
 * @link       http://www.github.com/aces/Lors/
 */
class Sessions extends \NDB_Form implements RequestHandlerInterface
{
    public $skipTemplate = true;

    /**
     * Returns true if user has access to this Endpoint.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'GET',
        ];
    }

    /**
     * Process the ServerRequestInterface
     *
     * @param ServerRequestInterface  $request The PSR7 request.
     * @param RequestHandlerInterface $handler The request handler.
     *
     * @return ResponseInterface The outgoing PSR7 response.
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        return $handler->handle($request);
    }

    /**
     * Handles Endpoint request for the initial DQT setup that needs
     * the ProgressBar's stream "reader" to get the needed setup data
     * from couchDB.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        ini_set('memory_limit', '-1');
        $user = $request->getAttribute('user');

        $data = []; // we will send as stream to client on completion.

        $username         = $user->getUsername();
        $config           = \NDB_Config::singleton();
        $couchConfig      = $config->getSetting('CouchDB');
        $couchConfigValid = isset(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            $couchConfig['port'],
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
        if (!$couchConfigValid) {
            error_log(
                'Data Query Tool cannot be loaded due to missing ' .
                'configuration settings. Ensure that `dbName`, `hostname`, ' .
                '`port`, `admin` and `adminpass` values are properly ' .
                'configured in project/config.xml'
            );
            throw new \ConfigurationException(
                'Missing CouchDB configuration settings. Cannot load ' .
                'Data Query Tool.'
            );
        }
        $couch            = \NDB_Factory::singleton()->couchDB(
            $couchConfig['dbName'],
            $couchConfig['hostname'],
            intval($couchConfig['port']),
            $couchConfig['admin'],
            $couchConfig['adminpass']
        );
        $sessionResults   = $couch->queryView(
            "DQG-2.0",
            "sessions",
            [
                "reduce" => "true",
                "group"  => "true",
            ]
        );
        $sessions         = array_map(
            function ($element) {
                return $element['key'];
            },
            $sessionResults
        );
        $data['sessions'] = $sessions;
        // Note: StringStream since BinaryStream isn't in 23.0-release.
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "text/plain")
            ->withStatus(200)
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($data)
                )
            );
    }
}

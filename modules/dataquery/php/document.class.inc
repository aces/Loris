<?php declare(strict_types=1);
/**
 * Handles retrieving and saving documents for CouchDB.
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
 * The Document class for the GET or POST requests.
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Document extends \NDB_Page
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
     * Initialize setup - Retrieve data for the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Start Connecting to CouchDB
        $cdb = \NDB_Factory::singleton()->couchDB();

        // Retrieve the Document from CouchDB
        $docID  = urlencode($values['DocID']);
        $values = $cdb->getDoc(
            $docID
        );

        return new \LORIS\Http\Response\JsonResponse(
            $values
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

        // Start Connecting to CouchDB
        $cdb = \NDB_Factory::singleton()->couchDB();

        $user = \User::singleton();
        $qid  = $user->getUserName() . '_' . $values['QueryName'];

        if ($values['SharedQuery'] === 'true') {
            $qid = 'global:' . $qid;
        }

        if ($values['OverwriteQuery'] === 'false') {
            $results = $cdb->getDoc(
                $qid
            );

            if (!empty($results)) {
                error_log($values['SharedQuery']);
                return new \LORIS\Http\Response\JSON\Conflict(
                    'SharedQuery Conflict'
                );
            }
        }

        $baseDocument = array(
            '_id'        => $qid,
            'Meta'       => array(
                'DocType' => 'SavedQuery',
                'user'    => $user->getUserName(),
            ),
            'Fields'     => array(),
            'Conditions' => array(),
        );
        if (isset($values['QueryName'])) {
            $baseDocument['Meta']['name'] = $values['QueryName'];
        }
        if ($values['SharedQuery'] === 'true') {
            $baseDocument['Meta']['user'] = 'global';
            $baseDocument['Meta']['name'] = $user->getUserName() .
                ': ' .
                $values['QueryName'];
        }
        $fields = $values['Fields'];
        $cond   = $values['Filters'];
        $baseDocument['Conditions'] = $cond;
        $baseDocument['Fields']     = $fields;

        if ($values['OverwriteQuery'] === 'true') {
            unset($baseDocument['_id']);
            $cdb->replaceDoc($qid, $baseDocument);
            $values['id'] = $qid;
        } else {
            return new \LORIS\Http\Response\JsonResponse(
                $cdb->postDoc($baseDocument)
            );
        }
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
        return (
            $user->hasPermission('dataquery_view')
        );
    }
}

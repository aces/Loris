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
 * The View class for requests.
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
        // Ensure allowed request.
        switch ($request->getMethod()) {
        case 'PUT':
            return $this->_handlePUT($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['PUT']
            );
        }
    }

    /**
     * CSV Import data from user using the DataQueryTool.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse PUT request body.
        $values = json_decode((string) $request->getBody(), true);

        // Start Connecting to CouchDB.
        $cdb = \NDB_Factory::singleton()->couchDB();

        // Retrieve the Query params for CouchDB.
        $children = $values['children'];
        $category = 'demographics';
        $results  = [];

        if (isset($category) && $category) {
            $category = urlencode($category);
            $results  = $cdb->queryView(
                "DQG-2.0",
                "datadictionary",
                [
                    "reduce"   => "false",
                    "startkey" => "[\"$category\"]",
                    "endkey"   => "[\"$category\", \"ZZZZZZZZ\"]",
                ]
            );
        }

        // Populate the fields for each child to satisfy the DQT.
        for ($i=0; $i<count($children); $i++) {
            $child           = $children[$i];
            $child['fields'] = $results;

            // query for equal.
            $category  = $child['instrument'];
            $fieldName = $child['field'];
            $value     = $child['value'];
            if (!is_numeric($value) && $value !== "null") {
                $value = "\"$value\"";
            }
            $results        = $cdb->queryView(
                "DQG-2.0",
                "search",
                [
                    "reduce" => "false",
                    "key"    => "[\"$category\", \"$fieldName\", $value]",
                ]
            );
            $sessionResults = array_map(
                function ($element) {
                    return $element['value'];
                },
                $results
            );

            // Populates rule.candidates and rule.session
            $visits   = [];
            $sessions = [];
            for ($k=0; $k<count($sessionResults); $k++) {
                $session = $sessionResults[$k];
                array_push($visits, $session[1]);
                $session_keys          = [$session[0], $session[0]];
                $sessions[$session[1]] = $session_keys;
            }
            $candidates = [$sessionResults[0][0] => $visits];

            $candidatesResult['allCandidates'] = $candidates;
            $candidatesResult['allSessions']   = $sessions;

            $child['candidates'] = $candidatesResult;

            // Collect all sessions.
            if ($child['visit'] === 'All') {
                $child['session'] = array_keys($candidates);
            }

            $children[$i] = $child;
        }

        // We now have allCandidates and allSessions populated per child.
        $values['children']       = $children;
        $values['activeOperator'] = '1';

        // Need all Visit_Windows

        // Return Query results to the user.
        return new \LORIS\Http\Response\JsonResponse(
            $values
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

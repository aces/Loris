<?php declare(strict_types=1);

namespace LORIS\dataquery\endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Data\Filters\AccessibleResourceFilter;

/**
 * Handles requests to queries under the /queries/* endpoint of
 * the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Queries extends \LORIS\Http\Endpoint
{
    public $skipTemplate = true;

    /**
     * If the user has access to the module they can access this endpoint,
     * specific queries permissions are checked (and filtered out) individually.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    #[\Override]
    function isAccessibleBy(\User $user) : bool
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $user = $request->getAttribute('user');
        switch ($request->getMethod()) {
        case 'GET':
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'queries' => iterator_to_array(
                        $this->getUserAccessibleQueries($user),
                        false, // do not preserve keys, stay an array
                    ),
                ]
            );
        case 'POST':
            $requestjson = (string) $request->getBody();
            $requestdata = json_decode($requestjson, true);
            if ($requestdata === false) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid JSON data'
                );
            }
            if ($this->_validateQuery($requestdata, $user) === false) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'Invalid query'
                );
            }
            $queryID = $this->_storeQuery($requestjson);
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'QueryID' => $queryID
                ]
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET', 'POST']);
        }
    }

    /**
     * Validates that a query submitted is valid before storing it.
     * Returns true if the query is valid, false otherwise.
     *
     * @param array $json The parsed JSON of the query
     * @param \User $user The user trying to create the query
     *
     * @return bool
     */
    private function _validateQuery(array $json, \User $user) : bool
    {
        if (($json['type'] ?? 'invalid') !== "candidates") {
            return false;
        }
        if (!isset($json['fields'])
            || !is_array($json['fields'])
            || !array_is_list($json['fields'])
        ) {
            return false;
        }

        // Validate all the fields used in the fields and filters
        // are accessible by the current user.
        $theQuery = new \LORIS\dataquery\Query(
            loris: $this->loris,
            queryID: -1,
            query: $json,
        );
        return $theQuery->isAccessibleBy($user);
    }

    /**
     * Store a query that was run in the database and return the QueryID.
     * for it.
     *
     * @param string $requestjson The JSON of the query
     *
     * @return int
     */
    private function _storeQuery(string $requestjson)
    {
        $DB      = $this->loris->getDatabaseConnection();
        $queryID = $DB->pselectOne(
            "SELECT QueryID
                FROM dataquery_queries
             WHERE Query=:json",
            [
                'json' => $requestjson,
            ],
        );
        if ($queryID === null) {
            // Dealing with JSON need to use the unsafe wrapper
            $oldTrackChanges   = $DB->_trackChanges;
            $DB->_trackChanges = false;
            $DB->unsafeInsert(
                'dataquery_queries',
                [
                    'Query'  => $requestjson,
                ],
            );
            $DB->_trackChanges = $oldTrackChanges;
            $queryID           = $DB->getLastInsertId();
        }
        return intval($queryID);
    }

    /**
     * Get a list of recent query runs for this user
     *
     * @param \User $user The user getting the queries.
     *
     * @return \Traversable
     */
    public function getUserAccessibleQueries(\User $user) : iterable
    {
        return (new \LORIS\dataquery\provisioners\AllUserQueries(
            $this->loris,
            $user
        ))->filter(new AccessibleResourceFilter())
            ->execute($user);
    }
}

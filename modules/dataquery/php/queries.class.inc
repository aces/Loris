<?php
namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Data\Filters\AccessibleResourceFilter;

/**
 * Handles requests to queries under the /queries/* endpoint of
 * the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Queries extends \NDB_Page
{
    public $skipTemplate = true;
    /**
     * Allow all users for testing
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
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
        $user    = $request->getAttribute('user');
        $url     = $request->getURI()->getPath();
        $pieces  = [];
        $queryID = null;
        if (preg_match(
            "/queries$/",
            $url,
            $pieces
        ) === 1
        ) {
            switch ($request->getMethod()) {
            case 'GET':
                return new \LORIS\Http\Response\JSON\OK(
                    [
                        'recent'     => iterator_to_array(
                            $this->getRecentQueries($user),
                            false,
                        ),
                        'shared'     => iterator_to_array(
                            $this->getSharedQueries($user),
                            false,
                        ),
                        'topqueries' => iterator_to_array(
                            $this->getTopQueries($user),
                            false,
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
                $user = $request->getAttribute('user');
                // FIXME: Validate query before storing it. Must contain fields.
                $queryID = $this->_storeQuery($requestjson);
                return new \LORIS\Http\Response\JSON\OK(
                    [
                        'QueryID' => $queryID
                    ]
                );
            default:
            }
        }
        if (preg_match(
            "/queries\/([0-9]+)$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return $this->handleQueryRequest($request, $queryID);
        }
        if (preg_match(
            "/queries\/([0-9]+)\/run$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return $this->runQuery($user, $queryID);
        }
        if (preg_match(
            "/queries\/([0-9]+)\/count$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            return $this->countResults($user, $queryID);
        }
        if (preg_match(
            "/queries\/([0-9]+)\/run\/([0-9]+)$/",
            $url,
            $pieces
        ) === 1
        ) {
            $queryID = intval($pieces[1]);
            $runID   = intval($pieces[2]);
            return $this->queryRun($user, $queryID, $runID);
        }
        return new \LORIS\Http\Response\JSON\NotFound();
    }

    /**
     * Get a list of recent query runs for this user
     *
     * @param \User $user The user getting the queries.
     *
     * @return QueryRun[]
     */
    public function getRecentQueries(\User $user) : iterable
    {
        return (new provisioners\RecentQueries($this->loris, $user))
            //->filter(new AccessibleResourceFilter())
            ->execute($user);
    }

    /**
     * Get a list of shared queries for this user
     *
     * @param \User $user The user getting the queries.
     *
     * @return Query[]
     */
    public function getSharedQueries(\User $user) : iterable
    {
        return (new provisioners\SharedQueries($this->loris, $user))
            //->filter(new AccessibleResourceFilter())
            ->execute($user);
    }

    /**
     * Get a list of top queries for this user
     *
     * @param \User $user The user getting the queries.
     *
     * @return Query[]
     */
    public function getTopQueries(\User $user) : iterable
    {
        return (new provisioners\StudyQueries($this->loris, 'topquery'))
            //->filter(new AccessibleResourceFilter())
            ->execute($user);
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
            $DB->unsafeInsert(
                'dataquery_queries',
                [
                    'Query'  => $requestjson,
                ],
            );
            $queryID = $DB->getLastInsertId();
        }
        return intval($queryID);
    }

    /**
     * Handle a request for the /queries/{id} endpoint to get a single query.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     * @param int                    $queryID The query being handled
     *
     * @return ResponseInterface
     */
    public function handleQueryRequest($request, int $queryID) : ResponseInterface
    {
        $user = $request->getAttribute('user');

        $query = null;
        try {
            $query = new Query($this->loris, $queryID);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }
        if (!$query->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }
        switch ($request->getMethod()) {
        case 'GET':
            return new \LORIS\Http\Response\JSON\OK($query->toArray());
        case 'PATCH':
            $params = $request->getQueryParams();
            // Can only do 1 action at a time.
            if (isset($params['star']) && isset($params['share'])) {
                return new \LORIS\Http\Response\JSON\BadRequest();
            }

            if (isset($params['star'])) {
                if ($params['star'] == 'unstar') {
                    $query->unstar($user);
                    return new \LORIS\Http\Response\JSON\OK(
                        ['msg'=>'Unstarred query']
                    );
                } else if ($params['star'] == 'star') {
                    $query->star($user);
                    return new \LORIS\Http\Response\JSON\OK(
                        ['msg'=>'Starred query']
                    );
                } else {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Invalid star action'
                    );
                }
            }

            if (isset($params['share'])) {
                if ($params['share'] == 'share') {
                    $query->share($user);
                    return new \LORIS\Http\Response\JSON\OK(
                        ['msg'=>'Shared query']
                    );
                } else if ($params['share'] == 'unshare') {
                    $query->unshare($user);
                    return new \LORIS\Http\Response\JSON\OK(
                        ['msg'=>'Unshared query']
                    );
                } else {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Invalid share action'
                    );
                }
            }

            if (!empty($params['type'])) {
                if (str_contains($params['type'], 'untop')) {
                    $query->removeAdminPinnedQuery('topquery');
                } else if (str_contains($params['type'], 'top')) {
                    $query->setAdminPinnedQuery($user, $params['name'], 'topquery');
                }

                if (str_contains($params['type'], 'dashboard')) {
                    $query->setAdminPinnedQuery($user, $params['name'], 'dashboard');
                }
                    return new \LORIS\Http\Response\JSON\OK(
                        ['msg' => 'Pinned query']
                    );
            } else if (!empty($params['name'])) {
                $query->setQueryName($user, $params['name']);
                return new \LORIS\Http\Response\JSON\OK(['msg'=>'named query']);
            }

            return new \LORIS\Http\Response\JSON\BadRequest(
                'Unhandled PATCH action'
            );
        }
        return new \LORIS\Http\Response\JSON\BadMethod('Request must be GET');
    }

    /**
     * Runs a Query for a user and returns the results.
     *
     * @param \User $user    The user running the query
     * @param int   $queryID The ID of the query to run
     *
     * @return ResponseInterface
     */
    public function runQuery(\User $user, int $queryID) : ResponseInterface
    {
        try {
            $query = new Query($this->loris, $queryID);

            $queryRun = $query->newRun($user);
            $queryRun->insertCandidates($user);
            $data = $queryRun->getQueryDataProvisioner();

            $table  = (new \LORIS\Data\Table())
                ->withDataFrom($data);
            $rows   = $table->getRows($user);
            $stream = new \LORIS\Http\DataIteratorBinaryStream($rows);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                //->withHeader("Content-Type", "application/octet-stream")
                ->withBody($stream);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\NotImplemented($e->getMessage());

        }
    }

    /**
     * Return a count of the number of matches for the query with ID $queryID
     * if it is run by $user
     *
     * @param \User $user    The user whose number of matches should be checked
     * @param int   $queryID The ID of the query to count the matches for
     *
     * @return ResponseInterface
     */
    public function countResults(\User $user, int $queryID) : ResponseInterface
    {
        try {
            $query = new Query($this->loris, $queryID);

            $candidates = $query->matchCandidates($user);
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'count' => count($candidates),
                ]
            );
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\NotImplemented($e->getMessage());
        }
    }
}

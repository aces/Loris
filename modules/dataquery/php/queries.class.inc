<?php
namespace LORIS\dataquery;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
// use \LORIS\Data\Filters\AccessibleResourceFilter;

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
        $user   = $request->getAttribute('user');
        $url    = $request->getURI()->getPath();
        $pieces = [];
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
                        'recent'  => iterator_to_array(
                            $this->getRecentRuns($user),
                            false,
                        ),
                        'queries' => iterator_to_array(
                            $this->getUserAccessibleQueries($user),
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
            switch ($request->getMethod()) {
            case 'POST':
                $queryID = intval($pieces[1]);
                return $this->runQuery($user, $queryID);
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
            }
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
        /*
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
        */
        return new \LORIS\Http\Response\JSON\NotFound();
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
        return (new provisioners\AllUserQueries($this->loris, $user))
            // ->filter(new AccessibleResourceFilter())
            ->execute($user);
    }


    /**
     * Get a list of recent query runs for this user
     *
     * @param \User $user The user getting the queries.
     *
     * @return \Traversable
     */
    public function getRecentRuns(\User $user) : iterable
    {
        return (new provisioners\RecentQueries($this->loris, $user))
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
            $resp = [];
            if (isset($params['star'])) {
                if ($params['star'] == 'false') {
                    $query->unstar($user);
                    $resp['starred' => 'Unstarred query'];
                } else if ($params['star'] == 'true') {
                    $query->star($user);
                    $resp['starred' => 'Starred query'];
                } else {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Invalid star action'
                    );
                }
            }

            if (isset($params['share'])) {
                if ($params['share'] == 'true') {
                    $query->share($user);
                    $resp['Share'] = 'Marked query public';
                } else if ($params['share'] == 'false') {
                    $query->unshare($user);
                    $resp['Share'] = 'Unshared query';
                } else {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'Invalid share action'
                    );
                }
            }

            if (isset($params['adminname'])) {
                if ($params['adminname'] == '') {
                    $query->removeAdminPinnedQuery('topquery');
                    $resp['adminpin'] = 'Unpinned query from dataquery module';
                } else {
                    $query->setAdminPinnedQuery($user, $params['adminname'], 'topquery');
                    $resp['adminpin'] = 'Pinned query to dataquery module';
                }
            }

            if (isset($params['dashboardname'])) {
                if ($params['dashboardname'] == '') {
                    $query->removeAdminPinnedQuery('dashboard');
                    $resp['dashboard'] = 'Unpinned query from dashboard';
                } else {
                    $query->setAdminPinnedQuery($user, $params['dashboardname'], 'dashboard');
                    $resp['dashboard'] = 'Pinned query to dashboard';
                }
            }

            if (isset($params['name'])) {
                $query->setQueryName($user, $params['name']);
                $resp['Name'] = 'Named query';
            }
            return new \LORIS\Http\Response\JSON\OK($resp);
        }
        return new \LORIS\Http\Response\JSON\MethodNotAllowed(
            ['GET'],
            'Request must be GET'
        );
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

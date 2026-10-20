<?php declare(strict_types=1);

namespace LORIS\dataquery\endpoints\queries\query\run;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

use LORIS\StudyEntities\Candidate\CandID;

/**
 * Handles requests to queries under the /queries/{queryID}/run
 * endpoint of the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Run extends \LORIS\Http\Endpoint
{
    /**
     * {@constructor}
     *
     * @param protected \LORIS\LorisInstance $loris   The LorisInstance object
     * @param public readonly int            $queryID The query we are getting
     *                                                a count for.
     * @param public readonly int            $runID   The run of this query
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        public readonly int $queryID,
        public readonly int $runID
    ) {
        parent::__construct($loris);
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
        switch ($request->getMethod()) {
        case 'GET':
            $user   = $request->getAttribute("user");
            $params = $request->getQueryParams();

            $count = null;
            if (isset($params['count'])) {
                $count = filter_var(
                    $params['count'],
                    FILTER_VALIDATE_INT,
                    ['options' => ['min_range' => 1]]
                );
                if ($count === false) {
                    return new \LORIS\Http\Response\JSON\BadRequest(
                        'count must be a positive integer'
                    );
                }
            }
            $offset = filter_var(
                $params['offset'] ?? 0,
                FILTER_VALIDATE_INT,
                ['options' => ['min_range' => 0]]
            );
            if ($offset === false) {
                return new \LORIS\Http\Response\JSON\BadRequest(
                    'offset must be a non-negative integer'
                );
            }
            return $this->queryResults($user, $count, $offset);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
    }

    /**
     * Runs a Query for a user and returns the results.
     *
     * Rows are ordered by CandID and paged after the rows the user cannot
     * access are removed. The X-Total-Count header carries the number of
     * accessible rows in the run.
     *
     * @param \User $user   The user running the query
     * @param ?int  $count  The maximum number of rows to return, or null
     *                      for every row after the offset
     * @param int   $offset The number of accessible rows to skip
     *
     * @return ResponseInterface
     */
    public function queryResults(
        \User $user,
        ?int $count = null,
        int $offset = 0
    ) : ResponseInterface {
        $db      = $this->loris->getDatabaseConnection();
        $candIDs = $db->pselectCol(
            "SELECT c.CandID
                FROM dataquery_run_results drr
                JOIN candidate c on c.ID=drr.CandidateID
                WHERE drr.RunID=:rid
                ORDER BY c.CandID",
            [
                'rid' => $this->runID
            ]
        );

        $accessible = [];
        $filtered   = \Candidate::filterInaccessibleCandIDs(
            $this->loris,
            array_map(
                function ($candID) {
                    return new CandID(strval($candID));
                },
                $candIDs
            ),
            $user
        );
        foreach ($filtered as $candID) {
            $accessible[strval($candID)] = true;
        }
        $candIDs = array_values(
            array_filter(
                $candIDs,
                function ($candID) use ($accessible) {
                    return isset($accessible[$candID]);
                }
            )
        );

        if (count($candIDs) == 0) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "No results found. Query may have expired."
            );
        }

        $page    = array_slice($candIDs, $offset, $count);
        $results = [];
        if (count($page) > 0) {
            $results = $db->pselect(
                "SELECT c.CandID, drr.RowData
                    FROM dataquery_run_results drr
                    JOIN candidate c on c.ID=drr.CandidateID
                    WHERE drr.RunID=:rid
                        AND c.CandID BETWEEN :first AND :last
                    ORDER BY c.CandID",
                [
                    'rid'   => $this->runID,
                    'first' => $page[0],
                    'last'  => $page[count($page) - 1],
                ]
            );
        }
        $stream = new \LORIS\Http\DataIteratorBinaryStream(
            $this->_jsondecoded($results, $page)
        );

            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/octet-stream")
                ->withHeader("X-Total-Count", strval(count($candIDs)))
                ->withBody($stream);
    }

    /**
     * Convert json encoded database result back to an array
     *
     * @param iterable $results The results to decode
     * @param array    $CandIDs The CandIDs to limit the results to
     *
     * @return \Traversable
     */
    private function _jsondecoded(iterable $results, array $CandIDs)
    {
        $accessible = [];
        foreach ($CandIDs as $candID) {
            $accessible[strval($candID)] = true;
        }
        foreach ($results as $row ) {
            if (isset($accessible[strval($row['CandID'])])) {
                yield json_decode($row['RowData']);
            }
        }
    }
}

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
            $user = $request->getAttribute("user");
            return $this->queryResults($user);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
    }

    /**
     * Runs a Query for a user and returns the results.
     *
     * @param \User $user The user running the query
     *
     * @return ResponseInterface
     */
    public function queryResults(\User $user) : ResponseInterface
    {
        $db      = $this->loris->getDatabaseConnection();
        $candIDs = $db->pselectCol(
            "SELECT c.CandID
                FROM dataquery_run_results drr
                JOIN candidate c on c.ID=drr.CandidateID
                WHERE drr.RunID=:rid",
            [
                'rid' => $this->runID
            ]
        );
        $candIDs = \iterator_to_array(
            \Candidate::filterInaccessibleCandIDs(
                $this->loris,
                array_map(
                    function ($candID) {
                        return new CandID(strval($candID));
                    },
                    $candIDs
                ),
                $user
            )
        );

        if (count($candIDs) == 0) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "No results found. Query may have expired."
            );
        }
        $results = $db->pselect(
            "SELECT c.CandID, drr.RowData
                FROM dataquery_run_results drr
                JOIN candidate c on c.ID=drr.CandidateID
                WHERE drr.RunID=:rid",
            [
                'rid' => $this->runID
            ]
        );
        $stream  = new \LORIS\Http\DataIteratorBinaryStream(
            $this->_jsondecoded($results, $candIDs)
        );

            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/octet-stream")
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
        foreach ($results as $row ) {
            if (in_array(new CandID(strval($row['CandID'])), $CandIDs)) {
                yield json_decode($row['RowData']);
            }
        }
    }
}

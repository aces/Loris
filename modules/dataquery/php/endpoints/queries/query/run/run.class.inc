<?php declare(strict_types=1);

namespace LORIS\dataquery\endpoints\queries\query\run;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

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
            $db = $this->loris->getDatabaseConnection();
        // FIXME: Check permissions. Check if count(*) > 0.
        $results = $db->pselect(
            "SELECT RowData FROM dataquery_run_results WHERE RunID=:rid",
            [
                'rid' => $this->runID
            ]
        );
        if (count($results) == 0) {
            return new \LORIS\Http\Response\JSON\NotFound(
                "No results found. Query may have expired."
            );
        }
        $stream = new \LORIS\Http\DataIteratorBinaryStream(
            $this->_jsondecoded($results)
        );

            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                //->withHeader("Content-Type", "application/octet-stream")
                ->withBody($stream);
    }

    /**
     * Convert json encoded database result back to an array
     *
     * @param iterable $results The results to decode
     *
     * @return \Traversable
     */
    private function _jsondecoded(iterable $results)
    {
        foreach ($results as $row) {
            yield json_decode($row['RowData']);
        }
    }
}

<?php declare(strict_types=1);

namespace LORIS\dataquery\endpoints\queries\query;

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
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        public readonly int $queryID
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
            $proxy = (new \LORIS\dataquery\endpoints\queries\runs($this->loris));
            return $proxy->handle(
                $request->withAttribute("queryid", $this->queryID),
            );
        case 'POST':
            $user = $request->getAttribute("user");
            return $this->runQuery($user, $this->queryID);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }
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
            $query = new \LORIS\dataquery\Query($this->loris, $queryID);

            $db = $this->loris->getDatabaseConnection();
            // Put the query run in a transaction to make it atomic
            $db->beginTransaction();
            $queryRun = $query->newRun($user);
            $data     = $queryRun->getQueryDataProvisioner()->execute($user);

            $values = [];

            set_time_limit(300);
            $runid  = $queryRun->getRunId();
            $stream = new \LORIS\Http\DataIteratorBinaryStream(
                $data,
                function (
                    $candid,
                    $rowsArray,
                    /* @phan-suppress-next-line PhanUnusedClosureParameter */
                    $rowsBinary,
                    bool $end
                ) use (&$values, &$db, &$runid) {
                    $values[] = join(
                        ',',
                        [$runid, $candid, $db->quote(json_encode($rowsArray))]
                    );
                    if ((count($values) >= 2000 || $end) && count($values) > 0) {
                        $insertstmt = "INSERT INTO dataquery_run_results
            				    (RunID, CandID, RowData) VALUES "
                        . " (" . join('),(', $values) . ')';
                        $q          = $db->prepare($insertstmt);
                        $q->execute([]);
                        $values = [];
                    }

                    if ($end) {
                             $db->commit();
                    }
                }
            );

            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                //->withHeader("Content-Type", "application/octet-stream")
                ->withBody($stream);
        } catch (\LorisException $e) {
            return new \LORIS\Http\Response\JSON\NotImplemented($e->getMessage());

        }
    }
}

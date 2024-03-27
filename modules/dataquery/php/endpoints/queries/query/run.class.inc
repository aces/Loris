<?php
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
     * @param \User $user The user whose number of matches should be checked
     *
     * @return ResponseInterface
     */
    public function countResults(\User $user) : ResponseInterface
    {
        try {
            $query = new \LORIS\dataquery\Query($this->loris, $this->queryID);

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

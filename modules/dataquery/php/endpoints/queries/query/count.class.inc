<?php
namespace LORIS\dataquery\endpoints\queries\query;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /queries/{queryid}/count
 * endpoint of the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Count extends \LORIS\Http\Endpoint
{
    /**
     * Construct a Count endpoint handler
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
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            $user = $request->getAttribute("user");
            return $this->countResults($user, $this->queryID);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
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
            $query = new \LORIS\dataquery\Query($this->loris, $queryID);

            $candidates = \iterator_to_array($query->matchCandidates($user));
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

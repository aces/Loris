<?php declare(strict_types=1);

namespace LORIS\dataquery\endpoints\queries;

use \LORIS\dataquery\provisioners\RecentQueries;
use \LORIS\dataquery\provisioners\QueryRuns;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /queries/runs endpoint of
 * to get a list of this user's queryRuns. May also be
 * the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Runs extends \LORIS\Http\Endpoint
{
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
            $user    = $request->getAttribute("user");
            $queryid = $request->getAttribute("queryid");
            if (!empty($queryid)) {
                $results = $this->getQueryRuns($user, $queryid);
            } else {
                $results = $this->getRecentRuns($user);
            }
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'queryruns' => iterator_to_array(
                        $results,
                        false,
                    ),
                ]
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
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
        return (new RecentQueries($this->loris, $user))
                //->filter(new AccessibleResourceFilter())
                ->execute($user);
    }

    /**
     * Get a list of recent query runs for this user
     *
     * @param \User $user    The user getting the query runs
     * @param int   $queryid The query to get runs for
     *
     * @return \Traversable
     */
    public function getQueryRuns(\User $user, int $queryid) : iterable
    {
        return (new QueryRuns($this->loris, $user, $queryid))
                ->execute($user);
    }
}

<?php
namespace LORIS\dataquery\endpoints\queries;

use \LORIS\dataquery\provisioners\RecentQueries;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /queries/* endpoint of
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
            $user = $request->getAttribute("user");
            return new \LORIS\Http\Response\JSON\OK(
                [
                    'queryruns' => iterator_to_array(
                        $this->getRecentRuns($user),
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
}

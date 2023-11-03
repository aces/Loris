<?php
namespace LORIS\dataquery\endpoints\queries;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles requests to queries under the /queries/{queryid} endpoint of
 * the dataquery module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Query extends \LORIS\Http\Endpoint
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
        $queryID = $this->queryID;
        $user    = $request->getAttribute('user');
        try {
            $query = new \LORIS\dataquery\Query($this->loris, $queryID);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }
        if (!$query->isAccessibleBy($user)) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }
        switch ($request->getMethod()) {
        case 'GET':
            $query->loadQueryMetadata($user);
            return new \LORIS\Http\Response\JSON\OK($query->jsonSerialize());
        case 'PATCH':
            $params = $request->getQueryParams();
            // Can only do 1 action at a time.
            $resp = [];
            if (isset($params['star'])) {
                if ($params['star'] == 'false') {
                    $query->unstar($user);
                    $resp['starred'] = 'Unstarred query';
                } else if ($params['star'] == 'true') {
                    $query->star($user);
                    $resp['starred'] = 'Starred query';
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
                    $query->setAdminPinnedQuery(
                        $user,
                        $params['adminname'],
                        'topquery'
                    );
                    $resp['adminpin'] = 'Pinned query to dataquery module';
                }
            }

            if (isset($params['dashboardname'])) {
                if ($params['dashboardname'] == '') {
                    $query->removeAdminPinnedQuery('dashboard');
                    $resp['dashboard'] = 'Unpinned query from dashboard';
                } else {
                    $query->setAdminPinnedQuery(
                        $user,
                        $params['dashboardname'],
                        'dashboard'
                    );
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
            ['GET', 'PATCH'],
            'Request must be GET'
        );
    }
}

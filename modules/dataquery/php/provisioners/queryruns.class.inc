<?php declare(strict_types=1);

namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;
use \LORIS\dataquery\QueryRun;

/**
 * A QueryRuns provisioner gets a list of runs for a particular query
 * and user combination.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class QueryRuns extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a QueryRuns provisioner, which gets rows for
     * the query runs by a given user.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance the User ran
     *                                    queries on.
     * @param \User                $user  The user to get a recent list of
     *                                    queries for.
     * @param int                  $qid   The QueryID to get Query Runs for
     */
    function __construct(
        protected \LORIS\LorisInstance $loris,
        \User $user,
        int $qid
    ) {
        parent::__construct(
            "SELECT drq.RunID, dq.QueryID, RunTime, Query
            FROM dataquery_queries dq
                JOIN dataquery_run_queries drq ON (dq.QueryID=drq.QueryID)
                LEFT JOIN dataquery_starred_queries_rel dpq ON
                    (dq.QueryID=dpq.QueryID AND dpq.StarredBy=:userid)
                LEFT JOIN dataquery_shared_queries_rel dsq ON
                    (dq.QueryID=dsq.QueryID AND dsq.SharedBy=:userid)
                LEFT JOIN dataquery_query_names name ON 
                    (dq.QueryID=name.QueryID AND name.UserID=:userid)
            WHERE drq.UserID=:userid AND drq.QueryID=:qid
            ORDER BY drq.RunTime DESC",
            ['userid' => $user->getId(), 'qid' => $qid]
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
        $qr = new QueryRun(
            loris: $this->loris,
            query: new Query(
                loris: $this->loris,
                queryID: intval($row['QueryID']),
                query: json_decode($row['Query'], true),
            ),
            RunID: intval($row['RunID']),
            runTime: $row['RunTime'],
        );
        return $qr;
    }
}

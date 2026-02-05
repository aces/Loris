<?php declare(strict_types=1);

namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

/**
 * A RecentQueries provisioner gets a list of queries that were recently
 * run by a user
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class AllUserQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a RecentQueriees provisioner, which gets rows for
     * the recent query runs by a given user.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance the User ran
     *                                    queries on.
     * @param \User                $user  The user to get a recent list of
     *                                    queries for.
     */
    function __construct(protected \LORIS\LorisInstance $loris, \User $user)
    {
        parent::__construct(
            $loris,
            "SELECT DISTINCT dq.QueryID, dq.Query,
                name.Name,
                GROUP_CONCAT(dsq.Name) as AdminName,
                GROUP_CONCAT(u.UserID) as SharedBy,
                starred.StarredBy
            FROM dataquery_queries dq
                -- User named queries
                LEFT JOIN dataquery_query_names name ON 
                    (dq.QueryID=name.QueryID)
                -- Admin pinned top queries
                LEFT JOIN dataquery_study_queries_rel dsq ON
                    (dq.QueryID=dsq.QueryID AND PinType='topquery')
                -- Public queries
                LEFT JOIN dataquery_shared_queries_rel dshq ON
                    (dq.QueryID=dshq.QueryID)
                LEFT JOIN users u ON (dshq.SharedBy=u.ID)
                LEFT JOIN dataquery_starred_queries_rel starred ON
                    (starred.QueryID=dq.QueryID AND starred.StarredBy = :userid)
            WHERE dq.QueryID IN 
                (SELECT QueryID FROM dataquery_run_queries WHERE UserID=:userid
                      UNION
                     SELECT QueryID FROM dataquery_shared_queries_rel dsq
                      UNION
                     SELECT QueryID FROM dataquery_study_queries_rel
                        WHERE PinType='topquery'
                )
            GROUP BY dq.QueryID, name.Name, starred.StarredBy
            ",
            ['userid' => $user->getId()]
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
        return new Query(
            loris: $this->loris,
            queryID: intval($row['QueryID']),
            query: json_decode($row['Query'], true),
            name: $row['Name'] ?? '',
            adminname: $row['AdminName'] ?? '',
            sharedBy: $row['SharedBy'] != null
                ?  explode(',', $row['SharedBy'])
                : null,
            starred: $row['StarredBy'] !== null,
        );
    }
}

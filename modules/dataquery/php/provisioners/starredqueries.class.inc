<?php declare(strict_types=1);
namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

/**
 * A StarredQueries provisioner gets a list of queries which have been
 * starred by a user.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class StarredQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a StarredQueries provisioner, which gets rows for
     * the starred user queries for a given user.
     *
     * @param \LORIS\LorisInstance $loris The LORIS Instance
     * @param \User                $user  The user
     */
    function __construct(protected \LORIS\LorisInstance $loris, \User $user)
    {
        parent::__construct(
            "SELECT dpq.QueryID,
                    COALESCE(dqn.Name, CONCAT('Query ', dpq.QueryID)) as Name
            FROM dataquery_starred_queries_rel dpq
                JOIN dataquery_queries dq
                    ON (dq.QueryID=dpq.QueryID)
                LEFT JOIN dataquery_query_names dqn
                    ON (dpq.StarredBy=dqn.UserID AND dpq.QueryID=dqn.QueryID)
            WHERE dpq.StarredBy=:userid",
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
            queryID: $row['QueryID'] !== null
                ? intval($row['QueryID'])
                : null,
            name: $row['Name'],
        );
    }
}

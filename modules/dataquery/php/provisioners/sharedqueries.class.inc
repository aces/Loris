<?php declare(strict_types=1);
namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

/**
 * A LORIS Data Provisioner which retrieves a list of shared queries that
 * are accessible by a user.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class SharedQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a SharedQueries provisioner, which gets queries which are
     * shared with a given user.
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance with the user
     * @param \User                $user  The user retrieving the list of
     *                                    shared queries.
     */
    function __construct(protected \LORIS\LorisInstance $loris, \User $user)
    {
        parent::__construct(
            "SELECT dq.QueryID, Query, GROUP_CONCAT(u.UserID) as SharedBy, name.Name
            FROM dataquery_queries dq
                LEFT JOIN dataquery_shared_queries_rel dsq ON
                    (dq.QueryID=dsq.QueryID)
                LEFT JOIN users u ON (dsq.SharedBy=u.ID)
                LEFT JOIN dataquery_query_names name ON 
                    (dsq.QueryID=name.QueryID AND name.UserID=dsq.SharedBy)
            WHERE dsq.SharedBy != :userid
            GROUP BY QueryID
            ORDER BY QueryID",
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
            query: json_decode($row['Query'], true),
            name: $row['Name'] ?? '',
            sharedBy: explode(',', $row['SharedBy']),
        );
    }
}

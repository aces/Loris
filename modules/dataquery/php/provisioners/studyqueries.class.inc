<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get study queries
 * for a user.
 *
 * PHP Version 7
 *
 * @author Dave MacFarlane <david.macfarlane2@mcgill.ca>
 */

namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

class StudyQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a StudyQueries provisioner, which gets rows for
     * the pinned study queries.
     */
    function __construct(protected \LORIS\LorisInstance $loris, $pintype) {
        parent::__construct(
            "SELECT dq.QueryID, Query, dsq.Name
            FROM dataquery_queries dq
                LEFT JOIN dataquery_study_queries_rel dsq ON
                    (dq.QueryID=dsq.QueryID)
            WHERE dsq.PinType=:pintype
            GROUP BY QueryID
            ORDER BY QueryID",
            ['pintype' => $pintype],
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance {
        return new Query(
            loris: $this->loris,
            queryID: $row['QueryID'] !== null
                ? intval($row['QueryID'])
                : null,
            query: json_decode($row['Query'], true),
            name: $row['Name'],
        );
    }
}

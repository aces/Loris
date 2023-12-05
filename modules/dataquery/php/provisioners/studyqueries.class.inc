<?php declare(strict_types=1);
namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

/**
 * Provisioner to return any pinned study queries.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class StudyQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a StudyQueries provisioner, which gets rows for
     * the pinned study queries.
     *
     * @param protected \LORIS\LorisInstance $loris   - The LORIS object
     * @param string                         $pintype - The pin type. Either
     *                                                "dashboard" or "study"
     */
    function __construct(protected \LORIS\LorisInstance $loris, $pintype)
    {
        parent::__construct(
            "SELECT dq.QueryID, Query, dsq.Name
            FROM dataquery_queries dq
                LEFT JOIN dataquery_study_queries_rel dsq ON
                    (dq.QueryID=dsq.QueryID)
            WHERE dsq.PinType=:pintype
            GROUP BY QueryID, Query, dsq.Name
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
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
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

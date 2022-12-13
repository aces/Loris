<?php declare(strict_types=1);
namespace LORIS\dataquery\Provisioners;
use \LORIS\dataquery\Query;

/**
 * A StudyQueries provisioner gets a list of queries for a study
 * that were pinned by an administrator as being important for
 * the entire study.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class StudyQueries extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a StudyQueries provisioner, which gets rows for
     * the pinned study queries.
     *
     * @param \LORIS\LorisInstance $loris   The LORIS study instance
     * @param string               $pintype Either 'dashboard' if the
     *                                      query should be pinned to
     *                                      the LORIS dashboard or 'topquery'
     *                                      if it should be pinned to the top
     *                                      of the data query tool.
     */
    function __construct(protected \LORIS\LorisInstance $loris, $pintype)
    {
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

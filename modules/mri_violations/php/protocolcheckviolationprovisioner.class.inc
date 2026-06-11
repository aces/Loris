<?php declare(strict_types=1);

namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all ProtocolCheck violations
 * for a single SeriesUID.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ProtocolCheckViolationProvisioner
    extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ProtocolCheckViolationProvisioner
     *
     * @param \LORIS\LorisInstance $loris     The LORIS instance to retrieve data
     *                                        from.
     * @param string               $seriesUID the SeriesUID with violations
     */
    function __construct(protected \LORIS\LorisInstance $loris, string $seriesUID)
    {
        parent::__construct(
            $loris,
            "SELECT
                l.PatientName,
                c.CandID,
                l.Visit_label,
                mst.MriScanTypeName AS ScanType,
                mpcg.Name,
                l.Severity,
                l.Header,
                l.Value,
                COALESCE(l.ValidRange, l.ValidRegex)
            FROM mri_violations_log l
                LEFT JOIN mri_scan_type mst ON (mst.MriScanTypeID=l.MriScanTypeID)
                LEFT JOIN mri_protocol_checks_group mpcg
                    ON (mpcg.MriProtocolChecksGroupID = l.MriProtocolChecksGroupID)
                LEFT JOIN candidate c ON (l.CandidateID=c.ID)
                LEFT JOIN session s ON (
                  l.Visit_label = s.Visit_label AND l.CandidateID=s.CandidateID
                )
                LEFT JOIN psc p ON (p.CenterID = s.CenterID)
            WHERE l.SeriesUID=:sid",
            ['sid' => $seriesUID]
        );
    }

    /**
     * Returns an instance of a MediaFile object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ProtocolCheckViolation($row);
    }
}

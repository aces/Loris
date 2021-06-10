<?php declare(strict_types=1);
/**
 * This file implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all possible files
 * for the media menu page.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Henri Rabalais <henri.rabalais@mcin.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class ProtocolCheckViolationProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     */
    function __construct(private string $seriesUID)
    {
        parent::__construct(
            "SELECT 
                l.PatientName,
                l.CandID,
                l.Visit_label,
                m.Scan_type,
                mpcg.Name,
                l.Severity,
                l.Header,
                l.Value,
                COALESCE(l.ValidRange, l.ValidRegex)
            FROM mri_violations_log l
                LEFT JOIN mri_scan_type m ON (m.ID=l.Scan_type)
                LEFT JOIN mri_protocol_checks_group mpcg
                    ON (mpcg.MriProtocolChecksGroupID = l.MriProtocolChecksGroupID)
                LEFT JOIN candidate c ON (l.CandID=c.CandID)
                LEFT JOIN session s ON (
                  l.Visit_label = s.Visit_label AND l.CandID=s.CandID
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

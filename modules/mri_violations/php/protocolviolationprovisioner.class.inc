<?php declare(strict_types=1);
namespace LORIS\mri_violations;

/**
 * This class implements a data provisioner to get all protocol violations
 * for a specific SeriesUID
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class ProtocolViolationProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a ProtocolViolationProvisioner, which gets all mri_protocol violations
     * for a specific SeriesUID.
     *
     * @param string $seriesUID The SeriesUID
     */
    function __construct(string $seriesUID)
    {
        parent::__construct(
            "SELECT 
                mpv.CandID,
                mpv.PSCID,
                mpv.time_run,
                mpv.series_description,
                mpv.minc_location,
                mpv.PatientName,
                mpg.Name,
                mpv.TR_range,
                mpv.TE_range,
                mpv.TI_range,
                mpv.slice_thickness_range,
                mpv.xspace_range,
                mpv.yspace_range,
                mpv.zspace_range,
                mpv.xstep_range,
                mpv.ystep_range,
                mpv.zstep_range,
                mpv.time_range,
                mpv.SeriesUID,
                tarchive.TarchiveID,
                mpv.image_type,
                mpv.PhaseEncodingDirection,
                mpv.EchoNumber
             FROM mri_protocol_violated_scans mpv
                LEFT JOIN mri_protocol_group mpg ON
                 (mpg.MriProtocolGroupID=mpv.MriProtocolGroupID)
                LEFT JOIN tarchive ON
                 (mpv.PatientName = tarchive.PatientName)
             WHERE SeriesUID=:sid",
            ['sid' => $seriesUID]
        );
    }

    /**
     * Returns an instance of a ProtocolViolation object.
     *
     * @param array $row The database row from the LORIS Database class.
     *
     * @return \LORIS\Data\DataInstance An instance representing this row.
     */
    public function getInstance($row) : \LORIS\Data\DataInstance
    {
            return new ProtocolViolation($row);
    }
}

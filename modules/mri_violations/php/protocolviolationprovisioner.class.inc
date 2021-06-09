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
class ProtocolViolationProvisioner extends \LORIS\Data\Provisioners\DBRowProvisioner
{
    /**
     * Create a MediaFileProvisioner, which gets files for the meida
     * menu table.
     */
    function __construct(private string $seriesUID)
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
                tarchive.TarchiveID
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
     * Returns an instance of a MediaFile object.
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

<?php declare(strict_types=1);

/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS\api\Views\Visit;

use \LORIS\Data\Models\DicomTarDTO;
use \LORIS\Data\Models\DicomSeriesDTO;
/**
 * Creates a representation of a visit dicoms following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Dicoms_0_0_4_Dev
{
    private $_timepoint;
    private $_dicoms;

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint  $timepoint The timepoint to represent
     * @param DicomTarDTO ...$dicoms An array of dicomtars
     */
    public function __construct(\Timepoint $timepoint, DicomTarDTO ...$dicoms)
    {
        $this->_timepoint = $timepoint;
        $this->_dicoms    = $dicoms;
    }

    /**
     * This is a mapper function that formats a dicomtar following the
     * API specifications.
     *
     * @param DicomTarDTO $dicom The dicomtar to format.
     *
     * @return array
     */
    private static function _formatDicomTars(DicomTarDTO $dicom): array
    {
        return [
            'Tarname'     => $dicom->getTarname(),
            'Patientname' => $dicom->getPatientname(),
            'SeriesInfo'  => array_map(
                [
                    self::class,
                    '_formatSeries'
                ],
                $dicom->getSeries()
            ),
        ];
    }

    /**
     * This is a mapper function that formats a dicom series following the
     * API specifications.
     *
     * @param DicomSeriesDTO $series The series to format.
     *
     * @return array
     */
    private static function _formatSeries(DicomSeriesDTO $series): array
    {
        return [
            'SeriesDescription' => $series->getSeriesDescription(),
            'SeriesNumber'      => $series->getSeriesNumber(),
            'EchoTime'          => $series->getEchotime(),
            'RepetitionTime'    => $series->getRepetitiontime(),
            'InversionTime'     => $series->getInversiontime(),
            'SliceThickness'    => $series->getSlicethickness(),
            'Modality'          => $series->getModality(),
            'SeriesUID'         => $series->getSeriesuid(),
        ];
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = [
            'CandID' => $this->_timepoint->getCandID(),
            'Visit'  => $this->_timepoint->getVisitLabel(),
        ];

        $dicomtars = array_map(
            [self::class, '_formatDicomTars'],
            $this->_dicoms
        );

        return [
            'Meta'      => $meta,
            'DicomTars' => $dicomtars,
        ];
    }
}

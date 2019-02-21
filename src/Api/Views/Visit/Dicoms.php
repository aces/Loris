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

namespace LORIS\Api\Views\Visit;

use \LORIS\DicomTarDTO;
use \LORIS\DicomSeriesDTO;
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

class Dicoms
{
    protected $meta      = array();
    protected $dicomtars = array();

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint  $timepoint The timepoint to represent
     * @param DicomTarDTO ...$dicoms An array of dicomtars
     */
    public function __construct(\Timepoint $timepoint, DicomTarDTO ...$dicoms)
    {
        $this->meta['CandID'] = $timepoint->getCandID();
        $this->meta['Visit']  = $timepoint->getVisitLabel();

        $this->dicomtars[] = array_map(
            'Dicoms::_formatDicomTars',
            $dicoms
        );
    }

    /**
     * This is a mapper function that formats a dicomtar following the
     * API specifications.
     *
     * @param DicomTarDTO $dicom The dicomtar to format.
     *
     * @return array
     */
    private function _formatDicomTars(DicomTarDTO $dicom): array
    {
        return array(
                'Tarname'    => $dicom->getTarname(),
                'SeriesInfo' => array_map(
                    'Dicoms::_formatSeries',
                    $dicom->getSeries()
                ),
               );
    }

    /**
     * This is a mapper function that formats a dicom series following the
     * API specifications.
     *
     * @param DicomSeriesDTO $series The series to format.
     *
     * @return array
     */
    private function _formatSeries(DicomSeriesDTO $series): array
    {
        return array(
                'SeriesDescription' => $series->getSeriesDescription(),
                'SeriesNumber'      => $series->getSeriesNumber(),
                'EchoTime'          => $series->getEchotime(),
                'RepetitionTime'    => $series->getRepetitiontime(),
                'InversionTime'     => $series->getInversiontime(),
                'SliceThickness'    => $series->getSlicethickness(),
                'Modality'          => $series->getModality(),
                'SeriesUID'         => $series->getSeriesuid(),
               );
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return array(
                'Meta'      => $this->meta,
                'DicomTars' => $this->dicomtars,
               );
    }
}


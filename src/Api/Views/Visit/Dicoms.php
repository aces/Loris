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

        foreach ($dicoms as $dicom) {
            $obj = array(
                    'Tarname'    => $dicom->getTarname(),
                    'SeriesInfo' => array_map(
                        function ($serie) {
                            $s = array(
                                  'SeriesDescription' => $serie->getDescription(),
                                  'SeriesNumber'      => $serie->getNumber(),
                                  'EchoTime'          => $serie->getEchotime(),
                                  'RepetitionTime'    => $serie->getRepetitiontime(),
                                  'InversionTime'     => $serie->getInversiontime(),
                                  'SliceThickness'    => $serie->getSlicethickness(),
                                  'Modality'          => $serie->getModality(),
                                  'SeriesUID'         => $serie->getSeriesuid(),
                                 );
                            return $s;
                        },
                        $dicom->getSeries()
                    ),
                   );
            $this->dicomtars[] = $obj;
        }
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

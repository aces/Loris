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
     * @param \Timepoint $timepoint The timepoint to represent
     * @param array      $dicoms    An array of \LORIS\api\VisitDicomsRow
     */
    public function __construct(\Timepoint $timepoint, array $dicoms)
    {
        $this->meta['CandID'] = $timepoint->getCandID();
        $this->meta['Visit']  = $timepoint->getVisitLabel();

        $this->dicomtars = array_reduce(
            $dicoms,
            function (array $carry , array $item) {
                $tarname = $item['Tarname'];
                if (!isset($carry[$tarname])) {
                    $carry[$tarname] = array(
                                        'Tarname'    => $tarname,
                                        'SeriesInfo' => array(),
                                       );
                }
                $info = array(
                         'SeriesDescription' => $item['SeriesDescription'],
                         'SeriesNumber'      => $item['SeriesNumber'],
                         'EchoTime'          => $item['EchoTime'],
                         'RepetitionTime'    => $item['RepetitionTime'],
                         'InversionTime'     => $item['InversionTime'],
                         'SliceThickness'    => $item['SliceThickness'],
                         'Modality'          => $item['Modality'],
                         'SeriesUID'         => $item['SeriesUID'],
                        );
                $carry[$tarname]['SeriesInfo'][] = $info;
                return $carry;
            },
            array()
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
                'DicomTars' => array_values($this->dicomtars),
               );
    }
}

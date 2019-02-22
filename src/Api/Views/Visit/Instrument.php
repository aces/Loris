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
 * Creates a representation of a visit intrument following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Instrument
{
    protected $meta       = array();
    protected $instrument = array();

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     * and instrument.
     *
     * @param \Timepoint          $timepoint  The timepoint to represent
     * @param \NDB_BVL_Instrument $instrument The instrument.
     */
    public function __construct(
        \Timepoint $timepoint,
        \NDB_BVL_Instrument $instrument
    ) {
        $instrumentname = $instrument->testName;
        $instrumentdata = \NDB_BVL_Instrument::loadInstanceData(
            $instrument
        );

        $isDDE = strpos($instrumentdata['CommentID'], 'DDE_') === 0;

        $this->meta['Candidate']  = $timepoint->getCandID();
        $this->meta['Visit']      = $timepoint->getVisitLabel();
        $this->meta['DDE']        = $isDDE;
        $this->meta['Instrument'] = $instrumentname;

        $this->instrument[$instrumentname] = $instrumentdata;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return array_merge(
            array(
             'Meta' => $this->meta,
            ),
            $this->instrument
        );
    }
}


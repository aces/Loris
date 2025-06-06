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

class Instrument_0_0_4_Dev
{
    private $_timepoint;
    private $_instrument;

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
        $this->_timepoint  = $timepoint;
        $this->_instrument = $instrument;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $instrumentname = $this->_instrument->testName;
        $instrumentdata = $this->_instrument->getInstanceData();

        $isDDE = strpos($this->_instrument->getCommentID() ?? '', 'DDE_') === 0;

        $meta = [
            'Candidate'  => $this->_timepoint->getCandID(),
            'Visit'      => $this->_timepoint->getVisitLabel(),
            'DDE'        => $isDDE,
            'Instrument' => $instrumentname,
        ];

        $instrument = ['Data' => $instrumentdata];

        return array_merge(
            ['Meta' => $meta],
            $instrument
        );
    }
}


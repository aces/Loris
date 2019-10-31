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
 * Creates a representation of a visit instrument flags following the
 * api response specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Flags
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

        $instrumentdata = \NDB_BVL_Instrument::loadInstanceData(
            $this->_instrument
        );

        $isDDE = strpos($instrumentdata['CommentID'], 'DDE_') === 0;

        $meta = array(
                 'Candidate'  => $this->_timepoint->getCandID(),
                 'Visit'      => $this->_timepoint->getVisitLabel(),
                 'DDE'        => $isDDE,
                 'Instrument' => $instrumentname,
                );

        $flags = $this->_instrument->getFlags()->toArray();

        return array(
                'Meta'  => $meta,
                'Flags' => $flags,
               );
    }
}


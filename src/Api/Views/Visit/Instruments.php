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
 * Creates a representation of a project visit following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Instruments
{
    private $_meta            = array();
    private $_instrumentnames = array();

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint $timepoint The timepoint to represent
     */
    public function __construct(\Timepoint $timepoint)
    {
        $this->_meta['CandID'] = $timepoint->getCandID();
        $this->_meta['Visit']  = $timepoint->getVisitLabel();

        $this->_instrumentnames = $timepoint->getInstrumentNames();
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        return array(
                'Meta'        => $this->_meta,
                'Instruments' => $this->_instrumentnames,
               );
    }
}

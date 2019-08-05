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

use \LORIS\TimePointImagingQC;

/**
 * Creates a representation of a visit imaging qc following the api response
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Qc
{
    private $_timepoint;
    private $_qc;

    /**
     * Constructor which sets the instance variables based on the provided timepoint.
     *
     * @param \Timepoint         $timepoint The timepoint to represent
     * @param TimePointImagingQC $qc        The imaging qc values
     */
    public function __construct(\Timepoint $timepoint, TimePointImagingQC $qc)
    {
        $this->_timepoint = $timepoint;
        $this->_qc        = $qc;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = array(
                 'CandID' => $this->_timepoint->getCandID(),
                 'Visit'  => $this->_timepoint->getVisitLabel(),
                );

        $sessionqc = $this->_qc->getQC;
        $ispending = $this->_qc->getQCPending();

        return array(
                'Meta'      => $meta,
                'SessionQC' => $sessionqc,
                'Pending'   => $ispending === 'N' ? false : true,
               );
    }
}

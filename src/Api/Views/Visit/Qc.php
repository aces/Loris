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
    protected $meta = array();
    protected $sessionqc;
    protected $ispending;

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint $timepoint The timepoint to represent
     * @param array      $mriqc     An associative array containing MRIQCStatus and
     *                              MRIQCPending keys MRIQCPending keys
     */
    public function __construct(\Timepoint $timepoint, array $mriqc)
    {
        $this->meta['CandID'] = $timepoint->getCandID();
        $this->meta['Visit']  = $timepoint->getVisitLabel();

        // TODO :: $this->sessionqc = $timepoint->getMRIQCStatus();
        // TODO :: $this->ispending = $timepoint->getMRIQCPending();
        $this->sessionqc = $mriqc['MRIQCStatus'] ?? null;
        $this->ispending = $mriqc['MRIQCPending'] ?? null;
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
                'SessionQC' => $this->sessionqc,
                'Pending'   => $this->ispending === 'N' ? false : true,
               );
    }
}

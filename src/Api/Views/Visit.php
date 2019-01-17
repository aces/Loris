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

namespace LORIS\Api\Views;

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

class Visit
{
    protected $meta   = array();
    protected $stages = array();

    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint $timepoint The timepoint to represent
     */
    public function __construct(\Timepoint $timepoint)
    {
        $this->meta['CandID']  = $timepoint->getCandID();
        $this->meta['Visit']   = $timepoint->getVisitLabel();
        $this->meta['Site']    = $timepoint->getPSC();
        $this->meta['Battery'] = $timepoint->getData('SubprojectTitle');

        if ($timepoint->getDateOfScreening() !== null) {
            $screening = array(
                          'Date'   => $timepoint->getDateOfScreening(),
                          'Status' => $timepoint->getScreeningStatus(),
                         );
            $this->stages['Screening'] = $screening;
        }

        if ($timepoint->getDateOfVisit() !== null) {
            $visit = array(
                      'Date'   => $timepoint->getDateOfVisit(),
                      'Status' => $timepoint->getVisitStatus(),
                     );
            $this->stages['Visit'] = $visit;
        }

        if ($timepoint->getDateOfApproval() !== null) {
            $approval = array(
                         'Date'   => $timepoint->getDateOfapproval(),
                         'Status' => $timepoint->getApprovalStatus(),
                        );
            $this->stages['Screening'] = $approval;
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
                'Meta'   => $this->meta,
                'Stages' => $this->stages,
               );
    }
}

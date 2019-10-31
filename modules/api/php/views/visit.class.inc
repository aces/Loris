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

namespace LORIS\api\Views;

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
    private $_timepoint;
    /**
     * Constructor which sets the instance variables based on the provided timepoint
     *
     * @param \Timepoint $timepoint The timepoint to represent
     */
    public function __construct(\Timepoint $timepoint)
    {
        $this->_timepoint = $timepoint;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = array(
                 'CandID'  => $this->_timepoint->getCandID(),
                 'Visit'   => $this->_timepoint->getVisitLabel(),
                 'Site'    => $this->_timepoint->getPSC(),
                 'Battery' => $this->_timepoint->getData('SubprojectTitle'),
                 'Project' => $this->_timepoint->getProject(),
                );

        $stages = array();

        if ($this->_timepoint->getDateOfScreening() !== null) {
            $screening = array(
                          'Date'   => $this->_timepoint->getDateOfScreening(),
                          'Status' => $this->_timepoint->getScreeningStatus(),
                         );

            $stages['Screening'] = $screening;
        }

        if ($this->_timepoint->getDateOfVisit() !== null) {
            $visit = array(
                      'Date'   => $this->_timepoint->getDateOfVisit(),
                      'Status' => $this->_timepoint->getVisitStatus(),
                     );

            $stages['Visit'] = $visit;
        }

        if ($this->_timepoint->getDateOfApproval() !== null) {
            $approval = array(
                         'Date'   => $this->_timepoint->getDateOfapproval(),
                         'Status' => $this->_timepoint->getApprovalStatus(),
                        );

            $stages['Screening'] = $approval;
        }

        return array(
                'Meta'   => $meta,
                'Stages' => $stages,
               );
    }
}

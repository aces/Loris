<?php declare(strict_types=1);

/**
 * PHP Version 8
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
     * @param \Timepoint $timepoint  The timepoint to represent
     * @param string     $apiversion The version of the API being used
     */
    public function __construct(
        \Timepoint $timepoint,
        private string $apiversion = 'v0.0.3'
    ) {
        $this->_timepoint = $timepoint;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $cohortKey = $this->apiversion == 'v0.0.4-dev' ? 'Cohort' : 'Battery';
        $meta      = [
            'CandID'   => $this->_timepoint->getCandID(),
            'Visit'    => $this->_timepoint->getVisitLabel(),
            'Site'     => $this->_timepoint->getPSC(),
            $cohortKey => $this->_timepoint->getData('CohortTitle'),
            'Project'  => $this->_timepoint->getProject(),
        ];

        $stages = [];

        if ($this->_timepoint->getDateOfScreening() !== null) {
            $screening = [
                'Date'   => $this->_timepoint->getDateOfScreening(),
                'Status' => $this->_timepoint->getScreeningStatus(),
            ];

            $stages['Screening'] = $screening;
        }

        if ($this->_timepoint->getDateOfVisit() !== null) {
            $visit = [
                'Date'   => $this->_timepoint->getDateOfVisit(),
                'Status' => $this->_timepoint->getVisitStatus(),
            ];

            $stages['Visit'] = $visit;
        }

        if ($this->_timepoint->getDateOfApproval() !== null) {
            $approval = [
                'Date'   => $this->_timepoint->getDateOfapproval(),
                'Status' => $this->_timepoint->getApprovalStatus(),
            ];

            $stages['Screening'] = $approval;
        }

        return [
            'Meta'   => $meta,
            'Stages' => $stages,
        ];
    }
}

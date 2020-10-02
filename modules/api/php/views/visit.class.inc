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
     * @param string     $version   Version of the API
     */
    public function __construct(\Timepoint $timepoint, string $version)
    {
        $this->_timepoint = $timepoint;
        $this->_version   = $version;
    }

    /**
     * Creates an serializable array of this object's data
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = [
            'CandID'  => $this->_timepoint->getCandID(),
            'Visit'   => $this->_timepoint->getVisitLabel(),
            'Site'    => $this->_timepoint->getPSC(),
            'Battery' => $this->_timepoint->getData('SubprojectTitle'),
        ];

        if ($this->_version != 'v0.0.2') {
            $meta['Project'] = $this->_timepoint->getProject();
        }

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

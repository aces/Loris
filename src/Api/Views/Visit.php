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

    public function __construct(\Timepoint $timepoint)
    {
        $this->meta['CandID']  = $timepoint->getCandID();
        $this->meta['Visit']   = $timepoint->getVisitLabel();
        $this->meta['Site']    = $timepoint->getPSC();
        $this->meta['Battery'] = $timepoint->getData('SubprojectTitle');

        if ($timepoint->getDateOfScreening() !== null) {
            $this->stages['Screening'] = array(
                                          'Date'   => $timepoint->getDateOfScreening(),
                                          'Status' => $timepoint->getScreeningStatus(),
                                         );
        }

        if ($timepoint->getDateOfVisit() !== null) {
            $this->stages['Visit'] = array(
                                      'Date'   => $timepoint->getDateOfVisit(),
                                      'Status' => $timepoint->getVisitStatus(),
                                     );
        }

        if ($timepoint->getDateOfApproval() !== null) {
            $this->stages['Screening'] = array(
                                          'Date'   => $timepoint->getDateOfapproval(),
                                          'Status' => $timepoint->getApprovalStatus(),
                                         );
        }
    }

    public function toArray(): array
    {
        return array(
                'Meta'   => $this->meta,
                'Stages' => $this->stages,
               );
    }
}

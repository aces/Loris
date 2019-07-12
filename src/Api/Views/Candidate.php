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

class Candidate
{
    protected $meta = array();

    protected $visits = array();

    public function __construct(\Candidate $candidate)
    {
        $this->meta['CandID']  = $candidate->getCandID();
        $this->meta['Project'] = $candidate->getProjectTitle();
        $this->meta['PSCID']   = $candidate->getPSCID();
        $this->meta['Site']    = $candidate->getCandidateSite();
        $this->meta['EDC']     = $candidate->getCandidateEDC();
        $this->meta['DoB']     = $candidate->getCandidateDoB();
        $this->meta['Sex']     = $candidate->getCandidateSex();

        $this->visits = array_values($candidate->getListOfVisitLabels());
    }

    public function toArray(): array
    {
        return array(
                'Meta'   => $this->meta,
                'Visits' => $this->visits,
               );
    }
}

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
 * This class formats a candidate object into an array following the API
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Candidate
{
    private $_candidate;

    /**
     * Constructor.
     *
     * @param \Candidate $candidate The candidate to format
     */
    public function __construct(\Candidate $candidate)
    {
        $this->_candidate = $candidate;
    }

    /**
     * Generates the array
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = array(
                 'CandID'  => $this->_candidate->getCandID(),
                 'Project' => $this->_candidate->getProjectTitle(),
                 'PSCID'   => $this->_candidate->getPSCID(),
                 'Site'    => $this->_candidate->getCandidateSite(),
                 'EDC'     => $this->_candidate->getCandidateEDC(),
                 'DoB'     => $this->_candidate->getCandidateDoB(),
                 'Sex'     => $this->_candidate->getCandidateSex(),
                );

        $visits = array_values($this->_candidate->getListOfVisitLabels());

        return array(
                'Meta'   => $meta,
                'Visits' => $visits,
               );
    }
}

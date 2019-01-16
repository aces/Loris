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

class Project
{
    private $project;

    protected $meta = array();

    // Variables used to store data after lazy evaluation
    protected $candidates;
    protected $images;
    protected $instruments;
    protected $visits;


    public function __construct(\Project $project)
    {
        $this->project         = $project;
        $this->meta['Project'] = $project->getName();
    }

    public function toArray(): array
    {
        return array(
                'Meta'        => $this->meta,
                'Candidates'  => $this->_getCandidates(),
                'Instruments' => array_keys($this->_getInstruments()),
                'Visits'      => $this->_getVisits(),
               );
    }

    public function toCandidateArray(): array
    {

        return array(
                'Meta'       => $this->meta,
                'Candidates' => $this->_getCandidates(),
               );
    }

    public function toInstrumentArray(): array
    {
        $ddeinstruments = \Utility::getAllDDEInstruments();
        $instruments    = array();
        foreach ($this->_getInstruments() as $shortname => $fullname) {
            $isDDE    = in_array($shortname, $ddeinstruments);
            $subgroup = null; // TODO

            $obj = array(
                    'FullName'               => $fullname,
                    'Subgroup'               => $subgroup,
                    'DoubleDataEntryEnabled' => $isDDE,
                   );
            $instruments[$shortname] = $obj;
        }

        return array(
                'Meta'        => $this->meta,
                'Instruments' => $instruments,
               );
    }

    public function toVisitArray(): array
    {
        return array(
                'Meta'   => $this->meta,
                'Visits' => $this->_getVisits(),
               );
    }

    private function _getCandidates(): array
    {
        if (!isset($this->candidates)) {
            $this->candidates = $this->project->getCandidateIds();
        }
        return $this->candidates;
    }

    private function _getInstruments(): array
    {
        if (!isset($this->instruments)) {
            $this->instruments = \Utility::getAllInstruments();
        }
        return $this->instruments;
    }

    private function _getVisits(): array
    {
        if (!isset($this->visits)) {
            $this->visits = array_keys(
                \Utility::getExistingVisitLabels(
                    $this->project->getId()
                )
            );
        }
        return $this->visits;
    }
}

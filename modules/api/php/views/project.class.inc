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
 * This class formats a Project object into arrays following the API
 * specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Project
{
    /**
     * The project to format
     *
     * @var \Project
     */
    private $_project;

    /**
     * Constructor
     *
     * @param \Project $project    The project to format
     * @param string   $apiversion The version of the API being accessed
     */
    public function __construct(\Project $project, private string $apiversion = '')
    {
        $this->_project = $project;
    }


    /**
     * Produce an array representation of this project.
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = ['Project' => $this->_project->getName()];

        $obj = [
            'Meta'        => $meta,
            'Candidates'  => $this->_project->getCandidateIds(),
            'Instruments' => array_keys(\Utility::getAllInstruments()),
            'Visits'      => $this->_getVisits(),
        ];
        switch ($this->apiversion) {
        case 'v0.0.3':
            return $obj;
        default:
            // >= v0.0.4
            $obj['Cohorts'] = array_map(
                function ($cohort) {
                    return $cohort['title'];
                },
                $this->_project->getCohorts()
            );
        }
        return $obj;
    }

    /**
     * Produce a list of all candidate candids of this project following
     * the api specifications for /project/<project_name>/candidates.
     *
     * @return array
     */
    public function toCandidateArray(): array
    {
        $meta = ['Project' => $this->_project->getName()];

        return [
            'Meta'       => $meta,
            'Candidates' => $this->_project->getCandidateIds(),
        ];
    }

    /**
     * Produce a list of all existing visit labels of this project following
     * the api specifications for /project/<project_name>/visits.
     *
     * @return array
     */
    public function toVisitArray(): array
    {
        $meta = ['Project' => $this->_project->getName()];

        return [
            'Meta'   => $meta,
            'Visits' => $this->_getVisits(),
        ];
    }

    /**
     * Generates the list of visit_labels for the project.
     *
     * @return array
     */
    private function _getVisits(): array
    {
        // TODO :: This should be replaced by $this->_project->getVisitLabels();
        return array_keys(
            \Utility::getVisitList(
                $this->_project->getId()
            )
        );
    }
}

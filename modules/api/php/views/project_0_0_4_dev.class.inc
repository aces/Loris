<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category ApiViews
 * @package  Loris
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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Project_0_0_4_Dev extends Project
{
    /**
     * Produce an array representation of this project.
     *
     * @return array
     */
    public function toArray(): array
    {
        $meta = ['Project' => $this->_project->getName()];

        return [
            'Meta'        => $meta,
            'Subprojects' => array_values(
                \Utility::getSubprojectList(
                    $this->_project->getId()
                )
            ),
            'Candidates'  => $this->_project->getCandidateIds(),
            'Instruments' => array_keys(\Utility::getAllInstruments()),
            'Visits'      => $this->getVisits(),
        ];
    }
}

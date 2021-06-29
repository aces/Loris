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
 * Create a array representations of this LORIS instance subprojects
 *  suitable to the API specifications.
 *
 * @category ApiViews
 * @package  Loris
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Subprojects
{
    private $_subprojects;

    /**
     * Create an api formated view of an array of subprojects
     *
     * @param [] $subprojects The subprojects
     */
    public function __construct(array $subprojects)
    {
        $this->_subprojects = $subprojects;
    }

    /**
     * Gets the required data from the projects.
     *
     * @return array
     */
    public function toArray(): array
    {
        $subprojects = [];
        foreach ($this->_subprojects as $subproject) {
            $subprojects[$subproject['title']] = [
                'useEDC' => $subproject['useEDC'],
                'WindowDifference' => $subproject['WindowDifference'],
                'RecruitmentTarget' => $subproject['RecruitmentTarget']
            ];
        }
        return ['Subprojects' => $subprojects];
    }
}

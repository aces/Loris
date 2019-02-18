<?php declare(strict_types=1);
/**
 * This file contains a class which encapsulates the concept of a "Project"
 * in LORIS. This is a default project for studies that don't use projects.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Project class encapsulates all details of a default project.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ProjectDefault extends Project
{
    private static $_instance;

    /**
     * Private constructor to make sure that the singleton function is used
     */
    private function __construct()
    {
        $this->_projectId = null;
        $this->_projectName = 'loris';
    }

    /**
     * This returns a single Project object with the default name 'loris'
     * It will only ever instantiate one object in the event that it's called
     * multiple times.
     *
     * @param string $projectName The project
     *
     * @return Project the Project object
     * @throws LorisException
     */
    public static function &singleton($projectName)
    {
        if (!isset(self::$_instance)) {
            $factory = \NDB_Factory::singleton();
            $config  = $factory->config();

            if ($config->getSetting("useProjects") == 'true') {
                throw new \LorisException("This study uses projects");
            }

            $project = new ProjectDefault();

            self::$_instance = $project;
        }

        return self::$_instance;
    }

    /**
     * Get the project's recruitment target.
     *
     * @return int The sum of all subprojects recruitment target
     */
    public function getRecruitmentTarget() : int
    {
        if (empty($this->recruitmentTarget)) {
            $total = array_reduce(
                $this->getSubprojects(),
                function ($carry, $item) {
                    return (int )($carry + $item->recruitmentTarget);
                },
                0
            );
            // The following assignment is temporary and is not transmitted to the
            // database.
            $this->recruitmentTarget = $total;
        }
        return (int) $this->recruitmentTarget;
    }

    /**
     * Get that project subprojects as defined in the project_rel table
     *
     * @return array A list of object representation of subprojects
     */
    public function getSubprojects(): array
    {
        $factory        = \NDB_Factory::singleton();
        $subProjectData = $factory->database()->pselect(
            "
            SELECT
              sp.subprojectId,
              sp.title,
              sp.useEDC,
              sp.windowDifference,
              sp.recruitmentTarget
            FROM
              subproject sp
            ",
            array()
        );

        return array_map(
            function ($row) {
                return (object) array(
                                 'subprojectId'      => $row['subprojectId'],
                                 'title'             => $row['title'],
                                 'useEDC'            => $row['useEDC'],
                                 'windowDifference'  => $row['windowDifference'],
                                 'recruitmentTarget' => $row['recruitmentTarget'],
                                );
            },
            $subProjectData
        );
    }
}

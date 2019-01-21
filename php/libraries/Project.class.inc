<?php declare(strict_types=1);
/**
 * This file contains a class which encapsulates the concept of a "Project"
 * in LORIS.
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
 * The Project class encapsulates all details of a project.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Project
{
    private static $_instances = array();

    private $_projectId;
    private $_projectName;
    private $_recruitmentTarget;

    /**
     * Private constructor to make sure that the singleton function is used
     */
    private function __construct()
    {
    }

    /**
     * This returns a single Project object for the given
     * project name, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param string $projectName The project
     *
     * @note This should be used by the NDB_Factory and not be called
     * directly
     *
     * @return Project the Project object
     * @throws LorisException
     */
    static function &singleton($projectName)
    {
        if (!isset(self::$_instances[$projectName])) {
            $factory = \NDB_Factory::singleton();
            $config  = $factory->config();

            if ($config->getSetting("useProjects") == 'true') {
                $projectData = $factory->database()->pSelectRow(
                    "
                    SELECT
                      projectId,
                      name,
                      recruitmentTarget as recTarget
                    FROM
                      Project
                    WHERE name = :v_project_name
                    ",
                    array('v_project_name' => $projectName)
                );

                if (empty($projectData)) {
                    throw new \NotFound("No project named: $projectName");
                }

                $project = new Project();

                $project->_projectId         = $projectData['projectId'];
                $project->_projectName       = $projectData['name'];
                $project->_recruitmentTarget = (integer) $projectData['recTarget'];
            } else {
                if ($projectName != 'loris') {
                    throw new \LorisException("This study is not using projects");
                }
                $project =& ProjectDefault::singleton('loris');
            }

            self::$_instances[$projectName] = $project;
        }

        return self::$_instances[$projectName];
    }

    /**
     * This does the work of creating a new Project by inserting a new entry in the
     * Project table and return the object instance of the newly created project.
     *
     * @param string       $projectName       The project name
     * @param integer|null $recruitmentTarget The number of expected participants
     *
     * @note If the recruitmentTarget is missing or null, this project
     * recruitmentTarget will be the sum of all its subprojects recruitmentTarget
     * see: getRecruitmentTarget
     *
     * @return Project the Project object
     * @throws DatabaseException | LorisException
     */
    static public function createNew(
        string $projectName,
        ?int $recruitmentTarget = null
    ): \Project {

        // TODO :: Add not null constraint to the name column of the Project table
        if (empty($projectName)) {
            throw new \LorisException("ProjectName can't be null");
        }

        $factory = \NDB_Factory::singleton();
        // TODO :: Add unique constraint to the name column of the Project table
        $projectId = $factory->database()->pselectOne(
            "
            SELECT 
              projectId
            FROM
              Project
            WHERE
              name = :v_project_name
            ",
            array('v_project_name' => $projectName)
        );
        if (!empty($projectId)) {
            throw new \LorisException("The project $projectName already exists");
        }

        $factory->database()->insert(
            'Project',
            array(
             'name'              => $projectName,
             'recruitmentTarget' => $recruitmentTarget,
            )
        );

        $project = $factory->project($projectName);

        return $project;
    }

    /**
     * Get this project's id
     *
     * @return integer This project's id
     */
    public function getId(): int
    {
        return $this->_projectId;
    }

    /**
     * Set this project's id
     *
     * @param integer $projectId This project's id
     *
     * @return void
     */
    public function setId(int $projectId): void
    {
        $this->_projectId = $projectId;
    }

    /**
     * Get this project's name
     *
     * @return string This project's name
     */
    public function getName(): string
    {
        return $this->_projectName;
    }

    /**
     * Set this project's name
     *
     * @param string $projectName This project's name
     *
     * @return void
     */
    public function setName(string $projectName): void
    {
        $this->_projectName = $projectName;
    }

    /**
     * Get the project's recruitment target.
     *
     * @note If the database value is null then the return value will be the sum of
     * all this project's subproject recruitment target.
     *
     * @return int
     */
    public function getRecruitmentTarget() : int
    {
        if (empty($this->_recruitmentTarget)) {
            $total = array_reduce(
                $this->getSubprojects(),
                function ($carry, $item) {
                    return (int )($carry + $item->_recruitmentTarget);
                },
                0
            );
            // The following assignment is temporary and is not transmitted to the
            // database.
            $this->_recruitmentTarget = $total;
        }
        return (int)$this->_recruitmentTarget;
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
              project_rel pr
            JOIN 
              subproject sp USING (subprojectId)
            WHERE
              pr.projectId = :v_project_id
            ",
            array('v_project_id' => $this->_projectId)
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

    /**
     * Get that project's participants
     *
     * @return array A list of object representation of a basic candidates
     */
    public function getCandidateIds(): array
    {
        $factory = \NDB_Factory::singleton();

        $p = array($this->_projectId);
        if ($factory->config()->getSetting('useProjects') !== 'true') {
            array_push($p, '-1');
        }
        $candidatesData = $factory->database()->pselect(
            "
            SELECT
              candid
            FROM
              candidate
            WHERE
              active = 'Y' AND
              FIND_IN_SET(IFNULL(projectId, '-1'), :v_project_id)
            ",
            array('v_project_id' => implode(',', $p))
        );
        return array_map(
            function ($row) {
                return $row['candid'];
            },
            $candidatesData
        );
    }
}

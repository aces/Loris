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

    /**
     * The id of the project in database.
     *
     * @var int
     */
    private $_projectId;
    private $_projectName;
    private $_projectAlias;
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

            $projectData = $factory->database()->pSelectRow(
                "
                    SELECT
                      projectId,
                      name,
                      Alias,
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

            $project->_projectId         = (int) $projectData['projectId'];
            $project->_projectName       = $projectData['name'];
            $project->_projectAlias      = $projectData['Alias'];
            $project->_recruitmentTarget = (integer) $projectData['recTarget'];

            self::$_instances[$projectName] = $project;
        }

        return self::$_instances[$projectName];
    }

    /**
     * Get a project object from the ID by mapping the ID to a name and using the
     * singleton function
     *
     * @param int $projectID The ID of the project queried
     *
     * @return Project
     *
     * @throws NotFound
     */
    static function getProjectFromID(int $projectID) : \Project
    {
        $factory = \NDB_Factory::singleton();

        $projectName = $factory->database()->pSelectOne(
            "
                    SELECT
                      Name
                    FROM
                      Project
                    WHERE ProjectID = :pid
                    ",
            array('pid' => $projectID)
        );

        if (empty($projectName)) {
            throw new \NotFound("No project with ID: $projectID");
        }

        return \Project::singleton($projectName);
    }

    /**
     * This does the work of creating a new Project by inserting a new entry in the
     * Project table and return the object instance of the newly created project.
     *
     * @param string       $projectName       The project name
     * @param string       $projectAlias      The project alias
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
        string $projectAlias,
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
                'Name'              => $projectName,
                'Alias'             => $projectAlias,
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
     * Set this project's name
     *
     * @param ?string $projectName The new name. Uses class property when null.
     *
     * @return void
     */
    public function updateName(?string $projectName = ''): void
    {
        if (!empty($projectName)) {
            $this->setName($projectName);
        }
        $this->_updateField("Name", $this->_projectName);
    }

    /**
     * Get this project's alias
     *
     * @return string This project's alias
     */
    public function getAlias(): string
    {
        return $this->_projectAlias;
    }

    /**
     * Set this project's alias
     *
     * @param string $projectAlias This project's alias
     *
     * @return void
     */
    public function setAlias(string $projectAlias): void
    {
        if (strlen($projectAlias) > 4 ) {
            throw new InvalidArgumentException(
                "The length of the project's alias can not be longer than ".
                "4 characters."
            );
        }
        $this->_projectAlias = $projectAlias;
    }

    /**
     * Update the Alias field in the database for this Project.
     *
     * @param ?string $projectAlias The new alias. Uses class property when null.
     *
     * @return void
     */
    public function updateAlias(?string $projectAlias = ''): void
    {
        if (!empty($projectAlias)) {
            $this->setAlias($projectAlias);
        }
        $this->_updateField("Alias", $this->_projectAlias);
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
     * Set this project's recruitment target
     *
     * @param int $target This project's recruitment target
     *
     * @return void
     */
    public function setRecruitmentTarget(int $target): void
    {
        $this->_recruitmentTarget = $target;
    }

    /**
     * Update the recruitmentTarget field in the database for this Project.
     *
     * @param ?int $target The new recruitmentTarget. Uses class property
     *                     when null.
     *
     * @return void
     */
    public function updateRecruitmentTarget(?int $target = null): void
    {
        if (isset($target)) {
            $this->setRecruitmentTarget($target);
        }
        $this->_updateField("recruitmentTarget", $this->_recruitmentTarget);
    }

    /**
     * Updates a column in the database corresponding to this Project.
     *
     * @param string $field The name of the column to update.
     * @param mixed  $value The new value
     *
     * @return void
     */
    private function _updateField(string $field, $value): void
    {
        \NDB_Factory::singleton()->database()
            ->update(
                "Project",
                array($field => (string) $value),
                array("ProjectID" => $this->_projectId)
            );
    }

    /**
     * Get that project subprojects as defined in the project_subproject_rel table
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
              project_subproject_rel psr
            JOIN 
              subproject sp USING (subprojectId)
            WHERE
              psr.projectId = :v_project_id
            ",
            array('v_project_id' => $this->_projectId)
        );

        return array_map(
            function ($row) {
                return (object) array(
                    'subprojectId'      => (int) $row['subprojectId'],
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
        $candidatesData = $factory->database()->pselect(
            "
            SELECT
              candid
            FROM
              candidate
            WHERE
              active = 'Y' AND
              FIND_IN_SET(IFNULL(RegistrationProjectID, '-1'), :v_project_id)
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

    /**
     * Inserts new subproject IDs into the database, creating a relationship
     * between them and this project.
     *
     * @param int[] $ids The new subprojectIDs.
     *
     * @return void
     */
    public function insertSubprojectIDs(array $ids): void
    {
        $db = \NDB_Factory::singleton()->database();
        foreach ($ids as $id) {
            $db->insertIgnore(
                'project_subproject_rel',
                array(
                    'ProjectID'    => $this->_projectId,
                    'SubprojectID' => $id,
                )
            );
        }
    }

    /**
     * Deletes subproject IDs from the database.
     *
     * @param int[] $ids The old subprojectIDs to delete.
     *
     * @return void
     */
    public function deleteSubprojectIDs(array $ids): void
    {
        $db = \NDB_Factory::singleton()->database();
        // The following can cause some deletions from the
        // visit_project_subproject_rel table.
        foreach ($ids as $id) {
            $db->delete(
                'project_subproject_rel',
                array(
                    'ProjectID'    => $this->_projectId,
                    'SubprojectID' => $id,
                )
            );
        }
    }
}

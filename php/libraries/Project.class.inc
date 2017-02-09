<?php
/**
 * This file contains a class which encapsulates the concept of a "Project"
 * in LORIS.
 *
 * PHP Version 5
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

    private static $_instances       = array();
    private static $_id_name_mapping = array();

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
            $factory     = \NDB_Factory::singleton();
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
                throw new \LorisException("There is no project named: $projectName");
            }

            $project = new Project();

            $project->projectId         = $projectData['projectId'];
            $project->projectName       = $projectData['name'];
            $project->recruitmentTarget = (integer) $projectData['recTarget'];

            self::$_instances[$projectName]            = $project;
            self::$_id_name_mapping[$project->getId()] = $projectName;
        }

        return self::$_instances[$projectName];
    }

    /**
     * This returns a single Project object for the given
     * project id, and will only ever instantiate one object in
     * the event that it's called multiple times.
     *
     * @param string $id The project id
     *
     * @return Project the Project object
     * @throws LorisException
     */
    static function getInstanceById($id)
    {
        if (!isset(self::$_id_name_mapping[$id])) {
            $factory     = \NDB_Factory::singleton();
            $projectData = $factory->database()->pSelectRow(
                "
                SELECT
                  projectId,
                  name,
                  recruitmentTarget as recTarget
                FROM
                  Project
                WHERE projectId = :v_project_id
                ",
                array('v_project_id' => $id)
            );
            if (empty($projectData)) {
                throw new \LorisException("This PorjetcId does not exists : $id");
            }

            $project = new Project();

            $project->projectId         = $projectData['projectId'];
            $project->projectName       = $projectData['name'];
            $project->recruitmentTarget = (integer) $projectData['recTarget'];

            self::$_instances[$projectName]            = $project;
            self::$_id_name_mapping[$project->getId()] = $projectName;
        }
        $projectName = self::$_id_name_mapping[$id];
        return self::$_instances[$projectName];
    }

    /**
     * This does the work of creating a new Project by inserting a new entry in the
     * Project table and return the object instance of the newly created project.
     *
     * @param string  $projectName       The project name
     * @param integer $recruitmentTarget The number of expected participants
     *
     * @note If the recruitmentTarget is missing or null, this project
     * recruitmentTarget will be the sum of all its subprojects recruitmentTarget
     * see: getRecruitmentTarget
     *
     * @return Project the Project object
     * @throws DatabaseException | LorisException
     */
    static public function createNew($projectName, $recruitmentTarget = null)
    {

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
    public function getId()
    {
        return $this->projectId;
    }

    /**
     * Get this project's name
     *
     * @return string This project's name
     */
    public function getName()
    {
        return $this->projectName;
    }

    /**
     * Get the project's recruitment target.
     *
     * @note If the database value is null then the return value will be the sum of
     * all this project's subproject recruitment target.
     *
     * @return string This project's name
     */
    public function getRecruitmentTarget()
    {
        if (empty($this->recruitmentTarget)) {
            $total = array_reduce(
                $this->getSubprojects(),
                function ($carry, $item) {
                    return $carry + $item->recruitmentTarget;
                },
                0
            );
            // The following assignment is temporary and is not transmitted to the
            // database.
            $this->recruitmentTarget = $total;
        }
        return $this->recruitmentTarget;
    }

    /**
     * Get that project subprojects as defined in the project_rel table
     *
     * @return array A list of object representation of subprojects
     */
    public function getSubprojects()
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
            array('v_project_id' => $this->projectId)
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
    public function getCandidateIds()
    {
        $factory = \NDB_Factory::singleton();

        $p = array($this->projectId);
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

    /**
     * Tells if any of this project's subproject is using Estimated Date of
     * Confinement (EDC)
     *
     * @return boolean True if any subproject is using EDC.
     */
    public function isUsingEDC()
    {
        return array_reduce(
            $this->getSubprojects(),
            function ($carry, $item) {
                return $carry || $item->useEDC;
            },
            false
        );
    }

    /**
     * Get a list of instruments installed for this project
     *
     * @return array of object representation of basic instrument informations
     */
    public function getInstrumentList()
    {
        $instruments = array();
        $factory     = \NDB_Factory::singleton();
        $config      = $factory->config();

        $ddeInstruments = $config->getSetting("DoubleDataEntryInstruments");

        $results = $factory->database()->pselect(
            "
            SELECT DISTINCT
              t.Test_name as short_name,
              t.Full_name as full_name,
              t.Sub_group as subgroup
            FROM
              test_names t
            JOIN test_battery USING (Test_name)
            JOIN subproject USING (SubprojectID)
            JOIN project_rel USING (SubprojectID)
            JOIN Project USING (ProjectID)
            WHERE
                Project.ProjectID = :v_project_id AND
                test_battery.Active = 'Y'
            ",
            array('v_project_id' => $this->projectId)
        );
        foreach ($results as $row) {
            $isDDE         = in_array($row['short_name'], $ddeInstruments);
            $instrument    = (object) array(
                                       'ShortName'             => $row['short_name'],
                                       'FullName'              => $row['full_name'],
                                       'Subgroup'              => $row['subgroup'],
                                       'DoubleDataEntryEnable' => $isDDE,
                                      );
            $instruments[] = $instrument;
        }
        return $instruments;
    }
}

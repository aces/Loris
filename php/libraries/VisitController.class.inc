<?php
/**
 * This file contains the VisitController class.
 *
 * PHP Version 7
 *
 * @category Controller
 * @package  Visits
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

use \LORIS\VisitData;

/**
 * Base class that contains method to access the visit of projects
 *
 * @category Controller
 * @package  Visits
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitController extends \LORIS\Data\ProvisionerInstance
{
    /**
     * The database connection to use
     *
     * @var \Database
     */
    protected $database;

    /**
     * The constructor
     *
     * @param \Database $database The database connection to use
     */
    public function __construct(\Database $database)
    {
        if (!$database->isConnected()) {
            throw new \RuntimeException("VisitController - Database not connected");
        }
        $this->database = $database;
    }

    /**
     * Function defining the base query for visits to avoid duplication
     *
     * @return string
     */
    protected function getBaseQuery() : string
    {
        return "SELECT
                    VisitID,
                    VisitName,
                    VisitLabel,
                    WindowMinDays,
                    WindowMaxDays,
                    OptimumMinDays,
                    OptimumMaxDays,
                    WindowMidpointDays
                FROM visit v
                    JOIN Visit_Windows vw ON (v.VisitName=vw.Visit_label) ";
    }

    /**
     * This returns a single Visit object for the given
     * visit name (formerly known as visit_label), and will only ever instantiate
     * one object in the event that it's called multiple times.
     *
     * @param string $visitName The name of the visit
     *
     * @note This should be used by the NDB_Factory and not be called
     * directly
     *
     * @return VisitData the Visit object
     */
    public function getVisitByName($visitName) : VisitData
    {
        $query     = $this->getBaseQuery() . " WHERE v.VisitName = :vname";
        $visitData = $this->database->pSelectRow(
            $query,
            ['vname' => $visitName]
        );

        if (empty($visitData)) {
            throw new \NotFound("No visit named $visitName found.");
        }

        $visit = new VisitData();
        $visit->setID(intval($visitData["VisitID"]));
        $visit->name           = $visitData["VisitName"];
        $visit->label          = $visitData["VisitLabel"];
        $visit->windowMinDays  = intval($visitData["WindowMinDays"]);
        $visit->windowMaxDays  = intval($visitData["WindowMaxDays"]);
        $visit->optimumMinDays = intval($visitData["OptimumMinDays"]);
        $visit->optimumMaxDays = intval($visitData["OptimumMaxDays"]);
        $visit->windowMidpointDays = intval($visitData["WindowMidpointDays"]);

        $visit = $this->withNestedEntities($visit);

        return $visit;
    }

    /**
     * Get a visit object from the ID by mapping the ID to a name and using the
     * singleton function
     *
     * @param int $visitID The ID of the visit requested
     *
     * @return VisitData
     */
    public function getVisitByID(int $visitID) : VisitData
    {
        $visitName = $this->database->pSelectOne(
            "SELECT
              VisitName
            FROM
              visit
            WHERE VisitID = :vid
            ",
            ['vid' => $visitID]
        );

        if (empty($visitName)) {
            throw new \NotFound("No visit with ID: $visitID");
        }

        return $this->getVisitByName($visitName);
    }

    /**
     * Loads project associations into the VisitData object passed in as a parameter
     *
     * @param VisitData $visit VisitData object without projects
     *
     * @return VisitData
     */
    protected function withProjects(VisitData $visit) : VisitData
    {
        $query = 'SELECT DISTINCT p.Name
                FROM visit_project_cohort_rel vpcr
                    JOIN project_cohort_rel pcr USING(ProjectCohortRelID)
                    JOIN Project p USING(ProjectID)
                WHERE VisitID=:vid;';

        $data = $this->db->pselectCol(
            $query,
            ["vid"=>$visit->id],
        );

        $projects = [];
        foreach ($data as $projectName) {
            $projects[] = \Project::singleton($projectName);
        }

        $visit->setProjects($projects);

        return $visit;
    }

    /**
     * Loads cohort associations into the VisitData object passed in as a parameter
     *
     * @param VisitData $visit VisitData object without cohorts
     *
     * @return VisitData
     */
    protected function withCohorts(VisitData $visit) : VisitData
    {
        $query = 'SELECT DISTINCT c.title
                FROM visit_project_cohort_rel vpcr
                    JOIN project_cohort_rel pcr USING(ProjectCohortRelID)
                    JOIN cohort c USING(CohortID)
                WHERE VisitID=:vid;';

        $data = $this->db->pselectCol(
            $query,
            ["vid"=>$visit->id],
        );

        $cohorts     = [];
        $cController = new \CohortController($this->database);
        foreach ($data as $cohortTitle) {
            $cohorts[] = $cController->getCohortByTitle($cohortTitle);
        }

        $visit->setCohorts($cohorts);

        return $visit;
    }

    /**
     * Loads all nested entities by calling independent functions for each entity.
     *
     * @param VisitData $visit VisitData object with no nested entities loaded
     *
     * @return VisitData
     */
    protected function withNestedEntities(VisitData $visit) : VisitData
    {
        $visit = $this->withProjects($visit);
        $visit = $this->withCohorts($visit);

        return $visit;
    }

    /**
     * Create a new visit and insert it into the database.
     *
     * @param VisitData $visit A visit object without the ID
     *
     * @return VisitData The created Visit with it's new ID
     */
    public function createVisit(VisitData $visit) : VisitData
    {
        if (!empty($visit->id)) {
            throw new \LorisException(
                "An ID can not be supplied when creating a new visit, the ID
                will be generated by the database."
            );
        }
        if ($this->visitNameExists($visit->name)) {
            throw new \LorisException(
                "A visit with the same name ".$visit->name." already exists"
            );
        }

        // Update visit table
        $this->database->insert(
            'visit',
            [
                'VisitName'  => $visit->name(),
                'VisitLabel' => $visit->label(),
            ]
        );

        // Update Visit_Windows table
        $this->database->insert(
            'Visit_Windows',
            [
                'Visit_label'        => $visit->name,
                'WindowMinDays'      => $visit->windowMinDays,
                'WindowMaxDays'      => $visit->windowMaxDays,
                'OptimumMinDays'     => $visit->optimumMinDays,
                'OptimumMaxDays'     => $visit->optimumMaxDays,
                'WindowMidpointDays' => $visit->windowMidpointDays,
            ]
        );

        return $this->getVisitByName($visit->name);
    }

    /**
     * Update an existing visit in the database.
     *
     * @param VisitData $visit The visit object to update
     *
     * @return VisitData The updated Visit
     */
    public function updateVisit(VisitData $visit) : VisitData
    {
        // Name and ID are immutable, verify they match the database values
        $visitDBID = $this->database->pselectOne(
            "SELECT VisitID FROM visit WHERE visitName=:vname",
            ['vname' => $visit->name]
        );
        if (!$this->visitNameExists()) {
            throw new \LorisException(
                "The queried visit ".$visit->name." does not exist in the database."
            );
        }
        if ($visit->id !== $visitDBID) {
            throw new \LorisException(
                "The supplied visit name and ID do not match database records."
            );
        }

        // Update visit table
        $this->database->update(
            'visit',
            [
                'VisitLabel' => $visit->label,
            ],
            ['VisitName'  => $visit->name]
        );

        // Update Visit_Windows table
        $this->database->update(
            'Visit_Windows',
            [
                'WindowMinDays'      => $visit->windowMinDays,
                'WindowMaxDays'      => $visit->windowMaxDays,
                'OptimumMinDays'     => $visit->optimumMinDays,
                'OptimumMaxDays'     => $visit->optimumMaxDays,
                'WindowMidpointDays' => $visit->windowMidpointDays,
            ],
            ['Visit_label'        => $visit->name]
        );

        return $this->getVisitByName($visit->name);
    }

    /**
     * Retruns a list of configured Visits
     *
     * @return array The list of visits
     */
    public function getAllVisits(): array
    {
        return array_map(
            function ($visitData) {
                $visit = new VisitData();
                $visit->setID(intval($visitData["VisitID"]));
                $visit->name           = $visitData["VisitName"];
                $visit->label          = $visitData["VisitLabel"];
                $visit->windowMinDays  = intval($visitData["WindowMinDays"]);
                $visit->windowMaxDays  = intval($visitData["WindowMaxDays"]);
                $visit->optimumMinDays = intval($visitData["OptimumMinDays"]);
                $visit->optimumMaxDays = intval($visitData["OptimumMaxDays"]);
                $visit->windowMidpointDays = intval($visitData["WindowMidpointDays"]);

                $visit = $this->withNestedEntities($visit);

                return $visit;
            },
            $this->database->pselect(
                $this->getBaseQuery(). " ORDER BY VisitName",
                []
            )
        );
    }

    /**
     * Check if a visit name is already in use in the DB
     *
     * @param string $visitName Name of the visit
     *
     * @return bool
     */
    public function visitNameExists(string $visitName) : bool
    {
        $visit = $this->database->pselectOne(
            "SELECT VisitID FROM visit WHERE VisitName=:vname",
            ["vname"=>$visitName]
        );

        if (empty($visit)) {
            return false;
        }
        return true;
    }




















    // IGNORE THINGS BELOW THIS LINE
    /**
     * Returns a list of configured Visits and their association with projects
     * and cohorts
     *
     * @return array The list of visits, projectID and cohortID
     */
    public function getVisitsProjectCohort(): array
    {
        return array_map(
            function ($row) {
                return [
                    new VisitData(
                        intval($row['VisitID']),
                        $row['VisitName'],
                        $row['VisitLabel'],
                        intval($row['WindowMinDays']),
                        intval($row['WindowMaxDays']),
                        intval($row['OptimumMinDays']),
                        intval($row['OptimumMaxDays']),
                        intval($row['WindowMidpointDays']),
                    ),
                    $row['project'],    // will be modified to object when
                    $row['cohort'], // available
                ];
            },
            $this->database->pselect(
                'SELECT
                  VisitID,
                  VisitName,
                  VisitLabel,
                  WindowMinDays,
                  WindowMaxDays,
                  OptimumMinDays,
                  OptimumMaxDays,
                  WindowMidpointDays,
                  psr.ProjectID as "project",
                  psr.CohortID as "cohort"
                 FROM
                  visit v
                 JOIN
                  visit_project_cohort_rel vps
                 ON v.VisitID = vps.VisitID
                 JOIN
                  project_cohort_rel psr
                 ON vps.ProjectCohortRelID = psr.ProjectCohortRelID
                ORDER BY ID, project, cohort
                ',
                []
            )
        );
    }

    /**
     * Add an association between the supplied visit and ProjectCohortID
     * to the visit_project_cohort_rel table of the database
     *
     * @param VisitData $visit Visit object to add association to
     * @param int       $PSRID ProjectCohortRelID to be added
     *
     * @return void
     */
    public function addProjectCohort(VisitData $visit, int $PSRID)
    {
        $this->database->insert(
            "visit_project_cohort_rel",
            ["ProjectCohortRelID"=>$PSRID, "VisitID"=>$visit->getID()]
        );
    }

    /**
     * Remove an association between the supplied visit and ProjectCohortID
     * to the visit_project_cohort_rel table of the database
     *
     * @param VisitData $visit Visit object to add association to
     * @param int       $PSRID ProjectCohortRelID to be added
     *
     * @return void
     */
    public function removeProjectCohort(VisitData $visit, int $PSRID)
    {
        $this->database->delete(
            "visit_project_cohort_rel",
            ["ProjectCohortRelID"=>$PSRID, "VisitID"=>$visit->getID()]
        );
    }

    protected function getAllInstances(): \Traversable
    {
        return new \ArrayIterator($this->getAllVisits());
    }
}

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

/**
 * Base class that contains method to access the visit of projects
 *
 * @category Controller
 * @package  Visits
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitController
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
     * Retruns a list of configured Visits
     *
     * @return array The list of visits
     */
    public function getAllVisits(): array
    {
        return array_map(
            function ($row) {
                return new \LORIS\Visit(
                    $row['name'],
                    $row['ID']
                );
            },
            $this->database->pselect(
                'SELECT
                 v.VisitID as "ID", v.VisitName as "name"
                FROM
                 visit v
ORDER BY ID
                ',
                array()
            )
        );
    }

    /**
     * Retruns a VisitID by name
     *
     * @param string $visit the name of the visit
     *
     * @return array the ID of the visit
     */
    public function getVisitsByName(string $visit): array
    {
        return array_map(
            function ($row) {
                return new \LORIS\Visit(
                    $row['name'],
                    $row['ID']
                );
            },
            $this->database->pselect(
                'SELECT
                 v.VisitID as "ID", v.VisitName as "name"
                FROM
                 visit v
                WHERE
                 v.VisitName = :name
                ORDER BY ID
                ',
                array('name' => $visit)
            )
        );
    }
    /**
     * Returns a list of configured Visits and their association with projects
     * and subprojects
     *
     * @return array The list of visits, projectID and subprojectID
     */
    public function getVisitsProjectSubproject(): array
    {
        return array_map(
            function ($row) {
                return array(
                        new \LORIS\Visit($row['name'], $row['ID']),
                        $row['project'],    // will be modified to object when
                        $row['subproject'], // available
                       );
            },
            $this->database->pselect(
                'SELECT
                  v.VisitID as "ID",
                  v.VisitName as "name",
                  pr.ProjectID as "project",
                  pr.SubprojectID as "subproject"
                 FROM
                  visit v
                 JOIN
                  visit_project_subproject_rel vps
                 ON v.VisitID = vps.VisitID
                 JOIN 
                  project_rel pr 
                 ON vps.ProjectSubprojectID = pr.ProjectSubprojectID
                ORDER BY ID, project, subproject
                ',
                array()
            )
        );
    }

}

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
                    $row['visit']
                );
            },
            $this->database->pselect(
                'SELECT
                  v.VisitName as "visit"
                 FROM
                  visit v
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
     * @return array the ID of the visit  //TODO array of Visit
     */
    public function getVisitsWithID(string $visit): array
    {
        return array_map(
            function ($row) {
                return new \LORIS\Visit(
                    $row['ID']
                );
            },
            $this->database->pselect(
                'SELECT
                  v.VisitID as "ID"
                 FROM
                  visit v
                 WHERE
                  v.VisitName = :name
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
    public function getVisitsWithProject(): array
    {
        return array_map(
            function ($row) {
                return array(
                        new \LORIS\Visit($row['visit']),
                        $row['project'],
                        $row['subproject'],
                       );
            },
            $this->database->pselect(
                'SELECT
                  v.VisitName as "visit",
                  vps.ProjectID as "project",
                  vps.SubProjectID as "subproject"
                 FROM
                  visit v
                 JOIN
                  visit_project_subproject_rel vps
                 ON v.VisitID = vps.VisitID
                ',
                array()
            )
        );
    }

}

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
                    $row['VisitName'],
                    $row['VisitLabel']
                );
            },
            iterator_to_array(
                $this->database->pselect(
                    'SELECT VisitName, VisitLabel FROM visit ORDER BY VisitName',
                    []
                )
            )
        );
    }

    /**
     * Get an associative array of the type
     *
     * @return array
     */
    public function getVisitlabels(): array
    {
        $visitLabels = [];
        foreach ($this->getAllVisits() as $visitObj) {
            $visitLabels[$visitObj->getName()] = $visitObj->getLabel();
        }
        return $visitLabels;
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
            iterator_to_array(
                $this->database->pselect(
                    'SELECT
                 v.VisitID as "ID", v.VisitName as "name"
                FROM
                 visit v
                WHERE
                 v.VisitName = :name
                ORDER BY ID
                ',
                    ['name' => $visit]
                )
            )
        );
    }

    /**
     * Instanciate a visit object using the visit label value
     *
     * @param string $visitLabel Label for which the Visit object s requested
     *
     * @return Visit Visit associated with the supplied label
     *
     * @throws \NotFound
     */
    public function getVisitFromVisitLabel(string $visitLabel) : \LORIS\Visit
    {
        $visitData = $this->database->pselectRow(
            'SELECT
                 v.VisitID, v.VisitName
                FROM
                 visit v
                WHERE
                 v.VisitLabel = :vl',
            ['vl' => $visitLabel]
        );

        if (empty($visitData)) {
            throw new \NotFound(
                "No visits found in the database with label: $visitLabel"
            );
        }

        return new \LORIS\Visit($visitData['VisitName'], $visitLabel);
    }

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
                    new \LORIS\Visit($row['name'], $row['ID']),
                    $row['project'],    // will be modified to object when
                    $row['cohort'], // available
                ];
            },
            iterator_to_array(
                $this->database->pselect(
                    'SELECT
                  v.VisitID as "ID",
                  v.VisitName as "name",
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
            )
        );
    }

}

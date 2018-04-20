<?php
/**
 * This file contains the VisitControler class.
 *
 * PHP Version 7
 *
 * @category Controler
 * @package  Visits
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

/**
 * Base class that contains method to access the visit of projects
 *
 * @category Controler
 * @package  Visits
 * @author   Mélanie Legault <melanie.legault2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitControler
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
            throw new \RuntimeException("VisitControler - Database not connected");
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
        return array_map( function ($row) {
            return new \LORIS\Visit(
                $row['visit'],
                $row['project'],
                $row['subproject']
            );
        }, $this->database->pselect(
            '
          SELECT 
            v.name as "visit",
            p.Name as "project",
            s.title as "subproject"
          FROM
            visit
          LEFT JOIN visit_project_subproject_rel vpsr
            USING (VisitID)
          LEFT JOIN Project
            USING (ProjectID)
          LEFT JOIN subproject
            USING (SubprojectID)
        ',
            array()
        );
    }
}

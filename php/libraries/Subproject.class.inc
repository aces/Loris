<?php declare(strict_types=1);
/**
 * This file contains a class which encapsulates the concept of a "Subproject"
 * in LORIS.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Project class encapsulates all details of a project.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Subproject implements \JsonSerializable
{
    private $_subproject_id;
    private $_project_id;
    private $_title;
    private $_useEDC;
    private $_windowDifference;
    private $_recruitmentTarget;

    /**
     * Contructor
     *
     * @param string     $id                The subproject id
     * @param \ProjectID $project_id        the associated project id
     * @param string     $title             This title
     * @param ?string    $useEDC            useEDC Either "0", "1" or null
     * @param ?string    $windowDifference  Value from the database
     * @param ?string    $recruitmentTarget A numeric string or null
     */
    public function __construct(
        string $id,
        \ProjectID $project_id,
        string $title,
        ?string $useEDC = null,
        ?string $windowDifference = null,
        ?string $recruitmentTarget = null
    ) {
        $this->_subproject_id = $id;
        $this->_project_id    = $project_id;
        $this->_title         = $title;
        if (!is_null($useEDC)) {
            $this->_useEDC = boolval($useEDC);
        }
        $this->_windowDifference = $windowDifference;
        if (!is_null($recruitmentTarget)) {
            $this->_recruitmentTarget = intval($recruitmentTarget);
        }
    }

    /**
     * Gets the visit names for that subproject
     *
     * @return array An array of Visit object
     */
    public function getVisits(): array
    {
        $factory    = \NDB_Factory::singleton();
        $visitsData = $factory->database()->pselect(
            "
             SELECT
               v.VisitName name
             FROM visit v
             LEFT JOIN visit_project_subproject_rel vpsr
               ON (v.VisitID = vpsr.VisitID)
             LEFT JOIN project_subproject_rel psr
               ON (vpsr.ProjectSubprojectRelID = psr.ProjectSubprojectRelID)
             WHERE
               psr.SubprojectID = :v_subproject_id AND
               psr.ProjectID = :v_project_id
            ",
            [
                'v_subproject_id' => $this->_subproject_id,
                'v_project_id'    => $this->_project_id
            ]
        );

        return array_map(
            function ($visit) {
                return new \LORIS\Visit($visit['name']);
            },
            $visitsData
        );
    }

    /**
     * Specify data which should be serialized to JSON.
     * Returns data which can be serialized by json_encode(), which is a value of
     * any type other than a resource.
     *
     * @see    https://www.php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed
     */
    public function jsonSerialize()
    {
        return [
            "SubprojectID"      => $this->_subproject_id,
            "Title"             => $this->_title,
            "UseEDC"            => $this->_useEDC,
            "WindowDifference"  => $this->_windowDifference,
            "RecruitmentTarget" => $this->_recruitmentTarget
        ];
    }
}

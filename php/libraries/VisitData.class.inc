<?php
/**
 * Describe a LORIS visit
 *
 * PHP Version 7
 *
 * @category Model
 * @package  Visits
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

use LORIS\Data\DataInstance;

/**
 * Representation of a Visit in LORIS
 *
 * @category Model
 * @package  Visits
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class VisitData implements DataInstance
{
    /**
     * The ID of the visit in the DB
     *
     * Note: This should be set to readonly in PHP8.1
     */
    public int $id;

    /**
     * The visit name (formerly known as visit_label)
     */
    public string $name;

    /**
     * The visit label displayed in the browser
     */
    public string $label;

    /**
     * Variables holding Visit_Windows data
     */
    public ?int $windowMinDays;
    public ?int $windowMaxDays;
    public ?int $optimumMinDays;
    public ?int $optimumMaxDays;
    public ?int $windowMidpointDays;

    /**
     * Variable holding ProjectSubprojectIDs affiliated with this visit
     *
     * These variables are non-initialized when the Visit object is lazy-loaded
     *
     * Note: making these readonly would prevent any other class initializing the
     * variables forcing it to go through the setter classes
     */
    public array $projects;
    public array $cohorts;

    /**
     * Setter for the ID value since readonly properties can only be set from within
     * the class
     *
     * @param int $id Integer ID for the visit
     *
     * @return void
     */
    public function setID(int $id) : void
    {
        $this->id = $id;
    }

    /**
     * Setter for the $projects property. This validates that the content of the
     * array is limited to Project objects.
     *
     * @param array $projects
     *
     * @return void
     *
     * @throws \LorisException
     */
    public function setProjects(array $projects) : void
    {
        foreach ($projects as $project) {
            if (!$project instanceof \Project) {
                throw new \LorisException("Incorrect Project parameter");
            }
        }

        $this->projects = $projects;
    }

    /**
     * Setter for the $cohorts property. This validates that the content of the
     * array is limited to Cohort objects.
     *
     * @param array $projects
     *
     * @return void
     *
     * @throws \LorisException
     */
    public function setCohorts(array $cohorts) : void
    {
        foreach ($cohorts as $cohort) {
            if (!$cohort instanceof \CohortData) {
                throw new \LorisException("Incorrect Cohort parameter");
            }
        }

        $this->cohorts = $cohort;
    }

    /**
     * Specify data which should be serialized to JSON.
     * Returns data which can be serialized by json_encode(), which is a value of
     * any type other than a resource.
     *
     * @see https://www.php.net/manual/en/jsonserializable.jsonserialize.php
     *
     * @return array
     */
    public function jsonSerialize(): mixed
    {
        return [
            "VisitID"            => $this->id,
            "Name"               => $this->name,
            "Label"              => $this->label,
            "WindowMinDays"      => $this->windowMinDays,
            "WindowMaxDays"      => $this->windowMaxDays,
            "OptimumMinDays"     => $this->optimumMinDays,
            "OptimumMaxDays"     => $this->optimumMaxDays,
            "WindowMidpointDays" => $this->windowMidpointDays,
        ];

    }
}

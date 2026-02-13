<?php declare(strict_types=1);

/**
 * This file contains a class which encapsulates the concept of a "Cohort"
 * in LORIS.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace LORIS;

use LORIS\Data\DataInstance;

/**
 * The Project class encapsulates all details of a project.
 *
 * @category Main
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CohortData implements DataInstance
{
    /**
     * The variables below should be set as readonly
     * when PHP8.1 is the lowest supported PHP version
     *
     * @var int
     */
    public int $id;
    public string $title;
    public ?bool $useEDC;
    public ?string $windowDifference;
    public ?int $recruitmentTarget;

    /**
     * Setter for the ID value since readonly properties can only be set from within
     * the class
     *
     * @param int $id Integer ID for the cohort
     *
     * @return void
     */
    public function setID(int $id) : void
    {
        $this->id = $id;
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
    public function jsonSerialize() : array
    {
        return [
            "CohortID"          => $this->id,
            "Title"             => $this->title,
            "UseEDC"            => $this->useEDC,
            "WindowDifference"  => $this->windowDifference,
            "RecruitmentTarget" => $this->recruitmentTarget
        ];
    }

    public function isAccessibleBy(\User $user): bool
    {
        return $user->hasPermission('config');
    }
}

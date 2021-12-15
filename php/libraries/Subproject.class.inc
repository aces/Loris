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

namespace LORIS;

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
    protected ?int $id;
    public string $title;
    public ?bool $useEDC;
    public ?string $windowDifference;
    public ?int $recruitmentTarget;

    /**
     * Contructor
     *
     * @param ?int    $id                The subproject id
     * @param string  $title             The subproject title
     * @param ?bool   $useEDC            Expected date of confinement status
     * @param ?string $windowDifference  Value from the database
     * @param ?int    $recruitmentTarget Target number for subproject recruitment
     */
    public function __construct(
        ?int $id,
        string $title,
        ?bool $useEDC,
        ?string $windowDifference = null,
        ?int $recruitmentTarget = null
    ) {
        //ID should only be null when creating a new subproject
        $this->id     = $id;
        $this->title  = $title;
        $this->useEDC = $useEDC;
        $this->windowDifference  = $windowDifference;
        $this->recruitmentTarget = $recruitmentTarget;
    }

    /**
     * Getter for subproject ID
     *
     * @return int The subproject's identifier
     */
    public function getID(): int
    {
        if ($this->id === null) {
            throw new \LorisException("No ID defined for Subproject");
        }
        return $this->id;
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
            "SubprojectID"      => $this->id,
            "Title"             => $this->title,
            "UseEDC"            => $this->useEDC,
            "WindowDifference"  => $this->windowDifference,
            "RecruitmentTarget" => $this->recruitmentTarget
        ];
    }
}
